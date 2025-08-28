const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3007;

// Store configurations in memory
let configurations = [];
let nextId = 1;

// Base de données complète des cordages (Top 50)
const CORDAGES_DATABASE = [
  { name: "Luxilon ALU Power", type: "polyester", rigidite: 230, rc_base: 58, fc_type: 1.15, controle: 9.5, confort_base: 7.0, prix: 20 },
  { name: "Solinco Hyper-G", type: "polyester", rigidite: 218, rc_base: 52, fc_type: 1.05, controle: 9.0, confort_base: 8.5, prix: 18 },
  { name: "Babolat RPM Blast", type: "polyester", rigidite: 240, rc_base: 58, fc_type: 1.15, controle: 9.0, confort_base: 7.5, prix: 19 },
  { name: "Luxilon 4G", type: "polyester", rigidite: 265, rc_base: 65, fc_type: 1.25, controle: 10.0, confort_base: 7.0, prix: 22 },
  { name: "Head Lynx Tour", type: "polyester", rigidite: 210, rc_base: 52, fc_type: 1.05, controle: 9.0, confort_base: 8.0, prix: 17 },
  { name: "Solinco Tour Bite", type: "polyester", rigidite: 255, rc_base: 65, fc_type: 1.25, controle: 10.0, confort_base: 6.5, prix: 19 },
  { name: "Babolat VS Touch", type: "boyau", rigidite: 95, rc_base: 35, fc_type: 0.75, controle: 8.0, confort_base: 9.5, prix: 48 },
  { name: "Wilson Natural Gut", type: "boyau", rigidite: 100, rc_base: 35, fc_type: 0.80, controle: 7.5, confort_base: 9.0, prix: 45 },
  { name: "Solinco Mach-10", type: "polyester", rigidite: 195, rc_base: 52, fc_type: 1.05, controle: 8.5, confort_base: 8.0, prix: 65 },
  { name: "MSV Focus Hex", type: "polyester", rigidite: 235, rc_base: 58, fc_type: 1.15, controle: 9.5, confort_base: 7.0, prix: 15 },
  { name: "Tecnifibre X-One Biphase", type: "multifilament", rigidite: 160, rc_base: 42, fc_type: 0.85, controle: 7.0, confort_base: 8.5, prix: 25 },
  { name: "Head Reflex MLT", type: "multifilament", rigidite: 170, rc_base: 45, fc_type: 0.90, controle: 7.0, confort_base: 8.5, prix: 22 },
  { name: "Yonex Poly Tour Pro", type: "polyester", rigidite: 220, rc_base: 58, fc_type: 1.15, controle: 8.5, confort_base: 7.5, prix: 18 },
  { name: "Kirschbaum Pro Line Evolution", type: "polyester", rigidite: 225, rc_base: 58, fc_type: 1.15, controle: 8.5, confort_base: 7.0, prix: 14 },
  { name: "Signum Pro X-Perience", type: "polyester", rigidite: 205, rc_base: 52, fc_type: 1.05, controle: 9.0, confort_base: 8.0, prix: 13 },
  { name: "Wilson NXT Soft", type: "multifilament", rigidite: 155, rc_base: 42, fc_type: 0.85, controle: 6.5, confort_base: 9.0, prix: 24 },
  { name: "Luxilon Element", type: "multi-mono", rigidite: 190, rc_base: 45, fc_type: 0.90, controle: 8.0, confort_base: 8.5, prix: 20 },
  { name: "Solinco Confidential", type: "polyester", rigidite: 245, rc_base: 65, fc_type: 1.25, controle: 9.5, confort_base: 7.5, prix: 18 },
  { name: "Head Hawk Touch", type: "polyester", rigidite: 215, rc_base: 52, fc_type: 1.05, controle: 9.0, confort_base: 7.0, prix: 17 },
  { name: "Tecnifibre Black Code 4S", type: "polyester", rigidite: 200, rc_base: 52, fc_type: 1.05, controle: 8.5, confort_base: 7.5, prix: 19 },
  { name: "Weiss Cannon Ultra Cable", type: "polyester", rigidite: 250, rc_base: 65, fc_type: 1.25, controle: 8.0, confort_base: 6.5, prix: 16 },
  { name: "Gamma Ocho", type: "polyester", rigidite: 210, rc_base: 52, fc_type: 1.05, controle: 8.5, confort_base: 7.0, prix: 15 },
  { name: "Volkl Cyclone", type: "polyester", rigidite: 230, rc_base: 58, fc_type: 1.15, controle: 8.5, confort_base: 6.5, prix: 14 },
  { name: "Toroline Wasabi", type: "polyester", rigidite: 185, rc_base: 52, fc_type: 1.05, controle: 8.0, confort_base: 7.5, prix: 25 },
  { name: "Isospeed Cream", type: "polyester", rigidite: 165, rc_base: 52, fc_type: 1.05, controle: 8.0, confort_base: 9.5, prix: 18 },
  { name: "Polyfibre TCS", type: "polyester", rigidite: 220, rc_base: 58, fc_type: 1.15, controle: 8.5, confort_base: 7.5, prix: 16 },
  { name: "Tecnifibre TGV", type: "multifilament", rigidite: 145, rc_base: 42, fc_type: 0.85, controle: 6.5, confort_base: 9.5, prix: 26 },
  { name: "Wilson NXT Power", type: "multifilament", rigidite: 165, rc_base: 45, fc_type: 0.90, controle: 6.5, confort_base: 8.0, prix: 23 },
  { name: "Head Velocity MLT", type: "multifilament", rigidite: 175, rc_base: 45, fc_type: 0.90, controle: 6.0, confort_base: 8.5, prix: 20 },
  { name: "Dunlop Iconic All", type: "multifilament", rigidite: 170, rc_base: 45, fc_type: 0.90, controle: 7.0, confort_base: 8.0, prix: 18 },
  { name: "Prince Synthetic Gut Duraflex", type: "synthetique", rigidite: 185, rc_base: 48, fc_type: 0.95, controle: 6.5, confort_base: 7.5, prix: 12 },
  { name: "Gosen Polylon", type: "polyester", rigidite: 240, rc_base: 58, fc_type: 1.15, controle: 9.0, confort_base: 6.0, prix: 11 },
  { name: "Yonex Polytour Air", type: "polyester", rigidite: 180, rc_base: 52, fc_type: 1.05, controle: 8.0, confort_base: 8.5, prix: 17 },
  { name: "Tecnifibre Multifeel", type: "multifilament", rigidite: 170, rc_base: 45, fc_type: 0.90, controle: 6.5, confort_base: 8.0, prix: 19 },
  { name: "MSV Swift", type: "polyester", rigidite: 175, rc_base: 52, fc_type: 1.05, controle: 8.0, confort_base: 8.5, prix: 14 },
  { name: "Toroline Caviar", type: "polyester", rigidite: 200, rc_base: 52, fc_type: 1.05, controle: 8.5, confort_base: 7.0, prix: 24 },
  { name: "Wilson Revolve", type: "polyester", rigidite: 205, rc_base: 52, fc_type: 1.05, controle: 8.0, confort_base: 7.0, prix: 16 },
  { name: "Luxilon Eco Power", type: "polyester", rigidite: 225, rc_base: 58, fc_type: 1.15, controle: 7.5, confort_base: 6.5, prix: 55 },
  { name: "Head RIP Control", type: "multifilament", rigidite: 180, rc_base: 45, fc_type: 0.90, controle: 7.5, confort_base: 7.0, prix: 21 },
  { name: "Solinco Hyper-G Soft", type: "polyester", rigidite: 172, rc_base: 52, fc_type: 1.05, controle: 8.5, confort_base: 8.5, prix: 18 },
  { name: "Velociti Catalyst", type: "biodegradable", rigidite: 190, rc_base: 48, fc_type: 1.00, controle: 7.0, confort_base: 8.0, prix: 50 },
  { name: "Kirschbaum Black Shark", type: "polyester", rigidite: 235, rc_base: 58, fc_type: 1.15, controle: 8.5, confort_base: 6.5, prix: 13 },
  { name: "ReString Zero", type: "polyester", rigidite: 215, rc_base: 52, fc_type: 1.05, controle: 8.0, confort_base: 7.0, prix: 58 },
  { name: "Gamma AMP", type: "polyester", rigidite: 220, rc_base: 58, fc_type: 1.15, controle: 8.0, confort_base: 6.5, prix: 15 },
  { name: "Tecnifibre Triax", type: "multifilament", rigidite: 165, rc_base: 42, fc_type: 0.85, controle: 7.5, confort_base: 8.5, prix: 24 },
  { name: "Polyfibre Hexablade", type: "polyester", rigidite: 240, rc_base: 58, fc_type: 1.15, controle: 8.5, confort_base: 6.5, prix: 17 },
  { name: "Head Hawk Power", type: "polyester", rigidite: 225, rc_base: 58, fc_type: 1.15, controle: 7.5, confort_base: 6.5, prix: 16 },
  { name: "MSV Focus Hex Plus", type: "polyester", rigidite: 240, rc_base: 58, fc_type: 1.15, controle: 8.5, confort_base: 7.5, prix: 16 },
  { name: "Weiss Cannon Silverstring", type: "polyester", rigidite: 250, rc_base: 65, fc_type: 1.25, controle: 8.0, confort_base: 6.0, prix: 14 }
];

