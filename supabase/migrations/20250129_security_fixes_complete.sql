-- ============================================
-- 🔒 SCRIPT DE CORRECTION DE SÉCURITÉ SUPABASE
-- ============================================
-- Date: 2025-01-29
-- Projet: Tennis String Advisor
-- ============================================
-- 
-- INSTRUCTIONS:
-- 1. Ouvrez Supabase Dashboard
-- 2. Allez dans SQL Editor > New Query
-- 3. Copiez-collez ce script entier
-- 4. Cliquez sur "Run" (ou Ctrl+Enter)
-- 5. Vérifiez les résultats dans l'onglet "Results"
--
-- ============================================

-- ============================================
-- DÉBUT DU SCRIPT
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '🚀 Début des corrections de sécurité...';
END $$;

-- ============================================
-- 1. NEWSLETTER_SUBSCRIBERS - Activer RLS
-- ============================================
-- Problème: RLS désactivé (ERROR)

DO $$
BEGIN
  RAISE NOTICE '📧 [1/4] Correction de la table newsletter_subscribers...';
END $$;

-- Créer la table si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  source TEXT DEFAULT 'website'
);

-- Activer RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Users can view own subscription" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.newsletter_subscribers;

-- Créer les nouvelles politiques sécurisées
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own subscription" ON public.newsletter_subscribers
  FOR SELECT USING (
    auth.jwt() IS NOT NULL 
    AND email = (auth.jwt()->>'email')
  );

CREATE POLICY "Users can update own subscription" ON public.newsletter_subscribers
  FOR UPDATE USING (
    auth.jwt() IS NOT NULL 
    AND email = (auth.jwt()->>'email')
  );

DO $$
BEGIN
  RAISE NOTICE '✅ newsletter_subscribers: RLS activé et politiques créées';
END $$;

-- ============================================
-- 2. FONCTIONS - Corriger search_path
-- ============================================
-- Problème: search_path mutable (WARN x4)

DO $$
BEGIN
  RAISE NOTICE '⚙️ [2/4] Correction des fonctions avec search_path mutable...';
END $$;

-- 2.1 handle_updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  RAISE NOTICE '  ✅ handle_updated_at: search_path corrigé';
END $$;

-- 2.2 handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  RAISE NOTICE '  ✅ handle_new_user: search_path corrigé';
END $$;

-- 2.3 decrement_lifetime_counter
CREATE OR REPLACE FUNCTION public.decrement_lifetime_counter()
RETURNS INTEGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count INTEGER;
BEGIN
  SELECT (value)::INTEGER INTO current_count
  FROM public.settings
  WHERE key = 'lifetime_remaining';
  
  IF current_count > 0 THEN
    UPDATE public.settings
    SET value = to_jsonb(current_count - 1), updated_at = NOW()
    WHERE key = 'lifetime_remaining';
    RETURN current_count - 1;
  END IF;
  
  RETURN 0;
END;
$$;

DO $$
BEGIN
  RAISE NOTICE '  ✅ decrement_lifetime_counter: search_path corrigé';
END $$;

