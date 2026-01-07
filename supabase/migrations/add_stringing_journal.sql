-- ============================================
-- Tennis String Advisor - Stringing Journal Table
-- ============================================
-- Migration: Add stringing_journal table for Premium users
-- Feature: Track stringing orders for professional stringers
-- ============================================

-- ============================================
-- STRINGING_JOURNAL TABLE
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
  
  -- String Information
  string_id INTEGER REFERENCES public.strings(id) ON DELETE SET NULL,
  string_brand TEXT,
  string_model TEXT,
  
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

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE public.stringing_journal ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own journal entries
CREATE POLICY "Users can view own stringing journal" ON public.stringing_journal
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own journal entries
CREATE POLICY "Users can insert own stringing journal" ON public.stringing_journal
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own journal entries
CREATE POLICY "Users can update own stringing journal" ON public.stringing_journal
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own journal entries
CREATE POLICY "Users can delete own stringing journal" ON public.stringing_journal
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_stringing_journal_user_id ON public.stringing_journal(user_id);

-- Index on received_at for sorting
CREATE INDEX IF NOT EXISTS idx_stringing_journal_received_at ON public.stringing_journal(received_at DESC);

-- Index on status for filtering
CREATE INDEX IF NOT EXISTS idx_stringing_journal_status ON public.stringing_journal(status);

-- Index on client_name for search
CREATE INDEX IF NOT EXISTS idx_stringing_journal_client_name ON public.stringing_journal(client_name);

-- ============================================
-- TRIGGER FOR UPDATED_AT
-- ============================================

-- Apply updated_at trigger
DROP TRIGGER IF EXISTS stringing_journal_updated_at ON public.stringing_journal;
CREATE TRIGGER stringing_journal_updated_at
  BEFORE UPDATE ON public.stringing_journal
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- VERIFICATION
-- ============================================
-- Run these queries to verify the table was created:
--
-- SELECT * FROM public.stringing_journal LIMIT 1;
-- SELECT column_name, data_type FROM information_schema.columns 
--   WHERE table_name = 'stringing_journal' ORDER BY ordinal_position;
--
-- ============================================