// Base de données des raquettes avec leur rigidité RA
const RAQUETTES_DATABASE = [
  // Babolat
  { name: "Babolat Pure Drive", ra: 72, weight: "300g", headSize: "100in²", type: "puissance" },
  { name: "Babolat Pure Aero", ra: 67, weight: "300g", headSize: "100in²", type: "puissance" },
  { name: "Babolat Pure Strike", ra: 66, weight: "305g", headSize: "98in²", type: "controle" },
  { name: "Babolat Pure Drive Tour", ra: 68, weight: "315g", headSize: "100in²", type: "controle" },
  { name: "Babolat Pure Aero Tour", ra: 65, weight: "315g", headSize: "100in²", type: "controle" },
  
  // Head
  { name: "Head Speed MP", ra: 60, weight: "300g", headSize: "100in²", type: "polyvalent" },
  { name: "Head Speed Pro", ra: 62, weight: "310g", headSize: "100in²", type: "controle" },
  { name: "Head Radical MP", ra: 64, weight: "295g", headSize: "98in²", type: "polyvalent" },
  { name: "Head Prestige MP", ra: 62, weight: "320g", headSize: "98in²", type: "controle" },
  { name: "Head Gravity MP", ra: 63, weight: "295g", headSize: "100in²", type: "polyvalent" },
  { name: "Head Extreme MP", ra: 68, weight: "300g", headSize: "100in²", type: "puissance" },
  { name: "Head Boom MP", ra: 68, weight: "295g", headSize: "100in²", type: "puissance" },
  
  // Wilson
  { name: "Wilson Clash 100", ra: 54, weight: "295g", headSize: "100in²", type: "confort" },
  { name: "Wilson Clash 98", ra: 55, weight: "305g", headSize: "98in²", type: "confort" },
  { name: "Wilson Pro Staff RF97", ra: 68, weight: "340g", headSize: "97in²", type: "controle" },
  { name: "Wilson Pro Staff 97", ra: 66, weight: "315g", headSize: "97in²", type: "controle" },
  { name: "Wilson Blade 98", ra: 62, weight: "305g", headSize: "98in²", type: "polyvalent" },
  { name: "Wilson Ultra 100", ra: 68, weight: "300g", headSize: "100in²", type: "puissance" },
  { name: "Wilson Burn 100", ra: 73, weight: "300g", headSize: "100in²", type: "puissance" },
  
  // Yonex
  { name: "Yonex Ezone 100", ra: 65, weight: "300g", headSize: "100in²", type: "polyvalent" },
  { name: "Yonex Ezone 98", ra: 64, weight: "305g", headSize: "98in²", type: "polyvalent" },
  { name: "Yonex VCore 100", ra: 66, weight: "300g", headSize: "100in²", type: "puissance" },
  { name: "Yonex VCore 98", ra: 64, weight: "305g", headSize: "98in²", type: "controle" },
  { name: "Yonex VCore Pro 100", ra: 62, weight: "310g", headSize: "100in²", type: "controle" },
  
  // Technifibre
  { name: "Technifibre TFight 315", ra: 65, weight: "315g", headSize: "98in²", type: "controle" },
  { name: "Technifibre TFight 300", ra: 66, weight: "300g", headSize: "98in²", type: "polyvalent" },
  { name: "Technifibre TF40 315", ra: 66, weight: "315g", headSize: "98in²", type: "controle" },
  { name: "Technifibre Tempo 298", ra: 68, weight: "298g", headSize: "100in²", type: "polyvalent" }
];

