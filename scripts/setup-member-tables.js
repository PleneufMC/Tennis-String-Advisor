const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://yhhdkllbaxuhwrfpsmev.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGRrbGxiYXh1aHdyZnBzbWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NjI0MDEsImV4cCI6MjA4MTMzODQwMX0.2aC_gYZf0xxz6MXi5zcaCH2S64RBaQvXU7a5qiuD0_k'
);

async function checkTables() {
  console.log('Vérification des tables existantes...');
  
  // Check if profiles table exists
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
  
  if (profilesError && profilesError.code === '42P01') {
    console.log('Table profiles: NON EXISTANTE - À créer dans Supabase Dashboard');
  } else if (profilesError) {
    console.log('Table profiles: Erreur -', profilesError.message);
  } else {
    console.log('Table profiles: OK');
  }
  
  // Check if setups table exists
  const { data: setups, error: setupsError } = await supabase
    .from('user_setups')
    .select('*')
    .limit(1);
  
  if (setupsError && setupsError.code === '42P01') {
    console.log('Table user_setups: NON EXISTANTE - À créer dans Supabase Dashboard');
  } else if (setupsError) {
    console.log('Table user_setups: Erreur -', setupsError.message);
  } else {
    console.log('Table user_setups: OK');
  }
  
  console.log('\n--- SQL à exécuter dans Supabase Dashboard (SQL Editor) ---\n');
  
  console.log(`
-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  level TEXT CHECK (level IN ('debutant', 'intermediaire', 'avance', 'competition')),
  play_style TEXT CHECK (play_style IN ('puissance', 'controle', 'spin', 'polyvalent')),
  frequency TEXT CHECK (frequency IN ('occasionnel', 'regulier', 'intensif')),
  physical_issues TEXT[],
  current_racquet_id UUID REFERENCES racquets(id),
  current_string_id UUID REFERENCES strings(id),
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des setups utilisateurs
CREATE TABLE IF NOT EXISTS user_setups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  racquet_id UUID REFERENCES racquets(id),
  racquet_name TEXT,
  racquet_brand TEXT,
  string_id UUID REFERENCES strings(id),
  string_name TEXT,
  string_brand TEXT,
  tension DECIMAL(4,1),
  rcs_score DECIMAL(4,1),
  notes TEXT,
  is_favorite BOOLEAN DEFAULT false,
  string_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_user_setups_user_id ON user_setups(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_setups ENABLE ROW LEVEL SECURITY;

-- Policies pour profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies pour user_setups
CREATE POLICY "Users can view own setups" ON user_setups
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own setups" ON user_setups
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own setups" ON user_setups
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own setups" ON user_setups
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger pour créer un profil automatiquement à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Déclencher à chaque nouvelle inscription
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`);

  console.log('\n--- FIN SQL ---\n');
  console.log('Copiez ce SQL et exécutez-le dans Supabase Dashboard > SQL Editor');
}

checkTables();
