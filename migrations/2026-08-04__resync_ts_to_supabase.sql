-- =====================================================================
--  Tennis String Advisor - resynchronisation TS -> Supabase
--  Genere le 2026-08-04 depuis src/data/*.ts
--  Cible : projet yhhdkllbaxuhwrfpsmev / schema public
--  Proprietes : idempotent, transactionnel, ADDITIF (aucun DELETE/DROP)
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- ETAPE 1 : colonnes manquantes (donnees TS aujourd hui non stockables)
-- ---------------------------------------------------------------------
ALTER TABLE public.strings  ADD COLUMN IF NOT EXISTS versatility  NUMERIC;
ALTER TABLE public.strings  ADD COLUMN IF NOT EXISTS innovation   NUMERIC;
ALTER TABLE public.racquets ADD COLUMN IF NOT EXISTS balance      INTEGER;
ALTER TABLE public.racquets ADD COLUMN IF NOT EXISTS length        NUMERIC;
ALTER TABLE public.racquets ADD COLUMN IF NOT EXISTS swing_weight INTEGER;

-- tracabilite : savoir quelles lignes viennent du fichier TS
ALTER TABLE public.strings  ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE public.racquets ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE public.strings  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.racquets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ---------------------------------------------------------------------
-- ETAPE 2 : normalisation du type "Synthetic Gut" (absent de l enum TS)
--   12 lignes en base utilisent "Synthetic Gut", que le TypeScript refuse.
--   On aligne la base sur l enum TS ('Synthetic').
--   >>> Si vous preferez l inverse (ajouter Synthetic Gut a l enum TS),
--       commentez ce bloc et prevenez-moi : je modifierai le .ts.
-- ---------------------------------------------------------------------
UPDATE public.strings SET type = 'Synthetic' WHERE type = 'Synthetic Gut';

-- ---------------------------------------------------------------------
-- ETAPE 3 : cordages presents dans le TS mais absents de la base (18)
--   ON CONFLICT DO NOTHING => rejouable sans risque, n ecrase rien.
-- ---------------------------------------------------------------------
INSERT INTO public.strings
  (id, brand, model, type, gauges, stiffness, performance, control, comfort,
   durability, spin, power, versatility, innovation, tension_min, tension_max,
   price_eur, price_usd, description, pro_usage, color, source)
VALUES
  ('signum-pro-x-perience', 'Signum Pro', 'X-Perience', 'Polyester', ARRAY['1.18','1.24','1.30']::text[], 205, 8.5, 9, 8, 8, 8.5, 7.5, 8.5, 7.5, 22, 26, 11, 13, 'Référence allemande rapport qualité-prix. Très apprécié en Europe.', NULL, 'Orange', 'ts-database'),
  ('volkl-cyclone', 'Völkl', 'Cyclone', 'Polyester', ARRAY['1.20','1.25','1.30']::text[], 215, 8.3, 8.5, 7.5, 8, 8.8, 7.5, 8, 7.5, 22, 27, 11, 11, 'Polyester structuré (6 arêtes) très populaire pour le spin à petit prix.', NULL, 'Black', 'ts-database'),
  ('gosen-og-sheep-micro', 'Gosen', 'OG-Sheep Micro', 'Synthetic', ARRAY['1.25','1.30']::text[], 175, 7.5, 7, 8, 7.5, 6.5, 7.8, 8.5, 6, 22, 27, 7, 7, 'Boyau synthétique économique et polyvalent, valeur sûre pour tous niveaux.', NULL, 'White', 'ts-database'),
  ('gamma-moto', 'Gamma', 'Moto', 'Polyester', ARRAY['1.24','1.29']::text[], 205, 8.3, 8.3, 7.8, 8, 9, 7.5, 8, 7.5, 22, 27, 12, 12, 'Polyester à profil torsadé pour un spin maximal et un snapback marqué.', NULL, 'Orange', 'ts-database'),
  ('diadem-solstice-power', 'Diadem', 'Solstice Power', 'Polyester', ARRAY['1.25','1.30']::text[], 200, 8.5, 8.3, 8.3, 8, 8.5, 8.3, 8.5, 8, 22, 27, 15, 15, 'Polyester souple mêlant puissance, confort et spin, apprécié des joueurs all-court.', NULL, 'Black', 'ts-database'),
  ('wilson-repel', 'Wilson', 'Repel', 'Multifilament', ARRAY['1.25','1.30']::text[], 175, 7.8, 7.8, 8, 8.2, 7.5, 7.8, 8, 7.5, 22, 27, 14, 15, 'Multifilament à revêtement anti-abrasion : meilleure tenue et meilleur snapback que la moyenne des multis, donc plus de spin.', NULL, 'Natural', 'ts-database'),
  ('babolat-xalt', 'Babolat', 'Xalt', 'Multifilament', ARRAY['1.25','1.30']::text[], 158, 8.2, 7.5, 8.8, 7.2, 6.8, 8.5, 8.3, 7.5, 22, 27, 16, 17, 'Multifilament polyamide Babolat orienté confort et puissance, alternative moderne au Xcel.', NULL, 'Natural', 'ts-database'),
  ('babolat-addixion', 'Babolat', 'Addixion', 'Multifilament', ARRAY['1.25','1.30']::text[], 168, 7.6, 7.3, 8.4, 7.3, 6.8, 8.2, 8, 6.5, 22, 27, 12, 13, 'Multifilament d''entrée de gamme Babolat : confort accessible pour joueur loisir et club.', NULL, 'Natural', 'ts-database'),
  ('babolat-xplore', 'Babolat', 'XPlore', 'Multifilament', ARRAY['1.25','1.30','1.35']::text[], 178, 7, 7.2, 7.8, 7.8, 6.5, 7.8, 7.5, 5.5, 23, 28, 8, 9, 'Le multifilament le plus abordable de la gamme Babolat. Bon premier pas hors du synthétique pour un joueur débutant.', NULL, 'Natural', 'ts-database'),
  ('head-velocity-power', 'Head', 'Velocity Power', 'Multifilament', ARRAY['1.25','1.30']::text[], 150, 8.2, 7, 9.1, 7, 6.5, 9, 8, 7.5, 21, 26, 10, 11, 'Déclinaison puissance du Velocity MLT : très souple, beaucoup de profondeur, excellent pour bras fragile.', NULL, 'Natural', 'ts-database'),
  ('volkl-power-fiber-ii', 'Völkl', 'Power Fiber II', 'Multifilament', ARRAY['1.25']::text[], 152, 8.3, 7.4, 9.1, 7, 7, 8.7, 8.2, 8, 21, 26, 14, 15, 'Multifilament allemand haut de gamme : confort de premier ordre et très bonne tenue de tension.', NULL, 'Natural', 'ts-database'),
  ('volkl-power-fiber-pro', 'Völkl', 'Power Fiber Pro', 'Multifilament', ARRAY['1.25']::text[], 165, 8.1, 7.8, 8.5, 7.5, 7.2, 8.3, 8.2, 7.5, 22, 27, 13, 14, 'Version plus nerveuse du Power Fiber, un cran plus de contrôle pour joueur de niveau club confirmé.', NULL, 'Natural', 'ts-database'),
  ('prince-premier-control', 'Prince', 'Premier Control', 'Multifilament', ARRAY['1.30','1.40']::text[], 176, 7.6, 8.2, 8, 7.8, 6.8, 7.4, 7.8, 6.5, 23, 28, 11, 12, 'Multifilament Prince orienté contrôle, disponible en grosse jauge 1.40 pour une durabilité maximale.', NULL, 'Natural', 'ts-database'),
  ('kirschbaum-touch-multifiber', 'Kirschbaum', 'Touch Multifiber', 'Multifilament', ARRAY['1.30']::text[], 160, 8, 7.6, 8.8, 7.2, 6.8, 8.4, 8, 7, 22, 27, 15, 16, 'Multifilament artisanal allemand, toucher soyeux et confort marqué. Peu connu mais très apprécié des cordeurs.', NULL, 'Natural', 'ts-database'),
  ('isospeed-professional-classic', 'Isospeed', 'Professional Classic', 'Multifilament', ARRAY['1.20','1.30']::text[], 158, 8, 7.8, 8.9, 7, 6.8, 8.3, 8, 7.5, 21, 26, 11, 12, 'Multifilament autrichien réputé pour son amorti : marque historiquement positionnée sur la prévention des blessures.', NULL, 'Natural', 'ts-database'),
  ('isospeed-control-classic', 'Isospeed', 'Control Classic', 'Multifilament', ARRAY['1.30']::text[], 178, 7.8, 8.4, 8, 7.6, 7, 7.3, 7.8, 7, 23, 28, 13, 14, 'La déclinaison contrôle d''Isospeed : multifilament sec et précis pour joueur offensif sensible du bras.', NULL, 'Natural', 'ts-database'),
  ('signum-pro-fibercore', 'Signum Pro', 'Fibercore', 'Multifilament', ARRAY['1.30']::text[], 170, 7.5, 7.6, 8.3, 7.5, 6.8, 8, 7.8, 6.5, 22, 27, 9, 10, 'Multifilament économique de la marque allemande Signum Pro : confort correct à petit prix.', NULL, 'Natural', 'ts-database'),
  ('ashaway-dynamite-natural', 'Ashaway', 'Dynamite Natural', 'Multifilament', ARRAY['1.25','1.30']::text[], 143, 8.2, 7, 9.3, 7.4, 6.5, 9, 7.8, 8.5, 20, 25, 16, 17, 'Cordage à âme Zyex : élasticité et tenue de tension exceptionnelles, un des multis les plus doux du marché. Choix de niche pour bras très sensibles.', NULL, 'Optic Green', 'ts-database')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- ETAPE 4 : les 4 raquettes Wilson Defyer 2026 (confirmees absentes)
-- ---------------------------------------------------------------------
INSERT INTO public.racquets
  (id, brand, model, variant, stiffness, weight, head_size, balance, length,
   swing_weight, string_pattern, category, player_level, description, pro_usage,
   price_eur, price_usd, source)
VALUES
  ('wilson-defyer-98-pro-v1', 'Wilson', 'Defyer', '98 Pro', 64, 305, 98, 315, 27, 319, '16x20', 'Modern Player', ARRAY['Advanced','Pro']::text[], 'Le cadre de référence de la nouvelle franchise Defyer (2026). Plan 16x20 sans trous partagés : spin explosif mais trajectoire maîtrisée, avec un toucher étonnamment amorti pour une raquette à spin. Le modèle choisi par la grande majorité des pros Defyer.', 'Karen Khachanov, Holger Rune, Sebastian Korda, Arthur Fery', 280, 299, 'ts-database'),
  ('wilson-defyer-100-v1', 'Wilson', 'Defyer', '100', 66, 300, 100, 315, 27, NULL, '16x19', 'Modern Player', ARRAY['Intermediate','Advanced','Pro']::text[], 'La Defyer la plus polyvalente : tamis 100 et plan ouvert 16x19 pour un accès facile au lift, avec le pocketing caractéristique du Si3D. Le choix le plus pertinent pour la majorité des joueurs de club et compétiteurs.', 'Maria Sakkari, Peyton Stearns, Janice Tjen', 270, 289, 'ts-database'),
  ('wilson-defyer-100l-v1', 'Wilson', 'Defyer', '100L', 65, 285, 100, 330, 27, 312, '16x19', 'Tweener', ARRAY['Intermediate','Advanced']::text[], 'Version allégée de la plateforme Defyer 100 : même ADN spin dans un cadre plus maniable et plus rapide en bout de course. Pour joueur intermédiaire en progression qui veut jouer agressif.', NULL, 245, 259, 'ts-database'),
  ('wilson-defyer-100ul-v1', 'Wilson', 'Defyer', '100UL', 63, 265, 100, 340, 27, 306, '16x19', 'Light', ARRAY['Beginner','Intermediate']::text[], 'La plus légère de la gamme Defyer. Vitesse de tête de raquette maximale et accélération sans effort, tout en conservant le potentiel de spin de la franchise. Idéale pour junior en passage à la raquette adulte.', NULL, 235, 249, 'ts-database')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- ETAPE 4-bis : AVERTISSEMENT - pourquoi seulement 4 raquettes ?
--
--   Sur les 129 raquettes du fichier TS, 117 ont un id absent de la base.
--   Il serait TENTANT de toutes les inserer. C EST UN PIEGE.
--
--   Les deux sources n emploient pas la meme convention de nommage :
--
--       base :  model='Extreme Pro'   variant='2024'      (millesime)
--       TS   :  model='Extreme'       variant='Pro'       (declinaison)
--
--   Apres normalisation (accents, millesimes, ponctuation), 39 raquettes
--   du TS correspondent en realite a une ligne DEJA presente en base sous
--   un autre id. Les inserer creerait 39 doublons visibles par vos
--   visiteurs. Je ne le fais donc pas.
--
--   Correspondances detectees (TS -> ligne existante en base) :
--   TS babolat-pure-aero-standard         deja en base sous : babolat-pure-aero-2023
--   TS babolat-pure-aero-98               deja en base sous : babolat-pure-aero-98-2023
--   TS babolat-pure-aero-team             deja en base sous : babolat-pure-aero-team-2023
--   TS babolat-pure-drive-standard        deja en base sous : babolat-pure-drive-2025
--   TS babolat-pure-drive-98              deja en base sous : babolat-pure-drive-98-2025
--   TS babolat-pure-drive-team            deja en base sous : babolat-pure-drive-team-2025
--   TS head-gravity-mp                    deja en base sous : head-gravity-mp-2025
--   TS head-gravity-pro                   deja en base sous : head-gravity-pro-2025
--   TS head-instinct-mp                   deja en base sous : head-instinct-mp-2025
--   TS head-prestige-pro                  deja en base sous : head-prestige-pro-2023-2025
--   TS head-radical-mp                    deja en base sous : head-radical-mp-2023-2025
--   TS head-radical-pro                   deja en base sous : head-radical-pro-2023-2025
--   TS head-speed-mp                      deja en base sous : head-speed-mp-2024-legend-2025
--   TS head-speed-legend-pro              deja en base sous : head-speed-pro-2024
--   TS tecnifibre-tfight-305s-id          deja en base sous : tecnifibre-tfight-305s-id
--   TS tecnifibre-tfight-300-id           deja en base sous : tecnifibre-tfight-300-id
--   TS tecnifibre-tfight-315s             deja en base sous : tecnifibre-tfight-315s
--   TS wilson-clash-100-v2                deja en base sous : wilson-clash-100-v3
--   TS wilson-ultra-100-v5                deja en base sous : wilson-ultra-100-v5
--   TS wilson-ultra-99-pro-v5             deja en base sous : wilson-ultra-99-pro-v5
--   TS yonex-ezone-98                     deja en base sous : yonex-ezone-98-2025
--   TS yonex-ezone-100                    deja en base sous : yonex-ezone-100-2025
--   TS yonex-ezone-105                    deja en base sous : yonex-ezone-105-2025
--   TS yonex-percept-97                   deja en base sous : yonex-percept-97-midnight-navy
--   TS yonex-percept-100                  deja en base sous : yonex-percept-100-midnight-navy
--   TS yonex-percept-100d                 deja en base sous : yonex-percept-100d
--   TS yonex-vcore-95                     deja en base sous : yonex-vcore-95-2023
--   TS yonex-vcore-98                     deja en base sous : yonex-vcore-98-sand-beige-2024
--   TS yonex-vcore-100                    deja en base sous : yonex-vcore-100-sand-beige-2024, yonex-vcore-100-2023
--   TS yonex-vcore-100l                   deja en base sous : yonex-vcore-100l-sand-beige-2024
--   TS wilson-pro-staff-97-v14            deja en base sous : wilson-pro-staff-97-v14
--   TS wilson-blade-98-16x19-v9           deja en base sous : wilson-blade-98-16x19-v9
--   TS babolat-pure-strike-team           deja en base sous : babolat-pure-strike-team-2025
--   TS head-boom-pro-2024                 deja en base sous : head-boom-pro-2024
--   TS head-boom-mp-2024                  deja en base sous : head-boom-mp-2024
--   TS yonex-ezone-tour                   deja en base sous : yonex-ezone-98-tour-2025
--   TS dunlop-fx-500-tour                 deja en base sous : dunlop-fx-500-tour
--   TS dunlop-sx-300                      deja en base sous : dunlop-sx-300-2025
--   TS dunlop-sx-300-tour                 deja en base sous : dunlop-sx-300-tour
--
--   Les 78 autres raquettes TS ne sont pas concluantes automatiquement :
--   soit reellement absentes, soit variantes nommees trop differemment.
--   Un rapprochement fiable demande une revue manuelle -- dites-moi si
--   vous voulez que je la produise sous forme de tableau a valider.
--
--   >>> Seules les 4 Wilson Defyer sont inserees : verifiees absentes,
--       aucune correspondance meme approximative en base.
-- ---------------------------------------------------------------------

-- ---------------------------------------------------------------------
-- ETAPE 5 : 46 cordages avec des VALEURS DIVERGENTES TS <> base
--
--   RIEN N EST MODIFIE ICI. Ces lignes existent des deux cotes mais
--   avec des chiffres differents. Je ne choisis pas a votre place :
--   il faut trancher quelle source fait foi, cas par cas.
--
--   Colonne "TS" = src/data/strings-database.ts (ce que le site affiche)
--   Colonne "DB" = public.strings (Supabase, alimente en dec. 2025)
-- ---------------------------------------------------------------------

--  Luxilon ALU Power   (luxilon-alu-power)
--      performance  TS=9.8     DB=10     
--      comfort      TS=7       DB=6.5    
--      tension_min  TS=23      DB=20     
--      tension_max  TS=29      DB=26     
--      price_usd    TS=20      DB=22     
--
--  Solinco Hyper-G   (solinco-hyper-g)
--      comfort      TS=8.5     DB=7      
--      spin         TS=9       DB=9.5    
--      tension_min  TS=22      DB=21     
--      price_usd    TS=15      DB=17     
--
--  Babolat RPM Blast   (babolat-rpm-blast)
--      performance  TS=9.2     DB=9.5    
--      control      TS=9       DB=9.5    
--      comfort      TS=7.5     DB=6.5    
--      durability   TS=8       DB=8.5    
--      spin         TS=9.5     DB=10     
--      tension_min  TS=23      DB=21     
--      tension_max  TS=28      DB=27     
--      price_usd    TS=18      DB=20     
--
--  Luxilon 4G   (luxilon-4g)
--      performance  TS=9       DB=9.5    
--      comfort      TS=7       DB=5.5    
--      durability   TS=9.5     DB=10     
--      spin         TS=8       DB=8.5    
--      power        TS=6.5     DB=6      
--      tension_min  TS=24      DB=21     
--      tension_max  TS=30      DB=27     
--      price_usd    TS=22      DB=24     
--
--  Head Lynx Tour   (head-lynx-tour)
--      performance  TS=8.5     DB=9.5    
--      comfort      TS=8       DB=7.5    
--      durability   TS=8.5     DB=8      
--      spin         TS=8.5     DB=9.5    
--      power        TS=7.5     DB=8      
--      tension_min  TS=22      DB=21     
--      tension_max  TS=27      DB=26     
--      price_usd    TS=16      DB=18     
--
--  Solinco Tour Bite   (solinco-tour-bite)
--      comfort      TS=6.5     DB=6      
--      spin         TS=9.5     DB=10     
--      tension_min  TS=22      DB=20     
--      price_usd    TS=15      DB=17     
--
--  Wilson Champion's Choice   (wilson-champions-choice)
--      performance  TS=8.5     DB=10     
--      durability   TS=9       DB=6.5    
--      spin         TS=8       DB=8.5    
--      power        TS=8.5     DB=9      
--      tension_min  TS=22      DB=23     
--      price_eur    TS=45      DB=38     
--      price_usd    TS=45      DB=42     
--
--  Babolat VS Touch   (babolat-vs-touch)
--      performance  TS=9.5     DB=10     
--      comfort      TS=9.5     DB=10     
--      durability   TS=10      DB=5      
--      spin         TS=7.5     DB=7      
--      tension_min  TS=23      DB=24     
--      tension_max  TS=32      DB=28     
--      price_usd    TS=48      DB=55     
--
--  Solinco Mach-10   (solinco-mach-10)
--      stiffness    TS=195     DB=200    
--      performance  TS=9.5     DB=9      
--      control      TS=8.5     DB=8      
--      durability   TS=9.5     DB=8      
--      tension_min  TS=20      DB=21     
--      tension_max  TS=25      DB=27     
--      price_eur    TS=65      DB=17        <-- ecart de prix suspect
--      price_usd    TS=65      DB=18     
--
--  Tecnifibre X-One Biphase   (tecnifibre-x-one-biphase)
--      control      TS=7       DB=8      
--      comfort      TS=8.5     DB=9.5    
--      durability   TS=7.5     DB=6.5    
--      spin         TS=7       DB=7.5    
--      tension_min  TS=21      DB=23     
--      tension_max  TS=26      DB=27     
--      price_usd    TS=25      DB=28     
--
--  Head Reflex MLT   (head-reflex-mlt)
--      stiffness    TS=170     DB=160    
--      control      TS=7       DB=8      
--      comfort      TS=8.5     DB=9      
--      durability   TS=8       DB=7      
--      spin         TS=6.5     DB=7      
--      power        TS=8       DB=8.5    
--      tension_min  TS=20      DB=23     
--      tension_max  TS=25      DB=27     
--      price_eur    TS=18      DB=15     
--      price_usd    TS=18      DB=17     
--
--  Yonex Poly Tour Pro   (yonex-poly-tour-pro)
--      performance  TS=8       DB=9.5    
--      control      TS=8.5     DB=9      
--      durability   TS=8.5     DB=8      
--      spin         TS=8       DB=9      
--      power        TS=7.5     DB=8      
--      tension_min  TS=22      DB=20     
--      tension_max  TS=27      DB=26     
--      price_usd    TS=16      DB=18     
--
--  Wilson NXT Soft   (wilson-nxt-soft)
--      stiffness    TS=155     DB=145    
--      control      TS=6.5     DB=7      
--      comfort      TS=9       DB=10     
--      durability   TS=7.5     DB=6      
--      spin         TS=6       DB=7      
--      power        TS=8.5     DB=9      
--      tension_min  TS=20      DB=24     
--      tension_max  TS=25      DB=26     
--      price_eur    TS=22      DB=24     
--      price_usd    TS=22      DB=27     
--
--  Luxilon Element   (luxilon-element)
--      performance  TS=8       DB=8.5    
--      spin         TS=7.5     DB=8      
--      power        TS=8       DB=8.5    
--      tension_min  TS=21      DB=22     
--      tension_max  TS=26      DB=27     
--      price_usd    TS=20      DB=22     
--
--  Solinco Confidential   (solinco-confidential)
--      performance  TS=7.5     DB=8      
--      comfort      TS=7.5     DB=7      
--      tension_min  TS=23      DB=22     
--      price_usd    TS=15      DB=17     
--
--  Head Hawk Touch   (head-hawk-touch)
--      stiffness    TS=215     DB=200    
--      performance  TS=8       DB=9      
--      comfort      TS=7       DB=8      
--      durability   TS=8.5     DB=8      
--      power        TS=7       DB=8      
--      tension_min  TS=22      DB=21     
--      tension_max  TS=27      DB=26     
--      price_usd    TS=16      DB=18     
--
--  Tecnifibre Black Code 4S   (tecnifibre-black-code-4s)
--      stiffness    TS=200     DB=218    
--      performance  TS=8.5     DB=9      
--      control      TS=8.5     DB=9      
--      comfort      TS=7.5     DB=7      
--      spin         TS=9       DB=10     
--      power        TS=7.5     DB=7      
--      tension_min  TS=22      DB=21     
--      tension_max  TS=26      DB=27     
--      price_eur    TS=18      DB=15     
--      price_usd    TS=18      DB=17     
--
--  Wilson Natural Gut   (wilson-natural-gut)
--      performance  TS=9       DB=10     
--      control      TS=7.5     DB=8      
--      comfort      TS=9       DB=10     
--      durability   TS=10      DB=5      
--      power        TS=9       DB=9.5    
--      tension_min  TS=23      DB=25     
--      tension_max  TS=30      DB=29     
--      price_usd    TS=42      DB=48     
--
--  Tecnifibre TGV   (tecnifibre-tgv)
--      performance  TS=7       DB=8      
--      control      TS=6.5     DB=7.5    
--      comfort      TS=9.5     DB=10     
--      durability   TS=7       DB=6      
--      spin         TS=6       DB=7      
--      power        TS=8.5     DB=9.5    
--      tension_min  TS=19      DB=23     
--      tension_max  TS=24      DB=27     
--      price_usd    TS=24      DB=27     
--
--  Solinco Tour Bite Soft   (solinco-tour-bite-soft)
--      stiffness    TS=200     DB=225    
--      performance  TS=9       DB=8.5    
--      control      TS=8.5     DB=9.5    
--      comfort      TS=8       DB=7.5    
--      durability   TS=8       DB=8.5    
--      spin         TS=9       DB=9.5    
--      power        TS=8       DB=7      
--      tension_min  TS=22      DB=20     
--      price_eur    TS=14      DB=16     
--      price_usd    TS=14      DB=18     
--
--  Solinco Hyper-G Soft   (solinco-hyper-g-soft)
--      stiffness    TS=200     DB=195    
--      performance  TS=9.3     DB=9      
--      control      TS=8.8     DB=8.5    
--      comfort      TS=8.8     DB=8.5    
--      power        TS=8.2     DB=8.5    
--      price_usd    TS=16      DB=18     
--
--  Solinco Outlast   (solinco-outlast)
--      stiffness    TS=210     DB=235    
--      performance  TS=8.8     DB=8      
--      comfort      TS=7.5     DB=7      
--      durability   TS=9.5     DB=10     
--      power        TS=7.5     DB=7      
--      tension_min  TS=23      DB=22     
--      price_eur    TS=15      DB=14     
--      price_usd    TS=15      DB=16     
--
--  Luxilon ALU Power Soft   (luxilon-alu-power-soft)
--      stiffness    TS=210     DB=205    
--      control      TS=9.2     DB=9      
--      comfort      TS=8       DB=7.5    
--      durability   TS=8.8     DB=8.5    
--      power        TS=7.8     DB=8      
--      tension_min  TS=22      DB=21     
--      tension_max  TS=28      DB=26     
--      price_eur    TS=21      DB=22     
--      price_usd    TS=21      DB=24     
--
--  Luxilon Smart   (luxilon-smart)
--      stiffness    TS=215     DB=195    
--      performance  TS=8.8     DB=8.5    
--      control      TS=8.8     DB=8      
--      comfort      TS=7.8     DB=8      
--      durability   TS=8.5     DB=7.5    
--      spin         TS=8       DB=8.5    
--      power        TS=8       DB=8.5    
--      tension_min  TS=23      DB=22     
--      tension_max  TS=28      DB=27     
--      price_eur    TS=22      DB=19     
--      price_usd    TS=22      DB=21     
--
--  Luxilon Adrenaline   (luxilon-adrenaline)
--      stiffness    TS=205     DB=215    
--      performance  TS=8.7     DB=9      
--      control      TS=8.8     DB=8.5    
--      comfort      TS=8.3     DB=7.5    
--      durability   TS=8.5     DB=8      
--      spin         TS=8       DB=9      
--      power        TS=7.8     DB=8      
--      tension_min  TS=22      DB=21     
--      tension_max  TS=27      DB=26     
--      price_usd    TS=18      DB=20     
--
--  Yonex Poly Tour Strike   (yonex-poly-tour-strike)
--      stiffness    TS=215     DB=235    
--      control      TS=9       DB=9.5    
--      comfort      TS=7.5     DB=6.5    
--      spin         TS=8.5     DB=9      
--      power        TS=7.5     DB=7      
--      tension_min  TS=23      DB=21     
--      tension_max  TS=28      DB=27     
--      price_usd    TS=18      DB=20     
--
--  Yonex Poly Tour Rev   (yonex-poly-tour-rev)
--      stiffness    TS=205     DB=210    
--      performance  TS=8.8     DB=9      
--      comfort      TS=7.8     DB=8      
--      spin         TS=9.2     DB=10     
--      power        TS=7.8     DB=8      
--      tension_min  TS=22      DB=20     
--      tension_max  TS=27      DB=26     
--      price_usd    TS=17      DB=19     
--
--  Yonex Poly Tour Spin   (yonex-poly-tour-spin)
--      stiffness    TS=200     DB=218    
--      performance  TS=8.5     DB=9      
--      control      TS=8.3     DB=8.5    
--      comfort      TS=8       DB=7      
--      spin         TS=9       DB=10     
--      power        TS=8       DB=7.5    
--      tension_min  TS=22      DB=20     
--      tension_max  TS=27      DB=26     
--      price_usd    TS=16      DB=18     
--
--  Tecnifibre Razor Code   (tecnifibre-razor-code)
--      stiffness    TS=220     DB=200    
--      control      TS=9       DB=8.5    
--      comfort      TS=7.5     DB=8      
--      durability   TS=8.5     DB=8      
--      spin         TS=8.5     DB=9      
--      power        TS=7.5     DB=8      
--      tension_min  TS=23      DB=21     
--      tension_max  TS=28      DB=26     
--      price_eur    TS=17      DB=15     
--
--  Tecnifibre Ice Code   (tecnifibre-ice-code)
--      stiffness    TS=221     DB=195    
--      performance  TS=8.8     DB=9      
--      control      TS=8.8     DB=8.5    
--      durability   TS=8.5     DB=8      
--      spin         TS=8.3     DB=9      
--      power        TS=7.8     DB=8      
--      tension_min  TS=22      DB=21     
--      tension_max  TS=27      DB=26     
--      price_usd    TS=16      DB=18     
--
--  Tecnifibre Multifeel   (tecnifibre-multifeel)
--      stiffness    TS=160     DB=155    
--      performance  TS=8.2     DB=8      
--      comfort      TS=9.2     DB=9.5    
--      durability   TS=7       DB=6.5    
--      spin         TS=6.5     DB=7      
--      power        TS=8.5     DB=9      
--      tension_min  TS=22      DB=23     
--      price_eur    TS=14      DB=18     
--      price_usd    TS=14      DB=20     
--
--  Head Lynx Edge   (head-lynx-edge)
--      stiffness    TS=205     DB=218    
--      performance  TS=8.5     DB=9      
--      control      TS=8.5     DB=9      
--      comfort      TS=8       DB=7      
--      spin         TS=8.8     DB=10     
--      power        TS=7.8     DB=7.5    
--      tension_min  TS=22      DB=21     
--      tension_max  TS=27      DB=26     
--      price_eur    TS=13      DB=15     
--      price_usd    TS=13      DB=17     
--
--  Head Velocity MLT   (head-velocity-mlt)
--      stiffness    TS=165     DB=155    
--      comfort      TS=9       DB=9.5    
--      durability   TS=7       DB=6.5    
--      spin         TS=6.5     DB=7      
--      power        TS=8.5     DB=9      
--      tension_min  TS=22      DB=23     
--      price_eur    TS=13      DB=20     
--      price_usd    TS=13      DB=22     
--
--  Babolat RPM Blast Rough   (babolat-rpm-blast-rough)
--      performance  TS=9       DB=9.5    
--      control      TS=8.8     DB=9      
--      comfort      TS=7.3     DB=6.5    
--      spin         TS=9.7     DB=10     
--      power        TS=7       DB=7.5    
--      tension_min  TS=23      DB=21     
--      tension_max  TS=28      DB=27     
--      price_usd    TS=19      DB=21     
--
--  Babolat RPM Soft   (babolat-rpm-soft)
--      stiffness    TS=205     DB=200    
--      performance  TS=8.7     DB=8.5    
--      control      TS=8.5     DB=8      
--      comfort      TS=8.3     DB=8      
--      durability   TS=7.8     DB=7.5    
--      spin         TS=9       DB=8.5    
--      power        TS=7.8     DB=8.5    
--      tension_max  TS=27      DB=26     
--      price_eur    TS=18      DB=17     
--      price_usd    TS=18      DB=19     
--
--  Babolat Xcel   (babolat-xcel)
--      stiffness    TS=155     DB=145    
--      performance  TS=8.3     DB=8.5    
--      durability   TS=7       DB=6.5    
--      spin         TS=6.5     DB=7      
--      power        TS=8.8     DB=9      
--      tension_min  TS=22      DB=23     
--      price_eur    TS=16      DB=22     
--      price_usd    TS=16      DB=25     
--
--  Wilson Revolve   (wilson-revolve)
--      stiffness    TS=210     DB=220    
--      performance  TS=8.3     DB=8.5    
--      control      TS=8.3     DB=8.5    
--      comfort      TS=7.8     DB=7      
--      durability   TS=8       DB=8.5    
--      spin         TS=8.8     DB=8.5    
--      power        TS=7.8     DB=7.5    
--      price_eur    TS=12      DB=14     
--      price_usd    TS=12      DB=16     
--
--  Tecnifibre Triax   (tecnifibre-triax)
--      stiffness    TS=162     DB=165    
--      performance  TS=8.1     DB=8.5    
--      control      TS=8.1     DB=8      
--      comfort      TS=8.5     DB=9      
--      durability   TS=7.9     DB=7      
--      spin         TS=7.6     DB=7.5    
--      power        TS=8       DB=8.5    
--      tension_min  TS=22      DB=23     
--      price_eur    TS=17      DB=20     
--      price_usd    TS=18      DB=22     
--
--  Tecnifibre NRG2   (tecnifibre-nrg2)
--      performance  TS=8.4     DB=8.5    
--      control      TS=7.2     DB=7.5    
--      comfort      TS=9.4     DB=10     
--      durability   TS=6.8     DB=6      
--      spin         TS=6.3     DB=7      
--      power        TS=8.8     DB=9      
--      tension_min  TS=21      DB=24     
--      tension_max  TS=26      DB=27     
--      price_eur    TS=18      DB=22     
--      price_usd    TS=18      DB=25     
--
--  Tecnifibre Duramix HD   (tecnifibre-duramix-hd)
--      stiffness    TS=170     DB=175    
--      performance  TS=7.8     DB=7.5    
--      control      TS=7.5     DB=8      
--      comfort      TS=8.3     DB=8      
--      spin         TS=6.8     DB=7      
--      tension_min  TS=22      DB=23     
--      price_eur    TS=13      DB=12     
--      price_usd    TS=13      DB=14     
--
--  Wilson NXT   (wilson-nxt)
--      stiffness    TS=152     DB=155    
--      control      TS=7.6     DB=7.5    
--      comfort      TS=8.9     DB=9.5    
--      durability   TS=6.4     DB=6.5    
--      spin         TS=7.4     DB=7      
--      power        TS=8.6     DB=9      
--      tension_min  TS=21      DB=24     
--      tension_max  TS=26      DB=27     
--      price_eur    TS=23      DB=22     
--      price_usd    TS=24      DB=25     
--
--  Wilson NXT Power   (wilson-nxt-power)
--      stiffness    TS=145     DB=148    
--      performance  TS=8.6     DB=8.5    
--      comfort      TS=9.3     DB=9.5    
--      durability   TS=6.8     DB=6      
--      spin         TS=6.5     DB=7      
--      power        TS=9.2     DB=9.5    
--      tension_min  TS=20      DB=24     
--      tension_max  TS=25      DB=27     
--      price_usd    TS=24      DB=27     
--
--  Wilson Sensation   (wilson-sensation)
--      stiffness    TS=165     DB=160    
--      control      TS=7.4     DB=7.5    
--      comfort      TS=8.6     DB=9      
--      spin         TS=7.2     DB=7      
--      power        TS=8.4     DB=8.5    
--      tension_min  TS=22      DB=23     
--      price_eur    TS=12      DB=16     
--      price_usd    TS=14      DB=18     
--
--  Head RIP Control   (head-rip-control)
--      stiffness    TS=180     DB=165    
--      performance  TS=7.8     DB=8      
--      control      TS=8.3     DB=8      
--      comfort      TS=7.8     DB=9      
--      durability   TS=8       DB=7      
--      spin         TS=7.3     DB=7.5    
--      power        TS=7.2     DB=8.5    
--      tension_max  TS=28      DB=27     
--      price_eur    TS=9       DB=18     
--      price_usd    TS=10      DB=20     
--
--  Solinco Vanquish   (solinco-vanquish)
--      performance  TS=8.3     DB=8      
--      comfort      TS=9       DB=9.5    
--      durability   TS=7.2     DB=6.5    
--      power        TS=8.6     DB=8.5    
--      tension_min  TS=21      DB=22     
--      price_eur    TS=11      DB=18     
--      price_usd    TS=12      DB=20     
--
--  Solinco X-Natural   (solinco-x-natural)
--      stiffness    TS=147     DB=140    
--      performance  TS=8.4     DB=7.5    
--      control      TS=7.3     DB=7      
--      comfort      TS=9.2     DB=10     
--      durability   TS=6.8     DB=6      
--      spin         TS=6.8     DB=6.5    
--      power        TS=8.9     DB=8.5    
--      tension_min  TS=21      DB=23     
--      price_eur    TS=13      DB=20     
--      price_usd    TS=14      DB=22     
--
-- Pour inspecter ces lignes en base avant de decider, executez :
/*
SELECT id, brand, model, stiffness, price_eur, tension_min, tension_max
FROM public.strings
WHERE id IN ('luxilon-alu-power', 'solinco-hyper-g', 'babolat-rpm-blast', 'luxilon-4g', 'head-lynx-tour', 'solinco-tour-bite', 'wilson-champions-choice', 'babolat-vs-touch', 'solinco-mach-10', 'tecnifibre-x-one-biphase', 'head-reflex-mlt', 'yonex-poly-tour-pro', 'wilson-nxt-soft', 'luxilon-element', 'solinco-confidential', 'head-hawk-touch', 'tecnifibre-black-code-4s', 'wilson-natural-gut', 'tecnifibre-tgv', 'solinco-tour-bite-soft', 'solinco-hyper-g-soft', 'solinco-outlast', 'luxilon-alu-power-soft', 'luxilon-smart', 'luxilon-adrenaline', 'yonex-poly-tour-strike', 'yonex-poly-tour-rev', 'yonex-poly-tour-spin', 'tecnifibre-razor-code', 'tecnifibre-ice-code', 'tecnifibre-multifeel', 'head-lynx-edge', 'head-velocity-mlt', 'babolat-rpm-blast-rough', 'babolat-rpm-soft', 'babolat-xcel', 'wilson-revolve', 'tecnifibre-triax', 'tecnifibre-nrg2', 'tecnifibre-duramix-hd', 'wilson-nxt', 'wilson-nxt-power', 'wilson-sensation', 'head-rip-control', 'solinco-vanquish', 'solinco-x-natural')
ORDER BY brand, model;
*/

