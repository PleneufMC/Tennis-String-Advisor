-- ============================================================================
--  Durcissement RLS — public.strings et public.racquets
--  Base : yhhdkllbaxuhwrfpsmev.supabase.co
--  Date : 2026-08-08
-- ============================================================================
--
--  OBJET
--  -----
--  Retirer les droits d'ECRITURE de la clef anonyme sur les deux tables du
--  catalogue, en conservant la lecture publique.
--
--  ETAT CONSTATE LE 2026-08-08 (sonde REST reelle, pas supposition)
--  ---------------------------------------------------------------
--    SELECT anonyme  strings/racquets .... AUTORISE  (173 / 107 lignes)
--    INSERT anonyme  strings ............. BLOQUE    (42501, RLS)
--    DELETE anonyme  ..................... voir NOTE ci-dessous
--
--  NOTE IMPORTANTE SUR LA SONDE DELETE
--  -----------------------------------
--  Un « DELETE ... WHERE id = <inexistant> » renvoie 204 MEME quand la
--  politique bloque : zero ligne concernee = succes vide. Ce 204 ne prouve
--  donc RIEN. Le seul test concluant serait de supprimer une ligne
--  REELLEMENT presente, ce qui est destructif : je ne l'ai pas fait.
--  L'INSERT etant deja bloque (42501), il est probable que les politiques
--  d'ecriture anonyme aient deja ete retirees de cette instance.
--
--  Ce script est donc ecrit pour etre SANS EFFET si tout est deja correct,
--  et correctif dans le cas contraire. Il est integralement idempotent.
--
--  IMPACT FONCTIONNEL : AUCUN
--  --------------------------
--    - src/ ne contient AUCUNE reference a supabase (0 occurrence) :
--      le site lit les fichiers TypeScript, jamais ces tables.
--    - scripts/merge-db-to-ts.mjs fait uniquement des GET.
--    - Aucun script du depot n'ecrit vers ces tables avec la clef anon.
--  Les futures ecritures devront passer par la clef service_role, cote
--  serveur uniquement.
--
--  A EXECUTER dans : Supabase Dashboard > SQL Editor
--  Transaction unique : en cas d'erreur, tout est annule.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. RLS active (sans quoi les politiques ne sont pas evaluees)
-- ----------------------------------------------------------------------------
ALTER TABLE public.strings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.racquets ENABLE ROW LEVEL SECURITY;

-- NOTE : « FORCE ROW LEVEL SECURITY » a ete volontairement ECARTE.
-- FORCE applique RLS y compris au PROPRIETAIRE de la table. Or le SQL Editor
-- du dashboard Supabase s'execute avec un role proprietaire : si ce role ne
-- porte pas l'attribut BYPASSRLS, vos propres UPDATE/DELETE lances depuis le
-- dashboard seraient silencieusement filtres — sans message d'erreur.
-- Je n'ai aucun moyen de verifier cet attribut sur votre instance, et le
-- durcissement voulu est deja obtenu par le REVOKE de l'etape 5.
-- Je n'ajoute donc pas une clause dont je ne peux pas garantir l'innocuite.

-- ----------------------------------------------------------------------------
-- 2. Retrait des politiques d'ecriture anonyme
--    Noms exacts issus de scripts/create-tables.js (lignes 70-75).
--    IF EXISTS => aucune erreur si elles ont deja disparu.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow anon insert on strings"  ON public.strings;
DROP POLICY IF EXISTS "Allow anon delete on strings"  ON public.strings;
DROP POLICY IF EXISTS "Allow anon update on strings"  ON public.strings;

DROP POLICY IF EXISTS "Allow anon insert on racquets" ON public.racquets;
DROP POLICY IF EXISTS "Allow anon delete on racquets" ON public.racquets;
DROP POLICY IF EXISTS "Allow anon update on racquets" ON public.racquets;

-- ----------------------------------------------------------------------------
-- 3. Filet de securite : suppression de TOUTE politique d'ecriture
--    accessible a anon/public, y compris sous un nom different du notre.
--    Sans cette boucle, une politique renommee entre-temps survivrait.
-- ----------------------------------------------------------------------------
-- pg_policies.roles est un name[] contenant les NOMS de roles ; une politique
-- sans clause TO y apparait comme {public}. On couvre donc 'anon' et 'public'.
-- La comparaison se fait apres conversion en text[] pour eviter tout probleme
-- d'operateur d'intersection sur le type name[].
DO $$
DECLARE
  p RECORD;
  n INTEGER := 0;
