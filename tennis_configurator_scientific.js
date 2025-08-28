const http = require('http');
const fs = require('fs');

const PORT = 3007;

// Conversion functions
function lbsToKg(lbs) {
    return Math.round((lbs * 0.453592) * 10) / 10;
}

function kgToLbs(kg) {
    return Math.round((kg / 0.453592) * 10) / 10;
}

// FORMULE SCIENTIFIQUE DE RIGIDITÉ COMPOSITE (RCS)
// RCS = (RA × RC × FT) / (RA + RC) × 0.85

// Calcul de la rigidité cordage ajustée (RC)
function calculateStringRigidity(stringData, gauge = 1.25) {
    const RC_base = getStringBaseRigidity(stringData.type, stringData.category);
    const FC_type = getStringTypeFactor(stringData.type, stringData.category);
    const FC_jauge = getGaugeFactor(gauge);
    
    return RC_base * FC_type * FC_jauge;
}

// RC_base selon type de cordage
function getStringBaseRigidity(type, category) {
    const typeMap = {
        'boyau': 35,           // Boyau naturel
        'multifilament': category === 'premium' ? 42 : 45,  // Multi Premium/Standard  
        'synthetique': 48,     // Synthetic Gut
        'polyester': getPolyesterBase(category),
        'hybride': 40,         // Moyenne pour hybride
        'multi-mono': 44       // Luxilon Element type
    };
    
    return typeMap[type.toLowerCase()] || 50;
}

function getPolyesterBase(category) {
    // Classification polyester selon confort
    const comfortMap = {
        'comfort': 52,     // Polyester Souple (Isospeed Cream, Hyper-G Soft)
        'standard': 58,    // Polyester Standard (Hyper-G, Lynx Tour)
        'controle': 65,    // Polyester Rigide (ALU Power, 4G)
        'elite': 65,       // Elite = souvent rigide
        'premium': 58,     // Premium = standard
        'value': 58,       // Value = standard
        'budget': 58,      // Budget = standard
        'innovation': 52,  // Innovation = souvent plus confortable
        'spin': 60         // Spin = moyennement rigide
    };
    
    return comfortMap[category] || 58;
}

// Facteur type cordage (FC_type)
function getStringTypeFactor(type, category) {
    const typeFactors = {
        'boyau': category === 'premium' ? 0.75 : 0.80,
        'multifilament': category === 'premium' ? 0.85 : 0.90,
        'synthetique': category === 'premium' ? 0.95 : 1.00,
        'polyester': getPolyesterTypeFactor(category),
        'hybride': 0.90,
        'multi-mono': 0.85
    };
    
    return typeFactors[type.toLowerCase()] || 1.00;
}

function getPolyesterTypeFactor(category) {
    const polyFactors = {
        'comfort': 1.05,    // Polyester Confort
        'standard': 1.15,   // Polyester Standard  
        'controle': 1.25,   // Polyester Contrôle
        'elite': 1.25,      // Elite = contrôle
        'premium': 1.15,    // Premium = standard
        'value': 1.15,      // Value = standard
        'budget': 1.15,     // Budget = standard
        'innovation': 1.05, // Innovation = confort
        'spin': 1.20        // Spin = entre standard et contrôle
    };
    
    return polyFactors[category] || 1.15;
}

// Facteur jauge (FC_jauge)
function getGaugeFactor(gauge) {
    const gaugeFactors = {
        1.38: 0.95, // 15L
        1.30: 1.00, // 16
        1.25: 1.05, // 16L (standard)
        1.24: 1.10, // 17
        1.20: 1.15  // 18
    };
    
    // Trouve la jauge la plus proche
    const availableGauges = Object.keys(gaugeFactors).map(Number).sort();
    const closestGauge = availableGauges.reduce((prev, curr) => 
        Math.abs(curr - gauge) < Math.abs(prev - gauge) ? curr : prev
    );
    
    return gaugeFactors[closestGauge];
}

// Facteur tension (FT)
function getTensionFactor(tensionKg) {
    const referencetension = 23; // Standard moderne
    return 1 + (tensionKg - referenceTimeout) * 0.015;
}

// Calcul RCS principal
function calculateRCS(racquetRA, stringData, tensionKg, gauge = 1.25) {
    const RC = calculateStringRigidity(stringData, gauge);
    const FT = getTensionFactor(tensionKg);
    const attenuationFactor = 0.85;
    
    const RCS = (racquetRA * RC * FT) / (racquetRA + RC) * attenuationFactor;
    
    return Math.round(RCS * 10) / 10; // Arrondi à 1 décimale
}

// Calcul note confort
function calculateComfortRating(RCS) {
    const comfortScore = 10 - (RCS - 40) * 0.15;
    return Math.max(1, Math.min(10, Math.round(comfortScore * 10) / 10));
}

// Classification confort
function getComfortDescription(RCS) {
    if (RCS < 45) return { level: "Très Confortable", color: "green-600", profile: "Senior, problèmes bras" };
    if (RCS < 50) return { level: "Confortable", color: "green-500", profile: "Loisir, recherche confort" };
    if (RCS < 55) return { level: "Équilibré", color: "blue-500", profile: "Intermédiaire polyvalent" };
    if (RCS < 60) return { level: "Ferme", color: "orange-500", profile: "Compétiteur, recherche contrôle" };
    if (RCS < 65) return { level: "Rigide", color: "red-500", profile: "Expert, jeu puissant" };
    return { level: "Très Rigide", color: "red-700", profile: "Pro, bras acier uniquement" };
}