-- ---------------------------------------------------------------------
-- ETAPE 5b : BLOC OPTIONNEL - faire gagner le TypeScript sur ces lignes
--   Decommentez UNIQUEMENT si vous confirmez que le fichier TS fait foi.
--   (a mon avis discutable : ex. Solinco Mach 10 a 65 EUR cote TS
--    ressemble a une faute de saisie, 17 EUR cote base est plausible)
-- ---------------------------------------------------------------------
/*
UPDATE public.strings SET performance = 9.8, comfort = 7, tension_min = 23, tension_max = 29, price_usd = 20, updated_at = NOW() WHERE id = 'luxilon-alu-power';
UPDATE public.strings SET comfort = 8.5, spin = 9, tension_min = 22, price_usd = 15, updated_at = NOW() WHERE id = 'solinco-hyper-g';
UPDATE public.strings SET performance = 9.2, control = 9, comfort = 7.5, durability = 8, spin = 9.5, tension_min = 23, tension_max = 28, price_usd = 18, updated_at = NOW() WHERE id = 'babolat-rpm-blast';
UPDATE public.strings SET performance = 9, comfort = 7, durability = 9.5, spin = 8, power = 6.5, tension_min = 24, tension_max = 30, price_usd = 22, updated_at = NOW() WHERE id = 'luxilon-4g';
UPDATE public.strings SET performance = 8.5, comfort = 8, durability = 8.5, spin = 8.5, power = 7.5, tension_min = 22, tension_max = 27, price_usd = 16, updated_at = NOW() WHERE id = 'head-lynx-tour';
UPDATE public.strings SET comfort = 6.5, spin = 9.5, tension_min = 22, price_usd = 15, updated_at = NOW() WHERE id = 'solinco-tour-bite';
UPDATE public.strings SET performance = 8.5, durability = 9, spin = 8, power = 8.5, tension_min = 22, price_eur = 45, price_usd = 45, updated_at = NOW() WHERE id = 'wilson-champions-choice';
UPDATE public.strings SET performance = 9.5, comfort = 9.5, durability = 10, spin = 7.5, tension_min = 23, tension_max = 32, price_usd = 48, updated_at = NOW() WHERE id = 'babolat-vs-touch';
UPDATE public.strings SET stiffness = 195, performance = 9.5, control = 8.5, durability = 9.5, tension_min = 20, tension_max = 25, price_eur = 65, price_usd = 65, updated_at = NOW() WHERE id = 'solinco-mach-10';
UPDATE public.strings SET control = 7, comfort = 8.5, durability = 7.5, spin = 7, tension_min = 21, tension_max = 26, price_usd = 25, updated_at = NOW() WHERE id = 'tecnifibre-x-one-biphase';
UPDATE public.strings SET stiffness = 170, control = 7, comfort = 8.5, durability = 8, spin = 6.5, power = 8, tension_min = 20, tension_max = 25, price_eur = 18, price_usd = 18, updated_at = NOW() WHERE id = 'head-reflex-mlt';
UPDATE public.strings SET performance = 8, control = 8.5, durability = 8.5, spin = 8, power = 7.5, tension_min = 22, tension_max = 27, price_usd = 16, updated_at = NOW() WHERE id = 'yonex-poly-tour-pro';
UPDATE public.strings SET stiffness = 155, control = 6.5, comfort = 9, durability = 7.5, spin = 6, power = 8.5, tension_min = 20, tension_max = 25, price_eur = 22, price_usd = 22, updated_at = NOW() WHERE id = 'wilson-nxt-soft';
UPDATE public.strings SET performance = 8, spin = 7.5, power = 8, tension_min = 21, tension_max = 26, price_usd = 20, updated_at = NOW() WHERE id = 'luxilon-element';
UPDATE public.strings SET performance = 7.5, comfort = 7.5, tension_min = 23, price_usd = 15, updated_at = NOW() WHERE id = 'solinco-confidential';
UPDATE public.strings SET stiffness = 215, performance = 8, comfort = 7, durability = 8.5, power = 7, tension_min = 22, tension_max = 27, price_usd = 16, updated_at = NOW() WHERE id = 'head-hawk-touch';
UPDATE public.strings SET stiffness = 200, performance = 8.5, control = 8.5, comfort = 7.5, spin = 9, power = 7.5, tension_min = 22, tension_max = 26, price_eur = 18, price_usd = 18, updated_at = NOW() WHERE id = 'tecnifibre-black-code-4s';
UPDATE public.strings SET performance = 9, control = 7.5, comfort = 9, durability = 10, power = 9, tension_min = 23, tension_max = 30, price_usd = 42, updated_at = NOW() WHERE id = 'wilson-natural-gut';
UPDATE public.strings SET performance = 7, control = 6.5, comfort = 9.5, durability = 7, spin = 6, power = 8.5, tension_min = 19, tension_max = 24, price_usd = 24, updated_at = NOW() WHERE id = 'tecnifibre-tgv';
UPDATE public.strings SET stiffness = 200, performance = 9, control = 8.5, comfort = 8, durability = 8, spin = 9, power = 8, tension_min = 22, price_eur = 14, price_usd = 14, updated_at = NOW() WHERE id = 'solinco-tour-bite-soft';
UPDATE public.strings SET stiffness = 200, performance = 9.3, control = 8.8, comfort = 8.8, power = 8.2, price_usd = 16, updated_at = NOW() WHERE id = 'solinco-hyper-g-soft';
UPDATE public.strings SET stiffness = 210, performance = 8.8, comfort = 7.5, durability = 9.5, power = 7.5, tension_min = 23, price_eur = 15, price_usd = 15, updated_at = NOW() WHERE id = 'solinco-outlast';
UPDATE public.strings SET stiffness = 210, control = 9.2, comfort = 8, durability = 8.8, power = 7.8, tension_min = 22, tension_max = 28, price_eur = 21, price_usd = 21, updated_at = NOW() WHERE id = 'luxilon-alu-power-soft';
UPDATE public.strings SET stiffness = 215, performance = 8.8, control = 8.8, comfort = 7.8, durability = 8.5, spin = 8, power = 8, tension_min = 23, tension_max = 28, price_eur = 22, price_usd = 22, updated_at = NOW() WHERE id = 'luxilon-smart';
UPDATE public.strings SET stiffness = 205, performance = 8.7, control = 8.8, comfort = 8.3, durability = 8.5, spin = 8, power = 7.8, tension_min = 22, tension_max = 27, price_usd = 18, updated_at = NOW() WHERE id = 'luxilon-adrenaline';
UPDATE public.strings SET stiffness = 215, control = 9, comfort = 7.5, spin = 8.5, power = 7.5, tension_min = 23, tension_max = 28, price_usd = 18, updated_at = NOW() WHERE id = 'yonex-poly-tour-strike';
UPDATE public.strings SET stiffness = 205, performance = 8.8, comfort = 7.8, spin = 9.2, power = 7.8, tension_min = 22, tension_max = 27, price_usd = 17, updated_at = NOW() WHERE id = 'yonex-poly-tour-rev';
UPDATE public.strings SET stiffness = 200, performance = 8.5, control = 8.3, comfort = 8, spin = 9, power = 8, tension_min = 22, tension_max = 27, price_usd = 16, updated_at = NOW() WHERE id = 'yonex-poly-tour-spin';
UPDATE public.strings SET stiffness = 220, control = 9, comfort = 7.5, durability = 8.5, spin = 8.5, power = 7.5, tension_min = 23, tension_max = 28, price_eur = 17, updated_at = NOW() WHERE id = 'tecnifibre-razor-code';
UPDATE public.strings SET stiffness = 221, performance = 8.8, control = 8.8, durability = 8.5, spin = 8.3, power = 7.8, tension_min = 22, tension_max = 27, price_usd = 16, updated_at = NOW() WHERE id = 'tecnifibre-ice-code';
UPDATE public.strings SET stiffness = 160, performance = 8.2, comfort = 9.2, durability = 7, spin = 6.5, power = 8.5, tension_min = 22, price_eur = 14, price_usd = 14, updated_at = NOW() WHERE id = 'tecnifibre-multifeel';
UPDATE public.strings SET stiffness = 205, performance = 8.5, control = 8.5, comfort = 8, spin = 8.8, power = 7.8, tension_min = 22, tension_max = 27, price_eur = 13, price_usd = 13, updated_at = NOW() WHERE id = 'head-lynx-edge';
UPDATE public.strings SET stiffness = 165, comfort = 9, durability = 7, spin = 6.5, power = 8.5, tension_min = 22, price_eur = 13, price_usd = 13, updated_at = NOW() WHERE id = 'head-velocity-mlt';
UPDATE public.strings SET performance = 9, control = 8.8, comfort = 7.3, spin = 9.7, power = 7, tension_min = 23, tension_max = 28, price_usd = 19, updated_at = NOW() WHERE id = 'babolat-rpm-blast-rough';
UPDATE public.strings SET stiffness = 205, performance = 8.7, control = 8.5, comfort = 8.3, durability = 7.8, spin = 9, power = 7.8, tension_max = 27, price_eur = 18, price_usd = 18, updated_at = NOW() WHERE id = 'babolat-rpm-soft';
UPDATE public.strings SET stiffness = 155, performance = 8.3, durability = 7, spin = 6.5, power = 8.8, tension_min = 22, price_eur = 16, price_usd = 16, updated_at = NOW() WHERE id = 'babolat-xcel';
UPDATE public.strings SET stiffness = 210, performance = 8.3, control = 8.3, comfort = 7.8, durability = 8, spin = 8.8, power = 7.8, price_eur = 12, price_usd = 12, updated_at = NOW() WHERE id = 'wilson-revolve';
UPDATE public.strings SET stiffness = 162, performance = 8.1, control = 8.1, comfort = 8.5, durability = 7.9, spin = 7.6, power = 8, tension_min = 22, price_eur = 17, price_usd = 18, updated_at = NOW() WHERE id = 'tecnifibre-triax';
UPDATE public.strings SET performance = 8.4, control = 7.2, comfort = 9.4, durability = 6.8, spin = 6.3, power = 8.8, tension_min = 21, tension_max = 26, price_eur = 18, price_usd = 18, updated_at = NOW() WHERE id = 'tecnifibre-nrg2';
UPDATE public.strings SET stiffness = 170, performance = 7.8, control = 7.5, comfort = 8.3, spin = 6.8, tension_min = 22, price_eur = 13, price_usd = 13, updated_at = NOW() WHERE id = 'tecnifibre-duramix-hd';
UPDATE public.strings SET stiffness = 152, control = 7.6, comfort = 8.9, durability = 6.4, spin = 7.4, power = 8.6, tension_min = 21, tension_max = 26, price_eur = 23, price_usd = 24, updated_at = NOW() WHERE id = 'wilson-nxt';
UPDATE public.strings SET stiffness = 145, performance = 8.6, comfort = 9.3, durability = 6.8, spin = 6.5, power = 9.2, tension_min = 20, tension_max = 25, price_usd = 24, updated_at = NOW() WHERE id = 'wilson-nxt-power';
UPDATE public.strings SET stiffness = 165, control = 7.4, comfort = 8.6, spin = 7.2, power = 8.4, tension_min = 22, price_eur = 12, price_usd = 14, updated_at = NOW() WHERE id = 'wilson-sensation';
UPDATE public.strings SET stiffness = 180, performance = 7.8, control = 8.3, comfort = 7.8, durability = 8, spin = 7.3, power = 7.2, tension_max = 28, price_eur = 9, price_usd = 10, updated_at = NOW() WHERE id = 'head-rip-control';
UPDATE public.strings SET performance = 8.3, comfort = 9, durability = 7.2, power = 8.6, tension_min = 21, price_eur = 11, price_usd = 12, updated_at = NOW() WHERE id = 'solinco-vanquish';
UPDATE public.strings SET stiffness = 147, performance = 8.4, control = 7.3, comfort = 9.2, durability = 6.8, spin = 6.8, power = 8.9, tension_min = 21, price_eur = 13, price_usd = 14, updated_at = NOW() WHERE id = 'solinco-x-natural';
*/