-- 2.4 activate_premium
CREATE OR REPLACE FUNCTION public.activate_premium(
  p_user_id UUID,
  p_type TEXT,
  p_stripe_customer_id TEXT DEFAULT NULL,
  p_stripe_subscription_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expiry_date TIMESTAMPTZ;
BEGIN
  IF p_type = 'monthly' THEN
    expiry_date := NOW() + INTERVAL '1 month';
  ELSIF p_type = 'annual' THEN
    expiry_date := NOW() + INTERVAL '1 year';
  ELSIF p_type = 'lifetime' THEN
    expiry_date := NULL;
    PERFORM public.decrement_lifetime_counter();
  ELSE
    RETURN FALSE;
  END IF;
  
  UPDATE public.profiles
  SET 
    is_premium = TRUE,
    premium_type = p_type,
    premium_started_at = NOW(),
    premium_expires_at = expiry_date,
    stripe_customer_id = COALESCE(p_stripe_customer_id, stripe_customer_id),
    stripe_subscription_id = COALESCE(p_stripe_subscription_id, stripe_subscription_id),
    updated_at = NOW()
  WHERE id = p_user_id;
  
  RETURN FOUND;
END;
$$;

DO $$
BEGIN
  RAISE NOTICE '  ✅ activate_premium: search_path corrigé';
END $$;

-- ============================================
-- 3. RACQUETS - Corriger politiques RLS
-- ============================================
-- Problème: Politiques INSERT/DELETE trop permissives (WARN x2)

DO $$
BEGIN
  RAISE NOTICE '🎾 [3/4] Correction des politiques sur la table racquets...';
END $$;

-- Supprimer les politiques dangereuses
DROP POLICY IF EXISTS "Allow anon delete on racquets" ON public.racquets;
DROP POLICY IF EXISTS "Allow anon insert on racquets" ON public.racquets;
DROP POLICY IF EXISTS "Allow anon update on racquets" ON public.racquets;

-- Supprimer et recréer la politique de lecture
DROP POLICY IF EXISTS "Anyone can read racquets" ON public.racquets;
DROP POLICY IF EXISTS "Allow anon select on racquets" ON public.racquets;

CREATE POLICY "Anyone can read racquets" ON public.racquets
  FOR SELECT USING (true);

DO $$
BEGIN
  RAISE NOTICE '✅ racquets: Politiques INSERT/DELETE supprimées, lecture seule activée';
END $$;

-- ============================================
-- 4. STRINGS - Corriger politiques RLS
-- ============================================
-- Problème: Politiques INSERT/DELETE trop permissives (WARN x2)

DO $$
BEGIN
  RAISE NOTICE '🧵 [4/4] Correction des politiques sur la table strings...';
END $$;

-- Supprimer les politiques dangereuses
DROP POLICY IF EXISTS "Allow anon delete on strings" ON public.strings;
DROP POLICY IF EXISTS "Allow anon insert on strings" ON public.strings;
DROP POLICY IF EXISTS "Allow anon update on strings" ON public.strings;

-- Supprimer et recréer la politique de lecture
DROP POLICY IF EXISTS "Anyone can read strings" ON public.strings;
DROP POLICY IF EXISTS "Allow anon select on strings" ON public.strings;

CREATE POLICY "Anyone can read strings" ON public.strings
  FOR SELECT USING (true);

DO $$
BEGIN
  RAISE NOTICE '✅ strings: Politiques INSERT/DELETE supprimées, lecture seule activée';
END $$;

-- ============================================
-- FIN DU SCRIPT
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎉 ============================================';
  RAISE NOTICE '🎉 CORRECTIONS DE SÉCURITÉ TERMINÉES !';
  RAISE NOTICE '🎉 ============================================';
  RAISE NOTICE '';
END $$;

-- ============================================
-- 5. REQUÊTES DE VÉRIFICATION
-- ============================================
-- Exécutez ces requêtes séparément pour vérifier

-- 5.1 Vérifier que RLS est activé sur toutes les tables
SELECT 
  '📋 Tables avec RLS:' as info,
  tablename, 
  CASE WHEN rowsecurity THEN '✅ Activé' ELSE '❌ Désactivé' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 5.2 Vérifier les fonctions avec search_path
SELECT 
  '⚙️ Fonctions:' as info,
  proname as fonction,
  CASE 
    WHEN proconfig IS NOT NULL AND 'search_path=public' = ANY(proconfig) 
    THEN '✅ search_path=public' 
    ELSE '❌ search_path non défini'
  END as status
FROM pg_proc 
WHERE proname IN ('handle_updated_at', 'handle_new_user', 'decrement_lifetime_counter', 'activate_premium')
  AND pronamespace = 'public'::regnamespace;

-- 5.3 Vérifier les politiques sur racquets et strings
SELECT 
  '🔐 Politiques:' as info,
  tablename,
  policyname,
  cmd as operation,
  CASE 
    WHEN cmd = 'SELECT' THEN '✅ OK (lecture publique)'
    WHEN qual = 'true' OR with_check = 'true' THEN '⚠️ Trop permissif'
    ELSE '✅ OK'
  END as status
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('racquets', 'strings', 'newsletter_subscribers')
ORDER BY tablename, cmd;

-- ============================================
-- 📝 NOTE IMPORTANTE
-- ============================================
-- 
-- Pour "Leaked Password Protection", vous devez l'activer
-- manuellement dans le Dashboard Supabase:
--
-- 1. Dashboard Supabase > Authentication
-- 2. Settings > Password Security  
-- 3. Activer "Leaked Password Protection"
--
-- Cette option vérifie les mots de passe contre 
-- la base HaveIBeenPwned.org
--
-- ============================================