// Base de données raquettes avec RA précis
const RACQUETS_DATABASE = {
    babolat: [
        { name: "Pure Drive", weight: "300g", headSize: "100in²", type: "puissance", ra: 72 },
        { name: "Pure Aero", weight: "300g", headSize: "100in²", type: "puissance", ra: 71 },
        { name: "Pure Strike", weight: "305g", headSize: "98in²", type: "controle", ra: 68 },
        { name: "Pure Drive VS", weight: "300g", headSize: "100in²", type: "puissance", ra: 73 },
        { name: "Pure Aero VS", weight: "300g", headSize: "100in²", type: "puissance", ra: 70 },
        { name: "Pure Strike VS", weight: "305g", headSize: "98in²", type: "controle", ra: 66 },
        { name: "Pure Drive Tour", weight: "315g", headSize: "100in²", type: "controle", ra: 70 },
        { name: "Pure Aero Tour", weight: "315g", headSize: "100in²", type: "controle", ra: 69 },
        { name: "Pure Strike Tour", weight: "320g", headSize: "98in²", type: "controle", ra: 65 },
        { name: "Pure Drive Lite", weight: "270g", headSize: "100in²", type: "confort", ra: 69 },
        { name: "Pure Aero Lite", weight: "270g", headSize: "100in²", type: "confort", ra: 68 },
        { name: "Boost Drive", weight: "260g", headSize: "103in²", type: "confort", ra: 68 },
        { name: "Boost Aero", weight: "260g", headSize: "103in²", type: "confort", ra: 67 }
    ],
    head: [
        { name: "Speed MP", weight: "300g", headSize: "100in²", type: "polyvalent", ra: 66 },
        { name: "Speed Pro", weight: "310g", headSize: "100in²", type: "controle", ra: 62 },
        { name: "Speed Lite", weight: "280g", headSize: "100in²", type: "confort", ra: 65 },
        { name: "Radical MP", weight: "295g", headSize: "98in²", type: "polyvalent", ra: 62 },
        { name: "Radical Pro", weight: "315g", headSize: "98in²", type: "controle", ra: 59 },
        { name: "Radical S", weight: "280g", headSize: "102in²", type: "confort", ra: 64 },
        { name: "Prestige MP", weight: "320g", headSize: "98in²", type: "controle", ra: 60 },
        { name: "Prestige Pro", weight: "330g", headSize: "98in²", type: "controle", ra: 58 },
        { name: "Prestige S", weight: "295g", headSize: "102in²", type: "polyvalent", ra: 62 },
        { name: "Gravity MP", weight: "295g", headSize: "100in²", type: "polyvalent", ra: 65 },
        { name: "Gravity Pro", weight: "315g", headSize: "100in²", type: "controle", ra: 62 },
        { name: "Gravity S", weight: "280g", headSize: "102in²", type: "confort", ra: 67 },
        { name: "Gravity Tour", weight: "325g", headSize: "98in²", type: "controle", ra: 60 },
        { name: "Gravity Lite", weight: "270g", headSize: "102in²", type: "confort", ra: 68 },
        { name: "Extreme MP", weight: "300g", headSize: "100in²", type: "puissance", ra: 68 },
        { name: "Extreme Pro", weight: "315g", headSize: "100in²", type: "controle", ra: 65 },
        { name: "Extreme S", weight: "285g", headSize: "102in²", type: "confort", ra: 70 },
        { name: "Boom MP", weight: "295g", headSize: "100in²", type: "puissance", ra: 70 },
        { name: "Boom Pro", weight: "310g", headSize: "98in²", type: "controle", ra: 67 }
    ],
    wilson: [
        { name: "Clash 100", weight: "295g", headSize: "100in²", type: "confort", ra: 55 },
        { name: "Clash 98", weight: "305g", headSize: "98in²", type: "confort", ra: 57 },
        { name: "Clash 100 Tour", weight: "310g", headSize: "100in²", type: "polyvalent", ra: 58 },
        { name: "Pro Staff RF97", weight: "340g", headSize: "97in²", type: "controle", ra: 68 },
        { name: "Pro Staff 97", weight: "315g", headSize: "97in²", type: "controle", ra: 65 },
        { name: "Pro Staff 97L", weight: "290g", headSize: "97in²", type: "polyvalent", ra: 66 },
        { name: "Blade 98", weight: "305g", headSize: "98in²", type: "polyvalent", ra: 62 },
        { name: "Blade 100", weight: "300g", headSize: "100in²", type: "polyvalent", ra: 64 },
        { name: "Blade 98 v8", weight: "305g", headSize: "98in²", type: "polyvalent", ra: 61 },
        { name: "Ultra 100", weight: "300g", headSize: "100in²", type: "puissance", ra: 68 },
        { name: "Ultra 95", weight: "315g", headSize: "95in²", type: "controle", ra: 65 },
        { name: "Ultra 100L", weight: "280g", headSize: "100in²", type: "confort", ra: 66 },
        { name: "Burn 100", weight: "300g", headSize: "100in²", type: "puissance", ra: 70 },
        { name: "Burn 95", weight: "315g", headSize: "95in²", type: "controle", ra: 67 },
        { name: "Shift 99", weight: "305g", headSize: "99in²", type: "polyvalent", ra: 63 }
    ],
    yonex: [
        { name: "Ezone 100", weight: "300g", headSize: "100in²", type: "polyvalent", ra: 65 },
        { name: "Ezone 98", weight: "305g", headSize: "98in²", type: "polyvalent", ra: 63 },
        { name: "Ezone 100L", weight: "285g", headSize: "100in²", type: "confort", ra: 67 },
        { name: "Ezone Tour", weight: "310g", headSize: "100in²", type: "controle", ra: 61 },
        { name: "VCore 100", weight: "300g", headSize: "100in²", type: "puissance", ra: 67 },
        { name: "VCore 98", weight: "305g", headSize: "98in²", type: "controle", ra: 65 },
        { name: "VCore 95", weight: "310g", headSize: "95in²", type: "controle", ra: 63 },
        { name: "VCore Pro 100", weight: "310g", headSize: "100in²", type: "controle", ra: 64 },
        { name: "VCore Pro 97", weight: "315g", headSize: "97in²", type: "controle", ra: 62 },
        { name: "Percept 100", weight: "300g", headSize: "100in²", type: "polyvalent", ra: 64 },
        { name: "Percept 97", weight: "305g", headSize: "97in²", type: "polyvalent", ra: 62 },
        { name: "Astrel 100", weight: "290g", headSize: "100in²", type: "confort", ra: 66 },
        { name: "Astrel 105", weight: "280g", headSize: "105in²", type: "confort", ra: 68 }
    ],
    technifibre: [
        { name: "TFight 315", weight: "315g", headSize: "98in²", type: "controle", ra: 65 },
        { name: "TFight 300", weight: "300g", headSize: "98in²", type: "polyvalent", ra: 67 },
        { name: "TFight 280", weight: "280g", headSize: "100in²", type: "confort", ra: 69 },
        { name: "TF40 315", weight: "315g", headSize: "98in²", type: "controle", ra: 64 },
        { name: "TF40 300", weight: "300g", headSize: "100in²", type: "polyvalent", ra: 66 },
        { name: "Tempo 298", weight: "298g", headSize: "100in²", type: "polyvalent", ra: 65 },
        { name: "Tempo 285", weight: "285g", headSize: "100in²", type: "confort", ra: 67 },
        { name: "TFlash 300", weight: "300g", headSize: "98in²", type: "puissance", ra: 68 },
        { name: "TFlash 285", weight: "285g", headSize: "100in²", type: "confort", ra: 70 },
        { name: "TPulse 300", weight: "300g", headSize: "100in²", type: "puissance", ra: 69 },
        { name: "TPulse 285", weight: "285g", headSize: "102in²", type: "confort", ra: 71 }
    ]
};

