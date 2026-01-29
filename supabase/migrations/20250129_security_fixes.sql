-- ============================================
-- Migration: Security Fixes
-- Date: 2025-01-29
-- ============================================
-- This migration fixes the following security issues:
-- 1. RLS disabled on newsletter_subscribers table
-- 2. Functions with mutable search_path
-- 3. Overly permissive RLS policies on racquets and strings tables
-- ============================================

-- ============================================
-- 1. ENABLE RLS ON newsletter_subscribers
-- ============================================

-- First, create the table if it doesn't exist (for consistency)
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  source TEXT DEFAULT 'website'
);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can subscribe (insert their email)
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Policy: Only authenticated users can view their own subscription
DROP POLICY IF EXISTS "Users can view own subscription" ON public.newsletter_subscribers;
CREATE POLICY "Users can view own subscription" ON public.newsletter_subscribers
  FOR SELECT USING (
    auth.jwt() IS NOT NULL 
    AND email = (auth.jwt()->>'email')
  );

-- Policy: Only authenticated users can unsubscribe (update their own)
DROP POLICY IF EXISTS "Users can update own subscription" ON public.newsletter_subscribers;
CREATE POLICY "Users can update own subscription" ON public.newsletter_subscribers
  FOR UPDATE USING (
    auth.jwt() IS NOT NULL 
    AND email = (auth.jwt()->>'email')
  );

-- No delete policy - subscriptions are soft-deleted via is_active flag

-- ============================================
-- 2. FIX FUNCTIONS WITH MUTABLE SEARCH_PATH
-- ============================================

-- 2.1 Fix handle_updated_at function
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

-- 2.2 Fix handle_new_user function
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

-- 2.3 Fix decrement_lifetime_counter function
CREATE OR REPLACE FUNCTION public.decrement_lifetime_counter()
RETURNS INTEGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count INTEGER;
BEGIN
  -- Get current count
  SELECT (value)::INTEGER INTO current_count
  FROM public.settings
  WHERE key = 'lifetime_remaining';
  
  -- If count > 0, decrement
  IF current_count > 0 THEN
    UPDATE public.settings
    SET value = to_jsonb(current_count - 1), updated_at = NOW()
    WHERE key = 'lifetime_remaining';
    RETURN current_count - 1;
  END IF;
  
  RETURN 0;
END;
$$;

-- 2.4 Fix activate_premium function
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
  -- Calculate expiry based on type
  IF p_type = 'monthly' THEN
    expiry_date := NOW() + INTERVAL '1 month';
  ELSIF p_type = 'annual' THEN
    expiry_date := NOW() + INTERVAL '1 year';
  ELSIF p_type = 'lifetime' THEN
    expiry_date := NULL; -- No expiry for lifetime
    -- Decrement lifetime counter
    PERFORM public.decrement_lifetime_counter();
  ELSE
    RETURN FALSE;
  END IF;
  
  -- Update profile
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

-- ============================================
-- 3. FIX OVERLY PERMISSIVE RLS POLICIES ON RACQUETS
-- ============================================

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Allow anon delete on racquets" ON public.racquets;
DROP POLICY IF EXISTS "Allow anon insert on racquets" ON public.racquets;

-- Create proper read-only policy for public access
-- Racquets data should be read-only for everyone
DROP POLICY IF EXISTS "Anyone can read racquets" ON public.racquets;
CREATE POLICY "Anyone can read racquets" ON public.racquets
  FOR SELECT USING (true);

-- Only service role (admin) can insert/update/delete
-- This is handled by Supabase service role key, no policy needed

-- ============================================
-- 4. FIX OVERLY PERMISSIVE RLS POLICIES ON STRINGS
-- ============================================

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Allow anon delete on strings" ON public.strings;
DROP POLICY IF EXISTS "Allow anon insert on strings" ON public.strings;

-- Create proper read-only policy for public access
-- Strings data should be read-only for everyone
DROP POLICY IF EXISTS "Anyone can read strings" ON public.strings;
CREATE POLICY "Anyone can read strings" ON public.strings
  FOR SELECT USING (true);

-- Only service role (admin) can insert/update/delete
-- This is handled by Supabase service role key, no policy needed

-- ============================================
-- 5. VERIFICATION QUERIES
-- ============================================
-- Run these after migration to verify:

-- Check RLS is enabled on newsletter_subscribers:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'newsletter_subscribers';

-- Check functions have search_path set:
-- SELECT proname, prosrc FROM pg_proc WHERE proname IN ('handle_updated_at', 'handle_new_user', 'decrement_lifetime_counter', 'activate_premium');

-- Check policies on racquets and strings:
-- SELECT schemaname, tablename, policyname, cmd, qual FROM pg_policies WHERE tablename IN ('racquets', 'strings');

-- ============================================
-- END OF MIGRATION
-- ============================================