-- ---------------------------------------------------------------------
-- ETAPE 6 : controle final (doit renvoyer les comptes attendus)
-- ---------------------------------------------------------------------
SELECT 'strings'  AS table_name, COUNT(*) AS total FROM public.strings
UNION ALL
SELECT 'racquets' AS table_name, COUNT(*) AS total FROM public.racquets;

-- Verification que le Triax et les Defyer sont bien la :
SELECT id, brand, model, type FROM public.strings  WHERE model ILIKE '%triax%';
SELECT id, brand, model, variant FROM public.racquets WHERE model ILIKE '%defyer%' ORDER BY id;

-- Plus aucun "Synthetic Gut" ne doit subsister :
SELECT type, COUNT(*) FROM public.strings GROUP BY type ORDER BY 2 DESC;

COMMIT;

-- =====================================================================
-- ROLLBACK : si un controle ci-dessus vous surprend, tapez ROLLBACK;
-- au lieu de COMMIT; (la transaction annule tout).
-- =====================================================================
-- =====================================================================
-- ANNEXE SECURITE - a traiter separement, PAS inclus dans la transaction
--
--   scripts/create-tables.js a cree ces politiques RLS :
--
--     CREATE POLICY "Allow anon insert on strings"  ... WITH CHECK (true);
--     CREATE POLICY "Allow anon delete on strings"  ... USING (true);
--     (idem sur racquets)
--
--   Consequence : la cle anon est publiee dans le JavaScript envoye au
--   navigateur. N IMPORTE QUEL visiteur de tennisstringadvisor.org peut
--   donc, avec un simple appel HTTP, inserer des lignes bidon ou SUPPRIMER
--   vos 173 cordages et 107 raquettes. Rien ne l en empeche aujourd hui.
--
--   Le catalogue produit est une donnee en lecture seule pour le public.
--   Correctif recommande (a executer quand vous le decidez) :
--
--     DROP POLICY IF EXISTS "Allow anon insert on strings"  ON public.strings;
--     DROP POLICY IF EXISTS "Allow anon delete on strings"  ON public.strings;
--     DROP POLICY IF EXISTS "Allow anon insert on racquets" ON public.racquets;
--     DROP POLICY IF EXISTS "Allow anon delete on racquets" ON public.racquets;
--
--   La lecture publique (SELECT) reste intacte : le site continue de
--   fonctionner. Les ecritures se feront alors avec la cle service_role,
--   cote serveur uniquement.
--
--   Je ne l ai pas mis en actif car cela depasse votre demande et pourrait
--   casser un script d import que vous utilisez encore.
-- =====================================================================
