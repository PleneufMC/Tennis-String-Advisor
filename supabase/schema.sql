-- ============================================
-- Tennis String Advisor - Supabase Database Schema
-- ============================================
-- Execute this script in Supabase SQL Editor
-- Dashboard > SQL Editor > New Query
-- ============================================

-- ============================================
-- 1. PROFILES TABLE (User Information)
-- ============================================
-- This table stores extended user profile data
-- linked to Supabase Auth users

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  -- Player profile
  level TEXT CHECK (level IN ('debutant', 'intermediaire', 'avance', 'competiteur', 'pro')),
  frequency TEXT CHECK (frequency IN ('occasionnel', 'regulier', 'intensif', 'quotidien')),
  play_style TEXT CHECK (play_style IN ('polyvalent', 'puissance', 'controle', 'spin', 'service-volee')),
  physical_issues TEXT CHECK (physical_issues IN ('aucun', 'bras', 'epaule', 'poignet', 'dos')),
  -- Premium status
  is_premium BOOLEAN DEFAULT FALSE,
  premium_type TEXT CHECK (premium_type IN ('monthly', 'annual', 'lifetime')),
  premium_started_at TIMESTAMPTZ,
  premium_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  -- Usage tracking
  configurator_uses INTEGER DEFAULT 0,
  rcs_calculations_used INTEGER DEFAULT 0,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. USER_SETUPS TABLE (Racquet Configurations)
-- ============================================
-- Stores user's racquet + string + tension setups
-- Premium feature - unlimited for premium users

CREATE TABLE IF NOT EXISTS public.user_setups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  -- Racquet info
  racquet_id INTEGER REFERENCES public.racquets(id) ON DELETE SET NULL,
  racquet_brand TEXT,
  racquet_model TEXT,
  -- String info (MAINS / Montants)
  string_id INTEGER REFERENCES public.strings(id) ON DELETE SET NULL,
  string_brand TEXT,
  string_model TEXT,
  -- Hybrid string support (CROSSES / Travers)
  is_hybrid BOOLEAN DEFAULT FALSE,
  string_cross_id INTEGER REFERENCES public.strings(id) ON DELETE SET NULL,
  string_cross_brand TEXT,
  string_cross_model TEXT,
  -- Tension
  tension_mains DECIMAL(4,1),
  tension_crosses DECIMAL(4,1),
  tension_unit TEXT DEFAULT 'kg' CHECK (tension_unit IN ('kg', 'lbs')),
  -- RCS Score
  rcs_score INTEGER,
  rcs_category TEXT,
  -- Additional info
  name TEXT,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  last_strung_at DATE,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_setups ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own setups
CREATE POLICY "Users can view own setups" ON public.user_setups
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own setups
CREATE POLICY "Users can insert own setups" ON public.user_setups
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own setups
CREATE POLICY "Users can update own setups" ON public.user_setups
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own setups
CREATE POLICY "Users can delete own setups" ON public.user_setups
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 3. SETTINGS TABLE (Application Settings)
-- ============================================
-- Stores global application settings like lifetime counter

CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial settings
INSERT INTO public.settings (key, value) VALUES
  ('lifetime_remaining', '150'::jsonb),
  ('lifetime_price', '19.99'::jsonb),
  ('monthly_price', '2.99'::jsonb),
  ('annual_price', '24.99'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Enable RLS but allow public read
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read settings
CREATE POLICY "Anyone can read settings" ON public.settings
  FOR SELECT USING (true);

-- ============================================
-- 4. STRING_HISTORY TABLE (Future Feature)
-- ============================================
-- Tracks string usage history for premium users

CREATE TABLE IF NOT EXISTS public.string_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  setup_id UUID REFERENCES public.user_setups(id) ON DELETE SET NULL,
  string_id INTEGER REFERENCES public.strings(id) ON DELETE SET NULL,
  string_brand TEXT,
  string_model TEXT,
  tension DECIMAL(4,1),
  strung_date DATE NOT NULL,
  broke_date DATE,
  hours_played INTEGER,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.string_history ENABLE ROW LEVEL SECURITY;

-- Policies for string_history
CREATE POLICY "Users can view own string history" ON public.string_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own string history" ON public.string_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own string history" ON public.string_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own string history" ON public.string_history
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 5. STRINGING_JOURNAL TABLE (Premium Feature)
-- ============================================
-- Stores stringing orders for professional stringers
-- Premium feature only

CREATE TABLE IF NOT EXISTS public.stringing_journal (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Client Information
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_email TEXT,
  
  -- Racquet Information
  racquet_id INTEGER REFERENCES public.racquets(id) ON DELETE SET NULL,
  racquet_brand TEXT,
  racquet_model TEXT,
  
  -- String Information (MAINS / Montants)
  string_id INTEGER REFERENCES public.strings(id) ON DELETE SET NULL,
  string_brand TEXT,
  string_model TEXT,
  
  -- Hybrid String Support (CROSSES / Travers)
  is_hybrid BOOLEAN DEFAULT FALSE,
  string_cross_id INTEGER REFERENCES public.strings(id) ON DELETE SET NULL,
  string_cross_brand TEXT,
  string_cross_model TEXT,
  
  -- Tension Settings
  tension_mains DECIMAL(4,1) NOT NULL,
  tension_crosses DECIMAL(4,1),
  tension_unit TEXT DEFAULT 'kg' CHECK (tension_unit IN ('kg', 'lbs')),
  
  -- RCS Score (calculated)
  rcs_score INTEGER,
  
  -- Pricing
  string_price DECIMAL(8,2),
  labor_price DECIMAL(8,2),
  total_price DECIMAL(8,2),
  
  -- Status Management
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delivered', 'cancelled')),
  
  -- Dates
  received_at DATE DEFAULT CURRENT_DATE,
  completed_at DATE,
  delivered_at DATE,
  
  -- Notes
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.stringing_journal ENABLE ROW LEVEL SECURITY;

-- Policies for stringing_journal
CREATE POLICY "Users can view own stringing journal" ON public.stringing_journal
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stringing journal" ON public.stringing_journal
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stringing journal" ON public.stringing_journal
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stringing journal" ON public.stringing_journal
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 6. PRICE_ALERTS TABLE (Future Feature)
-- ============================================
-- Stores price alert subscriptions for premium users

CREATE TABLE IF NOT EXISTS public.price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('racquet', 'string')),
  racquet_id INTEGER REFERENCES public.racquets(id) ON DELETE CASCADE,
  string_id INTEGER REFERENCES public.strings(id) ON DELETE CASCADE,
  target_price DECIMAL(8,2),
  current_price DECIMAL(8,2),
  is_active BOOLEAN DEFAULT TRUE,
  last_checked_at TIMESTAMPTZ,
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- Policies for price_alerts
CREATE POLICY "Users can view own price alerts" ON public.price_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own price alerts" ON public.price_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own price alerts" ON public.price_alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own price alerts" ON public.price_alerts
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 6. NEWSLETTER SUBSCRIBERS TABLE
-- ============================================
-- Stores newsletter subscriptions

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
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Policy: Only authenticated users can view their own subscription
CREATE POLICY "Users can view own subscription" ON public.newsletter_subscribers
  FOR SELECT USING (
    auth.jwt() IS NOT NULL 
    AND email = (auth.jwt()->>'email')
  );

-- Policy: Only authenticated users can unsubscribe (update their own)
CREATE POLICY "Users can update own subscription" ON public.newsletter_subscribers
  FOR UPDATE USING (
    auth.jwt() IS NOT NULL 
    AND email = (auth.jwt()->>'email')
  );

-- ============================================
-- 7. AUTOMATIC PROFILE CREATION TRIGGER
-- ============================================
-- Automatically creates a profile when a new user signs up

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

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 8. UPDATE TIMESTAMP TRIGGER
-- ============================================
-- Automatically updates the updated_at column

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

-- Apply to profiles
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Apply to user_setups
DROP TRIGGER IF EXISTS user_setups_updated_at ON public.user_setups;
CREATE TRIGGER user_setups_updated_at
  BEFORE UPDATE ON public.user_setups
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Apply to stringing_journal
DROP TRIGGER IF EXISTS stringing_journal_updated_at ON public.stringing_journal;
CREATE TRIGGER stringing_journal_updated_at
  BEFORE UPDATE ON public.stringing_journal
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 9. HELPER FUNCTION: Decrement Lifetime Counter
-- ============================================
-- Call this function when a lifetime purchase is made

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

-- ============================================
-- 10. HELPER FUNCTION: Activate Premium
-- ============================================
-- Call this function after successful payment

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
-- 11. INDEXES FOR PERFORMANCE
-- ============================================

-- Index on user_setups for faster queries
CREATE INDEX IF NOT EXISTS idx_user_setups_user_id ON public.user_setups(user_id);
CREATE INDEX IF NOT EXISTS idx_user_setups_created_at ON public.user_setups(created_at DESC);

-- Index on string_history
CREATE INDEX IF NOT EXISTS idx_string_history_user_id ON public.string_history(user_id);
CREATE INDEX IF NOT EXISTS idx_string_history_strung_date ON public.string_history(strung_date DESC);

-- Index on price_alerts
CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON public.price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_active ON public.price_alerts(is_active) WHERE is_active = TRUE;

-- Index on stringing_journal
CREATE INDEX IF NOT EXISTS idx_stringing_journal_user_id ON public.stringing_journal(user_id);
CREATE INDEX IF NOT EXISTS idx_stringing_journal_received_at ON public.stringing_journal(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_stringing_journal_status ON public.stringing_journal(status);
CREATE INDEX IF NOT EXISTS idx_stringing_journal_client_name ON public.stringing_journal(client_name);

-- ============================================
-- 12. SECURITY NOTES FOR RACQUETS AND STRINGS TABLES
-- ============================================
-- The racquets and strings tables should have:
-- - RLS enabled
-- - Read-only public access (SELECT with USING (true))
-- - No public INSERT/UPDATE/DELETE (admin only via service role)
--
-- Example policies (apply after creating racquets/strings tables):
--
-- ALTER TABLE public.racquets ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Anyone can read racquets" ON public.racquets
--   FOR SELECT USING (true);
--
-- ALTER TABLE public.strings ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Anyone can read strings" ON public.strings
--   FOR SELECT USING (true);

-- ============================================
-- VERIFICATION QUERIES (Run after setup)
-- ============================================

-- Check tables exist:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS is enabled on all public tables:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check profiles table:
-- SELECT * FROM public.profiles LIMIT 5;

-- Check settings:
-- SELECT * FROM public.settings;

-- Check functions have search_path set:
-- SELECT proname, proconfig FROM pg_proc 
-- WHERE proname IN ('handle_updated_at', 'handle_new_user', 'decrement_lifetime_counter', 'activate_premium');

-- Check policies on tables:
-- SELECT schemaname, tablename, policyname, cmd, qual FROM pg_policies WHERE schemaname = 'public';

-- Test trigger by inserting a test user (will auto-create profile):
-- This happens automatically when users sign up

-- ============================================
-- END OF SCHEMA
-- ============================================
