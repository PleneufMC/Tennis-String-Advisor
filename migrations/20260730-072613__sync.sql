-- Tennis String Advisor - incremental catalogue sync
-- run_id : 20260730-072613
-- mode   : BOOTSTRAP (no /data/snapshot_strings.json present in the repo)
-- source : Tennis Warehouse Europe, facet catpage-MULTIFILSTR (source_tier 1)
-- scope  : strings / multifilament facet only. See /reports/20260730-072613.md
--
-- Lifecycle policy: rows are NEVER deleted. History is carried by
-- lifecycle_status + superseded_by + discontinued_at. This file contains
-- no DELETE, DROP, TRUNCATE or ALTER statement by construction.

begin;

-- ---------------------------------------------------------------------
-- 0. Reference DDL (idempotent).
--    public.strings / public.racquets do not exist in supabase/schema.sql;
--    without them this migration cannot apply. Kept separate and additive.
-- ---------------------------------------------------------------------
-- PostgreSQL 15+ required. Additive and idempotent: no ALTER, no DROP.
create table if not exists public.strings (
  id                uuid primary key default gen_random_uuid(),
  brand_slug        text not null,
  model_slug        text not null,
  family_slug       text not null,
  brand_label       text not null,
  model_label       text not null,
  gauge_mm          numeric(4,2) not null,
  gauge_label       text,
  construction      text not null check (construction in
                      ('multifilament','monofilament','boyau_naturel','synthetic_gut',
                       'multifilament_gaine','hybride','autre')),
  core_material     text,
  wrap_material     text,
  colors            text[] default '{}',
  tension_min_lbs   int,
  tension_max_lbs   int,
  price_eur         numeric(8,2),
  lifecycle_status  text not null default 'current'
                      check (lifecycle_status in ('current','legacy','discontinued')),
  superseded_by     uuid references public.strings(id),
  discontinued_at   timestamptz,
  absence_streak    int not null default 0,
  first_seen_at     timestamptz not null default now(),
  last_seen_at      timestamptz not null default now(),
  source_url        text not null,
  source_tier       int not null default 1,
  missing_fields    text[] default '{}',
  content_hash      text not null,
  updated_at        timestamptz not null default now(),
  constraint strings_natural_key unique (brand_slug, model_slug, gauge_mm)
);

create table if not exists public.racquets (
  id                  uuid primary key default gen_random_uuid(),
  brand_slug          text not null,
  model_slug          text not null,
  family_slug         text not null,
  brand_label         text not null,
  model_label         text not null,
  generation_label    text not null,
  head_size_in        numeric(4,1),
  unstrung_weight_g   int,
  balance_unstrung_mm int,
  string_pattern      text,
  beam_mm             text,
  stiffness_ra        int,
  length_in           numeric(3,1),
  price_eur           numeric(8,2),
  lifecycle_status    text not null default 'current'
                        check (lifecycle_status in ('current','legacy','discontinued')),
  superseded_by       uuid references public.racquets(id),
  discontinued_at     timestamptz,
  absence_streak      int not null default 0,
  first_seen_at       timestamptz not null default now(),
  last_seen_at        timestamptz not null default now(),
  source_url          text not null,
  source_tier         int not null default 1,
  missing_fields      text[] default '{}',
  content_hash        text not null,
  updated_at          timestamptz not null default now(),
  constraint racquets_natural_key unique (brand_slug, model_slug, generation_label)
);

create table if not exists public.sync_runs (
  run_id            text primary key,
  started_at        timestamptz not null,
  finished_at       timestamptz,
  status            text not null check (status in ('ok','aborted','partial')),
  counts            jsonb not null default '{}',
  abort_reason      text,
  report_path       text
);

