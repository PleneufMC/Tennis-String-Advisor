# Peupler la Base de Données - Catalogue Raquettes & Cordages

Ce document explique comment remplir les tables `racquets` et `strings` dans Supabase avec le catalogue complet.

## 📊 Catalogue Disponible

- **104 raquettes** : Babolat, Head, Wilson, Yonex, Prince, Tecnifibre, Dunlop, Volkl
- **165+ cordages** : Luxilon, Babolat, Head, Wilson, Solinco, Tecnifibre, Yonex

## 🚀 Méthode 1 : Utiliser les Scripts Node.js (Recommandé)

### Prérequis
```bash
cd /home/user/webapp
npm install
```

### Étape 1 : Créer les Tables

```bash
node scripts/create-tables.js
```

Ce script crée les tables suivantes :
- `racquets` (raquettes)
- `strings` (cordages)
- Avec indexes pour performance

### Étape 2 : Insérer les Données

**Option A : Tout insérer en une fois**
```bash
node scripts/insert-data.js
```

**Option B : Insérer par marque (plus contrôlé)**
```bash
# Raquettes
node scripts/update-racquets.js

# Cordages par marque
node scripts/update-babolat-strings.js
node scripts/update-luxilon-strings.js
node scripts/update-head-strings.js
node scripts/update-solinco-strings.js
node scripts/update-tecnifibre-strings.js
node scripts/update-wilson-yonex-strings.js
```

### Vérification

```bash
# Vérifier dans Supabase SQL Editor
SELECT COUNT(*) as total_racquets FROM racquets;
SELECT COUNT(*) as total_strings FROM strings;
SELECT brand, COUNT(*) FROM racquets GROUP BY brand ORDER BY brand;
```

Résultat attendu :
```
total_racquets: ~104
total_strings: ~165
```

## 🗄️ Méthode 2 : SQL Direct (Alternative)

Si les scripts Node.js ne fonctionnent pas, vous pouvez créer les tables manuellement.

### Créer la Table Racquets

```sql
CREATE TABLE IF NOT EXISTS public.racquets (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT,
  head_size INTEGER,
  weight INTEGER,
  balance INTEGER,
  swingweight INTEGER,
  stiffness INTEGER,
  string_pattern TEXT,
  length DECIMAL(4,2) DEFAULT 27.0,
  beam_width TEXT,
  composition TEXT,
  category TEXT,
  player_level TEXT[],
  pro_usage TEXT,
  description TEXT,
  technology TEXT,
  image_url TEXT,
  price_eur DECIMAL(6,2),
  price_usd DECIMAL(6,2),
  affiliate_link TEXT,
  in_stock BOOLEAN DEFAULT TRUE,
  year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_racquets_brand ON public.racquets(brand);
CREATE INDEX IF NOT EXISTS idx_racquets_category ON public.racquets(category);
CREATE INDEX IF NOT EXISTS idx_racquets_player_level ON public.racquets USING GIN(player_level);
CREATE INDEX IF NOT EXISTS idx_racquets_stiffness ON public.racquets(stiffness);

-- Enable RLS
ALTER TABLE public.racquets ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read racquets
CREATE POLICY "Anyone can read racquets" ON public.racquets
  FOR SELECT USING (true);
```

### Créer la Table Cordages

```sql
CREATE TABLE IF NOT EXISTS public.strings (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  type TEXT NOT NULL,
  gauge DECIMAL(4,2)[],
  construction TEXT,
  material TEXT,
  spin INTEGER CHECK (spin >= 1 AND spin <= 10),
  power INTEGER CHECK (power >= 1 AND power <= 10),
  control INTEGER CHECK (control >= 1 AND control <= 10),
  comfort INTEGER CHECK (comfort >= 1 AND comfort <= 10),
  durability INTEGER CHECK (durability >= 1 AND durability <= 10),
  stiffness DECIMAL(5,1),
  description TEXT,
  technology TEXT,
  best_for TEXT[],
  tension_range_min INTEGER,
  tension_range_max INTEGER,
  color TEXT[],
  image_url TEXT,
  price_eur DECIMAL(6,2),
  price_usd DECIMAL(6,2),
  affiliate_link TEXT,
  in_stock BOOLEAN DEFAULT TRUE,
  year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_strings_brand ON public.strings(brand);
CREATE INDEX IF NOT EXISTS idx_strings_type ON public.strings(type);
CREATE INDEX IF NOT EXISTS idx_strings_spin ON public.strings(spin);
CREATE INDEX IF NOT EXISTS idx_strings_comfort ON public.strings(comfort);

-- Enable RLS
ALTER TABLE public.strings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read strings
CREATE POLICY "Anyone can read strings" ON public.strings
  FOR SELECT USING (true);
```

## 🔍 Scripts Disponibles

Tous les scripts sont dans `/scripts/` :

