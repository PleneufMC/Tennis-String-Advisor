-- Test sans effet durable de 2026-10-09__profiles_lock_premium_columns.sql
-- Tout s'execute dans UN bloc DO qui se termine par RAISE EXCEPTION :
-- la transaction entiere (y compris la migration) est annulee, le resultat
-- est rendu dans le message d'erreur (SQLSTATE P0001, prefixe RESULT).
-- Chaque essai tourne dans un sous-bloc annule (P0099) pour ne pas polluer le suivant.
DO $test$
DECLARE
  uid uuid;
  log text := '';
  n int;

BEGIN
  SELECT id INTO uid FROM public.profiles WHERE NOT coalesce(is_premium,false) LIMIT 1;
  IF uid IS NULL THEN RAISE EXCEPTION 'RESULT: aucun profil non premium pour tester'; END IF;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', uid, 'role', 'authenticated')::text, true);

  -- ---------- AVANT migration ----------
  FOR i IN 1..4 LOOP
    BEGIN
      IF i IN (1,2,3) THEN EXECUTE 'SET LOCAL ROLE authenticated'; ELSE EXECUTE 'SET LOCAL ROLE anon'; END IF;
      IF i = 1 THEN
        UPDATE public.profiles SET is_premium = true, premium_type = 'lifetime' WHERE id = uid;
        GET DIAGNOSTICS n = ROW_COUNT;
        log := log || format(E'\nAVANT auth  auto-promotion UPDATE      : OK, %s ligne(s)', n);
      ELSIF i = 2 THEN
        UPDATE public.profiles SET configurator_uses = configurator_uses + 1 WHERE id = uid;
        GET DIAGNOSTICS n = ROW_COUNT;
        log := log || format(E'\nAVANT auth  update configurator_uses   : OK, %s ligne(s)', n);
      ELSIF i = 3 THEN
        PERFORM public.activate_premium(uid, 'lifetime', null, null);
        log := log || E'\nAVANT auth  rpc activate_premium       : OK (appel accepte)';
      ELSE
        PERFORM public.activate_premium(uid, 'monthly', null, null);
        log := log || E'\nAVANT anon  rpc activate_premium       : OK (appel accepte)';
      END IF;
      RAISE EXCEPTION USING ERRCODE = 'P0099';
    EXCEPTION
      WHEN SQLSTATE 'P0099' THEN NULL;
      WHEN insufficient_privilege THEN log := log || format(E'\nAVANT essai %s : REFUSE (%s)', i, SQLERRM);
    END;
  END LOOP;
  RESET ROLE;

  -- ---------- Migration (corps exact du fichier, hors BEGIN/COMMIT) ----------
  REVOKE INSERT, UPDATE ON TABLE public.profiles FROM anon, authenticated;
  GRANT INSERT (id, full_name, avatar_url, level, frequency, playing_style,
                physical_issues, configurator_uses, rcs_calculations_used, updated_at)
    ON TABLE public.profiles TO authenticated;
  GRANT UPDATE (id, full_name, avatar_url, level, frequency, playing_style,
                physical_issues, configurator_uses, rcs_calculations_used, updated_at)
    ON TABLE public.profiles TO authenticated;
  REVOKE EXECUTE ON FUNCTION public.activate_premium(uuid, text, text, text) FROM PUBLIC, anon, authenticated;
  GRANT  EXECUTE ON FUNCTION public.activate_premium(uuid, text, text, text) TO service_role;
  REVOKE EXECUTE ON FUNCTION public.decrement_lifetime_counter() FROM PUBLIC, anon, authenticated;
  GRANT  EXECUTE ON FUNCTION public.decrement_lifetime_counter() TO service_role;

  -- ---------- APRES migration ----------
  FOR i IN 1..9 LOOP
    BEGIN
      IF i IN (8) THEN EXECUTE 'SET LOCAL ROLE anon';
      ELSIF i = 9 THEN EXECUTE 'SET LOCAL ROLE service_role';
      ELSE EXECUTE 'SET LOCAL ROLE authenticated'; END IF;
      IF i = 1 THEN
        UPDATE public.profiles SET is_premium = true, premium_type = 'lifetime' WHERE id = uid;
        log := log || E'\nAPRES auth  auto-promotion UPDATE      : PASSE (ECHEC DU TEST)';
      ELSIF i = 2 THEN
        UPDATE public.profiles SET premium_expires_at = now() + interval '100 years' WHERE id = uid;
        log := log || E'\nAPRES auth  update premium_expires_at  : PASSE (ECHEC DU TEST)';
      ELSIF i = 3 THEN
        INSERT INTO public.profiles (id, is_premium) VALUES (uid, true)
          ON CONFLICT (id) DO UPDATE SET is_premium = EXCLUDED.is_premium;
        log := log || E'\nAPRES auth  upsert is_premium          : PASSE (ECHEC DU TEST)';
      ELSIF i = 4 THEN
        UPDATE public.profiles SET configurator_uses = configurator_uses + 1 WHERE id = uid;
        GET DIAGNOSTICS n = ROW_COUNT;
        log := log || format(E'\nAPRES auth  update configurator_uses   : OK, %s ligne(s)', n);
      ELSIF i = 5 THEN
        UPDATE public.profiles SET rcs_calculations_used = rcs_calculations_used + 1 WHERE id = uid;
        GET DIAGNOSTICS n = ROW_COUNT;
        log := log || format(E'\nAPRES auth  update rcs_calculations_used: OK, %s ligne(s)', n);
      ELSIF i = 6 THEN
        -- forme exacte de l'upsert PostgREST d'account.html
        INSERT INTO public.profiles (id, level, frequency, playing_style, physical_issues, updated_at)
          VALUES (uid, null, null, null, null, now())
          ON CONFLICT (id) DO UPDATE SET id = EXCLUDED.id, level = EXCLUDED.level,
            frequency = EXCLUDED.frequency, playing_style = EXCLUDED.playing_style,
            physical_issues = EXCLUDED.physical_issues, updated_at = EXCLUDED.updated_at;
        GET DIAGNOSTICS n = ROW_COUNT;
        log := log || format(E'\nAPRES auth  upsert profil (account)   : OK, %s ligne(s)', n);
      ELSIF i = 7 THEN
        PERFORM public.activate_premium(uid, 'lifetime', null, null);
        log := log || E'\nAPRES auth  rpc activate_premium       : PASSE (ECHEC DU TEST)';
      ELSIF i = 8 THEN
        PERFORM public.activate_premium(uid, 'monthly', null, null);
        log := log || E'\nAPRES anon  rpc activate_premium       : PASSE (ECHEC DU TEST)';
      ELSE
        UPDATE public.profiles SET is_premium = true WHERE id = uid;
        GET DIAGNOSTICS n = ROW_COUNT;
        PERFORM public.activate_premium(uid, 'monthly', null, null);
        log := log || format(E'\nAPRES svc   update is_premium + rpc    : OK, %s ligne(s)', n);
      END IF;
      RAISE EXCEPTION USING ERRCODE = 'P0099';
    EXCEPTION
      WHEN SQLSTATE 'P0099' THEN NULL;
      WHEN insufficient_privilege THEN log := log || format(E'\nAPRES essai %s : REFUSE (%s)', i, SQLERRM);
    END;
  END LOOP;
  RESET ROLE;

  RAISE EXCEPTION 'RESULT (tout est annule) uid=%:%', left(uid::text, 8), log;