create table if not exists public.sync_quarantine (
  id            uuid primary key default gen_random_uuid(),
  run_id        text not null references public.sync_runs(run_id),
  entity        text not null check (entity in ('string','racquet')),
  raw_payload   jsonb not null,
  reject_reason text not null,
  source_url    text not null,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 1. sync_runs bookkeeping
-- ---------------------------------------------------------------------
insert into public.sync_runs (run_id, started_at, status, counts, abort_reason, report_path)
values ('20260730-072613', '2026-07-30T07:32:16+00:00', 'partial', '{"enumerated_facets": {"MULTIFILSTR": 64, "ALLMULTIS": 62, "VALUMULTI": 17, "POLYSTRING": 314, "POLYSTST": 42, "HYBRIDSTR": 18, "SYNGUTSTR": 16, "NATURALGUT": 5}, "strings_rows_upserted": 52, "strings_quarantined": 5, "racquets_rows_upserted": 0}'::jsonb,
        'scope limited to the strings/multifilament facet: detail pages for the polyester, synthetic gut, natural gut and hybrid facets were not collected, and the racquets entity was not enumerated. No lifecycle transition emitted (bootstrap run).',
        '/reports/20260730-072613.md')
on conflict (run_id) do nothing;

-- ---------------------------------------------------------------------
-- 2. strings upserts - 52 natural-key rows, all lifecycle_status='current'
--    Bootstrap run: no row may be moved to 'discontinued' (no comparison history).
--    superseded_by is left NULL: the source publishes no family grouping nor
--    generation label for strings, so no chaining can be derived without inventing one.
-- ---------------------------------------------------------------------
-- Ashaway Dynamite Natural 1.25mm  [missing: tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('ashaway', 'dynamite-natural', 'dynamite-natural', 'Ashaway', 'Dynamite Natural', 1.25, '17', 'multifilament', 'Zyex', null, '{"Optic Green"}'::text[], null, null, 15.9, 'current', 'https://www.tenniswarehouse-europe.com/Ashaway_Dynamite_17_125_Natural_String_Optic_Green/descpageACASH-D17SOFT-EN.html', 1, '{"tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '43a771e8d315e66ebe05c81079f75f6679672263c80b94a040d7bf32c2c97beb', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Babolat Addixion 1.25mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('babolat', 'addixion', 'addixion', 'Babolat', 'Addixion', 1.25, '17', 'multifilament', null, null, '{"Natural"}'::text[], null, null, 11.9, 'current', 'https://www.tenniswarehouse-europe.com/Babolat_Addixion__125_17_String/descpageACQBA-BADDSP125-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], 'a3b19d8a7084011660eec832394f014eb9ef16e7f58a74264a285f57529b4e8f', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Babolat Addixion 1.3mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('babolat', 'addixion', 'addixion', 'Babolat', 'Addixion', 1.3, '16', 'multifilament', null, null, '{"Natural"}'::text[], null, null, 11.9, 'current', 'https://www.tenniswarehouse-europe.com/Babolat_Addixion__130_16_String/descpageACQBA-BADDSP130-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '1520338d905a76475da3c1964d4624cbc0ea034f283538a7b8f641f44e8e310d', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Babolat Xalt 1.25mm  [missing: tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('babolat', 'xalt', 'xalt', 'Babolat', 'Xalt', 1.25, '17', 'multifilament', 'polyamide', null, '{"White"}'::text[], null, null, 15.9, 'current', 'https://www.tenniswarehouse-europe.com/Babolat_Xalt_125_17_String/descpageACQBA-BAXAL17-EN.html', 1, '{"tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '088ceb93ff59550a1690ff033619b02bbab69606787a33adf3ca3027b90ba666', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Babolat Xalt 1.3mm  [missing: tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('babolat', 'xalt', 'xalt', 'Babolat', 'Xalt', 1.3, '16', 'multifilament', 'polyamide', null, '{"White"}'::text[], null, null, 15.9, 'current', 'https://www.tenniswarehouse-europe.com/Babolat_Xalt_130_16_String/descpageACQBA-BAXAL16-EN.html', 1, '{"tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '28f89646e3773b4c0fab8a83f0c36a7d5922af07c27a8705d98f6a898cecfa99', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Babolat XCel 1.25mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('babolat', 'xcel', 'xcel', 'Babolat', 'XCel', 1.25, '17', 'multifilament', null, null, '{"Blue","Natural"}'::text[], null, null, 13.9, 'current', 'https://www.tenniswarehouse-europe.com/Babolat_XCel_125_17_String_Set/descpageACQBA-XCEL17S-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '49699f17ff6313e0927f0172f0fe244636d756183c53215e1bee78365bcf10fb', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Babolat XCel 1.3mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('babolat', 'xcel', 'xcel', 'Babolat', 'XCel', 1.3, '16', 'multifilament', null, null, '{"Black","Blue"}'::text[], null, null, 13.9, 'current', 'https://www.tenniswarehouse-europe.com/Babolat_XCel_130_16_String_Set/descpageACQBA-XCEL16S-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '32cac7dc2a1252ced3012c318abb4a391c919c5219e91f79b94e2e4628243257', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Babolat XPlore 1.25mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('babolat', 'xplore', 'xplore', 'Babolat', 'XPlore', 1.25, '17', 'multifilament', null, null, '{"Blue","Grey"}'::text[], null, null, 7.9, 'current', 'https://www.tenniswarehouse-europe.com/Babolat_XPlore_125_17_String_Blue/descpageACQBA-BXPLR25-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '14d772313ff5ed3afb4201ca930ccf6977b61f5c89983ef210c171c98a3e86ae', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Babolat XPlore 1.3mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('babolat', 'xplore', 'xplore', 'Babolat', 'XPlore', 1.3, '16', 'multifilament', null, null, '{"Blue","Grey"}'::text[], null, null, 7.9, 'current', 'https://www.tenniswarehouse-europe.com/Babolat_XPlore_130_16_String_Blue/descpageACQBA-BXPLR30-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], 'b9ffe37b71970cb45ffa08c41f7f137af55146222dcc75a24229d71251921fe5', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Babolat XPlore 1.35mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('babolat', 'xplore', 'xplore', 'Babolat', 'XPlore', 1.35, '15L', 'multifilament', null, null, '{"Blue","Grey"}'::text[], null, null, 7.9, 'current', 'https://www.tenniswarehouse-europe.com/Babolat_XPlore_135_15L_String_Blue/descpageACQBA-BXPLR35-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], 'c6348ce86b0467ed3f6df8dc0a4ddb1fef3934749f783963762ccd34bd403a9c', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Head Reflex MLT 1.25mm  [missing: colors,core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('head', 'reflex-mlt', 'reflex-mlt', 'Head', 'Reflex MLT', 1.25, '17', 'multifilament', null, null, '{}', null, null, 13.9, 'current', 'https://www.tenniswarehouse-europe.com/Head_Reflex_MLT_17_125_String/descpageACHEAD-HRM17S-EN.html', 1, '{"colors","core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '4aab3023d40cdda4d4b96eafc711242ba779feb467ba5ac0a743e8f9723cfff9', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Head Reflex MLT 1.3mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('head', 'reflex-mlt', 'reflex-mlt', 'Head', 'Reflex MLT', 1.3, '16', 'multifilament', null, null, '{"Black","Natural"}'::text[], null, null, 13.9, 'current', 'https://www.tenniswarehouse-europe.com/Head_Reflex_MLT_130_16_String/descpageACHEAD-HRM16S-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '3ef6d6b8e01d6a1fa09e42357872b9f90a7b1fe91079a15b798aec551e3118f0', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Head RIP Control 1.25mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('head', 'rip-control', 'rip-control', 'Head', 'RIP Control', 1.25, '17', 'multifilament', null, null, '{"Black","Natural"}'::text[], null, null, 8.9, 'current', 'https://www.tenniswarehouse-europe.com/Head_RIP_Control_125_17_String_Set/descpageACHEAD-RCON17-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '65c9d79d978b4fb116b686409156ac3beb6dac05de65facb089cd8ecdf13d7d9', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Head Velocity MLT 1.25mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('head', 'velocity-mlt', 'velocity-mlt', 'Head', 'Velocity MLT', 1.25, '17', 'multifilament', null, null, '{"Black","Natural"}'::text[], null, null, 8.1, 'current', 'https://www.tenniswarehouse-europe.com/Head_Velocity_MLT_125_17_String/descpageACHEAD-HVM17SX-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], 'e7177008d58439ed89c04dc1935cc62b3747ada7381f4053c2f308e0d04fb5f0', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Head Velocity MLT 1.3mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('head', 'velocity-mlt', 'velocity-mlt', 'Head', 'Velocity MLT', 1.3, '16', 'multifilament', null, null, '{"Black","Natural"}'::text[], null, null, 7.9, 'current', 'https://www.tenniswarehouse-europe.com/Head_Velocity_MLT_130_16_String/descpageACHEAD-HVM16SX-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '5993d5c3d9324d5556320652b7850e5c80a73bf3669275a417007b4d2c038d6f', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Head Velocity Power 1.25mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('head', 'velocity-power', 'velocity-power', 'Head', 'Velocity Power', 1.25, '17', 'multifilament', null, null, '{"Black","Natural"}'::text[], null, null, 9.5, 'current', 'https://www.tenniswarehouse-europe.com/Head_Velocity_Power_125_17_Black_String/descpageACHEAD-HVP17BK-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '3c6979dcf88a2aa4ba818ad4df45f1c59cb4e13d69611b54953399c3282522f0', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Head Velocity Power 1.3mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('head', 'velocity-power', 'velocity-power', 'Head', 'Velocity Power', 1.3, '16', 'multifilament', null, null, '{"Black","Natural"}'::text[], null, null, 9.5, 'current', 'https://www.tenniswarehouse-europe.com/Head_Velocity_Power_130_16_Black_String/descpageACHEAD-HVP16BK-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], 'd85add600cde740cdb6b18c2e8b4ffe75ec82f70068bb1e56def625b6196b99a', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Isospeed Control 1.3mm  [missing: colors,core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('isospeed', 'control', 'control', 'Isospeed', 'Control', 1.3, '16', 'multifilament', null, null, '{}', null, null, 12.9, 'current', 'https://www.tenniswarehouse-europe.com/ISOSPEED_Control_130_16_String/descpageACISOH-ISOC16-EN.html', 1, '{"colors","core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '15ee5aefd8e1b1d65ad27c187875e539898e4c8108b2af0efb332856888f02af', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Isospeed Control Classic 1.3mm  [missing: core_material,gauge_label,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('isospeed', 'control-classic', 'control-classic', 'Isospeed', 'Control Classic', 1.3, null, 'multifilament', null, null, '{"Natural"}'::text[], null, null, 12.9, 'current', 'https://www.tenniswarehouse-europe.com/ISOSPEED_Control_Classic_130_String/descpageACISOH-ISOCC16-EN.html', 1, '{"core_material","gauge_label","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '2c56831f461f04fe5aadb8c5bb3ffa71490ed54de294409e8ce9c00a9b8c55dc', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Isospeed Professional Classic 1.2mm  [missing: colors,core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('isospeed', 'professional-classic', 'professional-classic', 'Isospeed', 'Professional Classic', 1.2, '17', 'multifilament', null, null, '{}', null, null, 10.9, 'current', 'https://www.tenniswarehouse-europe.com/ISOSPEED_Professional_Classic_120_17_String/descpageACISOH-ISOPC120-EN.html', 1, '{"colors","core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '53ceb5f2915713750ab8115fc098a700360b3340f455ab08bf9b6a94b87d50de', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Isospeed Professional New 1.2mm  [missing: colors,core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('isospeed', 'professional-new', 'professional-new', 'Isospeed', 'Professional New', 1.2, '17', 'multifilament', null, null, '{}', null, null, 13.95, 'current', 'https://www.tenniswarehouse-europe.com/ISOSPEED_Professional_New_120_17_String/descpageACISOH-ISOP17-EN.html', 1, '{"colors","core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '06ac015a44aac7cda6e3e6a86ceec496b12a585597e6006f94be94a06d91810c', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Kirschbaum Touch Multifiber 1.3mm  [missing: colors,core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('kirschbaum', 'touch-multifiber', 'touch-multifiber', 'Kirschbaum', 'Touch Multifiber', 1.3, '16', 'multifilament', null, null, '{}', null, null, 14.9, 'current', 'https://www.tenniswarehouse-europe.com/Kirschbaum_Touch_Multifiber_130_16_String/descpageACKIRSCHH-TMULTI16-EN.html', 1, '{"colors","core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '7b6ca2df7371f8626ec5ca0058727882f1767b1a5ff3cec8d2032ca33a36088b', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Prince Premier Control 1.4mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('prince', 'premier-control', 'premier-control', 'Prince', 'Premier Control', 1.4, '15', 'multifilament', null, null, '{"Natural"}'::text[], null, null, 10.9, 'current', 'https://www.tenniswarehouse-europe.com/Prince_Premier_Control_15_140_String/descpageACPRINCEH-PPC15-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '140fcd02b2d23e74fed6db4443c958c4b9fb9cf926eb828d86b7f7f4dca5c60c', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Signum Pro Fibercore 1.3mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('signum-pro', 'fibercore', 'fibercore', 'Signum Pro', 'Fibercore', 1.3, '16', 'multifilament', null, null, '{"Natural"}'::text[], null, null, 8.5, 'current', 'https://www.tenniswarehouse-europe.com/Signum_Pro_Fibercore_130_String/descpageACSIGPROH-SPF130S-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '8592a53547150deb7ee562b4562d1a9f6e5eedfbca5bd1395ed91aec5be38179', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Solinco Vanquish 1.3mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('solinco', 'vanquish', 'vanquish', 'Solinco', 'Vanquish', 1.3, '16', 'multifilament', null, null, '{"Natural"}'::text[], null, null, 10.9, 'current', 'https://www.tenniswarehouse-europe.com/Solinco_Vanquish_130_16_String/descpageACNOASOLH-SVAN16-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '304332812557a0a41a5a5135176170bfee8b77f8b0414fb3b1795be44963405c', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Solinco X-Natural 1.2mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('solinco', 'x-natural', 'x-natural', 'Solinco', 'X-Natural', 1.2, '17', 'multifilament', null, null, '{"Black"}'::text[], null, null, 13.2, 'current', 'https://www.tenniswarehouse-europe.com/Solinco_X-Natural_120_17_String/descpageACNOASOLH-SXN17-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '0fc0eb2f948086fabe9c0abfb12377265877f84b23e693cc4fda18147794b396', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Solinco X-Natural 1.3mm  [missing: colors,core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('solinco', 'x-natural', 'x-natural', 'Solinco', 'X-Natural', 1.3, '16', 'multifilament', null, null, '{}', null, null, 13.2, 'current', 'https://www.tenniswarehouse-europe.com/Solinco_X-Natural_130_16_String/descpageACNOASOLH-SXN16-EN.html', 1, '{"colors","core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '600ff5bbc3144f5c945ea82e755be59e638a34b0aae1560b9b52520b5b6d0389', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Tecnifibre Duramix HD 1.25mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('tecnifibre', 'duramix-hd', 'duramix-hd', 'Tecnifibre', 'Duramix HD', 1.25, '17', 'multifilament', null, null, '{"Black","Natural","Red"}'::text[], null, null, 12.7, 'current', 'https://www.tenniswarehouse-europe.com/Tecnifibre_Duramix_HD_125_17_String/descpageACTECNIH-TDM125-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '0269c2dc34653c9180fe6f30c35307bc3e50854226852ff82d15fb60d40b6408', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Tecnifibre Duramix HD 1.3mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('tecnifibre', 'duramix-hd', 'duramix-hd', 'Tecnifibre', 'Duramix HD', 1.3, '16', 'multifilament', null, null, '{"Black","Natural","Red"}'::text[], null, null, 12.75, 'current', 'https://www.tenniswarehouse-europe.com/Tecnifibre_Duramix_HD_130_16_String/descpageACTECNIH-TDM-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '0bb3c3cceacffc0a646bd5e63e0e9f7f822e992d975c2108492293585b1133dc', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Tecnifibre Duramix HD 1.35mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('tecnifibre', 'duramix-hd', 'duramix-hd', 'Tecnifibre', 'Duramix HD', 1.35, '15L', 'multifilament', null, null, '{"Black","Natural","Red"}'::text[], null, null, 12.75, 'current', 'https://www.tenniswarehouse-europe.com/Tecnifibre_Duramix_HD_135_15L_String/descpageACTECNIH-TDM135-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '115fd50fe874c927e03d44b2cbdc10be430739d0192d6aa4b9037d190c580d8c', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Tecnifibre Multifeel 1.25mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('tecnifibre', 'multifeel', 'multifeel', 'Tecnifibre', 'Multifeel', 1.25, '17', 'multifilament', null, null, '{"Black","Blue","Natural","Pink"}'::text[], null, null, 10.9, 'current', 'https://www.tenniswarehouse-europe.com/Tecnifibre_Multifeel_17_125_String/descpageACTECNIH-TMF17-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '6676c98200b07a0537bac1642b5da9ce4e9d562139eb98e811a60c8ab6520447', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Tecnifibre Multifeel 1.35mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('tecnifibre', 'multifeel', 'multifeel', 'Tecnifibre', 'Multifeel', 1.35, '15', 'multifilament', null, null, '{"Natural"}'::text[], null, null, 11.2, 'current', 'https://www.tenniswarehouse-europe.com/Tecnifibre_Multifeel_15L_135_String/descpageACTECNIH-TMF135-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], 'ed45b54b0711c1b7dc460bced9cfd5896d43280e5a4f41a91684f996c4cf5337', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Tecnifibre NRG2 1.24mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('tecnifibre', 'nrg2', 'nrg2', 'Tecnifibre', 'NRG2', 1.24, '17', 'multifilament', null, null, '{"Natural"}'::text[], null, null, 17.9, 'current', 'https://www.tenniswarehouse-europe.com/Tecnifibre_NRG2_124_17_String/descpageACTECNIH-NRG17-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '5303051382c667ce9895beeaf6efc487185d71cb8657aa8961ee4df8722a8631', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Tecnifibre NRG2 1.32mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('tecnifibre', 'nrg2', 'nrg2', 'Tecnifibre', 'NRG2', 1.32, '16', 'multifilament', null, null, '{"Natural"}'::text[], null, null, 17.9, 'current', 'https://www.tenniswarehouse-europe.com/Tecnifibre_NRG2_132_16_String/descpageACTECNIH-NRG16-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '281c35fb0e6d9eb1bc1beb16236753aab2a05421553551b58ac3f65855795663', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Tecnifibre TGV 1.25mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('tecnifibre', 'tgv', 'tgv', 'Tecnifibre', 'TGV', 1.25, '17', 'multifilament', null, null, '{"Black","Natural"}'::text[], null, null, 16.9, 'current', 'https://www.tenniswarehouse-europe.com/Tecnifibre_TGV_125_17_String/descpageACTECNIH-TTGV17S-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], 'ba08a08795c7fc21aab29f07f50478c5f120f9b5b51fca0396a1abb4b839f88e', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Tecnifibre TGV 1.3mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('tecnifibre', 'tgv', 'tgv', 'Tecnifibre', 'TGV', 1.3, '16', 'multifilament', null, null, '{"Black","Natural"}'::text[], null, null, 16.9, 'current', 'https://www.tenniswarehouse-europe.com/Tecnifibre_TGV_130_16_String/descpageACTECNIH-TTGV16S-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], 'a63c6f6c1978f3fa43de5efe26de99e23baa21fb711bffc6f7e764fae1f1166d', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Tecnifibre Triax 1.28mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('tecnifibre', 'triax', 'triax', 'Tecnifibre', 'Triax', 1.28, '17', 'multifilament', null, null, '{"Natural�"}'::text[], null, null, 17.24, 'current', 'https://www.tenniswarehouse-europe.com/Tecnifibre_Triax_128_17_String_/descpageACTECNIH-TSTX28-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '9e34e6615fee3fc1547ae0690d489599d90540ef229a9aa5a2fbc6df2462dc51', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Tecnifibre Triax 1.33mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('tecnifibre', 'triax', 'triax', 'Tecnifibre', 'Triax', 1.33, '16', 'multifilament', null, null, '{"Natural"}'::text[], null, null, 17.24, 'current', 'https://www.tenniswarehouse-europe.com/Tecnifibre_Triax_133_16_String_/descpageACTECNIH-TSTX33-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '3425590def56b0829dda1ac223506e3cb180f27f27610bacdbe95d24de75271a', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Tecnifibre Triax 1.38mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('tecnifibre', 'triax', 'triax', 'Tecnifibre', 'Triax', 1.38, '15L', 'multifilament', null, null, '{"Natural"}'::text[], null, null, 17.24, 'current', 'https://www.tenniswarehouse-europe.com/Tecnifibre_Triax_138_15L_String_/descpageACTECNIH-TSTX38-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '447575cbbaa4e863547ec01e4484d7f76c863dd0d644cd3508541c7490b3e817', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Tecnifibre X-One Biphase 1.18mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('tecnifibre', 'x-one-biphase', 'x-one-biphase', 'Tecnifibre', 'X-One Biphase', 1.18, '18', 'multifilament', null, null, '{"Natural"}'::text[], null, null, 21.9, 'current', 'https://www.tenniswarehouse-europe.com/Tecnifibre_X-One_Biphase_118_String/descpageACTECNIH-X118NA-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], 'de329115987196a8ce9ac4032af8138cb52efac9946a8e52e9c07214b43d2e65', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Tecnifibre X-One Biphase 1.24mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('tecnifibre', 'x-one-biphase', 'x-one-biphase', 'Tecnifibre', 'X-One Biphase', 1.24, '17', 'multifilament', null, null, '{"Black","Natural"}'::text[], null, null, 21.9, 'current', 'https://www.tenniswarehouse-europe.com/Tecnifibre_X-One_Biphase_124_Black_17_String_/descpageACTECNIH-X117B-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '7477fb2f1ddda88e3cd92c6c37c77feeb34abdc9c04d60a1940f2c3564d7837b', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Tecnifibre X-One Biphase 1.3mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('tecnifibre', 'x-one-biphase', 'x-one-biphase', 'Tecnifibre', 'X-One Biphase', 1.3, '16', 'multifilament', null, null, '{"Natural"}'::text[], null, null, 21.9, 'current', 'https://www.tenniswarehouse-europe.com/Tecnifibre_X-One_Biphase_130_16_String_/descpageACTECNIH-X116-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '8ad55fcd88bb8c40d7731c49eb77802413ca4df3a66def36cab95b7969220368', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Volkl Power Fiber II 1.25mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('volkl', 'power-fiber-ii', 'power-fiber-ii', 'Volkl', 'Power Fiber II', 1.25, '17', 'multifilament', null, null, '{"Natural"}'::text[], null, null, 13.9, 'current', 'https://www.tenniswarehouse-europe.com/Volkl_Power_Fiber_II_125_17_String_Natural/descpageACVOLKLGH-VPF217-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '3e290146c6be464e52163568a7cb0d6bc33a3e67a20dfae1911e7064dbda01a5', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Volkl Power Fiber Pro 1.25mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('volkl', 'power-fiber-pro', 'power-fiber-pro', 'Volkl', 'Power Fiber Pro', 1.25, '17', 'multifilament', null, null, '{"Red"}'::text[], null, null, 12.9, 'current', 'https://www.tenniswarehouse-europe.com/Volkl_Power_Fiber_Pro_125_17_String_Set/descpageACVOLKLGH-VPF17SS-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], 'd7170b501849db8ccbff8c936f938332d02575ec8895701035848b0837f7d386', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Wilson NXT 1.24mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('wilson', 'nxt', 'nxt', 'Wilson', 'NXT', 1.24, '17', 'multifilament', null, null, '{"Natural"}'::text[], null, null, 22.9, 'current', 'https://www.tenniswarehouse-europe.com/Wilson_NXT_124_17_String/descpageACWILSON-WNXTS-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], 'b5b64f843a781f342154fa7f51de2b2869e763a813d6b6f50a7bce1b97b1e305', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Wilson NXT 1.3mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('wilson', 'nxt', 'nxt', 'Wilson', 'NXT', 1.3, '16', 'multifilament', null, null, '{"White"}'::text[], null, null, 22.9, 'current', 'https://www.tenniswarehouse-europe.com/Wilson_NXT_130_16_String/descpageACWILSON-WNXT-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], '948ccb7ea8f886be5237b4015d9257ef69a4db7f36ac965af700f8b9f2a3371c', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Wilson NXT Power 1.26mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('wilson', 'nxt-power', 'nxt-power', 'Wilson', 'NXT Power', 1.26, '17', 'multifilament', null, null, '{"Natural"}'::text[], null, null, 23.9, 'current', 'https://www.tenniswarehouse-europe.com/Wilson_NXT_Power_126_17_String/descpageACWILSON-WNXT17-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], 'f49a654343e2358ebae02c60230c48377c568f198f7aef3214c433e33e83b1fb', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Wilson NXT Power 1.3mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('wilson', 'nxt-power', 'nxt-power', 'Wilson', 'NXT Power', 1.3, '16', 'multifilament', null, null, '{"Natural"}'::text[], null, null, 23.9, 'current', 'https://www.tenniswarehouse-europe.com/Wilson_NXT_Power_130_16_String/descpageACWILSON-WNXT16-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], 'a540da763f265c25acaba62a7514e29afe124ef3528a45e52843b5ba95dd038a', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Wilson Repel 1.25mm  [missing: colors,core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('wilson', 'repel', 'repel', 'Wilson', 'Repel', 1.25, '17', 'multifilament', null, null, '{}', null, null, 13.9, 'current', 'https://www.tenniswarehouse-europe.com/Wilson_Repel_17_125_17_String/descpageACWILSON-WRP17NA-EN.html', 1, '{"colors","core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], 'efbde4b9c0d575204ff97c2d8c3a9fa06540c4e7c3a18be57492e6fdb9c160b0', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Wilson Repel 1.3mm  [missing: colors,core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('wilson', 'repel', 'repel', 'Wilson', 'Repel', 1.3, '16', 'multifilament', null, null, '{}', null, null, 13.9, 'current', 'https://www.tenniswarehouse-europe.com/Wilson_Repel_16_130_16_String/descpageACWILSON-WRP16NA-EN.html', 1, '{"colors","core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], 'cf0c087049ceae9872ccaed648bb2fbb880b5e7638cd8cdae728fe92190c6595', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Wilson Sensation 1.25mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('wilson', 'sensation', 'sensation', 'Wilson', 'Sensation', 1.25, '17', 'multifilament', null, null, '{"Natural"}'::text[], null, null, 11.9, 'current', 'https://www.tenniswarehouse-europe.com/Wilson_Sensation_125_17_String/descpageACWILSON-WSNS17-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], 'fac0634e8457354d83288a726ac4ac4bee8ff729682aec296db18e032a11ef8e', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- Wilson Sensation 1.3mm  [missing: core_material,tension_max_lbs,tension_min_lbs,wrap_material]
insert into public.strings
  (brand_slug, model_slug, family_slug, brand_label, model_label, gauge_mm, gauge_label, construction, core_material, wrap_material, colors, tension_min_lbs, tension_max_lbs, price_eur, lifecycle_status, source_url, source_tier, missing_fields, content_hash, last_seen_at, absence_streak, updated_at)
values ('wilson', 'sensation', 'sensation', 'Wilson', 'Sensation', 1.3, '16', 'multifilament', null, null, '{"Blue","Natural"}'::text[], null, null, 11.9, 'current', 'https://www.tenniswarehouse-europe.com/Wilson_Sensation_130_16_Blue_String/descpageACWILSON-SEN16BL-EN.html', 1, '{"core_material","tension_max_lbs","tension_min_lbs","wrap_material"}'::text[], 'fad460e8c1fd9705fcb3ec2290de631dec71dc4525a4fa848816a223d9008c6b', '2026-07-30T07:32:16+00:00', 0, now())
on conflict on constraint strings_natural_key do update set
  brand_label      = excluded.brand_label,
  model_label      = excluded.model_label,
  gauge_label      = excluded.gauge_label,
  construction     = excluded.construction,
  core_material    = excluded.core_material,
  wrap_material    = excluded.wrap_material,
  colors           = excluded.colors,
  tension_min_lbs  = excluded.tension_min_lbs,
  tension_max_lbs  = excluded.tension_max_lbs,
  price_eur        = excluded.price_eur,
  source_url       = excluded.source_url,
  missing_fields   = excluded.missing_fields,
  content_hash     = excluded.content_hash,
  last_seen_at     = excluded.last_seen_at,
  absence_streak   = 0,
  updated_at       = now()
where public.strings.content_hash is distinct from excluded.content_hash;

-- ---------------------------------------------------------------------
-- 3. lifecycle_status transitions - separate block, never mixed with upserts
-- ---------------------------------------------------------------------
-- NONE. This is a bootstrap run: <phase_0_preflight> forbids any transition
-- to 'discontinued' when no prior snapshot exists. 1 legacy model
-- (wilson / nxt-soft) is absent from the source facet; per the lifecycle
-- table that requires 2 consecutive absent runs AND absence from the
-- manufacturer site before any status change. Recorded in the run report.

-- ---------------------------------------------------------------------
-- 4. quarantine - 5 records rejected, never guessed into the main table
-- ---------------------------------------------------------------------
-- multi_segment_gauge_mains_crosses_not_representable_in_single_gauge_mm
insert into public.sync_quarantine (run_id, entity, raw_payload, reject_reason, source_url)
values ('20260730-072613', 'string', '{"sku_code": "HIT", "raw": {"raw_name": "Head IntelliTour 1.25 (17) String", "raw_specs": {"manufacturer name": "HEAD Sport GmbH", "address": "Wuhrkopfweg 1, 6921 Kennelbach, Austria", "contact": "www.head.com", "gauge": "17 gauge mains (1.23mm)/17 gauge crosses (1.323mm)", "length": "Mains/22 feet (6.7m), Crosses/18 feet (5.5m)", "colours": "Yellow/Natural."}, "gauge_mm": 1.23, "gauge_label": null, "construction_source_text": null, "colors": ["Yellow", "Natural."], "price_eur": 11.3, "gauge_conflict": {"title_mm": 1.25, "spec_mm": 1.23}, "gauge_segments": ["1.23", "1.323"], "notes": ["multi_segment_gauge_detected", "gauge_precision_exceeds_numeric_4_2", "gauge_contradiction_title_vs_spec"]}}'::jsonb,
        'multi_segment_gauge_mains_crosses_not_representable_in_single_gauge_mm', 'https://www.tenniswarehouse-europe.com/Head_IntelliTour_125_17_String/descpageACHEAD-HIT-EN.html');

-- gauge_contradiction_between_title_and_spec_line
insert into public.sync_quarantine (run_id, entity, raw_payload, reject_reason, source_url)
values ('20260730-072613', 'string', '{"sku_code": "X115", "raw": {"raw_name": "Tecnifibre X-One Biphase 1.34 String", "raw_specs": {"manufacturer name": "Tecnifibre S.A.", "address": "RD 307, 78810 Feucherolles, France", "contact": "contact@tecnifibre.com", "gauge": "15L/1.35 mm", "length": "40ft/12.2m", "composition": "Multifilament (Polyurethane - PU 400, H2C fibers, Biphasic treatment)", "colour": "Natural"}, "gauge_mm": 1.35, "gauge_label": "15L", "construction_source_text": "Multifilament (Polyurethane - PU 400, H2C fibers, Biphasic treatment)", "colors": ["Natural"], "price_eur": 21.9, "gauge_conflict": {"title_mm": 1.34, "spec_mm": 1.35}, "gauge_segments": null, "notes": ["gauge_contradiction_title_vs_spec"]}}'::jsonb,
        'gauge_contradiction_between_title_and_spec_line', 'https://www.tenniswarehouse-europe.com/Tecnifibre_X-One_Biphase_134_String_/descpageACTECNIH-X115-EN.html');

-- gauge_contradiction_between_title_and_spec_line
insert into public.sync_quarantine (run_id, entity, raw_payload, reject_reason, source_url)
values ('20260730-072613', 'string', '{"sku_code": "WNXTC", "raw": {"raw_name": "Wilson NXT Control 16 (1.32) String", "raw_specs": {"manufacturer name": "Wilson Sporting Goods Co.", "address": "130 E. Randolph Street, Suite 600 Chicago, IL 60601 USA", "contact": "https://wilson.com", "responsible person": "Amer Sports Europe Services GmbH", "responsible person address": "Parkring 15-17 85748 Garching, Germany", "responsible person contact": "https://www.amersports.com/brands/wilson/", "gauge": "16/1.30mm", "length": "40ft/12mm", "composition": "Natural Gut", "color": "Natural"}, "gauge_mm": 1.3, "gauge_label": "16", "construction_source_text": "Natural Gut", "colors": ["Natural"], "price_eur": 20.9, "gauge_conflict": {"title_mm": 1.32, "spec_mm": 1.3}, "gauge_segments": null, "notes": ["gauge_contradiction_title_vs_spec"]}}'::jsonb,
        'gauge_contradiction_between_title_and_spec_line', 'https://www.tenniswarehouse-europe.com/Wilson_NXT_Control_16_132_String/descpageACWILSON-WNXTC-EN.html');

-- construction_unpublished_on_every_sku_of_this_natural_key
insert into public.sync_quarantine (run_id, entity, raw_payload, reject_reason, source_url)
values ('20260730-072613', 'string', '{"sku_code": "RCON16", "raw": {"raw_name": "Head RIP Control 1.30/16 String Set", "key": "head/rip-control/1.3", "raw_specs": {"string color": "Black Stock # 281099-16BK", "manufacturer name": "HEAD Sport GmbH", "address": "Wuhrkopfweg 1, 6921 Kennelbach, Austria", "contact": "www.head.com", "gauge": "16/1.30 mm", "length": "40ft/12m", "colour": "Black, Natural"}}}'::jsonb,
        'construction_unpublished_on_every_sku_of_this_natural_key', 'https://www.tenniswarehouse-europe.com/Head_RIP_Control_130_16_String_Set/descpageACHEAD-RCON16-EN.html');

-- construction_unpublished_on_every_sku_of_this_natural_key
insert into public.sync_quarantine (run_id, entity, raw_payload, reject_reason, source_url)
values ('20260730-072613', 'string', '{"sku_code": "TTGV15S", "raw": {"raw_name": "Tecnifibre TGV 1.35/15L String", "key": "tecnifibre/tgv/1.35", "raw_specs": {"string color": "Black Stock # 01GTG135XB", "manufacturer name": "Tecnifibre S.A.", "address": "RD 307, 78810 Feucherolles, France", "contact": "contact@tecnifibre.com", "gauge": "15L (1.35 mm)", "length": "12.2m", "construction": "PU 400 inner core with SPL Coating Silicone Pyrogene Lubritec: reduces elongation and improves durability by up to 40%", "color": "Black"}}}'::jsonb,
        'construction_unpublished_on_every_sku_of_this_natural_key', 'https://www.tenniswarehouse-europe.com/Tecnifibre_TGV_135_15L_String/descpageACTECNIH-TTGV15S-EN.html');

update public.sync_runs set finished_at = now() where run_id = '20260730-072613';

commit;
