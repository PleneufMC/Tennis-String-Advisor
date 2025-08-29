'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Lock } from 'lucide-react';

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
  });

  const [journalData, setJournalData] = useState({
    isPremium: true,
    hasAccess: false,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-green-600">
      {/* Header */}
      <div className="text-center py-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Tennis String Advisor Premium</h1>
        <p className="text-green-100">Système avancé avec journal de cordage professionnel</p>
        <button className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-full text-sm font-medium transition-colors">
          Version Gratuite
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Configuration */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-2">⚙️</span>
              Configuration et Analyse de Confort
            </h2>

            {/* Nom de la Configuration */}
            <div className="mb-6">
              <div 
                className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => toggleSection('config')}
              >
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">📝</span>
                  <span className="font-medium">Nom de la Configuration</span>
                </div>
                {expandedSections.config ? <ChevronUp /> : <ChevronDown />}
              </div>
              {expandedSections.config && (
                <div className="mt-3 px-3">
                  <input
                    type="text"
                    placeholder="Ex: Setup Tournoi 2025"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.configName}
                    onChange={(e) => handleInputChange('configName', e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Choisir une Raquette */}
            <div className="mb-6">
              <div 
                className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => toggleSection('racquet')}
              >
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">🎾</span>
                  <span className="font-medium">Choisir une Raquette</span>
                </div>
                <ChevronDown />
              </div>
            </div>

            {/* Cordage Principal */}
            <div className="mb-6">
              <div 
                className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => toggleSection('principal')}
              >
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">🎯</span>
                  <span className="font-medium">Cordage Principal</span>
                </div>
                {expandedSections.principal ? <ChevronUp /> : <ChevronDown />}
              </div>
              {expandedSections.principal && (
                <div className="mt-3 px-3 space-y-3">
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.mainString}
                    onChange={(e) => handleInputChange('mainString', e.target.value)}
                  >
                    <option value="">Sélectionner votre cordage</option>
                    <option value="babolat-rpm">Babolat RPM Blast</option>
                    <option value="luxilon-alu">Luxilon ALU Power</option>
                    <option value="wilson-nxt">Wilson NXT</option>
                  </select>
                </div>
              )}
            </div>

            {/* Jauge du Calibre */}
            <div className="mb-6">
              <div 
                className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => toggleSection('caliber')}
              >
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">📏</span>
                  <span className="font-medium">Jauge du Calibre</span>
                </div>
                {expandedSections.caliber ? <ChevronUp /> : <ChevronDown />}
              </div>
              {expandedSections.caliber && (
                <div className="mt-3 px-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Principal</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={formData.mainGauge}
                      onChange={(e) => handleInputChange('mainGauge', e.target.value)}
                    >
                      <option value="16 (1.30mm)">16 (1.30mm) - Standard</option>
                      <option value="17 (1.25mm)">17 (1.25mm)</option>
                      <option value="18 (1.20mm)">18 (1.20mm)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Travers</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
            <div className="mb-6">
              <div 
                className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => toggleSection('tension')}
              >
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">⚡</span>
                  <span className="font-medium">Tension 23 kg</span>
                </div>
                {expandedSections.tension ? <ChevronUp /> : <ChevronDown />}
              </div>
              {expandedSections.tension && (
                <div className="mt-3 px-3">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm text-gray-600">Principal</label>
                        <span className="text-sm font-medium">{formData.mainTension} kg</span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max="35"
                        value={formData.mainTension}
                        onChange={(e) => handleInputChange('mainTension', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>15 kg</span>
                        <span>35 kg</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm text-gray-600">Travers</label>
                        <span className="text-sm font-medium">{formData.crossTension} kg</span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max="35"
                        value={formData.crossTension}
                        onChange={(e) => handleInputChange('crossTension', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>15 kg</span>
                        <span>35 kg</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Évaluer votre expérience */}
            <div className="mb-6">
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-yellow-600 mr-2">⭐</span>
                <span className="font-medium text-gray-700">Évaluer votre expérience</span>
              </div>
              <div className="mt-3 px-3">
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="text-2xl text-gray-300 hover:text-yellow-400 transition-colors"
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Votre personnelle de satisfaction</p>
              </div>
            </div>

            {/* Notes personnelles */}
            <div className="mb-6">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 mr-2">📝</span>
                <span className="font-medium">Notes personnelles</span>
              </div>
              <div className="mt-3 px-3">
                <textarea
                  placeholder="Sensations, conditions de jeu, météo..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-24 resize-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center">
                <span className="mr-2">💾</span>
                Analyser le Confort
              </button>
              <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center">
                <span className="mr-2">📊</span>
                Enregistrer dans le Journal
              </button>
            </div>
          </div>

          {/* Right Column - Journal de Cordage */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-2">📚</span>
              Journal de Cordage
              <span className="ml-auto text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">PREMIUM</span>
            </h2>

            {/* Premium Feature Box */}
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Fonctionnalité Premium
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Le journal de cordage complet est réservé aux membres Premium.
              </p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li>✓ Historique illimité de configurations</li>
                <li>✓ Suivi des performances dans le temps</li>
                <li>✓ Statistiques et analyses avancées</li>
                <li>✓ Export PDF de vos données</li>
                <li>✓ Rappels de reordage</li>
              </ul>
              <button className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors">
                Débloquer le Journal Premium
              </button>
            </div>

            {/* Configuration Preview */}
            <div className="border-2 border-gray-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Configuration Tolouse</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Raquette Pure Drive × ATP Blend</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Luxilon ALU 125 / ALU Power × × × × ×</span>
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <span>Score Global: 8.75 /10</span>
                </div>
              </div>
            </div>

            {/* RCS Box */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Recommandations Confort (RCS)
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Confort Bras:</span>
                    <span className="font-medium">Moyen calcul × tension haute (RCS = 20)</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Puissance Potentielle:</span>
                    <span className="font-medium">× tension basse × (RCS 20-24)</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Contrôle:</span>
                    <span className="font-medium">Polyester × tension haute (RCS 25-30)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tennis Elbow:</span>
                    <span className="font-medium">Éviter RCS × 30, configurations extrêmes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">24</div>
                <div className="text-xs text-gray-500">Configurations sauvées</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">8.5</div>
                <div className="text-xs text-gray-500">Score moyen</div>
              </div>
            </div>

            {/* Recent Configurations */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Configurations récentes</h4>
              <div className="space-y-2">
                {['Configuration Tolouse', 'Setup Tournoi 2024', 'Test Hybrid'].map((config, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <span className="text-sm">{config}</span>
                    <span className="text-xs text-gray-500">⭐ {8.5 - idx * 0.5}/10</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}