// Fonction pour calculer la rigidité composite selon la formule
function calculateRCS(ra_raquette, cordage, tension_kg, jauge = "16") {
  // Facteur jauge
  const fc_jauge = {
    "15L": 0.95,
    "16": 1.00,
    "16L": 1.05,
    "17": 1.10,
    "18": 1.15
  }[jauge] || 1.00;
  
  // Rigidité cordage ajustée
  const rc = cordage.rc_base * cordage.fc_type * fc_jauge;
  
  // Facteur tension
  const tension_reference = 23;
  const ft = 1 + (tension_kg - tension_reference) * 0.015;
  
  // Calcul RCS
  const rcs = (ra_raquette * rc * ft) / (ra_raquette + rc) * 0.85;
  
  return rcs;
}

// Fonction pour convertir RCS en note de confort
function rcsToComfortScore(rcs) {
  let score = 10 - (rcs - 40) * 0.15;
  score = Math.max(1, Math.min(10, score));
  return Math.round(score * 10) / 10;
}

// Fonction pour générer les commentaires selon le confort
function getComfortComment(comfortScore) {
  if (comfortScore >= 9) {
    return "Confort exceptionnel - Parfait pour les joueurs sensibles au tennis elbow";
  } else if (comfortScore >= 8) {
    return "Très confortable - Excellent pour les sessions longues";
  } else if (comfortScore >= 7) {
    return "Bon confort - Équilibre idéal pour la plupart des joueurs";
  } else if (comfortScore >= 6) {
    return "Confort modéré - Convient aux joueurs sans problème de bras";
  } else if (comfortScore >= 5) {
    return "Assez ferme - Pour joueurs expérimentés recherchant le contrôle";
  } else {
    return "Configuration rigide - Réservé aux experts avec technique parfaite";
  }
}

