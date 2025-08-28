'use client';

import { useState, useEffect } from 'react';

interface Configuration {
  id: string;
  name: string;
  racquet: string;
  mainString: string;
  crossString: string | null;
  mainTension: number;
  crossTension: number | null;
  rating: number;
  createdAt: string;
}

export function Configurator() {
  const [isHybrid, setIsHybrid] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [savedConfigurations, setSavedConfigurations] = useState<Configuration[]>([]);
  
  const [configName, setConfigName] = useState('');
  const [racquet, setRacquet] = useState('');
  const [mainString, setMainString] = useState('');
  const [crossString, setCrossString] = useState('');
  const [mainTension, setMainTension] = useState(55);
  const [crossTension, setCrossTension] = useState(53);

  // Load saved configurations on mount
  useEffect(() => {
    const saved = localStorage.getItem('tennisConfigurations');
    if (saved) {
      setSavedConfigurations(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever configurations change
  useEffect(() => {
    if (savedConfigurations.length > 0) {
      localStorage.setItem('tennisConfigurations', JSON.stringify(savedConfigurations));
    }
  }, [savedConfigurations]);

  const handleSaveConfiguration = () => {
    if (!racquet || !mainString) {
      alert('Veuillez sélectionner au moins une raquette et un cordage principal');
      return;
    }

    if (currentRating === 0) {
      alert('Veuillez donner une note à cette configuration');
      return;
    }

    const newConfig: Configuration = {
      id: Date.now().toString(),
      name: configName || `Config ${new Date().toLocaleDateString('fr-FR')}`,
      racquet,
      mainString,
      crossString: isHybrid ? crossString : null,
      mainTension,
      crossTension: isHybrid ? crossTension : null,
      rating: currentRating,
      createdAt: new Date().toISOString(),
    };

    setSavedConfigurations([...savedConfigurations, newConfig]);
    alert('Configuration sauvegardée avec succès !');

    // Reset form
    setConfigName('');
    setCurrentRating(0);
  };

  const handleLoadConfiguration = (configId: string) => {
    const config = savedConfigurations.find(c => c.id === configId);
    if (!config) return;

    setConfigName(config.name);
    setRacquet(config.racquet);
    setMainString(config.mainString);
    setMainTension(config.mainTension);

    if (config.crossString) {
      setIsHybrid(true);
      setCrossString(config.crossString);
      setCrossTension(config.crossTension || 53);
    } else {
      setIsHybrid(false);
    }

    setCurrentRating(config.rating);
    alert('Configuration chargée avec succès !');
  };

  const handleDeleteConfiguration = (configId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette configuration ?')) {
      setSavedConfigurations(savedConfigurations.filter(c => c.id !== configId));
    }
  };

  const renderStars = (rating: number, isInteractive: boolean = false) => {
    return (
      <div className={`flex ${isInteractive ? 'cursor-pointer' : ''}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-2xl mx-0.5 transition-colors ${
              (isInteractive ? (hoverRating || currentRating) : rating) >= star
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
            onMouseEnter={isInteractive ? () => setHoverRating(star) : undefined}
            onMouseLeave={isInteractive ? () => setHoverRating(0) : undefined}
            onClick={isInteractive ? () => setCurrentRating(star) : undefined}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Configurateur de Setup avec Système de Rating
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Créez, sauvegardez et évaluez vos configurations préférées
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Configuration de Setup
            </h3>

            {/* Configuration Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la Configuration
              </label>
              <input
                type="text"
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
                placeholder="Ex: Ma config tournoi 2024"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Racquet Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎾 Choisir une Raquette
              </label>
              <select
                value={racquet}
                onChange={(e) => setRacquet(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Sélectionnez votre raquette</option>
                <optgroup label="🔥 Raquettes Populaires">
                  <option value="babolat-pure-drive">Babolat Pure Drive (300g, 100in²)</option>
                  <option value="wilson-clash-100">Wilson Clash 100 (295g, 100in²)</option>
                  <option value="head-speed-mp">Head Speed MP (300g, 100in²)</option>
                </optgroup>
                <optgroup label="⚡ Raquettes Puissance">
                  <option value="babolat-pure-aero">Babolat Pure Aero (300g, 100in²)</option>
                  <option value="wilson-ultra-100">Wilson Ultra 100 (300g, 100in²)</option>
                </optgroup>
                <optgroup label="🎯 Raquettes Contrôle">
                  <option value="wilson-pro-staff-rf97">Wilson Pro Staff RF97 (340g, 97in²)</option>
                  <option value="wilson-blade-98">Wilson Blade 98 (305g, 98in²)</option>
                </optgroup>
              </select>
            </div>

            {/* Hybrid Toggle */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Configuration Hybride</span>
                <button
                  onClick={() => setIsHybrid(!isHybrid)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isHybrid
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {isHybrid ? '🎾 Standard' : '💡 Hybride'}
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {isHybrid
                  ? 'Configuration hybride avec cordages différents'
                  : 'Configuration standard avec un seul type de cordage'}
              </p>
            </div>

            {/* Main String */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🧵 Cordage Principal
              </label>
              <select
                value={mainString}
                onChange={(e) => setMainString(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Sélectionnez votre cordage</option>
                <optgroup label="🥇 Polyester">
                  <option value="luxilon-alu-power">Luxilon ALU Power 1.25mm</option>
                  <option value="babolat-rpm-blast">Babolat RPM Blast 1.25mm</option>
                </optgroup>
                <optgroup label="💪 Multifilament">
                  <option value="wilson-nxt">Wilson NXT 1.30mm</option>
                  <option value="technifibre-xcel">Technifibre X-One Biphase 1.30mm</option>
                </optgroup>
              </select>
            </div>

            {/* Cross String (if hybrid) */}
            {isHybrid && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🧵 Cordage Croisé
                </label>
                <select
                  value={crossString}
                  onChange={(e) => setCrossString(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez votre cordage croisé</option>
                  <optgroup label="🥇 Polyester">
                    <option value="luxilon-alu-power-cross">Luxilon ALU Power 1.25mm</option>
                    <option value="babolat-rpm-blast-cross">Babolat RPM Blast 1.25mm</option>
                  </optgroup>
                  <optgroup label="💪 Multifilament">
                    <option value="wilson-nxt-cross">Wilson NXT 1.30mm</option>
                  </optgroup>
                </select>
              </div>
            )}

            {/* Main Tension */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⚖️ Tension Principale: {mainTension} lbs
              </label>
              <input
                type="range"
                min="40"
                max="70"
                value={mainTension}
                onChange={(e) => setMainTension(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Cross Tension (if hybrid) */}
            {isHybrid && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⚖️ Tension Croisée: {crossTension} lbs
                </label>
                <input
                  type="range"
                  min="40"
                  max="70"
                  value={crossTension}
                  onChange={(e) => setCrossTension(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {/* Rating */}
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-gray-900 mb-3">⭐ Évaluer cette configuration</h4>
              {renderStars(0, true)}
              <p className="text-xs text-gray-600 mt-2">
                Cliquez pour noter cette configuration
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSaveConfiguration}
                className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                💾 Sauvegarder Cette Configuration
              </button>
              <button className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                🎯 Analyser Cette Configuration
              </button>
            </div>
          </div>

          {/* Saved Configurations */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Configurations Sauvegardées
            </h3>

            {savedConfigurations.length === 0 ? (
              <p className="text-gray-500 text-center py-12">
                Aucune configuration sauvegardée pour le moment
              </p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {savedConfigurations
                  .sort((a, b) => b.rating - a.rating)
                  .map((config) => (
                    <div
                      key={config.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{config.name}</h4>
                        {renderStars(config.rating)}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>Raquette:</strong> {config.racquet.replace(/-/g, ' ')}
                        </p>
                        <p>
                          <strong>Cordage:</strong> {config.mainString.replace(/-/g, ' ')}
                        </p>
                        {config.crossString && (
                          <p>
                            <strong>Cordage croisé:</strong> {config.crossString.replace(/-/g, ' ')}
                          </p>
                        )}
                        <p>
                          <strong>Tension:</strong> {config.mainTension} lbs
                          {config.crossTension && ` / ${config.crossTension} lbs`}
                        </p>
                        <p className="text-xs text-gray-400">
                          Sauvegardé le: {new Date(config.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleLoadConfiguration(config.id)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                        >
                          Charger
                        </button>
                        <button
                          onClick={() => handleDeleteConfiguration(config.id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}