BEGIN
  FOR p IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('strings', 'racquets')
      AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
      AND (roles::text[] && ARRAY['anon', 'public']::text[])
  LOOP
    RAISE NOTICE 'Suppression politique ecriture : public.% -> %',
      p.tablename, p.policyname;
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I',
                   p.policyname, p.tablename);
    n := n + 1;
  END LOOP;

  IF n = 0 THEN
    RAISE NOTICE 'Aucune politique d''ecriture anonyme residuelle : rien a supprimer.';
  ELSE
    RAISE NOTICE '% politique(s) d''ecriture anonyme supprimee(s).', n;
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 4. Lecture publique reaffirmee (le site public en a besoin)
--    Recreee proprement pour garantir un etat connu.
--
--    CORRECTIF 2026-08-08 (constate sur l'instance reelle) : la verification
--    5.1 a revele QUATRE politiques SELECT et non deux. Les politiques
--    "Anyone can read strings" / "Anyone can read racquets" viennent de
--    supabase/migrations/20250129_security_fixes.sql, un repertoire que je
--    n'avais pas inspecte. Elles sont sans clause TO, donc s'appliquent a
--    {public} : plus large que {anon,authenticated}.
--    Les politiques SELECT s'additionnent en OR : ces doublons n'ouvrent pas
--    plus de droits que la lecture publique voulue, mais deux politiques
--    redondantes par table rendent l'etat de securite illisible. On les
--    supprime pour ne garder qu'une seule politique de lecture par table.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public read access on strings"  ON public.strings;
DROP POLICY IF EXISTS "Allow public read access on racquets" ON public.racquets;

DROP POLICY IF EXISTS "Anyone can read strings"  ON public.strings;
DROP POLICY IF EXISTS "Anyone can read racquets" ON public.racquets;

CREATE POLICY "Allow public read access on strings"
  ON public.strings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access on racquets"
  ON public.racquets FOR SELECT
  TO anon, authenticated
  USING (true);

-- ----------------------------------------------------------------------------
-- 5. Privileges au niveau TABLE
--    RLS ne s'applique qu'apres le controle des GRANT. Retirer le privilege
--    est une seconde barriere, independante des politiques.
-- ----------------------------------------------------------------------------
-- CORRECTIF 2026-08-08 : la verification 5.2 a montre que anon conserve
-- REFERENCES et TRIGGER, que mon REVOKE initial ne couvrait pas.
--   REFERENCES = creer une clef etrangere vers la table ;
--   TRIGGER    = poser un declencheur sur la table.
-- Ni l'un ni l'autre ne permet de modifier une ligne, donc le catalogue
-- n'etait pas en danger ; mais ce sont des privileges DDL inutiles a un
-- role anonyme. Le plus simple et le plus sur est de tout retirer puis
-- de re-accorder uniquement SELECT (fait juste apres).
REVOKE ALL
  ON public.strings, public.racquets
  FROM anon;

-- La lecture reste explicitement accordee.
GRANT SELECT ON public.strings, public.racquets TO anon, authenticated;

-- Ecriture reservee au role serveur.
GRANT INSERT, UPDATE, DELETE ON public.strings, public.racquets TO service_role;

COMMIT;

-- ============================================================================
--  VERIFICATION — a executer APRES le COMMIT
-- ============================================================================

-- 5.1 Politiques restantes : on attend UNIQUEMENT deux lignes SELECT.
SELECT tablename,
       policyname,
       cmd,
       roles::text AS roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('strings', 'racquets')
ORDER BY tablename, cmd, policyname;

-- 5.2 Privileges de anon : on attend UNIQUEMENT « SELECT ».
--     Toute ligne INSERT / UPDATE / DELETE ici = correctif incomplet.
SELECT table_name,
       privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'anon'
  AND table_schema = 'public'
  AND table_name IN ('strings', 'racquets')
ORDER BY table_name, privilege_type;

-- 5.3 RLS bien active : relrowsecurity = true.
--     relforcerowsecurity = false est ATTENDU et VOULU (voir la note de l'etape 1) :
--     FORCE aurait applique RLS au proprietaire, donc a vos propres ecritures
--     depuis le SQL Editor, qui tourne en « Role postgres ».
SELECT relname AS table_name,
       relrowsecurity      AS rls_active,
       relforcerowsecurity AS rls_forcee
FROM pg_class
WHERE oid IN ('public.strings'::regclass, 'public.racquets'::regclass);

-- 5.4 Le catalogue est intact : 173 cordages et 107 raquettes au 2026-08-08.
SELECT 'strings'  AS table_name, count(*) AS lignes FROM public.strings
UNION ALL
SELECT 'racquets' AS table_name, count(*) AS lignes FROM public.racquets;

-- ============================================================================
--  RESULTAT ATTENDU
-- ============================================================================
--
--  5.1  strings  | Allow public read access on strings  | SELECT | {anon,authenticated}
--       racquets | Allow public read access on racquets | SELECT | {anon,authenticated}
--       => AUCUNE ligne INSERT / UPDATE / DELETE
--
--  5.2  racquets | SELECT
--       strings  | SELECT
--       => AUCUN autre privilege
--
--  5.3  les deux tables : rls_active = true  (rls_forcee = false : voulu, voir etape 1)
--
--  5.4  strings 173, racquets 107  (inchange : ce script ne touche pas aux donnees)
--
-- ============================================================================
--  ANNULATION (si un besoin d'ecriture anonyme apparaissait)
-- ============================================================================
--  A n'utiliser qu'en connaissance de cause : la clef anon est publiee dans
--  le JavaScript envoye au navigateur. La reactiver rendrait l'ecriture
--  accessible a n'importe quel visiteur.
--
--    BEGIN;
--    GRANT INSERT, UPDATE, DELETE ON public.strings, public.racquets TO anon;
--    CREATE POLICY "Allow anon insert on strings"
--      ON public.strings FOR INSERT TO anon WITH CHECK (true);
--    CREATE POLICY "Allow anon delete on strings"
--      ON public.strings FOR DELETE TO anon USING (true);
--    COMMIT;
--
--  La bonne pratique reste : ecritures cote serveur avec service_role, jamais
--  depuis le navigateur.
-- ============================================================================