END
$test$;

-- =============================================================================
-- Partie 2 (revue securite 09/10) : fonctions de trigger + CHECK user_setups.
-- Meme principe : bloc DO auto-annule.
-- =============================================================================
DO $test2$
DECLARE
  uid uuid;
  sid uuid;
  newu uuid := gen_random_uuid();
  log text := '';
  ts timestamptz;
BEGIN
  SELECT id INTO uid FROM public.profiles WHERE NOT coalesce(is_premium,false) LIMIT 1;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', uid, 'role', 'authenticated')::text, true);

  -- AVANT : appel direct des fonctions de trigger
  BEGIN
    EXECUTE 'SET LOCAL ROLE anon';
    PERFORM public.handle_updated_at();
    RAISE EXCEPTION USING ERRCODE = 'P0099';
  EXCEPTION
    WHEN SQLSTATE 'P0099' THEN log := log || E'\nAVANT anon  appel handle_updated_at()  : accepte';
    WHEN insufficient_privilege THEN log := log || E'\nAVANT anon  appel handle_updated_at()  : REFUSE privilege';
    WHEN OTHERS THEN log := log || format(E'\nAVANT anon  appel handle_updated_at()  : EXECUTE accorde, erreur %s (%s)', SQLSTATE, SQLERRM);
  END;
  RESET ROLE;

  -- Migration (corps complet)
  REVOKE INSERT, UPDATE ON TABLE public.profiles FROM anon, authenticated;
  GRANT INSERT (id, full_name, avatar_url, level, frequency, playing_style,
                physical_issues, configurator_uses, rcs_calculations_used, updated_at)
    ON TABLE public.profiles TO authenticated;
  GRANT UPDATE (id, full_name, avatar_url, level, frequency, playing_style,
                physical_issues, configurator_uses, rcs_calculations_used, updated_at)
    ON TABLE public.profiles TO authenticated;
  REVOKE EXECUTE ON FUNCTION public.activate_premium(uuid, text, text, text) FROM PUBLIC, anon, authenticated;
  GRANT  EXECUTE ON FUNCTION public.activate_premium(uuid, text, text, text) TO service_role;
  REVOKE EXECUTE ON FUNCTION public.decrement_lifetime_counter() FROM PUBLIC, anon, authenticated;
  GRANT  EXECUTE ON FUNCTION public.decrement_lifetime_counter() TO service_role;
  REVOKE EXECUTE ON FUNCTION public.handle_new_user()   FROM PUBLIC, anon, authenticated;
  REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon, authenticated;
  ALTER TABLE public.user_setups
    ADD CONSTRAINT user_setups_name_length_check  CHECK (name  IS NULL OR char_length(name)  <= 100),
    ADD CONSTRAINT user_setups_notes_length_check CHECK (notes IS NULL OR char_length(notes) <= 2000);

  log := log || format(E'\nAPRES privileges EXECUTE handle_updated_at anon/auth : %s/%s',
    has_function_privilege('anon','public.handle_updated_at()','EXECUTE'),
    has_function_privilege('authenticated','public.handle_updated_at()','EXECUTE'));

  -- APRES : appel direct refuse
  BEGIN
    EXECUTE 'SET LOCAL ROLE anon';
    PERFORM public.handle_updated_at();
    RAISE EXCEPTION USING ERRCODE = 'P0099';
  EXCEPTION
    WHEN insufficient_privilege THEN log := log || E'\nAPRES anon  appel handle_updated_at()  : REFUSE (permission denied)';
    WHEN OTHERS THEN log := log || format(E'\nAPRES anon  appel handle_updated_at()  : %s (%s)', SQLSTATE, SQLERRM);
  END;
  RESET ROLE;

  -- APRES : le trigger profiles_updated_at se declenche pour authenticated (sans EXECUTE)
  ALTER TABLE public.profiles DISABLE TRIGGER profiles_updated_at;
  UPDATE public.profiles SET updated_at = '2000-01-01' WHERE id = uid;
  ALTER TABLE public.profiles ENABLE TRIGGER profiles_updated_at;
  EXECUTE 'SET LOCAL ROLE authenticated';
  UPDATE public.profiles SET configurator_uses = configurator_uses WHERE id = uid;
  SELECT updated_at INTO ts FROM public.profiles WHERE id = uid;
  RESET ROLE;
  log := log || format(E'\nAPRES auth  trigger profiles_updated_at: %s', CASE WHEN ts = now() THEN 'DECLENCHE (updated_at = now())' ELSE 'NON DECLENCHE ' || ts END);

  -- APRES : user_setups, insertion valide puis trigger d'update, puis bornes
  EXECUTE 'SET LOCAL ROLE authenticated';
  INSERT INTO public.user_setups (user_id, name, notes) VALUES (uid, repeat('n',100), repeat('x',2000)) RETURNING id INTO sid;
  log := log || E'\nAPRES auth  insert setup 100/2000 car. : OK';
  RESET ROLE;
  ALTER TABLE public.user_setups DISABLE TRIGGER user_setups_updated_at;
  UPDATE public.user_setups SET updated_at = '2000-01-01' WHERE id = sid;
  ALTER TABLE public.user_setups ENABLE TRIGGER user_setups_updated_at;
  EXECUTE 'SET LOCAL ROLE authenticated';
  UPDATE public.user_setups SET name = 'ok' WHERE id = sid;
  SELECT updated_at INTO ts FROM public.user_setups WHERE id = sid;
  log := log || format(E'\nAPRES auth  trigger user_setups_updated_at: %s', CASE WHEN ts = now() THEN 'DECLENCHE' ELSE 'NON DECLENCHE ' || ts END);
  BEGIN
    INSERT INTO public.user_setups (user_id, name) VALUES (uid, repeat('n',101));
    log := log || E'\nAPRES auth  name 101 car.             : PASSE (ECHEC DU TEST)';
  EXCEPTION WHEN check_violation THEN log := log || E'\nAPRES auth  name 101 car.             : REFUSE (' || SQLERRM || ')';
  END;
  BEGIN
    INSERT INTO public.user_setups (user_id, notes) VALUES (uid, repeat('x',2001));
    log := log || E'\nAPRES auth  notes 2001 car.           : PASSE (ECHEC DU TEST)';
  EXCEPTION WHEN check_violation THEN log := log || E'\nAPRES auth  notes 2001 car.           : REFUSE (' || SQLERRM || ')';
  END;
  RESET ROLE;

  -- APRES : on_auth_user_created cree toujours le profil
  -- (limite : postgres ne peut pas endosser supabase_auth_admin ; la preuve
  --  « trigger sans EXECUTE » est apportee ci-dessus par authenticated)
  INSERT INTO auth.users (id, email, raw_user_meta_data) VALUES (newu, 'qa-probe@invalid.test', '{"full_name":"QA"}');
  log := log || format(E'\nAPRES       trigger on_auth_user_created : profil cree = %s',
    EXISTS (SELECT 1 FROM public.profiles WHERE id = newu));

  RAISE EXCEPTION 'RESULT2 (tout est annule):%', log;
END
$test2$;
