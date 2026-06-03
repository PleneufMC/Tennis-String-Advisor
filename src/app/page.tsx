'use client';

import Link from 'next/link';
import { racquetsDatabase } from '@/data/racquets-database';
import { stringsDatabase } from '@/data/strings-database';
import { useLanguage, type TranslationKey } from '@/lib/i18n';

// ---- Icônes SVG (style line, cohérent avec le Header) ----
function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}
function IconSliders({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0" />
      <circle cx="15" cy="6" r="2" /><circle cx="7" cy="12" r="2" /><circle cx="17" cy="18" r="2" />
    </svg>
  );
}
function IconPulse({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l2 6 4-14 3 8h5" />
    </svg>
  );
}
function IconBook({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a2 2 0 012-2h6v16H6a2 2 0 01-2-2V5zM12 3h6a2 2 0 012 2v12a2 2 0 01-2 2h-6V3z" />
    </svg>
  );
}
function IconDatabase({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </svg>
  );
}
function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

const BRANDS = ['Babolat', 'Wilson', 'Head', 'Yonex', 'Dunlop', 'Tecnifibre', 'Prince', 'Völkl'];

const FEATURES: { icon: (p: { className?: string }) => JSX.Element; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: IconSliders, titleKey: 'home.feature.config.title', descKey: 'home.feature.config.desc' },
  { icon: IconPulse, titleKey: 'home.feature.rcs.title', descKey: 'home.feature.rcs.desc' },
  { icon: IconBook, titleKey: 'home.feature.journal.title', descKey: 'home.feature.journal.desc' },
  { icon: IconDatabase, titleKey: 'home.feature.database.title', descKey: 'home.feature.database.desc' },
];

export default function HomePage() {
  const { t } = useLanguage();
  const racquetCount = racquetsDatabase.length;
  const stringCount = stringsDatabase.length;
  const brandCount = new Set(racquetsDatabase.map((r) => r.brand)).size;

  return (
    <div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden border-b border-slate-100 dark:border-slate-800">
        {/* fond décoratif subtil */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-tennis-green-200/40 blur-3xl dark:bg-tennis-green-500/10" />
          <div className="absolute top-40 -left-24 h-80 w-80 rounded-full bg-tennis-court-200/40 blur-3xl dark:bg-tennis-court-500/10" />
          <div
            className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)',
              backgroundSize: '44px 44px',
            }}
          />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-12 lg:py-28">
          {/* Texte */}
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-tennis-green-200 bg-tennis-green-50 px-3 py-1 text-xs font-semibold text-tennis-green-700 dark:border-tennis-green-500/30 dark:bg-tennis-green-500/10 dark:text-tennis-green-300">
              <span className="h-1.5 w-1.5 rounded-full bg-tennis-green-500" />
              {t('home.badge')}
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              {t('home.title1')}
              <br />
              <span className="text-tennis-green-600 dark:text-tennis-green-400">{t('home.title2')}</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              {t('home.subtitle')}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/configurator"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-tennis-green-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-tennis-green-600/20 transition hover:bg-tennis-green-700 hover:shadow-tennis-green-600/30"
              >
                {t('home.cta.configurator')}
                <IconArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/racquets"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
              >
                {t('home.cta.explore')}
              </Link>
            </div>

            {/* mini-stats */}
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
              {[
                { v: racquetCount, l: t('home.stats.racquets') },
                { v: stringCount, l: t('home.stats.strings') },
                { v: brandCount, l: t('home.stats.brands') },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{s.v}</dt>
                  <dd className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Carte visuelle (aperçu RCS) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t('home.rcs.preview')}</p>
                <span className="rounded-full bg-tennis-green-50 px-2.5 py-1 text-xs font-semibold text-tennis-green-700 dark:bg-tennis-green-500/15 dark:text-tennis-green-300">
                  {t('home.rcs.comfortable')}
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">23</span>
                <span className="text-sm text-slate-400 dark:text-slate-500">/ 50</span>
              </div>

              {/* jauge */}
              <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-tennis-green-400 to-tennis-green-600"
                  style={{ width: '46%' }}
                />
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { k: t('home.rcs.racquet'), v: 'Wilson Blade 98 v9' },
                  { k: t('home.rcs.string'), v: 'Luxilon ALU Power' },
                  { k: t('home.rcs.tension'), v: '24 kg' },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="flex items-center justify-between border-b border-slate-100 pb-2 text-sm last:border-0 last:pb-0 dark:border-slate-800"
                  >
                    <span className="text-slate-500 dark:text-slate-400">{row.k}</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{row.v}</span>
                  </div>
                ))}
              </div>

              <p className="mt-5 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                {t('home.rcs.note')}
              </p>
            </div>
          </div>
        </div>

        {/* Bande de marques */}
        <div className="border-t border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t('home.brands.label')}
            </span>
            {BRANDS.map((b) => (
              <span key={b} className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {t('home.features.title')}
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{t('home.features.subtitle')}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.titleKey}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-tennis-green-200 hover:shadow-lg hover:shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-tennis-green-500/40 dark:hover:shadow-black/40"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-tennis-green-50 text-tennis-green-600 transition group-hover:bg-tennis-green-600 group-hover:text-white dark:bg-tennis-green-500/15 dark:text-tennis-green-400 dark:group-hover:bg-tennis-green-500 dark:group-hover:text-slate-950">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">{t(f.titleKey)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t(f.descKey)}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================== EXPLICATION RCS ===================== */}
      <section className="border-y border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-tennis-green-600 dark:text-tennis-green-400">
              {t('home.rcsSection.eyebrow')}
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {t('home.rcsSection.title')}
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{t('home.rcsSection.desc')}</p>
            <ul className="mt-6 space-y-3">
              {[
                t('home.rcsSection.point1'),
                t('home.rcsSection.point2'),
                t('home.rcsSection.point3'),
              ].map((text) => (
                <li key={text} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-tennis-green-100 text-tennis-green-700 dark:bg-tennis-green-500/20 dark:text-tennis-green-300">
                    <IconCheck className="h-3.5 w-3.5" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* échelle RCS */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t('home.rcsSection.scale')}</p>
            <div className="mt-5 space-y-4">
              {[
                { label: t('home.rcsSection.veryComfortable'), range: '< 20', color: 'bg-tennis-green-400', w: '30%' },
                { label: t('home.rcsSection.comfortable'), range: '20 – 25', color: 'bg-tennis-green-500', w: '50%' },
                { label: t('home.rcsSection.standard'), range: '25 – 30', color: 'bg-tennis-court-400', w: '68%' },
                { label: t('home.rcsSection.firm'), range: '30 – 35', color: 'bg-orange-400', w: '82%' },
                { label: t('home.rcsSection.veryFirm'), range: '> 35', color: 'bg-red-500', w: '95%' },
              ].map((r) => (
                <div key={r.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{r.label}</span>
                    <span className="text-slate-400 dark:text-slate-500">{r.range}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className={`h-full rounded-full ${r.color}`} style={{ width: r.w }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CTA FINAL ===================== */}
      <section className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-14 text-center sm:px-16 dark:border dark:border-slate-800">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-tennis-green-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-tennis-court-500/10 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t('home.finalCta.title')}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">{t('home.finalCta.desc')}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/configurator"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-tennis-green-500 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-tennis-green-400"
              >
                {t('home.finalCta.start')}
                <IconArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                {t('home.finalCta.premium')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