// Base de données cordages avec classification pour formule RCS
const STRINGS_DATABASE = {
    elite: [
        { name: "Luxilon ALU Power", type: "polyester", category: "controle", performance: 9.8, control: 9.5, comfort: 7.0, price: "18-22€", description: "Standard absolu ATP - Contrôle chirurgical" },
        { name: "Solinco Hyper-G", type: "polyester", category: "standard", performance: 9.5, control: 9.0, comfort: 8.5, price: "15-18€", description: "Sea of green - Équilibre parfait" },
        { name: "Babolat RPM Blast", type: "polyester", category: "spin", performance: 9.2, control: 9.0, comfort: 7.5, price: "16-20€", description: "Référence topspin Nadal" },
        { name: "Luxilon 4G", type: "polyester", category: "controle", performance: 9.0, control: 10.0, comfort: 7.0, price: "20-24€", description: "Contrôle absolu maximum" },
        { name: "Solinco Mach-10", type: "polyester", category: "innovation", performance: 9.5, control: 8.5, comfort: 8.0, price: "60-70€", description: "Innovation CloudForm - Révolutionnaire" },
        { name: "Babolat VS Touch", type: "boyau", category: "premium", performance: 9.5, control: 8.0, comfort: 9.5, price: "45-50€", description: "Excellence boyau français" },
        { name: "Wilson Champion's Choice", type: "hybride", category: "premium", performance: 8.5, control: 9.0, comfort: 9.0, price: "25-30€", description: "Hybride référence Federer" }
    ],
    premium: [
        { name: "Head Lynx Tour", type: "polyester", category: "standard", performance: 8.5, control: 9.0, comfort: 8.0, price: "14-17€", description: "Hexagonal équilibré" },
        { name: "Solinco Tour Bite", type: "polyester", category: "spin", performance: 9.0, control: 10.0, comfort: 6.5, price: "16-19€", description: "4 arêtes spin maximum" },
        { name: "MSV Focus Hex", type: "polyester", category: "controle", performance: 8.0, control: 9.5, comfort: 7.0, price: "12-15€", description: "Excellence allemande abordable" },
        { name: "Tecnifibre X-One Biphase", type: "multifilament", category: "premium", performance: 9.0, control: 7.0, comfort: 8.5, price: "18-22€", description: "Boost performance premium" },
        { name: "Yonex Poly Tour Pro", type: "polyester", category: "standard", performance: 8.0, control: 8.5, comfort: 7.5, price: "16-19€", description: "Équilibre japonais" },
        { name: "Tecnifibre Black Code 4S", type: "polyester", category: "controle", performance: 8.5, control: 8.5, comfort: 7.5, price: "15-18€", description: "Section carrée précise" },
        { name: "Solinco Confidential", type: "polyester", category: "controle", performance: 7.5, control: 9.5, comfort: 7.5, price: "17-20€", description: "Maintien tension champion" }
    ],
    standard: [
        { name: "Head Reflex MLT", type: "multifilament", category: "standard", performance: 7.5, control: 7.0, comfort: 8.5, price: "12-15€", description: "Multi excellence rapport qualité-prix" },
        { name: "Signum Pro X-Perience", type: "polyester", category: "standard", performance: 8.5, control: 9.0, comfort: 8.0, price: "12-15€", description: "Allemagne premium abordable" },
        { name: "Kirschbaum Pro Line Evolution", type: "polyester", category: "standard", performance: 8.0, control: 8.5, comfort: 7.0, price: "13-16€", description: "Durabilité allemande" },
        { name: "Wilson NXT Soft", type: "multifilament", category: "comfort", performance: 8.0, control: 6.5, comfort: 9.0, price: "15-18€", description: "+9% absorption innovation 2025" },
        { name: "Head Hawk Touch", type: "polyester", category: "standard", performance: 8.0, control: 9.0, comfort: 7.0, price: "13-16€", description: "Polyester accessible" },
        { name: "Wilson NXT Power", type: "multifilament", category: "standard", performance: 8.5, control: 6.5, comfort: 8.0, price: "14-17€", description: "Multi référence mondiale" }
    ],
    comfort: [
        { name: "Tecnifibre TGV", type: "multifilament", category: "comfort", performance: 7.0, control: 6.5, comfort: 9.5, price: "16-20€", description: "PU400 confort absolu" },
        { name: "Wilson Natural Gut", type: "boyau", category: "standard", performance: 9.0, control: 7.5, comfort: 9.0, price: "40-45€", description: "Référence boyau Wilson" },
        { name: "Isospeed Cream", type: "polyester", category: "comfort", performance: 7.0, control: 8.0, comfort: 9.5, price: "14-17€", description: "Poly le plus doux" },
        { name: "Yonex Polytour Air", type: "polyester", category: "comfort", performance: 7.5, control: 8.0, comfort: 8.5, price: "15-18€", description: "Poly souple innovation" },
        { name: "Solinco Hyper-G Soft", type: "polyester", category: "comfort", performance: 7.5, control: 8.5, comfort: 8.5, price: "16-19€", description: "Version douce de l'Hyper-G" }
    ],
    budget: [
        { name: "Gosen Polylon", type: "polyester", category: "controle", performance: 7.0, control: 9.0, comfort: 6.0, price: "9-12€", description: "Greatest budget poly" },
        { name: "Prince Synthetic Gut Duraflex", type: "synthetique", category: "standard", performance: 7.0, control: 6.5, comfort: 7.5, price: "8-11€", description: "Valeur sûre universelle" },
        { name: "Head Velocity MLT", type: "multifilament", category: "standard", performance: 7.0, control: 6.0, comfort: 8.5, price: "10-13€", description: "Multi budget développement" },
        { name: "Gamma Ocho", type: "polyester", category: "spin", performance: 7.5, control: 8.5, comfort: 7.0, price: "11-14€", description: "Octogonal américain" },
        { name: "Polyfibre TCS", type: "polyester", category: "standard", performance: 7.5, control: 8.5, comfort: 7.5, price: "10-13€", description: "Rapport qualité-prix" }
    ],
    innovation: [
        { name: "Luxilon Eco Power", type: "polyester", category: "innovation", performance: 7.5, control: 7.5, comfort: 6.5, price: "50-60€", description: "100% recyclé révolution" },
        { name: "Velociti Catalyst", type: "polyester", category: "innovation", performance: 7.0, control: 7.0, comfort: 8.0, price: "45-55€", description: "Premier cordage biodégradable" },
        { name: "ReString Zero", type: "polyester", category: "innovation", performance: 8.0, control: 8.0, comfort: 7.0, price: "55-65€", description: "Coating intégré révolutionnaire" },
        { name: "Toroline Wasabi", type: "polyester", category: "spin", performance: 8.5, control: 8.0, comfort: 7.5, price: "18-22€", description: "Coating slick innovation" },
        { name: "Luxilon Element", type: "multi-mono", category: "innovation", performance: 8.0, control: 8.0, comfort: 8.5, price: "22-26€", description: "Multi-Mono révolution" }
    ]
};