| Script | Description |
|--------|-------------|
| `create-tables.js` | Crée les tables racquets et strings |
| `insert-data.js` | Insert toutes les données (racquets + cordages) |
| `update-racquets.js` | Insert/update 104 raquettes |
| `update-babolat-strings.js` | Insert cordages Babolat |
| `update-luxilon-strings.js` | Insert cordages Luxilon |
| `update-head-strings.js` | Insert cordages Head |
| `update-solinco-strings.js` | Insert cordages Solinco |
| `update-tecnifibre-strings.js` | Insert cordages Tecnifibre |
| `update-wilson-yonex-strings.js` | Insert cordages Wilson & Yonex |

## ⚙️ Configuration Supabase

Les scripts utilisent les credentials suivants :

```javascript
const SUPABASE_URL = 'https://yhhdkllbaxuhwrfpsmev.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGc...'; // Déjà configuré dans les scripts
```

Ces credentials sont publics (anon key) et ne nécessitent pas de changement.

## 🧪 Tester le Configurateur Dynamique

Une fois les données insérées :

1. Ouvrez https://tennisstringadvisor.org/configurator.html
2. Complétez une configuration
3. **Recommencez plusieurs fois** avec les mêmes choix
4. ✅ Vous devriez voir **des raquettes différentes** à chaque fois

### Console Développeur

Ouvrez la console (F12) pour voir :
```
Loaded 104 racquets from database
Loaded 165 strings from database
```

Si vous voyez ces messages, le configurateur utilise bien la base de données !

## 🎯 Exemple de Données

### Raquettes par Niveau

```sql
-- Débutants (Light, Tweener, confort)
SELECT brand, model, stiffness, weight, category 
FROM racquets 
WHERE 'Beginner' = ANY(player_level) 
  AND stiffness <= 66
ORDER BY stiffness ASC
LIMIT 10;
```

Résultats attendus :
- Wilson Clash 100 (RA 54)
- Yonex EZONE 100 (RA 64)
- Head Instinct MP (RA 64)
- Babolat Pure Drive Lite (RA 69)

### Cordages par Type

```sql
-- Multifilaments (confort)
SELECT brand, model, comfort, spin, control 
FROM strings 
WHERE type ILIKE '%Multifilament%'
ORDER BY comfort DESC
LIMIT 10;
```

Résultats attendus :
- Tecnifibre NRG2 (Comfort: 10)
- Wilson NXT (Comfort: 9)
- Babolat Xcel (Comfort: 9)

## 🚨 Dépannage

### "Cannot find module @supabase/supabase-js"

```bash
cd /home/user/webapp
npm install @supabase/supabase-js
```

### "Tables already exist"

Les scripts gèrent les doublons avec `ON CONFLICT DO UPDATE`. Vous pouvez les relancer sans problème.

### "No data showing in configurator"

Vérifiez dans la console navigateur (F12) :
- Erreurs JavaScript ?
- Message "Loaded X racquets" ?

Si pas de données :
```sql
-- Vérifier que les tables existent
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('racquets', 'strings');

-- Vérifier le contenu
SELECT COUNT(*) FROM racquets;
SELECT COUNT(*) FROM strings;
```

### "Fallback racquets still appearing"

Si vous voyez toujours les mêmes raquettes hardcodées, c'est que la base n'est pas peuplée. Exécutez les scripts d'insertion.

## 📈 Monitoring

### Voir les Raquettes les Plus Recommandées

```sql
-- Top 10 des raquettes recommandées (à implémenter)
-- Pour l'instant, le configurateur ne log pas les recommendations
-- Future feature: track recommendation_count
```

### Statistiques du Catalogue

```sql
-- Raquettes par marque
SELECT brand, COUNT(*) as models, 
       ROUND(AVG(stiffness), 1) as avg_stiffness,
       ROUND(AVG(price_eur), 0) as avg_price
FROM racquets
GROUP BY brand
ORDER BY COUNT(*) DESC;

-- Cordages par type
SELECT type, COUNT(*) as models,
       ROUND(AVG(comfort), 1) as avg_comfort,
       ROUND(AVG(spin), 1) as avg_spin
FROM strings
GROUP BY type
ORDER BY COUNT(*) DESC;
```

## ✅ Checklist

- [ ] Tables `racquets` et `strings` créées dans Supabase
- [ ] Script `create-tables.js` exécuté avec succès
- [ ] Script `insert-data.js` ou scripts individuels exécutés
- [ ] Vérification : `SELECT COUNT(*) FROM racquets` → ~104
- [ ] Vérification : `SELECT COUNT(*) FROM strings` → ~165
- [ ] Test configurateur : recommandations variées à chaque essai
- [ ] Console navigateur : "Loaded X racquets from database"

## 🔄 Mise à Jour du Catalogue

Pour ajouter de nouvelles raquettes/cordages :

1. Modifiez le script correspondant (`update-racquets.js`, etc.)
2. Ajoutez les nouvelles données dans le tableau `racquetsData` ou `stringsData`
3. Relancez le script : `node scripts/update-racquets.js`

Les scripts gèrent les conflits avec `ON CONFLICT (slug) DO UPDATE`.

---

**Besoin d'aide ?** Vérifiez les logs des scripts ou contactez pleneuftrading@gmail.com
