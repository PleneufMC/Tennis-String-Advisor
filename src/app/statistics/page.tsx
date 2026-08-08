'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { stringsDatabase } from '@/data/strings-database';
import { racquetsDatabase } from '@/data/racquets-database';
import { ConfigurationStorage } from '@/lib/storage';

export default function StatisticsPage() {
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
    avgRCS: 0,
    favoriteRacquet: null as string | null,
    favoriteString: null as string | null
  });

  const [topProducts, setTopProducts] = useState({
    strings: [] as any[],
    racquets: [] as any[]
  });

  useEffect(() => {
    // Load statistics
    const configStats = ConfigurationStorage.getStats();
    setStats(configStats);

    // Calculate top products
    const topStrings = [...stringsDatabase]
      .sort((a, b) => b.performance - a.performance)
      .slice(0, 10)
      .map(s => ({
        ...s,
        avgScore: ((s.performance + s.control + s.comfort + s.durability) / 4).toFixed(1)
      }));

    const topRacquets = [...racquetsDatabase]
      .filter(r => r.stiffness !== null)
      .sort((a, b) => {
        // Sort by a combination of popularity and specs
        const aScore = (100 - Math.abs(68 - (a.stiffness || 68))) + (a.headSize / 10);
        const bScore = (100 - Math.abs(68 - (b.stiffness || 68))) + (b.headSize / 10);
        return bScore - aScore;
      })
      .slice(0, 10);

    setTopProducts({
      strings: topStrings,
      racquets: topRacquets
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
            Top 10 Cordages
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>#</th>
                  <th style={tableHeaderStyle}>Marque</th>
                  <th style={tableHeaderStyle}>Modèle</th>
                  <th style={tableHeaderStyle}>Type</th>
                  <th style={tableHeaderStyle}>Raideur</th>
                  <th style={tableHeaderStyle}>Performance</th>
                  <th style={tableHeaderStyle}>Contrôle</th>
                  <th style={tableHeaderStyle}>Prix</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.strings.map((string, idx) => (
                  <tr key={string.id}>
                    <td style={{ ...tableCellStyle, fontWeight: 'bold', color: '#3b82f6' }}>
                      {idx + 1}
                    </td>
                    <td style={tableCellStyle}>{string.brand}</td>
                    <td style={{ ...tableCellStyle, fontWeight: '500' }}>{string.model}</td>
                    <td style={tableCellStyle}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: string.type === 'Polyester' ? 'var(--tint-blue-bg)' : 
                                        string.type === 'Multifilament' ? 'var(--tint-green-bg)' : 'var(--tint-amber-bg)',
                        color: string.type === 'Polyester' ? 'var(--tint-blue-fg)' : 
                               string.type === 'Multifilament' ? 'var(--tint-green-fg)' : 'var(--tint-amber-fg)',
                        borderRadius: '4px',
                        fontSize: '0.75rem'
                      }}>
                        {string.type}
                      </span>
                    </td>
                    <td style={tableCellStyle}>{string.stiffness} lb/in</td>
                    <td style={tableCellStyle}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <span>{string.performance}/10</span>
                        <div style={{
                          width: '60px',
                          height: '6px',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${string.performance * 10}%`,
                            height: '100%',
                            backgroundColor: '#10b981'
                          }} />
                        </div>
                      </div>
                    </td>
                    <td style={tableCellStyle}>{string.control}/10</td>
                    <td style={tableCellStyle}>€{string.price.europe}</td>
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
            Top 10 Raquettes
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>#</th>
                  <th style={tableHeaderStyle}>Marque</th>
                  <th style={tableHeaderStyle}>Modèle</th>
                  <th style={tableHeaderStyle}>Variante</th>
                  <th style={tableHeaderStyle}>RA</th>
                  <th style={tableHeaderStyle}>Poids</th>
                  <th style={tableHeaderStyle}>Tamis</th>
                  <th style={tableHeaderStyle}>Catégorie</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.racquets.map((racquet, idx) => (
                  <tr key={racquet.id}>
                    <td style={{ ...tableCellStyle, fontWeight: 'bold', color: '#3b82f6' }}>
                      {idx + 1}
                    </td>
                    <td style={tableCellStyle}>{racquet.brand}</td>
                    <td style={{ ...tableCellStyle, fontWeight: '500' }}>{racquet.model}</td>
                    <td style={tableCellStyle}>{racquet.variant}</td>
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
                    <td style={tableCellStyle}>{racquet.weight}g</td>
                    <td style={tableCellStyle}>{racquet.headSize} sq in</td>
                    <td style={tableCellStyle}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#e0e7ff',
                        color: '#3730a3',
                        borderRadius: '4px',
                        fontSize: '0.75rem'
                      }}>
                        {racquet.category || 'Standard'}
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