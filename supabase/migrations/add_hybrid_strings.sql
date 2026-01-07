-- ============================================
-- Tennis String Advisor - Hybrid Strings Support
-- ============================================
-- Migration: Add hybrid string support to user_setups and stringing_journal
-- Feature: Allow different strings for mains and crosses
-- ============================================

-- ============================================
-- ADD HYBRID COLUMNS TO USER_SETUPS
-- ============================================

-- Rename existing string columns to be explicit for MAINS
-- Add new columns for CROSS strings

-- First, let's add the new columns for cross strings
ALTER TABLE public.user_setups 
ADD COLUMN IF NOT EXISTS is_hybrid BOOLEAN DEFAULT FALSE;

ALTER TABLE public.user_setups 
ADD COLUMN IF NOT EXISTS string_cross_id INTEGER REFERENCES public.strings(id) ON DELETE SET NULL;

ALTER TABLE public.user_setups 
ADD COLUMN IF NOT EXISTS string_cross_brand TEXT;

ALTER TABLE public.user_setups 
ADD COLUMN IF NOT EXISTS string_cross_model TEXT;

-- Add comments for clarity
COMMENT ON COLUMN public.user_setups.string_id IS 'String ID for MAINS (montants)';
COMMENT ON COLUMN public.user_setups.string_brand IS 'String brand for MAINS (montants)';
COMMENT ON COLUMN public.user_setups.string_model IS 'String model for MAINS (montants)';
COMMENT ON COLUMN public.user_setups.is_hybrid IS 'True if using different strings for mains and crosses';
COMMENT ON COLUMN public.user_setups.string_cross_id IS 'String ID for CROSSES (travers) - only used if is_hybrid=true';
COMMENT ON COLUMN public.user_setups.string_cross_brand IS 'String brand for CROSSES (travers) - only used if is_hybrid=true';
COMMENT ON COLUMN public.user_setups.string_cross_model IS 'String model for CROSSES (travers) - only used if is_hybrid=true';

-- ============================================
-- ADD HYBRID COLUMNS TO STRINGING_JOURNAL
-- ============================================

ALTER TABLE public.stringing_journal 
ADD COLUMN IF NOT EXISTS is_hybrid BOOLEAN DEFAULT FALSE;

ALTER TABLE public.stringing_journal 
ADD COLUMN IF NOT EXISTS string_cross_id INTEGER REFERENCES public.strings(id) ON DELETE SET NULL;

ALTER TABLE public.stringing_journal 
ADD COLUMN IF NOT EXISTS string_cross_brand TEXT;

ALTER TABLE public.stringing_journal 
ADD COLUMN IF NOT EXISTS string_cross_model TEXT;

-- Add comments for clarity
COMMENT ON COLUMN public.stringing_journal.string_id IS 'String ID for MAINS (montants)';
COMMENT ON COLUMN public.stringing_journal.string_brand IS 'String brand for MAINS (montants)';
COMMENT ON COLUMN public.stringing_journal.string_model IS 'String model for MAINS (montants)';
COMMENT ON COLUMN public.stringing_journal.is_hybrid IS 'True if using different strings for mains and crosses';
COMMENT ON COLUMN public.stringing_journal.string_cross_id IS 'String ID for CROSSES (travers) - only used if is_hybrid=true';
COMMENT ON COLUMN public.stringing_journal.string_cross_brand IS 'String brand for CROSSES (travers) - only used if is_hybrid=true';
COMMENT ON COLUMN public.stringing_journal.string_cross_model IS 'String model for CROSSES (travers) - only used if is_hybrid=true';

-- ============================================
-- VERIFICATION
-- ============================================
-- Run these queries to verify the columns were added:
--
-- SELECT column_name, data_type FROM information_schema.columns 
--   WHERE table_name = 'user_setups' AND column_name LIKE '%cross%' OR column_name = 'is_hybrid'
--   ORDER BY ordinal_position;
--
-- SELECT column_name, data_type FROM information_schema.columns 
--   WHERE table_name = 'stringing_journal' AND column_name LIKE '%cross%' OR column_name = 'is_hybrid'
--   ORDER BY ordinal_position;
--
-- ============================================
