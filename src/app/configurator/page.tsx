'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ConfiguratorPage() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    config: true,
    principal: false,
    caliber: false,
    tension: false,
  });

  const [formData, setFormData] = useState({
    configName: '',
    racquet: '',
    mainString: '',
    crossString: '',
    mainGauge: '16 (1.30mm)',
    crossGauge: '16 (1.30mm)',
    mainTension: 24,
    crossTension: 22,
    rating: 0,
    notes: ''
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    padding: '0.75rem',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    marginBottom: '0.5rem',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#f3f4f6'
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url("/images/tennis-court-bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      position: 'relative',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Dark overlay */}
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
          Tennis String Advisor Premium
        </h1>
        <p style={{ color: '#ffffff', fontSize: '1.1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Système avancé avec journal de cordage professionnel
        </p>
        <Link href="/" style={{
          display: 'inline-block',
          marginTop: '1rem',
          padding: '0.5rem 1.5rem',
          backgroundColor: 'rgba(74, 155, 95, 0.9)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: '500',
          textDecoration: 'none',
          transition: 'background-color 0.2s'
        }}>
          ← Retour à l\'accueil
        </Link>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 1rem 3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '1.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Left Column - Configuration */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          padding: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '0.5rem' }}>⚙️</span>
            Configuration et Analyse de Confort
          </h2>

          {/* Nom de la Configuration */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div 
              style={sectionHeaderStyle}
              onClick={() => toggleSection('config')}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>📝</span>
                <span style={{ fontWeight: '500' }}>Nom de la Configuration</span>
              </div>
              <span>{expandedSections.config ? '▲' : '▼'}</span>
            </div>
            {expandedSections.config && (
              <div style={{ padding: '0 0.75rem' }}>
                <input
                  type="text"
                  placeholder="Ex: Setup Tournoi 2025"
                  style={inputStyle}
                  value={formData.configName}
                  onChange={(e) => handleInputChange('configName', e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Choisir une Raquette */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div 
              style={sectionHeaderStyle}
              onClick={() => toggleSection('racquet')}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>🎾</span>
                <span style={{ fontWeight: '500' }}>Choisir une Raquette</span>
              </div>
              <span>▼</span>
            </div>
          </div>

          {/* Cordage Principal */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div 
              style={sectionHeaderStyle}
              onClick={() => toggleSection('principal')}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>🎯</span>
                <span style={{ fontWeight: '500' }}>Cordage Principal</span>
              </div>
              <span>{expandedSections.principal ? '▲' : '▼'}</span>
            </div>
            {expandedSections.principal && (
              <div style={{ padding: '0 0.75rem' }}>
                <select 
                  style={selectStyle}
                  value={formData.mainString}
                  onChange={(e) => handleInputChange('mainString', e.target.value)}
                >
                  <option value="">Sélectionner votre cordage</option>
                  <option value="babolat-rpm">Babolat RPM Blast</option>
                  <option value="luxilon-alu">Luxilon ALU Power</option>
                  <option value="wilson-nxt">Wilson NXT</option>
                  <option value="technifibre-x1">Technifibre X-One</option>
                  <option value="head-hawk">Head Hawk</option>
                </select>
              </div>
            )}
          </div>

          {/* Jauge du Calibre */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div 
              style={sectionHeaderStyle}
              onClick={() => toggleSection('caliber')}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>📏</span>
                <span style={{ fontWeight: '500' }}>Jauge du Calibre</span>
              </div>
              <span>{expandedSections.caliber ? '▲' : '▼'}</span>
            </div>
            {expandedSections.caliber && (
              <div style={{ 
                padding: '0 0.75rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem'
              }}>
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280',
                    marginBottom: '0.25rem',
                    display: 'block' 
                  }}>
                    Principal
                  </label>
                  <select 
                    style={selectStyle}
                    value={formData.mainGauge}
                    onChange={(e) => handleInputChange('mainGauge', e.target.value)}
                  >
                    <option value="16 (1.30mm)">16 (1.30mm) - Standard</option>
                    <option value="17 (1.25mm)">17 (1.25mm)</option>
                    <option value="18 (1.20mm)">18 (1.20mm)</option>
                  </select>
                </div>
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280',
                    marginBottom: '0.25rem',
                    display: 'block' 
                  }}>
                    Travers
                  </label>
                  <select 
                    style={selectStyle}
                    value={formData.crossGauge}
                    onChange={(e) => handleInputChange('crossGauge', e.target.value)}
                  >
                    <option value="16 (1.30mm)">16 (1.30mm) - Standard</option>
                    <option value="17 (1.25mm)">17 (1.25mm)</option>
                    <option value="18 (1.20mm)">18 (1.20mm)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Tension */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div 
              style={sectionHeaderStyle}
              onClick={() => toggleSection('tension')}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>⚡</span>
                <span style={{ fontWeight: '500' }}>
                  Tension {Math.round((formData.mainTension + formData.crossTension) / 2)} kg
                </span>
              </div>
              <span>{expandedSections.tension ? '▲' : '▼'}</span>
            </div>
            {expandedSections.tension && (
              <div style={{ padding: '0 0.75rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem' 
                  }}>
                    <label style={{ fontSize: '0.875rem', color: '#6b7280' }}>Principal</label>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{formData.mainTension} kg</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="35"
                    value={formData.mainTension}
                    onChange={(e) => handleInputChange('mainTension', parseInt(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    marginTop: '0.25rem'
                  }}>
                    <span>15 kg</span>
                    <span>35 kg</span>
                  </div>
                </div>
                <div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem' 
                  }}>
                    <label style={{ fontSize: '0.875rem', color: '#6b7280' }}>Travers</label>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{formData.crossTension} kg</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="35"
                    value={formData.crossTension}
                    onChange={(e) => handleInputChange('crossTension', parseInt(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    marginTop: '0.25rem'
                  }}>
                    <span>15 kg</span>
                    <span>35 kg</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Évaluer votre expérience */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              border: '1px solid #fde68a',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '0.5rem' }}>⭐</span>
              <span style={{ fontWeight: '500', color: '#92400e' }}>Évaluer votre expérience</span>
            </div>
            <div style={{ padding: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleInputChange('rating', star)}
                    style={{
                      fontSize: '1.5rem',
                      color: formData.rating >= star ? '#fbbf24' : '#d1d5db',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'color 0.2s'
                    }}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                Votre satisfaction personnelle
              </p>
            </div>
          </div>

          {/* Notes personnelles */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '0.5rem' }}>📝</span>
              <span style={{ fontWeight: '500' }}>Notes personnelles</span>
            </div>
            <div style={{ padding: '0.75rem' }}>
              <textarea
                placeholder="Sensations, conditions de jeu, météo..."
                style={{
                  ...inputStyle,
                  minHeight: '100px',
                  resize: 'vertical'
                }}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button style={{
              padding: '0.75rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              fontWeight: '500',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              fontSize: '1rem'
            }}>
              💾 Analyser le Confort
            </button>
            <button style={{
              padding: '0.75rem',
              backgroundColor: '#10b981',
              color: 'white',
              fontWeight: '500',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              fontSize: '1rem'
            }}>
              📊 Enregistrer dans le Journal
            </button>
          </div>
        </div>

        {/* Right Column - Journal de Cordage */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          padding: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '0.5rem' }}>📚</span>
              Journal de Cordage
            </div>
            <span style={{
              fontSize: '0.75rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              borderRadius: '9999px'
            }}>
              PREMIUM
            </span>
          </h2>

          {/* Premium Feature Box */}
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              fontWeight: 'bold',
              color: '#78350f',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              🔒 Fonctionnalité Premium
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#92400e', marginBottom: '0.75rem' }}>
              Le journal de cordage complet est réservé aux membres Premium.
            </p>
            <ul style={{ fontSize: '0.875rem', color: '#92400e', marginBottom: '1rem', listStyle: 'none', padding: 0 }}>
              <li>✓ Historique illimité de configurations</li>
              <li>✓ Suivi des performances dans le temps</li>
              <li>✓ Statistiques et analyses avancées</li>
              <li>✓ Export PDF de vos données</li>
              <li>✓ Rappels de reordage</li>
            </ul>
            <button style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#fbbf24',
              color: '#78350f',
              fontWeight: 'bold',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              fontSize: '1rem'
            }}>
              Débloquer le Journal Premium
            </button>
          </div>

          {/* Configuration Preview */}
          <div style={{
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>
              Configuration Toulouse
            </h4>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              <div style={{ marginBottom: '0.5rem' }}>Raquette Pure Drive × ATP Blend</div>
              <div style={{ marginBottom: '0.5rem' }}>Luxilon ALU 125 / ALU Power × × × × ×</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                Score Global: 8.75 /10
              </div>
            </div>
          </div>

          {/* RCS Box */}
          <div style={{
            backgroundColor: '#dbeafe',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{
              fontWeight: 'bold',
              color: '#1e3a8a',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              ℹ️ Recommandations Confort (RCS)
            </h4>
            <div style={{ fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#3730a3' }}>Confort Bras:</span>
                <span style={{ fontWeight: '500', color: '#1e3a8a' }}>Moyen (RCS = 20)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#3730a3' }}>Puissance:</span>
                <span style={{ fontWeight: '500', color: '#1e3a8a' }}>Tension basse (RCS 20-24)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#3730a3' }}>Contrôle:</span>
                <span style={{ fontWeight: '500', color: '#1e3a8a' }}>Polyester (RCS 25-30)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#3730a3' }}>Tennis Elbow:</span>
                <span style={{ fontWeight: '500', color: '#1e3a8a' }}>Éviter RCS > 30</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              padding: '0.75rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>24</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Configurations sauvées</div>
            </div>
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              padding: '0.75rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>8.5</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Score moyen</div>
            </div>
          </div>

          {/* Recent Configurations */}
          <div>
            <h4 style={{ fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>
              Configurations récentes
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Configuration Toulouse', 'Setup Tournoi 2024', 'Test Hybrid'].map((config, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}>
                  <span style={{ fontSize: '0.875rem' }}>{config}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    ⭐ {(8.5 - idx * 0.5).toFixed(1)}/10
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}