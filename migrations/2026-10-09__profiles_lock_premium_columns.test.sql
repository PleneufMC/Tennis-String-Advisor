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
