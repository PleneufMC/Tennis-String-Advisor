const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://yhhdkllbaxuhwrfpsmev.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGRrbGxiYXh1aHdyZnBzbWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NjI0MDEsImV4cCI6MjA4MTMzODQwMX0.2aC_gYZf0xxz6MXi5zcaCH2S64RBaQvXU7a5qiuD0_k';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkTables() {
  console.log('=== Vérification des tables Supabase ===\n');
  
  // Check profiles table
  console.log('1. Table "profiles":');
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
  
  if (profilesError) {
    console.log('   ❌ ERREUR:', profilesError.message);
    console.log('   → Table non existante ou non accessible\n');
  } else {
    console.log('   ✅ Table existe');
    console.log('   → Colonnes accessibles\n');
  }

  // Check user_setups table
  console.log('2. Table "user_setups":');
  const { data: setups, error: setupsError } = await supabase
    .from('user_setups')
    .select('*')
    .limit(1);
  
  if (setupsError) {
    console.log('   ❌ ERREUR:', setupsError.message);
    console.log('   → Table non existante ou non accessible\n');
  } else {
    console.log('   ✅ Table existe');
    console.log('   → Colonnes accessibles\n');
  }

  // Check settings table (for lifetime counter)
  console.log('3. Table "settings":');
  const { data: settings, error: settingsError } = await supabase
    .from('settings')
    .select('*')
    .limit(1);
  
  if (settingsError) {
    console.log('   ❌ ERREUR:', settingsError.message);
    console.log('   → Table non existante\n');
  } else {
    console.log('   ✅ Table existe\n');
  }

  // Check racquets and strings (should exist)
  console.log('4. Tables produits:');
  const { count: racquetCount } = await supabase.from('racquets').select('*', { count: 'exact', head: true });
  const { count: stringCount } = await supabase.from('strings').select('*', { count: 'exact', head: true });
  console.log(`   ✅ Raquettes: ${racquetCount}`);
  console.log(`   ✅ Cordages: ${stringCount}\n`);

  // Auth providers check
  console.log('5. Configuration Auth:');
  console.log('   ℹ️  Les providers OAuth (Google, Facebook) doivent être');
  console.log('   configurés dans Supabase Dashboard > Authentication > Providers\n');
}

checkTables().catch(console.error);
