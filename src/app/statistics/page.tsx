'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { stringsDatabase, type TennisString } from '@/data/strings-database';
import { racquetsDatabase, type TennisRacquet } from '@/data/racquets-database';
import { STRING_TESTER_RATINGS } from '@/data/tester-ratings';
import { RACQUET_TESTER_RATINGS } from '@/data/racquet-tester-ratings';
import { rankRacquetsByTesterAverage } from '@/lib/racquet-scoring';
import { StringRatingLabel, StringRatingsNotice } from '@/components/product/string-rating-label';
import { STRING_RATING_LABELS, distinctRatedNatures } from '@/lib/string-rating-nature';
import { ConfigurationStorage } from '@/lib/storage';

// ─────────────────────────────────────────────────────────────────────────────
//  Top 10 — classement par la moyenne des avis de testeurs (09/10/2026)
// ─────────────────────────────────────────────────────────────────────────────
//
// Ancien critère raquettes : (100 − |68 − RA|) + tamis/10, sans fondement ;
// ancien critère cordages : la note `performance`, sans équivalent sourcé.
// Le seul jugement d'ensemble sourcé du site est la moyenne des critères des
// avis de testeurs (provenance : src/data/tester-ratings.ts et
// racquet-tester-ratings.ts). On ne classe donc QUE les produits rapprochés ;
// les autres ne sont ni classés ni comptés comme zéro.
//
// Affichage sur 20, comme la synthèse : ramener sur 10 créerait des écarts et
// des égalités qui n'existent pas (14,6 et 14,5 donneraient tous deux 7,3).
// Rang partagé seulement en cas d'égalité exacte ; un écart < 0,5 /20 est dans
// la marge d'erreur de la synthèse — le texte le dit, le niveau (S à D) aussi.
// Classement dynamique : une raquette ajoutée à `RACQUET_TESTER_RATINGS` par
// tsa-core y entre sans retouche de cette page.

const TOP_N = 10;

interface RankedRow<T> {
  item: T;
  average20: number;
  tier: string;
  rank: number;
}

/** Rang « de compétition » : égalité exacte -> même rang ; coupe à TOP_N, ex aequo du dernier inclus. */
function topWithRanks<T>(sorted: readonly { item: T; average20: number; tier: string }[]): RankedRow<T>[] {
  const ranked = sorted.map((e, i) => ({ ...e, rank: i + 1 }));
  for (let i = 1; i < ranked.length; i++) {
    if (Math.abs(ranked[i].average20 - ranked[i - 1].average20) < 1e-9) ranked[i].rank = ranked[i - 1].rank;
  }
  if (ranked.length <= TOP_N) return ranked;
  const cutoff = ranked[TOP_N - 1].average20;
  return ranked.filter((r, i) => i < TOP_N || Math.abs(r.average20 - cutoff) < 1e-9);
}

/** Cordages rapprochés, triés par moyenne testeurs décroissante (même règle que les raquettes). */
function rankStringsByTesterAverage(strings: readonly TennisString[]) {
  return strings
    .filter((s) => STRING_TESTER_RATINGS[s.id] !== undefined)
    .map((s) => ({ item: s, average20: STRING_TESTER_RATINGS[s.id].docxAverage20, tier: STRING_TESTER_RATINGS[s.id].tier }))
    .sort((a, b) => b.average20 - a.average20 || a.item.id.localeCompare(b.item.id));
}

const rankedStrings = rankStringsByTesterAverage(stringsDatabase);
// Nature des notes /10 (colonnes Contrôle et Confort) des cordages classés : les fiches de la synthèse
// sont les 18 harmonisées, donc une seule nature. Si une autre entrait un jour dans ce classement,
// chaque ligne porterait son étiquette (`stringsMixed`) plutôt que de les mêler en silence.
const rankedStringNatures = distinctRatedNatures(rankedStrings.map((r) => r.item));
const stringsMixed = rankedStringNatures.length > 1;
const rankedRacquets = rankRacquetsByTesterAverage(racquetsDatabase).map((r) => ({
  item: r.racquet,
  average20: r.testerAverage20,
  tier: RACQUET_TESTER_RATINGS[r.racquet.id]?.tier ?? '—',
}));

/** « Standard » n'apporte rien au lecteur ; « Standard (2025) » devient « (2025) ». */
const displayVariant = (v?: string) => {
  const rest = (v ?? '').replace(/^Standard\b\s*/, '');
  return rest ? ` ${rest}` : '';
};

const fmt20 = (v: number) => v.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });

const TIER_TINT: Record<string, string> = { S: 'green', A: 'green', B: 'blue', C: 'amber', D: 'red' };
function TierBadge({ tier }: { tier: string }) {
  const tint = TIER_TINT[tier] ?? 'blue';
  return (
    <span style={{
      padding: '0.25rem 0.5rem',
      backgroundColor: `var(--tint-${tint}-bg)`,
      color: `var(--tint-${tint}-fg)`,
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: 600
    }}>
      {tier}
    </span>
  );
}

