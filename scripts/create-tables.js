/**
 * Script to create tables in Supabase using the Management API
 * First, let's check what endpoints are available
 */

const SUPABASE_URL = 'https://yhhdkllbaxuhwrfpsmev.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGRrbGxiYXh1aHdyZnBzbWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NjI0MDEsImV4cCI6MjA4MTMzODQwMX0.2aC_gYZf0xxz6MXi5zcaCH2S64RBaQvXU7a5qiuD0_k';

const SQL_CREATE_TABLES = `
-- Create racquets table
CREATE TABLE IF NOT EXISTS public.racquets (
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT,
  stiffness INTEGER,
  weight INTEGER NOT NULL,
  head_size INTEGER NOT NULL,
  string_pattern TEXT,
  category TEXT,
  player_level TEXT[],
  description TEXT,
  pro_usage TEXT,
  price_eur NUMERIC,
  price_usd NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create strings table
CREATE TABLE IF NOT EXISTS public.strings (
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  type TEXT NOT NULL,
  gauges TEXT[],
  stiffness INTEGER,
  performance NUMERIC,
  control NUMERIC,
  comfort NUMERIC,
  durability NUMERIC,
  spin NUMERIC,
  power NUMERIC,
  tension_min INTEGER,
  tension_max INTEGER,
  price_eur NUMERIC,
  price_usd NUMERIC,
  description TEXT,
  pro_usage TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.racquets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access on racquets" ON public.racquets;
DROP POLICY IF EXISTS "Allow public read access on strings" ON public.strings;
DROP POLICY IF EXISTS "Allow anon insert on racquets" ON public.racquets;
DROP POLICY IF EXISTS "Allow anon insert on strings" ON public.strings;
DROP POLICY IF EXISTS "Allow anon delete on racquets" ON public.racquets;
DROP POLICY IF EXISTS "Allow anon delete on strings" ON public.strings;

-- Create policies for public read access
CREATE POLICY "Allow public read access on racquets" ON public.racquets FOR SELECT USING (true);
CREATE POLICY "Allow public read access on strings" ON public.strings FOR SELECT USING (true);

-- Create policies for anon insert
CREATE POLICY "Allow anon insert on racquets" ON public.racquets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon insert on strings" ON public.strings FOR INSERT WITH CHECK (true);

-- Create policies for anon delete
CREATE POLICY "Allow anon delete on racquets" ON public.racquets FOR DELETE USING (true);
CREATE POLICY "Allow anon delete on strings" ON public.strings FOR DELETE USING (true);
`;

async function executeSQL(sql) {
  console.log('Executing SQL via RPC...');
  
  // Try using the rpc endpoint to execute raw SQL
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });
  
  const text = await response.text();
  console.log('Response status:', response.status);
  console.log('Response:', text);
  
  return response.ok;
}

async function main() {
  console.log('🔧 Attempting to create tables...\n');
  
  // The anon key doesn't have permission to create tables
  // We need to use the Supabase Dashboard SQL Editor
  
  console.log('⚠️  The anon key cannot create tables directly.');
  console.log('Please run the following SQL in your Supabase Dashboard:\n');
  console.log('1. Go to: https://supabase.com/dashboard/project/yhhdkllbaxuhwrfpsmev/sql');
  console.log('2. Copy and paste the following SQL:\n');
  console.log('========================================');
  console.log(SQL_CREATE_TABLES);
  console.log('========================================\n');
  console.log('3. Click "Run" to execute the SQL');
  console.log('4. Then run: node scripts/setup-supabase.js');
}

main().catch(console.error);
