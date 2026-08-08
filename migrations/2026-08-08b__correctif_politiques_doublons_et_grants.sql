-- ============================================================================
--  CORRECTIF COMPLEMENTAIRE — 2026-08-08
--  A executer apres la migration principale, deja passee avec succes.
--  Corrige deux lacunes revelees par VOS verifications 5.1 et 5.2.
--  Idempotent : re-executable sans effet de bord. Ne touche aucune donnee.
-- ============================================================================

BEGIN;

-- 1. Politiques de lecture en doublon.
--    Votre 5.1 a montre 4 politiques SELECT au lieu de 2.
--    "Anyone can read ..." vient de supabase/migrations/20250129_security_fixes.sql
--    et n'a pas de clause TO : elle s'applique donc a {public}.
--    Les politiques SELECT s'additionnent en OR : aucun droit d'ecriture
--    n'etait ouvert, mais on supprime le doublon pour garder un etat lisible.
DROP POLICY IF EXISTS "Anyone can read strings"  ON public.strings;
DROP POLICY IF EXISTS "Anyone can read racquets" ON public.racquets;

-- 2. Privileges residuels de anon.
--    Votre 5.2 a montre REFERENCES et TRIGGER, que mon REVOKE ne listait pas.
--    Ni l'un ni l'autre ne permet de modifier une ligne (ce sont des
--    privileges DDL), mais ils sont inutiles a un role anonyme.
REVOKE ALL ON public.strings, public.racquets FROM anon;

-- La lecture, elle, reste indispensable au site public.
GRANT SELECT ON public.strings, public.racquets TO anon, authenticated;

COMMIT;

-- ============================================================================
--  VERIFICATION — une requete a la fois (Supabase n'affiche que la derniere)
-- ============================================================================

-- A) Attendu : EXACTEMENT 2 lignes, cmd = SELECT, roles = {anon,authenticated}
SELECT tablename, policyname, cmd, roles::text AS roles
FROM pg_policies
WHERE schemaname = 'public' AND tablename IN ('strings', 'racquets')
ORDER BY tablename, policyname;

-- B) Attendu : EXACTEMENT 2 lignes, SELECT uniquement
--    (plus de REFERENCES ni TRIGGER)
SELECT table_name, privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'anon' AND table_schema = 'public'
  AND table_name IN ('strings', 'racquets')
ORDER BY table_name, privilege_type;

-- C) Attendu : strings 173, racquets 107 (inchange)
SELECT 'strings' AS table_name, count(*) AS lignes FROM public.strings
UNION ALL
SELECT 'racquets' AS table_name, count(*) AS lignes FROM public.racquets;
