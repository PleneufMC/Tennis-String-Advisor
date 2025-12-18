-- ============================================
-- Migration: Add Usage Tracking Columns
-- ============================================
-- Add columns for tracking free usage of configurator and RCS calculator
-- Execute this in Supabase SQL Editor if you already have a profiles table

-- Add configurator_uses column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS configurator_uses INTEGER DEFAULT 0;

COMMENT ON COLUMN public.profiles.configurator_uses IS 'Nombre de configurations utilisées (gratuit = 1)';

-- Add rcs_calculations_used column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS rcs_calculations_used INTEGER DEFAULT 0;

COMMENT ON COLUMN public.profiles.rcs_calculations_used IS 'Nombre de calculs RCS utilisés (gratuit = 1)';

-- Set default values for existing rows
UPDATE public.profiles 
SET configurator_uses = 0 
WHERE configurator_uses IS NULL;

UPDATE public.profiles 
SET rcs_calculations_used = 0 
WHERE rcs_calculations_used IS NULL;