// Correction de la fonction getTensionFactor
function getTensionFactor(tensionKg) {
    const referenceTension = 23; // Standard moderne
    return 1 + (tensionKg - referenceTension) * 0.015;
}

// Génération HTML pour raquettes
function generateRacquetOptions() {
    let html = '<option value="">Sélectionnez votre raquette</option>';
    
    const brandLabels = {
        babolat: '🔥 Babolat',
        head: '⚡ Head', 
        wilson: '🎾 Wilson',
        yonex: '🏸 Yonex',
        technifibre: '🎯 Technifibre'
    };
    
    Object.entries(RACQUETS_DATABASE).forEach(([brand, racquets]) => {
        html += `<optgroup label="${brandLabels[brand]}">`;
        racquets.forEach(racquet => {
            const value = `${brand}-${racquet.name.toLowerCase().replace(/\\s+/g, '-')}`;
            html += `<option value="${value}">${racquet.name} (${racquet.weight}, ${racquet.headSize}, RA${racquet.ra})</option>`;
        });
        html += '</optgroup>';
    });
    
    return html;
}

// Génération HTML pour cordages
function generateStringOptions() {
    let html = '<option value="">Sélectionnez votre cordage</option>';
    
    const categoryLabels = {
        elite: '🏆 Elite Performance',
        premium: '⭐ Premium',
        standard: '✅ Standard/Value',
        comfort: '💚 Confort',
        budget: '💰 Budget',
        innovation: '🚀 Innovation 2025'
    };
    
    Object.entries(STRINGS_DATABASE).forEach(([category, strings]) => {
        html += `<optgroup label="${categoryLabels[category]}">`;
        strings.forEach(string => {
            const value = `${string.name.toLowerCase().replace(/\\s+/g, '-')}`;
            html += `<option value="${value}">${string.name} (${string.type}, ${string.price})</option>`;
        });
        html += '</optgroup>';
    });
    
    return html;
}

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tennis String Advisor - Configurateur Scientifique RCS</title>
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
        @media (max-width: 768px) {
            .hero-bg { background-attachment: scroll; }
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        .hybrid-active {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            transform: scale(1.02);
        }
        .disabled { opacity: 0.6; pointer-events: none; }
        input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            height: 8px;
            background: linear-gradient(to right, #10b981 0%, #059669 50%, #047857 100%);
            border-radius: 5px;
            outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            background: white;
            cursor: pointer;
            border-radius: 50%;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            border: 3px solid #059669;
        }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
        .rcs-display {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
            color: white;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
    </style>
</head>
<body class="min-h-screen hero-bg">
    <section class="py-12 px-4">
        <div class="max-w-4xl mx-auto">
            <div class="text-center mb-12">
                <h1 class="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                    🔬 Tennis String Advisor
                </h1>
                <p class="text-xl md:text-2xl text-white/90 font-medium drop-shadow-lg max-w-3xl mx-auto">
                    Configurateur Scientifique RCS - Formule de Rigidité Composite Setup
                </p>
                <div class="flex items-center justify-center mt-4 text-white/80 text-sm">
                    <span class="bg-white/20 px-3 py-1 rounded-full mr-3">🔬 Formule RCS</span>
                    <span class="bg-white/20 px-3 py-1 rounded-full mr-3">📊 Note confort</span>
                    <span class="bg-white/20 px-3 py-1 rounded-full">🎯 Calcul scientifique</span>
                </div>
            </div>

            <div class="glass-card rounded-3xl p-8 shadow-2xl">
                <div class="space-y-8">
                    <div class="space-y-6">
                        <h3 class="text-2xl font-bold text-gray-800 text-center mb-6">
                            ⚙️ Configuration Setup Tennis
                        </h3>

                        <div>
                            <label class="block text-lg font-semibold text-gray-700 mb-3">
                                🎾 Raquette (avec indice RA)
                            </label>
                            <select id="racquet-select" class="racquet-select w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all">
                                ${generateRacquetOptions()}
                            </select>
                            <div id="racquet-info" class="mt-2 text-sm text-gray-600" style="display: none;"></div>
                        </div>

                        <div class="text-center py-4">
                            <button id="hybrid-toggle" class="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                                💡 Passer en Hybride
                            </button>
                            <p id="config-description" class="mt-2 text-gray-600 font-medium">
                                Configuration standard avec un seul type de cordage
                            </p>
                        </div>

                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-lg font-semibold text-gray-700 mb-3">
                                    🎯 Cordage Principal (ou Unique)
                                </label>
                                <select id="main-string" class="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500">
                                    ${generateStringOptions()}
                                </select>
                                <div id="string-info" class="mt-2 text-sm text-gray-600" style="display: none;"></div>
                            </div>

                            <div id="cross-string-section" style="display: none;" class="disabled">
                                <label class="block text-lg font-semibold text-gray-700 mb-3">
                                    🔄 Cordage Croisé (Hybride)
                                </label>
                                <select id="cross-string" class="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-orange-500">
                                    ${generateStringOptions()}
                                </select>
                            </div>
                        </div>

                        <div class="grid md:grid-cols-3 gap-6">
                            <div>
                                <label class="block text-lg font-semibold text-gray-700 mb-3">
                                    ⚡ Tension Principal
                                </label>
                                <div class="space-y-4">
                                    <input type="range" id="main-tension" min="18" max="32" value="24" 
                                           class="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer">
                                    <div class="flex justify-between items-center">
                                        <span id="main-tension-value" class="text-xl font-bold text-blue-700">24 kg</span>
                                        <select id="main-tension-type" class="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="kg">kilogrammes (kg)</option>
                                            <option value="lbs">livres (lbs)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div id="cross-tension-section" style="display: none;">
                                <label class="block text-lg font-semibold text-gray-700 mb-3">
                                    🔄 Tension Croisé
                                </label>
                                <div class="space-y-4">
                                    <input type="range" id="cross-tension" min="18" max="32" value="22" 
                                           class="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer">
                                    <div class="flex justify-between items-center">
                                        <span id="cross-tension-value" class="text-xl font-bold text-orange-700">22 kg</span>
                                        <select id="cross-tension-type" class="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                                            <option value="kg">kilogrammes (kg)</option>
                                            <option value="lbs">livres (lbs)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label class="block text-lg font-semibold text-gray-700 mb-3">
                                    📏 Jauge Cordage
                                </label>
                                <select id="gauge-select" class="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-purple-500">
                                    <option value="1.38">15L (1.38mm)</option>
                                    <option value="1.30">16 (1.30mm)</option>
                                    <option value="1.25" selected>16L (1.25mm)</option>
                                    <option value="1.24">17 (1.24mm)</option>
                                    <option value="1.20">18 (1.20mm)</option>
                                </select>
                            </div>
                        </div>

                        <div id="rcs-analysis" class="rcs-display rounded-xl p-6" style="display: none;">
                            <h4 class="font-bold text-white mb-4 flex items-center text-xl">
                                <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                </svg>
                                🔬 Analyse Scientifique RCS
                            </h4>
                            <div id="rcs-content" class="text-white/95 space-y-3"></div>
                        </div>
                    </div>
                    
                    <button id="calculate-rcs-btn" class="w-full py-4 px-6 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                        🔬 Calculer Rigidité Composite (RCS)
                    </button>

                    <div class="stats-grid pt-6">
                        <div class="text-center bg-white/25 backdrop-blur-md rounded-xl p-4 border border-white/40">
                            <div class="text-2xl font-bold text-white drop-shadow-lg mb-1">📐</div>
                            <div class="text-sm text-white/90 font-semibold">Formule RCS</div>
                        </div>
                        <div class="text-center bg-white/25 backdrop-blur-md rounded-xl p-4 border border-white/40">
                            <div class="text-2xl font-bold text-white drop-shadow-lg mb-1">🎯</div>
                            <div class="text-sm text-white/90 font-semibold">Calcul Précis</div>
                        </div>
                        <div class="text-center bg-white/25 backdrop-blur-md rounded-xl p-4 border border-white/40">
                            <div class="text-2xl font-bold text-white drop-shadow-lg mb-1">💚</div>
                            <div class="text-sm text-white/90 font-semibold">Note Confort</div>
                        </div>
                        <div class="text-center bg-white/25 backdrop-blur-md rounded-xl p-4 border border-white/40">
                            <div class="text-2xl font-bold text-white drop-shadow-lg mb-1">🧪</div>
                            <div class="text-sm text-white/90 font-semibold">Analyse Setup</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <script>
        let isHybrid = false;
        let currentRacquet = null;
        let currentString = null;
        
        // Base de données locale
        const racquetsDB = ${JSON.stringify(RACQUETS_DATABASE)};
        const stringsDB = ${JSON.stringify(STRINGS_DATABASE)};
        
        // FONCTIONS FORMULE RCS
        
        // Conversion functions
        function lbsToKg(lbs) {
            return Math.round((lbs * 0.453592) * 10) / 10;
        }
        
        function kgToLbs(kg) {
            return Math.round((kg / 0.453592) * 10) / 10;
        }
        
        // RC_base selon type de cordage
        function getStringBaseRigidity(type, category) {
            const typeMap = {
                'boyau': 35,           
                'multifilament': category === 'premium' ? 42 : 45,
                'synthetique': 48,     
                'polyester': getPolyesterBase(category),
                'hybride': 40,         
                'multi-mono': 44       
            };
            
            return typeMap[type.toLowerCase()] || 50;
        }

        function getPolyesterBase(category) {
            const comfortMap = {
                'comfort': 52,     
                'standard': 58,    
                'controle': 65,    
                'elite': 65,       
                'premium': 58,     
                'value': 58,       
                'budget': 58,      
                'innovation': 52,  
                'spin': 60         
            };
            
            return comfortMap[category] || 58;
        }

        // Facteur type cordage (FC_type)
        function getStringTypeFactor(type, category) {
            const typeFactors = {
                'boyau': category === 'premium' ? 0.75 : 0.80,
                'multifilament': category === 'premium' ? 0.85 : 0.90,
                'synthetique': category === 'premium' ? 0.95 : 1.00,
                'polyester': getPolyesterTypeFactor(category),
                'hybride': 0.90,
                'multi-mono': 0.85
            };
            
            return typeFactors[type.toLowerCase()] || 1.00;
        }

        function getPolyesterTypeFactor(category) {
            const polyFactors = {
                'comfort': 1.05,    
                'standard': 1.15,   
                'controle': 1.25,   
                'elite': 1.25,      
                'premium': 1.15,    
                'value': 1.15,      
                'budget': 1.15,     
                'innovation': 1.05, 
                'spin': 1.20        
            };
            
            return polyFactors[category] || 1.15;
        }

        // Facteur jauge
        function getGaugeFactor(gauge) {
            const gaugeFactors = {
                1.38: 0.95, 
                1.30: 1.00, 
                1.25: 1.05, 
                1.24: 1.10, 
                1.20: 1.15  
            };
            
            const availableGauges = Object.keys(gaugeFactors).map(Number).sort();
            const closestGauge = availableGauges.reduce((prev, curr) => 
                Math.abs(curr - gauge) < Math.abs(prev - gauge) ? curr : prev
            );
            
            return gaugeFactors[closestGauge];
        }

        // Facteur tension
        function getTensionFactor(tensionKg) {
            const referenceTension = 23; // Standard moderne
            return 1 + (tensionKg - referenceTension) * 0.015;
        }

        // Calcul RC
        function calculateStringRigidity(stringData, gauge = 1.25) {
            const RC_base = getStringBaseRigidity(stringData.type, stringData.category);
            const FC_type = getStringTypeFactor(stringData.type, stringData.category);
            const FC_jauge = getGaugeFactor(gauge);
            
            return RC_base * FC_type * FC_jauge;
        }

        // Calcul RCS principal
        function calculateRCS(racquetRA, stringData, tensionKg, gauge = 1.25) {
            const RC = calculateStringRigidity(stringData, gauge);
            const FT = getTensionFactor(tensionKg);
            const attenuationFactor = 0.85;
            
            const RCS = (racquetRA * RC * FT) / (racquetRA + RC) * attenuationFactor;
            
            return Math.round(RCS * 10) / 10;
        }

        // Note confort
        function calculateComfortRating(RCS) {
            const comfortScore = 10 - (RCS - 40) * 0.15;
            return Math.max(1, Math.min(10, Math.round(comfortScore * 10) / 10));
        }

        // Description confort
        function getComfortDescription(RCS) {
            if (RCS < 45) return { level: "Très Confortable", color: "text-green-400", profile: "Senior, problèmes bras" };
            if (RCS < 50) return { level: "Confortable", color: "text-green-300", profile: "Loisir, recherche confort" };
            if (RCS < 55) return { level: "Équilibré", color: "text-blue-300", profile: "Intermédiaire polyvalent" };
            if (RCS < 60) return { level: "Ferme", color: "text-orange-300", profile: "Compétiteur, recherche contrôle" };
            if (RCS < 65) return { level: "Rigide", color: "text-red-300", profile: "Expert, jeu puissant" };
            return { level: "Très Rigide", color: "text-red-400", profile: "Pro, bras acier uniquement" };
        }
        
        // Find data functions
        function findRacquet(value) {
            for (const [brand, racquets] of Object.entries(racquetsDB)) {
                for (const racquet of racquets) {
                    const racquetValue = brand + '-' + racquet.name.toLowerCase().replace(/\\s+/g, '-');
                    if (racquetValue === value) {
                        return { ...racquet, brand };
                    }
                }
            }
            return null;
        }
        
        function findString(value) {
            for (const [category, strings] of Object.entries(stringsDB)) {
                for (const string of strings) {
                    const stringValue = string.name.toLowerCase().replace(/\\s+/g, '-');
                    if (stringValue === value) {
                        return { ...string, category };
                    }
                }
            }
            return null;
        }
        
        // Event listeners
        const hybridToggle = document.getElementById('hybrid-toggle');
        const configDescription = document.getElementById('config-description');
        const crossStringSection = document.getElementById('cross-string-section');
        const crossTensionSection = document.getElementById('cross-tension-section');
        const racquetSelect = document.getElementById('racquet-select');
        const mainStringSelect = document.getElementById('main-string');
        const mainTension = document.getElementById('main-tension');
        const crossTension = document.getElementById('cross-tension');
        const mainTensionValue = document.getElementById('main-tension-value');
        const crossTensionValue = document.getElementById('cross-tension-value');
        const rcsAnalysis = document.getElementById('rcs-analysis');
        const rcsContent = document.getElementById('rcs-content');
        
        // Hybrid toggle
        hybridToggle.addEventListener('click', function() {
            isHybrid = !isHybrid;
            
            if (isHybrid) {
                hybridToggle.textContent = '🎾 Configuration Standard';
                hybridToggle.classList.add('hybrid-active');
                configDescription.textContent = '🔄 Configuration hybride avec cordages différents vertical/horizontal';
                crossStringSection.style.display = 'block';
                crossTensionSection.style.display = 'block';
                setTimeout(() => {
                    crossStringSection.classList.remove('disabled');
                }, 50);
            } else {
                hybridToggle.textContent = '💡 Passer en Hybride';
                hybridToggle.classList.remove('hybrid-active');
                configDescription.textContent = '⚡ Configuration standard avec un seul type de cordage';
                crossStringSection.classList.add('disabled');
                setTimeout(() => {
                    crossStringSection.style.display = 'none';
                    crossTensionSection.style.display = 'none';
                }, 300);
            }
        });
        
        // Racquet selection
        racquetSelect.addEventListener('change', function() {
            const value = this.value;
            if (value) {
                currentRacquet = findRacquet(value);
                if (currentRacquet) {
                    const info = document.getElementById('racquet-info');
                    info.innerHTML = '<strong>' + currentRacquet.brand.toUpperCase() + '</strong> - ' + 
                                   currentRacquet.type.toUpperCase() + ' | <strong>RA: ' + currentRacquet.ra + '</strong>' + 
                                   ' | Poids: ' + currentRacquet.weight + ' | Taille: ' + currentRacquet.headSize;
                    info.style.display = 'block';
                    info.className = 'mt-2 text-sm font-semibold text-blue-700 bg-blue-50 p-2 rounded-lg';
                }
            } else {
                currentRacquet = null;
                document.getElementById('racquet-info').style.display = 'none';
                rcsAnalysis.style.display = 'none';
            }
        });
        
        // String selection
        mainStringSelect.addEventListener('change', function() {
            const value = this.value;
            if (value) {
                currentString = findString(value);
                if (currentString) {
                    const info = document.getElementById('string-info');
                    info.innerHTML = '<strong>' + currentString.name + '</strong> (' + currentString.type + ') | ' +
                                   'Catégorie: ' + currentString.category + ' | Prix: ' + currentString.price;
                    info.style.display = 'block';
                    info.className = 'mt-2 text-sm font-semibold text-purple-700 bg-purple-50 p-2 rounded-lg';
                }
            } else {
                currentString = null;
                document.getElementById('string-info').style.display = 'none';
            }
        });
        
        // Tension updates
        mainTension.addEventListener('input', function() {
            const unit = document.getElementById('main-tension-type').value;
            if (unit === 'kg') {
                mainTensionValue.textContent = this.value + ' kg';
            } else {
                const lbsValue = kgToLbs(parseFloat(this.value));
                mainTensionValue.textContent = lbsValue + ' lbs';
            }
        });
        
        crossTension.addEventListener('input', function() {
            const unit = document.getElementById('cross-tension-type').value;
            if (unit === 'kg') {
                crossTensionValue.textContent = this.value + ' kg';
            } else {
                const lbsValue = kgToLbs(parseFloat(this.value));
                crossTensionValue.textContent = lbsValue + ' lbs';
            }
        });
        
        // Unit changes
        document.getElementById('main-tension-type').addEventListener('change', function() {
            mainTension.dispatchEvent(new Event('input'));
        });
        
        document.getElementById('cross-tension-type').addEventListener('change', function() {
            crossTension.dispatchEvent(new Event('input'));
        });
        
        // Calculate RCS button
        document.getElementById('calculate-rcs-btn').addEventListener('click', function() {
            if (!currentRacquet || !currentString) {
                alert('Veuillez sélectionner une raquette et un cordage pour calculer la rigidité composite.');
                return;
            }
            
            const gauge = parseFloat(document.getElementById('gauge-select').value);
            const tension = parseFloat(mainTension.value);
            
            const RCS = calculateRCS(currentRacquet.ra, currentString, tension, gauge);
            const comfortRating = calculateComfortRating(RCS);
            const comfortDesc = getComfortDescription(RCS);
            
            const RC = calculateStringRigidity(currentString, gauge);
            const FT = getTensionFactor(tension);
            
            let analysisHTML = '';
            analysisHTML += '<div class="grid md:grid-cols-3 gap-4 mb-4">';
            analysisHTML += '<div class="text-center bg-white/10 rounded-lg p-3">';
            analysisHTML += '<div class="text-3xl font-bold">' + RCS + '</div>';
            analysisHTML += '<div class="text-sm opacity-90">RCS Score</div>';
            analysisHTML += '</div>';
            analysisHTML += '<div class="text-center bg-white/10 rounded-lg p-3">';
            analysisHTML += '<div class="text-3xl font-bold">' + comfortRating + '/10</div>';
            analysisHTML += '<div class="text-sm opacity-90">Note Confort</div>';
            analysisHTML += '</div>';
            analysisHTML += '<div class="text-center bg-white/10 rounded-lg p-3">';
            analysisHTML += '<div class="text-lg font-bold ' + comfortDesc.color + '">' + comfortDesc.level + '</div>';
            analysisHTML += '<div class="text-xs opacity-90">' + comfortDesc.profile + '</div>';
            analysisHTML += '</div>';
            analysisHTML += '</div>';
            
            analysisHTML += '<div class="text-sm space-y-2">';
            analysisHTML += '<div><strong>📐 Formule RCS :</strong> (RA × RC × FT) / (RA + RC) × 0.85</div>';
            analysisHTML += '<div><strong>🎾 Raquette :</strong> ' + currentRacquet.name + ' (RA ' + currentRacquet.ra + ')</div>';
            analysisHTML += '<div><strong>🎯 Cordage :</strong> ' + currentString.name + ' (RC ' + Math.round(RC * 10) / 10 + ')</div>';
            analysisHTML += '<div><strong>⚡ Tension :</strong> ' + tension + ' kg (FT ' + Math.round(FT * 1000) / 1000 + ')</div>';
            analysisHTML += '<div><strong>📏 Jauge :</strong> ' + gauge + ' mm</div>';
            
            if (comfortRating < 6) {
                analysisHTML += '<div class="mt-3 p-2 bg-red-500/20 rounded"><strong>⚠️ Attention :</strong> Setup rigide - Risque tennis elbow. Considérez un cordage plus souple ou une tension plus faible.</div>';
            } else if (comfortRating >= 8) {
                analysisHTML += '<div class="mt-3 p-2 bg-green-500/20 rounded"><strong>✅ Excellent :</strong> Setup confortable et arm-friendly.</div>';
            }
            analysisHTML += '</div>';
            
            rcsContent.innerHTML = analysisHTML;
            rcsAnalysis.style.display = 'block';
            
            // Scroll vers les résultats
            rcsAnalysis.scrollIntoView({ behavior: 'smooth' });
        });
        
        // Initialize
        mainTension.dispatchEvent(new Event('input'));
        crossTension.dispatchEvent(new Event('input'));
    </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
    });
    res.end(HTML_CONTENT);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Tennis String Advisor Scientific RCS server running at http://0.0.0.0:${PORT}`);
    console.log(`Features: Scientific RCS formula, comfort rating calculation, tension factors`);
    console.log(`Formula: RCS = (RA × RC × FT) / (RA + RC) × 0.85`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\\nShutting down server gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\\nShutting down server gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});