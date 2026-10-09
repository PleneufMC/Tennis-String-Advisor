-- =============================================================================
-- 2026-10-09__profiles_lock_premium_columns.sql
-- Auteur : db-guardian (preparation) - NON APPLIQUEE.
-- Application : uniquement via deploy-captain, sur GO explicite de Pierre.
-- Projet Supabase : yhhdkllbaxuhwrfpsmev
--
-- Constat du 09/10/2026 (lecture pg_policies / role_table_grants / pg_proc) :
--   1. Policy "Users can update own profile" (UPDATE, USING auth.uid() = id)
--      sans restriction de colonne + GRANT UPDATE table entiere a anon et
--      authenticated => un utilisateur connecte peut ecrire
--      is_premium = true, premium_type = 'lifetime' sur sa propre ligne.
--   2. Meme defaut sur INSERT (policy "Users can insert own profile").
--   3. public.activate_premium(uuid, text, text, text) est SECURITY DEFINER,
--      proprietaire postgres, EXECUTE accorde a PUBLIC, anon et authenticated :
--      n'importe qui, meme non connecte, peut appeler
--      POST /rest/v1/rpc/activate_premium et passer premium N'IMPORTE QUEL
--      compte (p_user_id libre). Idem decrement_lifetime_counter() qui
--      decremente le compteur des 200 offres a vie dans public.settings.
--
-- Choix : privileges par colonne (REVOKE table + GRANT colonnes) plutot qu'un
-- trigger BEFORE UPDATE.
--   - declaratif, lisible dans information_schema.column_privileges ;
--   - ne depend ni des claims JWT ni de current_user : un trigger qui teste le
--     role verrait 'postgres' a l'interieur d'activate_premium (SECURITY
--     DEFINER) et devrait distinguer ce cas a la main ;
--   - une colonne ajoutee plus tard n'est PAS inscriptible cote client par
--     defaut (fermeture par defaut).
--   - service_role et postgres ne sont pas touches : webhook / back-office
--     gardent tous leurs droits.
--
-- Colonnes que le navigateur ecrit legitimement (grep origin/main, 09/10) :
--   public/en/account.html       upsert {id, level, frequency, playing_style,
--                                physical_issues, updated_at}
--   public/en/configurator.html  update {configurator_uses}
--   public/en/rcs-calculator.html update {rcs_calculations_used}
-- full_name / avatar_url : ecrits par handle_new_user() (SECURITY DEFINER),
-- laisses inscriptibles car donnees de profil appartenant a l'utilisateur.
-- id : necessaire a l'upsert PostgREST (SET id = EXCLUDED.id) ; un changement
-- d'id reste bloque par la RLS (WITH CHECK implicite auth.uid() = id).
--
-- Volontairement NON inscriptibles cote client : email, is_premium,
-- premium_type, premium_started_at, premium_expires_at, stripe_customer_id,
-- stripe_subscription_id, created_at.
-- =============================================================================

BEGIN;

-- 1. Ecriture sur profiles : retrait du droit table entiere ----------------------
REVOKE INSERT, UPDATE ON TABLE public.profiles FROM anon, authenticated;

-- anon n'a aucun usage legitime en ecriture (pas d'auth.uid()) : rien n'est rendu.
GRANT INSERT (id, full_name, avatar_url, level, frequency, playing_style,
              physical_issues, configurator_uses, rcs_calculations_used,
              updated_at)
  ON TABLE public.profiles TO authenticated;

GRANT UPDATE (id, full_name, avatar_url, level, frequency, playing_style,
              physical_issues, configurator_uses, rcs_calculations_used,
              updated_at)
  ON TABLE public.profiles TO authenticated;

-- 2. Fonctions de promotion : reservees au serveur ------------------------------
REVOKE EXECUTE ON FUNCTION public.activate_premium(uuid, text, text, text)
  FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.activate_premium(uuid, text, text, text)
  TO service_role;

REVOKE EXECUTE ON FUNCTION public.decrement_lifetime_counter()
  FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.decrement_lifetime_counter()
  TO service_role;

COMMIT;

-- =============================================================================
-- ROLLBACK (retour exact a l'etat constate le 09/10/2026 - rouvre la faille) :
--
-- BEGIN;
-- REVOKE INSERT (id, full_name, avatar_url, level, frequency, playing_style,
--   physical_issues, configurator_uses, rcs_calculations_used, updated_at)
--   ON TABLE public.profiles FROM authenticated;
-- REVOKE UPDATE (id, full_name, avatar_url, level, frequency, playing_style,
--   physical_issues, configurator_uses, rcs_calculations_used, updated_at)
--   ON TABLE public.profiles FROM authenticated;
-- GRANT INSERT, UPDATE ON TABLE public.profiles TO anon, authenticated;
-- GRANT EXECUTE ON FUNCTION public.activate_premium(uuid, text, text, text)
--   TO PUBLIC, anon, authenticated;
-- GRANT EXECUTE ON FUNCTION public.decrement_lifetime_counter()
--   TO PUBLIC, anon, authenticated;
-- COMMIT;
--
-- Verification post-application :
--   SELECT grantee, privilege_type, count(*) FROM information_schema.column_privileges
--    WHERE table_schema='public' AND table_name='profiles'
--      AND grantee IN ('anon','authenticated') AND privilege_type IN ('INSERT','UPDATE')
--    GROUP BY 1,2;                 -- attendu : authenticated INSERT 10, UPDATE 10 ; anon 0
--   SELECT has_function_privilege('authenticated',
--     'public.activate_premium(uuid,text,text,text)','EXECUTE');  -- attendu : false
-- =============================================================================