// HTML content with advanced rating system
const HTML_CONTENT = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tennis String Advisor Pro - Système de Rating avec Calcul de Confort</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .hero-bg {
            background-image: 
                linear-gradient(135deg, rgba(34, 197, 94, 0.85) 0%, rgba(22, 163, 74, 0.75) 50%, rgba(34, 197, 94, 0.85) 100%),
                url('https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2000&auto=format&fit=crop');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
        }
        .star-rating {
            display: inline-flex;
            cursor: pointer;
            font-size: 24px;
        }
        .star-rating .star {
            color: #ddd;
            transition: color 0.2s;
            margin: 0 2px;
        }
        .star-rating .star:hover,
        .star-rating .star.active {
            color: #ffd700;
        }
        .star-rating .star.filled {
            color: #ffd700;
        }
        .comfort-meter {
            height: 20px;
            border-radius: 10px;
            background: linear-gradient(90deg, #ef4444 0%, #f59e0b 30%, #eab308 50%, #84cc16 70%, #22c55e 100%);
            position: relative;
        }
        .comfort-indicator {
            position: absolute;
            top: -5px;
            width: 30px;
            height: 30px;
            background: white;
            border: 3px solid #333;
            border-radius: 50%;
            transform: translateX(-50%);
        }
        .saved-config-item {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 12px;
            transition: all 0.2s;
        }
        .saved-config-item:hover {
            border-color: #22c55e;
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
        }
    </style>
</head>
<body class="font-sans antialiased bg-white">
    <section class="relative min-h-screen hero-bg">
        <div class="absolute inset-0 bg-black/40"></div>
        
        <div class="relative container mx-auto px-6 py-12">
            <div class="text-center text-white mb-8">
                <h1 class="text-4xl md:text-5xl font-bold mb-4">
                    Tennis String Advisor Pro
                </h1>
                <p class="text-xl">
                    Système avancé de rating avec calcul de confort selon la formule de rigidité composite
                </p>
            </div>

            <div class="grid lg:grid-cols-2 gap-8">
                <!-- Configuration Form -->
                <div class="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">
                        Configuration et Analyse de Confort
                    </h3>
                    
                    <!-- Configuration Name -->
                    <div class="mb-4">
                        <label class="block text-sm font-bold text-gray-800 mb-2">📝 Nom de la Configuration</label>
                        <input type="text" id="config-name" placeholder="Ex: Setup Tournoi 2025" 
                               class="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500">
                    </div>
                    
                    <!-- Raquette Selection -->
                    <div class="mb-4">
                        <label class="block text-sm font-bold text-gray-800 mb-2">🎾 Choisir une Raquette</label>
                        <select id="racquet-select" class="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value="">Sélectionnez votre raquette</option>
                            ${RAQUETTES_DATABASE.map(r => 
                                `<option value="${r.name}" data-ra="${r.ra}">${r.name} (RA: ${r.ra}, ${r.weight}, ${r.headSize})</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <!-- Cordage Selection -->
                    <div class="mb-4">
                        <label class="block text-sm font-bold text-gray-800 mb-2">🧵 Cordage Principal</label>
                        <select id="main-string-select" class="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value="">Sélectionnez votre cordage</option>
                            <optgroup label="🥇 Polyester Premium">
                                ${CORDAGES_DATABASE.filter(c => c.type === 'polyester' && c.prix >= 18).map(c => 
                                    `<option value="${c.name}" data-cordage='${JSON.stringify(c)}'>${c.name} (${c.prix}€)</option>`
                                ).join('')}
                            </optgroup>
                            <optgroup label="💪 Polyester Budget">
                                ${CORDAGES_DATABASE.filter(c => c.type === 'polyester' && c.prix < 18).map(c => 
                                    `<option value="${c.name}" data-cordage='${JSON.stringify(c)}'>${c.name} (${c.prix}€)</option>`
                                ).join('')}
                            </optgroup>
                            <optgroup label="💎 Multifilament">
                                ${CORDAGES_DATABASE.filter(c => c.type === 'multifilament').map(c => 
                                    `<option value="${c.name}" data-cordage='${JSON.stringify(c)}'>${c.name} (${c.prix}€)</option>`
                                ).join('')}
                            </optgroup>
                            <optgroup label="👑 Boyau Naturel">
                                ${CORDAGES_DATABASE.filter(c => c.type === 'boyau').map(c => 
                                    `<option value="${c.name}" data-cordage='${JSON.stringify(c)}'>${c.name} (${c.prix}€)</option>`
                                ).join('')}
                            </optgroup>
                            <optgroup label="🌱 Autres">
                                ${CORDAGES_DATABASE.filter(c => !['polyester', 'multifilament', 'boyau'].includes(c.type)).map(c => 
                                    `<option value="${c.name}" data-cordage='${JSON.stringify(c)}'>${c.name} (${c.prix}€)</option>`
                                ).join('')}
                            </optgroup>
                        </select>
                    </div>
                    
                    <!-- Jauge Selection -->
                    <div class="mb-4">
                        <label class="block text-sm font-bold text-gray-800 mb-2">📏 Jauge du Cordage</label>
                        <select id="jauge-select" class="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value="15L">15L (1.38mm) - Plus de puissance</option>
                            <option value="16" selected>16 (1.30mm) - Standard</option>
                            <option value="16L">16L (1.25mm) - Plus de contrôle</option>
                            <option value="17">17 (1.24mm) - Plus de sensation</option>
                            <option value="18">18 (1.20mm) - Maximum de sensation</option>
                        </select>
                    </div>
                    
                    <!-- Tension -->
                    <div class="mb-4">
                        <label class="block text-sm font-bold text-gray-800 mb-2">⚖️ Tension: <span id="tension-value">23</span> kg</label>
                        <input type="range" id="main-tension" min="18" max="30" value="23" 
                               class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                        <div class="flex justify-between text-xs text-gray-600 mt-1">
                            <span>18 kg</span>
                            <span>24 kg</span>
                            <span>30 kg</span>
                        </div>
                    </div>
                    
                    <!-- Comfort Analysis Results -->
                    <div id="comfort-analysis" class="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4" style="display: none;">
                        <h4 class="font-bold text-blue-900 mb-2">📊 Analyse de Confort</h4>
                        <div class="space-y-2">
                            <div>
                                <span class="font-semibold">RCS (Rigidité Composite):</span>
                                <span id="rcs-value" class="font-bold text-blue-600"></span>
                            </div>
                            <div>
                                <span class="font-semibold">Note de Confort:</span>
                                <span id="comfort-score" class="text-2xl font-bold text-green-600"></span>
                            </div>
                            <div class="comfort-meter">
                                <div id="comfort-indicator" class="comfort-indicator"></div>
                            </div>
                            <p id="comfort-comment" class="text-sm text-gray-700 italic mt-2"></p>
                        </div>
                    </div>
                    
                    <!-- Rating -->
                    <div class="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <h4 class="font-medium text-gray-900 mb-2">⭐ Évaluer cette configuration</h4>
                        <div class="star-rating" id="star-rating">
                            <span class="star" data-rating="1">★</span>
                            <span class="star" data-rating="2">★</span>
                            <span class="star" data-rating="3">★</span>
                            <span class="star" data-rating="4">★</span>
                            <span class="star" data-rating="5">★</span>
                        </div>
                        <p class="text-xs text-gray-600 mt-2">Note personnelle de satisfaction</p>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="space-y-2">
                        <button id="analyze-btn" class="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                            📊 Analyser le Confort
                        </button>
                        <button id="save-config-btn" class="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                            💾 Sauvegarder Configuration
                        </button>
                    </div>
                </div>
                
                <!-- Saved Configurations -->
                <div class="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl max-h-[800px] overflow-y-auto">
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">
                        Configurations Sauvegardées
                    </h3>
                    
                    <div id="saved-configs-list">
                        <p class="text-gray-500 text-center py-8">Aucune configuration sauvegardée</p>
                    </div>
                    
                    <!-- Recommendations -->
                    <div class="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                        <h4 class="font-bold text-green-900 mb-2">💡 Recommandations Confort</h4>
                        <ul class="text-sm text-green-800 space-y-1">
                            <li>• <strong>Confort max:</strong> Boyau naturel + tension basse</li>
                            <li>• <strong>Équilibré:</strong> Multifilament + tension moyenne</li>
                            <li>• <strong>Contrôle:</strong> Polyester + tension haute</li>
                            <li>• <strong>Tennis elbow:</strong> RCS < 50 recommandé</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <script>
        // Base de données des cordages
        const cordagesDB = ${JSON.stringify(CORDAGES_DATABASE)};
        
        let currentRating = 0;
        let savedConfigurations = [];
        let currentRCS = null;
        let currentComfortScore = null;
        
        // Load saved configurations
        function loadSavedConfigurations() {
            const saved = localStorage.getItem('tennisConfigurationsAdvanced');
            if (saved) {
                savedConfigurations = JSON.parse(saved);
                updateSavedConfigsList();
            }
        }
        
        // Calculate RCS
        function calculateRCS(ra_raquette, cordage, tension_kg, jauge) {
            const fc_jauge = {
                "15L": 0.95,
                "16": 1.00,
                "16L": 1.05,
                "17": 1.10,
                "18": 1.15
            }[jauge] || 1.00;
            
            const rc = cordage.rc_base * cordage.fc_type * fc_jauge;
            const tension_reference = 23;
            const ft = 1 + (tension_kg - tension_reference) * 0.015;
            const rcs = (ra_raquette * rc * ft) / (ra_raquette + rc) * 0.85;
            
            return rcs;
        }
        
        // Convert RCS to comfort score
        function rcsToComfortScore(rcs) {
            let score = 10 - (rcs - 40) * 0.15;
            score = Math.max(1, Math.min(10, score));
            return Math.round(score * 10) / 10;
        }
        
        // Get comfort comment
        function getComfortComment(comfortScore) {
            if (comfortScore >= 9) {
                return "Confort exceptionnel - Parfait pour les joueurs sensibles au tennis elbow";
            } else if (comfortScore >= 8) {
                return "Très confortable - Excellent pour les sessions longues";
            } else if (comfortScore >= 7) {
                return "Bon confort - Équilibre idéal pour la plupart des joueurs";
            } else if (comfortScore >= 6) {
                return "Confort modéré - Convient aux joueurs sans problème de bras";
            } else if (comfortScore >= 5) {
                return "Assez ferme - Pour joueurs expérimentés recherchant le contrôle";
            } else {
                return "Configuration rigide - Réservé aux experts avec technique parfaite";
            }
        }
        
        // Analyze comfort
        document.getElementById('analyze-btn').addEventListener('click', function() {
            const racquetSelect = document.getElementById('racquet-select');
            const stringSelect = document.getElementById('main-string-select');
            const jaugeSelect = document.getElementById('jauge-select');
            const tension = parseInt(document.getElementById('main-tension').value);
            
            if (!racquetSelect.value || !stringSelect.value) {
                alert('Veuillez sélectionner une raquette et un cordage');
                return;
            }
            
            const ra = parseInt(racquetSelect.options[racquetSelect.selectedIndex].dataset.ra);
            const cordage = JSON.parse(stringSelect.options[stringSelect.selectedIndex].dataset.cordage);
            const jauge = jaugeSelect.value;
            
            currentRCS = calculateRCS(ra, cordage, tension, jauge);
            currentComfortScore = rcsToComfortScore(currentRCS);
            
            // Update display
            document.getElementById('rcs-value').textContent = currentRCS.toFixed(1);
            document.getElementById('comfort-score').textContent = currentComfortScore + '/10';
            document.getElementById('comfort-comment').textContent = getComfortComment(currentComfortScore);
            
            // Update comfort meter
            const indicator = document.getElementById('comfort-indicator');
            const position = ((currentComfortScore - 1) / 9) * 100;
            indicator.style.left = position + '%';
            
            document.getElementById('comfort-analysis').style.display = 'block';
        });
        
        // Update saved configurations display
        function updateSavedConfigsList() {
            const listContainer = document.getElementById('saved-configs-list');
            
            if (savedConfigurations.length === 0) {
                listContainer.innerHTML = '<p class="text-gray-500 text-center py-8">Aucune configuration sauvegardée</p>';
                return;
            }
            
            const sortedConfigs = [...savedConfigurations].sort((a, b) => b.comfortScore - a.comfortScore);
            
            listContainer.innerHTML = sortedConfigs.map(config => {
                const stars = '★'.repeat(config.rating) + '☆'.repeat(5 - config.rating);
                const comfortColor = config.comfortScore >= 7 ? 'text-green-600' : config.comfortScore >= 5 ? 'text-yellow-600' : 'text-red-600';
                
                return \`
                    <div class="saved-config-item">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="font-bold text-gray-900">\${config.name || 'Sans nom'}</h4>
                            <span class="text-yellow-500">\${stars}</span>
                        </div>
                        <div class="text-sm space-y-1">
                            <p><strong>Raquette:</strong> \${config.racquet}</p>
                            <p><strong>Cordage:</strong> \${config.mainString}</p>
                            <p><strong>Jauge:</strong> \${config.jauge} | <strong>Tension:</strong> \${config.tension} kg</p>
                            <div class="flex items-center gap-2">
                                <strong>Confort:</strong>
                                <span class="\${comfortColor} font-bold text-lg">\${config.comfortScore}/10</span>
                                <span class="text-xs text-gray-500">(RCS: \${config.rcs.toFixed(1)})</span>
                            </div>
                            <p class="text-xs text-gray-600 italic">\${config.comfortComment}</p>
                        </div>
                        <div class="mt-2 flex gap-2">
                            <button onclick="loadConfiguration('\${config.id}')" class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
                                Charger
                            </button>
                            <button onclick="deleteConfiguration('\${config.id}')" class="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">
                                Supprimer
                            </button>
                        </div>
                    </div>
                \`;
            }).join('');
        }
        
        // Save configuration
        document.getElementById('save-config-btn').addEventListener('click', function() {
            const racquet = document.getElementById('racquet-select').value;
            const mainString = document.getElementById('main-string-select').value;
            const configName = document.getElementById('config-name').value;
            const jauge = document.getElementById('jauge-select').value;
            const tension = document.getElementById('main-tension').value;
            
            if (!racquet || !mainString) {
                alert('Veuillez sélectionner une raquette et un cordage');
                return;
            }
            
            if (currentRating === 0) {
                alert('Veuillez donner une note à cette configuration');
                return;
            }
            
            if (!currentRCS || !currentComfortScore) {
                alert('Veuillez d\\'abord analyser le confort');
                return;
            }
            
            const newConfig = {
                id: Date.now().toString(),
                name: configName || \`Config \${new Date().toLocaleDateString('fr-FR')}\`,
                racquet: racquet,
                mainString: mainString,
                jauge: jauge,
                tension: tension,
                rating: currentRating,
                rcs: currentRCS,
                comfortScore: currentComfortScore,
                comfortComment: getComfortComment(currentComfortScore),
                createdAt: new Date().toISOString()
            };
            
            savedConfigurations.push(newConfig);
            localStorage.setItem('tennisConfigurationsAdvanced', JSON.stringify(savedConfigurations));
            updateSavedConfigsList();
            
            alert('Configuration sauvegardée avec succès !');
            
            // Reset form
            document.getElementById('config-name').value = '';
            currentRating = 0;
            updateStarDisplay();
        });
        
        // Load configuration
        window.loadConfiguration = function(configId) {
            const config = savedConfigurations.find(c => c.id === configId);
            if (!config) return;
            
            document.getElementById('config-name').value = config.name || '';
            document.getElementById('racquet-select').value = config.racquet;
            document.getElementById('main-string-select').value = config.mainString;
            document.getElementById('jauge-select').value = config.jauge;
            document.getElementById('main-tension').value = config.tension;
            document.getElementById('tension-value').textContent = config.tension;
            
            currentRating = config.rating;
            updateStarDisplay();
            
            // Trigger analysis
            document.getElementById('analyze-btn').click();
            
            alert('Configuration chargée !');
        }
        
        // Delete configuration
        window.deleteConfiguration = function(configId) {
            if (confirm('Supprimer cette configuration ?')) {
                savedConfigurations = savedConfigurations.filter(c => c.id !== configId);
                localStorage.setItem('tennisConfigurationsAdvanced', JSON.stringify(savedConfigurations));
                updateSavedConfigsList();
            }
        }
        
        // Star rating
        const stars = document.querySelectorAll('.star');
        
        function updateStarDisplay() {
            stars.forEach((star, index) => {
                star.classList.remove('active', 'filled');
                if (index < currentRating) {
                    star.classList.add('filled');
                }
            });
        }
        
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                currentRating = index + 1;
                updateStarDisplay();
            });
            
            star.addEventListener('mouseenter', () => {
                stars.forEach((s, i) => {
                    s.classList.toggle('active', i <= index);
                });
            });
        });
        
        document.getElementById('star-rating').addEventListener('mouseleave', updateStarDisplay);
        
        // Tension slider
        document.getElementById('main-tension').addEventListener('input', function() {
            document.getElementById('tension-value').textContent = this.value;
        });
        
        // Load configurations on start
        loadSavedConfigurations();
    </script>
</body>
</html>`;

// Handle HTTP requests
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Serve the HTML for all requests
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
    });
    res.end(HTML_CONTENT);
});

server.listen(PORT, () => {
    console.log(`🎾 Tennis String Advisor Pro - Système Avancé`);
    console.log(`🚀 Serveur en ligne: http://localhost:${PORT}`);
    console.log(`📊 Fonctionnalités:`);
    console.log(`   - Base de données: 50 cordages top 2025`);
    console.log(`   - Calcul RCS (Rigidité Composite Setup)`);
    console.log(`   - Note de confort automatique (1-10)`);
    console.log(`   - Recommandations personnalisées`);
    console.log(`   - Système de rating et sauvegarde`);
});