export default function StatisticsPage() {
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
    avgRCS: 0,
    favoriteRacquet: null as string | null,
    favoriteString: null as string | null
  });

  const [topProducts, setTopProducts] = useState({
    strings: [] as RankedRow<TennisString>[],
    racquets: [] as RankedRow<TennisRacquet>[]
  });

  useEffect(() => {
    // Load statistics
    const configStats = ConfigurationStorage.getStats();
    setStats(configStats);

    setTopProducts({
      strings: topWithRanks(rankedStrings),
      racquets: topWithRanks(rankedRacquets)
    });
  }, []);

  const cardStyle = {
    backgroundColor: 'var(--surface-card)',
    color: 'var(--text-strong)', // fix: eviter l'heritage du texte clair en mode sombre
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    padding: '1.5rem',
    marginBottom: '1.5rem'
  };

  const tableHeaderStyle = {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    padding: '0.75rem',
    borderBottom: '2px solid var(--surface-border)',
    textAlign: 'left' as const
  };

  const tableCellStyle = {
    padding: '0.75rem',
    borderBottom: '1px solid var(--surface-border-soft)',
    fontSize: '0.875rem'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url("/images/tennis-court-bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      position: 'relative'
    }}>
      {/* Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(30, 81, 40, 0.85) 0%, rgba(45, 122, 61, 0.8) 50%, rgba(74, 155, 95, 0.75) 100%)',
        zIndex: 0
      }} />

      {/* Header */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        padding: '2rem 1rem',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          textShadow: '3px 3px 6px rgba(0,0,0,0.5)'
        }}>
          📊 Statistiques & Top Produits
        </h1>
        <p style={{ color: '#ffffff', fontSize: '1.1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Analyse complète de votre matériel de tennis
        </p>
        <div style={{ marginTop: '1rem' }}>
          <Link href="/" style={{
            display: 'inline-block',
            marginRight: '0.5rem',
            padding: '0.5rem 1.5rem',
            backgroundColor: 'rgba(74, 155, 95, 0.9)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '500',
            textDecoration: 'none'
          }}>
            ← Accueil
          </Link>
          <Link href="/configurator" style={{
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            backgroundColor: 'rgba(59, 130, 246, 0.9)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '500',
            textDecoration: 'none'
          }}>
            ⚙️ Configurateur
          </Link>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem 3rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Global Stats */}
        <div style={cardStyle}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'var(--text-strong)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '0.5rem' }}>📈</span>
            Statistiques Globales
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              backgroundColor: 'var(--tint-blue-bg)',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--tint-blue-fg)' }}>
                {racquetsDatabase.length}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--tint-blue-fg)' }}>Raquettes disponibles</div>
            </div>
            <div style={{
              backgroundColor: 'var(--tint-green-bg)',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--tint-green-fg)' }}>
                {stringsDatabase.length}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--tint-green-fg)' }}>Cordages disponibles</div>
            </div>
            <div style={{
              backgroundColor: 'var(--tint-amber-bg)',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--tint-amber-fg)' }}>
                {stats.total}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--tint-amber-fg)' }}>Configurations sauvées</div>
            </div>
            <div style={{
              backgroundColor: '#fce7f3',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9f1239' }}>
                {stats.avgRCS > 0 ? stats.avgRCS.toFixed(1) : '—'}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#be123c' }}>RCS moyen</div>
            </div>
          </div>
        </div>

        {/* Méthode commune aux deux classements */}
        <div style={{ ...cardStyle, fontSize: '0.875rem', lineHeight: 1.6 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-strong)', marginBottom: '0.5rem' }}>
            Comment ces classements sont établis
          </h2>
          <p style={{ margin: 0 }}>
            Chaque produit est classé par la <strong>moyenne d&apos;une synthèse d&apos;avis de testeurs
            spécialisés</strong> sur les dernières générations (10 critères pour les cordages, 20 pour les
            raquettes, notés sur 20). Seuls les produits dont la fiche correspond au modèle testé sont
            classés : les autres ne sont ni classés ni comptés comme zéro. C&apos;est une appréciation, pas
            une mesure : un écart de moins de 0,5 point se lit comme une égalité, d&apos;où le niveau
            (S, A, B, C, D) à côté du rang.
          </p>
          <p style={{ margin: '0.5rem 0 0' }}>
            <strong>Un classement d&apos;ensemble n&apos;est pas un conseil pour votre bras.</strong> Le confort
            d&apos;un montage dépend de la rigidité du cordage, de la tension et de la raquette : vérifiez votre
            indice RCS dans le{' '}
            <Link href="/configurator" style={{ color: 'var(--tint-blue-fg)', textDecoration: 'underline' }}>configurateur</Link>{' '}
            avant d&apos;acheter, surtout si vous avez déjà eu mal au coude.
          </p>
        </div>

        {/* Top Strings */}
        <div style={cardStyle}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'var(--text-strong)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '0.5rem' }}>🎯</span>
            {rankedStrings.length >= TOP_N ? `Top ${TOP_N} Cordages` : `Classement des cordages (${rankedStrings.length})`}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-1rem', marginBottom: '0.25rem' }}>
            Classement établi sur les {rankedStrings.length} cordages couverts par la synthèse de tests
            (sur {stringsDatabase.length} au catalogue). Colonnes « Contrôle » et « Confort » (notes /10
            des fiches) :{' '}
            <strong data-rating-nature={rankedStringNatures.join(' ')} style={{ color: 'var(--text-strong)' }}>
              {rankedStringNatures.map((n) => STRING_RATING_LABELS[n]).join(' ; ')}
            </strong>
            .
          </p>
          <StringRatingsNotice
            style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 0, marginBottom: '1rem' }}
          />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>#</th>
                  <th style={tableHeaderStyle}>Cordage</th>
                  <th style={tableHeaderStyle}>Avis testeurs</th>
                  <th style={tableHeaderStyle}>Niveau</th>
                  <th style={tableHeaderStyle}>Type</th>
                  <th style={tableHeaderStyle}>Rigidité</th>
                  <th style={tableHeaderStyle}>Contrôle</th>
                  <th style={tableHeaderStyle}>Confort</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.strings.map(({ item: string, average20, tier, rank }) => (
                  <tr key={string.id}>
                    <td style={{ ...tableCellStyle, fontWeight: 'bold', color: 'var(--tint-blue-fg)' }}>
                      {rank}
                    </td>
                    <td style={{ ...tableCellStyle, fontWeight: '500' }}>
                      <Link href={`/tennis-strings/${string.id}`} style={{ color: 'inherit' }}>
                        {string.brand} {string.model}
                      </Link>
                      {stringsMixed && (
                        <StringRatingLabel
                          string={string}
                          as="div"
                          style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-muted)' }}
                        />
                      )}
                    </td>
                    <td style={{ ...tableCellStyle, fontWeight: 600 }}>{fmt20(average20)}/20</td>
                    <td style={tableCellStyle}><TierBadge tier={tier} /></td>
                    <td style={tableCellStyle}>{string.type}</td>
                    <td style={tableCellStyle}>{string.stiffness} lb/in</td>
                    <td style={tableCellStyle}>
                      {string.control !== undefined ? `${string.control.toLocaleString('fr-FR')}/10` : 'Non publié'}
                    </td>
                    <td style={tableCellStyle}>
                      {string.comfort !== undefined ? `${string.comfort.toLocaleString('fr-FR')}/10` : 'Non publié'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Racquets */}
        <div style={cardStyle}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'var(--text-strong)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '0.5rem' }}>🎾</span>
            {rankedRacquets.length >= TOP_N ? `Top ${TOP_N} Raquettes` : `Classement des raquettes (${rankedRacquets.length})`}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-1rem', marginBottom: '1rem' }}>
            Classement établi sur les {rankedRacquets.length} raquettes dont la fiche correspond à la
            génération testée (sur {racquetsDatabase.length} au catalogue).
            {rankedRacquets.length < TOP_N &&
              ' Moins de dix raquettes sont classables à ce jour : la liste s’allongera à mesure que les fiches seront alignées sur la dernière génération.'}
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>#</th>
                  <th style={tableHeaderStyle}>Raquette</th>
                  <th style={tableHeaderStyle}>Avis testeurs</th>
                  <th style={tableHeaderStyle}>Niveau</th>
                  <th style={tableHeaderStyle}>Tamis</th>
                  <th style={tableHeaderStyle}>Poids</th>
                  <th style={tableHeaderStyle}>RA</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.racquets.map(({ item: racquet, average20, tier, rank }) => (
                  <tr key={racquet.id}>
                    <td style={{ ...tableCellStyle, fontWeight: 'bold', color: 'var(--tint-blue-fg)' }}>
                      {rank}
                    </td>
                    <td style={{ ...tableCellStyle, fontWeight: '500' }}>
                      <Link href={`/racquets/${racquet.id}`} style={{ color: 'inherit' }}>
                        {racquet.brand} {racquet.model}{displayVariant(racquet.variant)}
                      </Link>
                    </td>
                    <td style={{ ...tableCellStyle, fontWeight: 600 }}>{fmt20(average20)}/20</td>
                    <td style={tableCellStyle}><TierBadge tier={tier} /></td>
                    <td style={tableCellStyle}>{racquet.headSize} in²</td>
                    <td style={tableCellStyle}>{racquet.weight} g</td>
                    <td style={tableCellStyle}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor:
                          racquet.stiffness && racquet.stiffness < 65 ? 'var(--tint-green-bg)' :
                          racquet.stiffness && racquet.stiffness < 70 ? 'var(--tint-amber-bg)' : 'var(--tint-red-bg)',
                        color:
                          racquet.stiffness && racquet.stiffness < 65 ? 'var(--tint-green-fg)' :
                          racquet.stiffness && racquet.stiffness < 70 ? 'var(--tint-amber-fg)' : 'var(--tint-red-fg)',
                        borderRadius: '4px',
                        fontSize: '0.75rem'
                      }}>
                        {racquet.stiffness || 'ND'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}