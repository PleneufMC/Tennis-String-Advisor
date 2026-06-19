'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { stringsDatabase, calculateRCS, getStringRecommendation } from '@/data/strings-database';
import { racquetsDatabase, calculateCompatibility } from '@/data/racquets-database';
import { ConfigurationStorage, SavedConfiguration } from '@/lib/storage';
import { trackConfiguratorComplete } from '@/components/analytics/analytics';
import { isPremiumActive } from '@/lib/premium';
import {
  calculateAdvancedRcs,
  stringTypeToFamily,
  parseGaugeMm,
  type AdvancedRcsResult,
} from '@/lib/advanced-rcs';

export default function ConfiguratorPage() {
  const { data: session } = useSession();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    config: true,
    racquet: false,
    principal: false,
    cross: false,
    caliber: false,
    tension: false,
  });

  const [formData, setFormData] = useState({
    configName: '',
    racquet: '',
    mainString: '',
    crossString: '',
    mainGauge: '1.25',
    crossGauge: '1.25',
    mainTension: 24,
    crossTension: 22,
    rating: 0,
    notes: ''
  });

  const [searchTerms, setSearchTerms] = useState({
    racquet: '',
    mainString: '',
    crossString: ''
  });

  const [showDropdowns, setShowDropdowns] = useState({
    racquet: false,
    mainString: false,
    crossString: false
  });

  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>([]);
  const [saveMessage, setSaveMessage] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
    avgRCS: 0,
    favoriteRacquet: null as string | null,
    favoriteString: null as string | null
  });

  // Selected items data
  const selectedRacquet = useMemo(() => 
    racquetsDatabase.find(r => r.id === formData.racquet),
    [formData.racquet]
  );

  const selectedMainString = useMemo(() => 
    stringsDatabase.find(s => s.id === formData.mainString),
    [formData.mainString]
  );

  const selectedCrossString = useMemo(() => 
    stringsDatabase.find(s => s.id === formData.crossString),
    [formData.crossString]
  );

  // Calculate RCS and recommendations
  const rcsData = useMemo(() => {
    if (!selectedRacquet || !selectedMainString) return null;
    
    const avgTension = (formData.mainTension + formData.crossTension) / 2;
    const mainRCS = calculateRCS(
      selectedRacquet.stiffness || 65,
      selectedMainString.stiffness,
      avgTension
    );

    let crossRCS = mainRCS;
    if (selectedCrossString) {
      crossRCS = calculateRCS(
        selectedRacquet.stiffness || 65,
        selectedCrossString.stiffness,
        formData.crossTension
      );
    }

    const avgRCS = selectedCrossString ? (mainRCS + crossRCS) / 2 : mainRCS;
    const recommendation = getStringRecommendation(avgRCS);
    const compatibilityResult = calculateCompatibility(
      selectedRacquet,
      selectedMainString.stiffness,
      avgTension
    );
    const compatibility = compatibilityResult.score;

    return {
      mainRCS,
      crossRCS,
      avgRCS,
      recommendation,
      compatibility
    };
  }, [selectedRacquet, selectedMainString, selectedCrossString, formData.mainTension, formData.crossTension]);

  // Statut Premium (l'analyse RCS avancée est réservée aux abonnés).
  const isPremium = useMemo(
    () => isPremiumActive(session?.user as any),
    [session?.user]
  );

  // RCS Avancé : analyse multi-facteurs + sous-scores + recommandations.
  const advancedRcs: AdvancedRcsResult | null = useMemo(() => {
    if (!selectedRacquet || !selectedMainString) return null;
    return calculateAdvancedRcs({
      racquetStiffness: selectedRacquet.stiffness ?? 63,
      racquetWeight: selectedRacquet.weight,
      racquetHeadSize: selectedRacquet.headSize,
      mainStringStiffness: selectedMainString.stiffness,
      mainStringFamily: stringTypeToFamily(selectedMainString.type),
      mainRatings: {
        control: selectedMainString.control,
        comfort: selectedMainString.comfort,
        spin: selectedMainString.spin,
        power: selectedMainString.power,
        durability: selectedMainString.durability,
      },
      mainGaugeMm: parseGaugeMm(formData.mainGauge),
      crossStringStiffness: selectedCrossString?.stiffness,
      crossStringFamily: selectedCrossString
        ? stringTypeToFamily(selectedCrossString.type)
        : undefined,
      crossRatings: selectedCrossString
        ? {
            control: selectedCrossString.control,
            comfort: selectedCrossString.comfort,
            spin: selectedCrossString.spin,
            power: selectedCrossString.power,
            durability: selectedCrossString.durability,
          }
        : undefined,
      crossGaugeMm: selectedCrossString ? parseGaugeMm(formData.crossGauge) : undefined,
      mainTension: formData.mainTension,
      crossTension: formData.crossTension,
    });
  }, [
    selectedRacquet,
    selectedMainString,
    selectedCrossString,
    formData.mainGauge,
    formData.crossGauge,
    formData.mainTension,
    formData.crossTension,
  ]);

  // GA4 : émettre `configurator_complete` quand une reco RCS valide est produite.
  // Dédupliqué par combinaison (raquette + cordages + tensions) pour ne pas
  // spammer l'event à chaque interaction sur une même configuration.
  const lastTrackedConfig = useRef<string | null>(null);
  useEffect(() => {
    if (!rcsData || !selectedRacquet || !selectedMainString) return;
    const signature = [
      formData.racquet,
      formData.mainString,
      formData.crossString,
      formData.mainTension,
      formData.crossTension,
    ].join('|');
    if (lastTrackedConfig.current === signature) return;
    lastTrackedConfig.current = signature;
    trackConfiguratorComplete(rcsData.avgRCS, rcsData.compatibility);
  }, [
    rcsData,
    selectedRacquet,
    selectedMainString,
    formData.racquet,
    formData.mainString,
    formData.crossString,
    formData.mainTension,
    formData.crossTension,
  ]);

  // Filtered lists based on search
  const filteredRacquets = useMemo(() => {
    if (!searchTerms.racquet) return racquetsDatabase.slice(0, 10);
    const term = searchTerms.racquet.toLowerCase();
    return racquetsDatabase.filter(r => 
      r.brand.toLowerCase().includes(term) ||
      r.model.toLowerCase().includes(term) ||
      r.variant.toLowerCase().includes(term)
    ).slice(0, 15);
  }, [searchTerms.racquet]);

  const filteredMainStrings = useMemo(() => {
    if (!searchTerms.mainString) return stringsDatabase.slice(0, 10);
    const term = searchTerms.mainString.toLowerCase();
    return stringsDatabase.filter(s => 
      s.brand.toLowerCase().includes(term) ||
      s.model.toLowerCase().includes(term) ||
      s.type.toLowerCase().includes(term)
    ).slice(0, 15);
  }, [searchTerms.mainString]);

  const filteredCrossStrings = useMemo(() => {
    if (!searchTerms.crossString) return stringsDatabase.slice(0, 10);
    const term = searchTerms.crossString.toLowerCase();
    return stringsDatabase.filter(s => 
      s.brand.toLowerCase().includes(term) ||
      s.model.toLowerCase().includes(term) ||
      s.type.toLowerCase().includes(term)
    ).slice(0, 15);
  }, [searchTerms.crossString]);

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

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setShowDropdowns({ racquet: false, mainString: false, crossString: false });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load saved configurations on mount
  useEffect(() => {
    const configs = ConfigurationStorage.getRecent(3);
    setSavedConfigs(configs);
    const configStats = ConfigurationStorage.getStats();
    setStats(configStats);
  }, []);

  // Save configuration function.
  // Sauvegarde TOUJOURS en localStorage (compat existante). En plus, si
  // l'utilisateur est connecté, persiste la configuration dans son compte
  // (Supabase) → journal synchronisé entre appareils, accessible via
  // /account/configurations.
  const saveConfiguration = async () => {
    if (!formData.configName || !selectedRacquet || !selectedMainString || !rcsData) {
      setSaveMessage('Veuillez remplir tous les champs requis');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    const payload = {
      name: formData.configName,
      racquetId: formData.racquet,
      mainStringId: formData.mainString,
      crossStringId: formData.crossString || undefined,
      mainGauge: formData.mainGauge,
      crossGauge: formData.crossGauge,
      mainTension: formData.mainTension,
      crossTension: formData.crossTension,
      rating: formData.rating,
      notes: formData.notes,
      rcsScore: rcsData.avgRCS,
      compatibility: rcsData.compatibility,
    };

    ConfigurationStorage.save(payload);

    // Persistance serveur pour les utilisateurs connectés.
    if (session?.user) {
      try {
        const res = await fetch('/api/configurations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setSaveMessage('Configuration enregistrée dans votre compte avec succès!');
        } else if (res.status === 403) {
          // Quota du plan gratuit atteint (3 configurations).
          const data = await res.json().catch(() => null);
          setSaveMessage(
            (data?.error as string) ||
              'Plan gratuit limité à 3 configurations enregistrées. Passez Premium pour un journal illimité.'
          );
        } else {
          setSaveMessage('Enregistrée localement (échec de la sauvegarde dans le compte).');
        }
      } catch {
        setSaveMessage('Enregistrée localement (hors ligne).');
      }
    } else {
      setSaveMessage('Configuration enregistrée localement avec succès!');
    }
    setTimeout(() => setSaveMessage(''), 6000);

    // Refresh saved configs and stats
    const configs = ConfigurationStorage.getRecent(3);
    setSavedConfigs(configs);
    const configStats = ConfigurationStorage.getStats();
    setStats(configStats);
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
                <span style={{ fontWeight: '500' }}>
                  Choisir une Raquette
                  {selectedRacquet && (
                    <span style={{ fontSize: '0.875rem', color: '#10b981', marginLeft: '0.5rem' }}>
                      ✓ {selectedRacquet.brand} {selectedRacquet.model}
                    </span>
                  )}
                </span>
              </div>
              <span>{expandedSections.racquet ? '▲' : '▼'}</span>
            </div>
            {expandedSections.racquet && (
              <div className="dropdown-container" style={{ padding: '0 0.75rem', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Rechercher une raquette (ex: Babolat, Pure Aero, Wilson)..."
                  style={inputStyle}
                  value={searchTerms.racquet}
                  onChange={(e) => {
                    setSearchTerms(prev => ({ ...prev, racquet: e.target.value }));
                    setShowDropdowns(prev => ({ ...prev, racquet: true }));
                  }}
                  onFocus={() => setShowDropdowns(prev => ({ ...prev, racquet: true }))}
                />
                {selectedRacquet && (
                  <div style={{ 
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: '#dbeafe',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}>
                    <strong>{selectedRacquet.brand} {selectedRacquet.model} {selectedRacquet.variant}</strong>
                    <div style={{ color: '#1e3a8a', fontSize: '0.75rem' }}>
                      RA: {selectedRacquet.stiffness || 'ND'} | Poids: {selectedRacquet.weight}g | Tamis: {selectedRacquet.headSize} sq in
                    </div>
                  </div>
                )}
                {showDropdowns.racquet && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0.75rem',
                    right: '0.75rem',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 10,
                    marginTop: '0.25rem'
                  }}>
                    {filteredRacquets.map(racquet => (
                      <div
                        key={racquet.id}
                        style={{
                          padding: '0.75rem',
                          borderBottom: '1px solid #f3f4f6',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        onClick={() => {
                          handleInputChange('racquet', racquet.id);
                          setSearchTerms(prev => ({ ...prev, racquet: `${racquet.brand} ${racquet.model} ${racquet.variant}` }));
                          setShowDropdowns(prev => ({ ...prev, racquet: false }));
                        }}
                      >
                        <div style={{ fontWeight: '500' }}>
                          {racquet.brand} {racquet.model} {racquet.variant}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          RA: {racquet.stiffness || 'ND'} | {racquet.weight}g | {racquet.headSize} sq in
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cordage Principal */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div 
              style={sectionHeaderStyle}
              onClick={() => toggleSection('principal')}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>🎯</span>
                <span style={{ fontWeight: '500' }}>
                  Cordage Principal
                  {selectedMainString && (
                    <span style={{ fontSize: '0.875rem', color: '#10b981', marginLeft: '0.5rem' }}>
                      ✓ {selectedMainString.brand} {selectedMainString.model}
                    </span>
                  )}
                </span>
              </div>
              <span>{expandedSections.principal ? '▲' : '▼'}</span>
            </div>
            {expandedSections.principal && (
              <div className="dropdown-container" style={{ padding: '0 0.75rem', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Rechercher un cordage (ex: Luxilon, ALU Power, Polyester)..."
                  style={inputStyle}
                  value={searchTerms.mainString}
                  onChange={(e) => {
                    setSearchTerms(prev => ({ ...prev, mainString: e.target.value }));
                    setShowDropdowns(prev => ({ ...prev, mainString: true }));
                  }}
                  onFocus={() => setShowDropdowns(prev => ({ ...prev, mainString: true }))}
                />
                {selectedMainString && (
                  <div style={{ 
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: '#dcfce7',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}>
                    <strong>{selectedMainString.brand} {selectedMainString.model}</strong>
                    <div style={{ color: '#166534', fontSize: '0.75rem' }}>
                      {selectedMainString.type} | Raideur: {selectedMainString.stiffness} lb/in | Contrôle: {selectedMainString.control}/10
                    </div>
                  </div>
                )}
                {showDropdowns.mainString && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0.75rem',
                    right: '0.75rem',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 10,
                    marginTop: '0.25rem'
                  }}>
                    {filteredMainStrings.map(string => (
                      <div
                        key={string.id}
                        style={{
                          padding: '0.75rem',
                          borderBottom: '1px solid #f3f4f6',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        onClick={() => {
                          handleInputChange('mainString', string.id);
                          setSearchTerms(prev => ({ ...prev, mainString: `${string.brand} ${string.model}` }));
                          setShowDropdowns(prev => ({ ...prev, mainString: false }));
                          // Set default gauge if available
                          if (string.gauges && string.gauges.length > 0) {
                            handleInputChange('mainGauge', string.gauges[0]);
                          }
                        }}
                      >
                        <div style={{ fontWeight: '500' }}>
                          {string.brand} {string.model}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {string.type} | Raideur: {string.stiffness} lb/in | €{string.price.europe}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cordage Travers (Cross) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div 
              style={sectionHeaderStyle}
              onClick={() => toggleSection('cross')}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>➕</span>
                <span style={{ fontWeight: '500' }}>
                  Cordage Travers (Hybride optionnel)
                  {selectedCrossString && (
                    <span style={{ fontSize: '0.875rem', color: '#10b981', marginLeft: '0.5rem' }}>
                      ✓ {selectedCrossString.brand} {selectedCrossString.model}
                    </span>
                  )}
                </span>
              </div>
              <span>{expandedSections.cross ? '▲' : '▼'}</span>
            </div>
            {expandedSections.cross && (
              <div className="dropdown-container" style={{ padding: '0 0.75rem', position: 'relative' }}>
                <div style={{ 
                  padding: '0.5rem',
                  backgroundColor: '#fef3c7',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  color: '#92400e',
                  marginBottom: '0.75rem'
                }}>
                  💡 Laissez vide pour un cordage uniforme, ou choisissez un autre cordage pour un hybride
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un cordage travers (optionnel)..."
                  style={inputStyle}
                  value={searchTerms.crossString}
                  onChange={(e) => {
                    setSearchTerms(prev => ({ ...prev, crossString: e.target.value }));
                    setShowDropdowns(prev => ({ ...prev, crossString: true }));
                  }}
                  onFocus={() => setShowDropdowns(prev => ({ ...prev, crossString: true }))}
                />
                {selectedCrossString && (
                  <div style={{ 
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: '#dcfce7',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}>
                    <strong>{selectedCrossString.brand} {selectedCrossString.model}</strong>
                    <div style={{ color: '#166534', fontSize: '0.75rem' }}>
                      {selectedCrossString.type} | Raideur: {selectedCrossString.stiffness} lb/in | Confort: {selectedCrossString.comfort}/10
                    </div>
                    <button
                      onClick={() => {
                        handleInputChange('crossString', '');
                        setSearchTerms(prev => ({ ...prev, crossString: '' }));
                      }}
                      style={{
                        marginTop: '0.25rem',
                        fontSize: '0.75rem',
                        color: '#dc2626',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Retirer le cordage travers
                    </button>
                  </div>
                )}
                {showDropdowns.crossString && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0.75rem',
                    right: '0.75rem',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 10,
                    marginTop: '0.25rem'
                  }}>
                    {filteredCrossStrings.map(string => (
                      <div
                        key={string.id}
                        style={{
                          padding: '0.75rem',
                          borderBottom: '1px solid #f3f4f6',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        onClick={() => {
                          handleInputChange('crossString', string.id);
                          setSearchTerms(prev => ({ ...prev, crossString: `${string.brand} ${string.model}` }));
                          setShowDropdowns(prev => ({ ...prev, crossString: false }));
                          // Set default gauge if available
                          if (string.gauges && string.gauges.length > 0) {
                            handleInputChange('crossGauge', string.gauges[0]);
                          }
                        }}
                      >
                        <div style={{ fontWeight: '500' }}>
                          {string.brand} {string.model}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {string.type} | Raideur: {string.stiffness} lb/in | €{string.price.europe}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    {selectedMainString?.gauges.map(gauge => (
                      <option key={gauge} value={gauge}>
                        {gauge}mm - {gauge === '1.30' ? 'Standard' : gauge < '1.25' ? 'Fin' : 'Medium'}
                      </option>
                    )) || [
                      <option key="1.15" value="1.15">1.15mm - Très fin</option>,
                      <option key="1.20" value="1.20">1.20mm - Fin</option>,
                      <option key="1.25" value="1.25">1.25mm - Medium</option>,
                      <option key="1.30" value="1.30">1.30mm - Standard</option>
                    ]}
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
                    {(selectedCrossString || selectedMainString)?.gauges.map(gauge => (
                      <option key={gauge} value={gauge}>
                        {gauge}mm - {gauge === '1.30' ? 'Standard' : gauge < '1.25' ? 'Fin' : 'Medium'}
                      </option>
                    )) || [
                      <option key="1.15" value="1.15">1.15mm - Très fin</option>,
                      <option key="1.20" value="1.20">1.20mm - Fin</option>,
                      <option key="1.25" value="1.25">1.25mm - Medium</option>,
                      <option key="1.30" value="1.30">1.30mm - Standard</option>
                    ]}
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

          {/* Evaluer votre experience */}
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
              <span style={{ fontWeight: '500', color: '#92400e' }}>Evaluer votre experience</span>
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

          {/* RCS Analysis Results */}
          {rcsData && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
              borderRadius: '8px',
              border: '2px solid #3b82f6'
            }}>
              <h3 style={{
                fontWeight: 'bold',
                color: '#1e3a8a',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                📊 Analyse RCS en Temps Réel
              </h3>
              <div style={{ fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#1e40af' }}>RCS Principal:</span>
                  <span style={{ fontWeight: 'bold', color: '#1e3a8a' }}>{rcsData.mainRCS.toFixed(1)}</span>
                </div>
                {selectedCrossString && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#1e40af' }}>RCS Travers:</span>
                    <span style={{ fontWeight: 'bold', color: '#1e3a8a' }}>{rcsData.crossRCS.toFixed(1)}</span>
                  </div>
                )}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '0.75rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid #93c5fd'
                }}>
                  <span style={{ color: '#1e40af', fontWeight: 'bold' }}>RCS Moyen:</span>
                  <span style={{ 
                    fontWeight: 'bold', 
                    fontSize: '1.125rem',
                    color: rcsData.avgRCS < 25 ? '#059669' : rcsData.avgRCS < 30 ? '#eab308' : '#dc2626'
                  }}>
                    {rcsData.avgRCS.toFixed(1)}
                  </span>
                </div>
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '6px',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#1e3a8a', marginBottom: '0.25rem' }}>
                    {rcsData.recommendation.level}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#1e40af' }}>
                    {rcsData.recommendation.description}
                  </div>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ color: '#1e40af' }}>Compatibilité:</span>
                  <span style={{ 
                    fontWeight: 'bold',
                    color: rcsData.compatibility > 75 ? '#059669' : rcsData.compatibility > 50 ? '#eab308' : '#dc2626'
                  }}>
                    {rcsData.compatibility.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* RCS Avancé (Premium) */}
          {advancedRcs && (
            <div
              style={{
                marginTop: '1rem',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid #d1d5db',
                background: 'linear-gradient(135deg,#f8fafc 0%,#eef2ff 100%)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                }}
              >
                <span style={{ fontWeight: 700, color: '#1f2937' }}>
                  🔬 Analyse RCS Avancée
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#92400e',
                    background: '#fde68a',
                    padding: '2px 8px',
                    borderRadius: '999px',
                  }}
                >
                  PREMIUM
                </span>
              </div>

              {/* Contenu : flouté + verrouillé pour les non-premium */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    filter: isPremium ? 'none' : 'blur(5px)',
                    userSelect: isPremium ? 'auto' : 'none',
                    pointerEvents: isPremium ? 'auto' : 'none',
                  }}
                  aria-hidden={!isPremium}
                >
                  {/* Score global */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '2rem',
                        fontWeight: 800,
                        color:
                          advancedRcs.level === 'excellent'
                            ? '#059669'
                            : advancedRcs.level === 'good'
                            ? '#2563eb'
                            : advancedRcs.level === 'moderate'
                            ? '#eab308'
                            : '#dc2626',
                      }}
                    >
                      {advancedRcs.overall}
                      <span style={{ fontSize: '1rem', color: '#6b7280' }}>/100</span>
                    </span>
                    <span style={{ color: '#374151', fontSize: '0.9rem' }}>
                      {advancedRcs.summary}
                    </span>
                  </div>

                  {/* Sous-scores */}
                  {(
                    [
                      ['Puissance', advancedRcs.subScores.power],
                      ['Contrôle', advancedRcs.subScores.control],
                      ['Confort', advancedRcs.subScores.comfort],
                      ['Spin', advancedRcs.subScores.spin],
                      ['Durabilité', advancedRcs.subScores.durability],
                    ] as [string, number][]
                  ).map(([label, value]) => (
                    <div key={label} style={{ marginBottom: '0.5rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.8rem',
                          color: '#374151',
                          marginBottom: '2px',
                        }}
                      >
                        <span>{label}</span>
                        <span style={{ fontWeight: 600 }}>{value}</span>
                      </div>
                      <div
                        style={{
                          height: '6px',
                          background: '#e5e7eb',
                          borderRadius: '999px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${value}%`,
                            height: '100%',
                            background:
                              value >= 75 ? '#059669' : value >= 50 ? '#2563eb' : '#f59e0b',
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Alertes */}
                  {advancedRcs.warnings.map((w, i) => (
                    <div
                      key={i}
                      style={{
                        marginTop: '0.6rem',
                        padding: '0.5rem 0.75rem',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        color: '#991b1b',
                      }}
                    >
                      ⚠️ {w}
                    </div>
                  ))}

                  {/* Recommandations */}
                  {advancedRcs.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        color: '#1e40af',
                      }}
                    >
                      💡 {rec}
                    </div>
                  ))}
                </div>

                {/* Overlay CTA pour les non-premium */}
                {!isPremium && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      gap: '0.6rem',
                      padding: '1rem',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>🔒</span>
                    <span style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.9rem' }}>
                      Sous-scores détaillés &amp; recommandations personnalisées
                    </span>
                    <Link
                      href="/pricing"
                      style={{
                        background: '#f59e0b',
                        color: '#1f2937',
                        fontWeight: 700,
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                      }}
                    >
                      Passer Premium
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              disabled={!selectedRacquet || !selectedMainString}
              style={{
                padding: '0.75rem',
                backgroundColor: (!selectedRacquet || !selectedMainString) ? '#9ca3af' : '#3b82f6',
                color: 'white',
                fontWeight: '500',
                borderRadius: '8px',
                border: 'none',
                cursor: (!selectedRacquet || !selectedMainString) ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                fontSize: '1rem'
              }}
            >
              💾 Analyser le Confort
            </button>
            <button 
              disabled={!formData.configName || !selectedRacquet || !selectedMainString}
              onClick={saveConfiguration}
              style={{
                padding: '0.75rem',
                backgroundColor: (!formData.configName || !selectedRacquet || !selectedMainString) ? '#9ca3af' : '#10b981',
                color: 'white',
                fontWeight: '500',
                borderRadius: '8px',
                border: 'none',
                cursor: (!formData.configName || !selectedRacquet || !selectedMainString) ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                fontSize: '1rem'
              }}
            >
              📊 Enregistrer dans le Journal
            </button>
            {saveMessage && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: saveMessage.includes('succès') ? '#dcfce7' : '#fee2e2',
                color: saveMessage.includes('succès') ? '#166534' : '#991b1b',
                borderRadius: '8px',
                fontSize: '0.875rem',
                textAlign: 'center'
              }}>
                {saveMessage}
              </div>
            )}
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

          {/* Journal Box — varie selon l'état de connexion */}
          {session?.user ? (
            <div style={{
              background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontWeight: 'bold',
                color: '#166534',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                ✅ Journal synchronisé activé
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#15803d', marginBottom: '0.75rem' }}>
                Vos configurations enregistrées sont sauvegardées dans votre
                compte et accessibles depuis tous vos appareils.
              </p>
              <Link
                href="/account/configurations"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  fontSize: '1rem',
                  textAlign: 'center',
                  textDecoration: 'none'
                }}
              >
                📚 Voir mon journal de cordage
              </Link>
            </div>
          ) : (
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
                🔒 Journal synchronisé
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#92400e', marginBottom: '0.75rem' }}>
                Connectez-vous pour sauvegarder vos configurations dans votre
                compte et les retrouver sur tous vos appareils.
              </p>
              <ul style={{ fontSize: '0.875rem', color: '#92400e', marginBottom: '1rem', listStyle: 'none', padding: 0 }}>
                <li>✓ Historique de configurations dans votre compte</li>
                <li>✓ Synchronisation entre tous vos appareils</li>
                <li>✓ Notes et évaluations conservées</li>
              </ul>
              <Link
                href="/auth/signin?callbackUrl=/configurator"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#fbbf24',
                  color: '#78350f',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  fontSize: '1rem',
                  textAlign: 'center',
                  textDecoration: 'none'
                }}
              >
                Se connecter pour activer
              </Link>
            </div>
          )}

          {/* Configuration Preview */}
          <div style={{
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>
              {formData.configName || 'Configuration en cours'}
            </h4>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                {selectedRacquet ? `${selectedRacquet.brand} ${selectedRacquet.model}` : 'Aucune raquette sélectionnée'}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                {selectedMainString ? `${selectedMainString.brand} ${selectedMainString.model} ${formData.mainGauge}mm` : 'Aucun cordage'}
                {selectedCrossString && ` / ${selectedCrossString.brand} ${selectedCrossString.model} ${formData.crossGauge}mm`}
              </div>
              {rcsData && (
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  RCS Moyen: {rcsData.avgRCS.toFixed(1)} | Compatibilité: {rcsData.compatibility.toFixed(0)}%
                </div>
              )}
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
                <span style={{ fontWeight: '500', color: '#1e3a8a' }}>
                  {rcsData ? rcsData.recommendation.level : 'Sélectionnez une config'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#3730a3' }}>RCS Optimal:</span>
                <span style={{ fontWeight: '500', color: '#1e3a8a' }}>20-25 (Confortable)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#3730a3' }}>RCS Moyen:</span>
                <span style={{ fontWeight: '500', color: '#1e3a8a' }}>25-30 (Standard)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#3730a3' }}>Tennis Elbow:</span>
                <span style={{ fontWeight: '500', color: '#dc2626' }}>Eviter RCS {'>'} 30</span>
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
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                {stats.total}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Configurations sauvées</div>
            </div>
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              padding: '0.75rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {stats.avgRCS > 0 ? stats.avgRCS.toFixed(1) : '—'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>RCS moyen</div>
            </div>
          </div>

          {/* Recent Configurations */}
          <div>
            <h4 style={{ fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>
              Configurations récentes
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {savedConfigs.length > 0 ? (
                savedConfigs.map((config) => {
                  const racquet = racquetsDatabase.find(r => r.id === config.racquetId);
                  const string = stringsDatabase.find(s => s.id === config.mainStringId);
                  return (
                    <div key={config.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{config.name}</div>
                        <div style={{ fontSize: '0.625rem', color: '#9ca3af' }}>
                          {racquet?.brand} {racquet?.model} | {string?.brand} {string?.model}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          RCS: {config.rcsScore.toFixed(1)}
                        </div>
                        {config.rating > 0 && (
                          <div style={{ fontSize: '0.625rem', color: '#fbbf24' }}>
                            ⭐ {config.rating}/5
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  Aucune configuration sauvée
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}