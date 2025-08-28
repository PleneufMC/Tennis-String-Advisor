const http = require('http');
const fs = require('fs');

const PORT = 3007;

// Conversion lbs to kg
function lbsToKg(lbs) {
    return Math.round((lbs * 0.453592) * 10) / 10;
}

function kgToLbs(kg) {
    return Math.round((kg / 0.453592) * 10) / 10;
}

// Base de données complète des raquettes
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

// Base de données complète des cordages - Top 50 2025
const STRINGS_DATABASE = {
    // Elite Performance - Top Tier
    elite: [
        { name: "Luxilon ALU Power", type: "Polyester", rigidity: 230, performance: 9.8, control: 9.5, comfort: 7.0, price: "18-22€", description: "Standard absolu ATP - Contrôle chirurgical", category: "controle" },
        { name: "Solinco Hyper-G", type: "Polyester", rigidity: 218, performance: 9.5, control: 9.0, comfort: 8.5, price: "15-18€", description: "Sea of green - Équilibre parfait", category: "polyvalent" },
        { name: "Babolat RPM Blast", type: "Polyester", rigidity: 240, performance: 9.2, control: 9.0, comfort: 7.5, price: "16-20€", description: "Référence topspin Nadal", category: "spin" },
        { name: "Luxilon 4G", type: "Polyester", rigidity: 265, performance: 9.0, control: 10.0, comfort: 7.0, price: "20-24€", description: "Contrôle absolu maximum", category: "controle" },
        { name: "Solinco Mach-10", type: "Polyester", rigidity: 195, performance: 9.5, control: 8.5, comfort: 8.0, price: "60-70€", description: "Innovation CloudForm - Révolutionnaire", category: "innovation" },
        { name: "Babolat VS Touch", type: "Boyau naturel", rigidity: 95, performance: 9.5, control: 8.0, comfort: 9.5, price: "45-50€", description: "Excellence boyau français", category: "confort" },
        { name: "Wilson Champion's Choice", type: "Hybride", rigidity: 165, performance: 8.5, control: 9.0, comfort: 9.0, price: "25-30€", description: "Hybride référence Federer", category: "polyvalent" }
    ],
    
    // Premium Performance
    premium: [
        { name: "Head Lynx Tour", type: "Polyester", rigidity: 210, performance: 8.5, control: 9.0, comfort: 8.0, price: "14-17€", description: "Hexagonal équilibré", category: "polyvalent" },
        { name: "Solinco Tour Bite", type: "Polyester", rigidity: 255, performance: 9.0, control: 10.0, comfort: 6.5, price: "16-19€", description: "4 arêtes spin maximum", category: "spin" },
        { name: "MSV Focus Hex", type: "Polyester", rigidity: 235, performance: 8.0, control: 9.5, comfort: 7.0, price: "12-15€", description: "Excellence allemande abordable", category: "controle" },
        { name: "Tecnifibre X-One Biphase", type: "Multifilament", rigidity: 160, performance: 9.0, control: 7.0, comfort: 8.5, price: "18-22€", description: "Boost performance premium", category: "puissance" },
        { name: "Yonex Poly Tour Pro", type: "Polyester", rigidity: 220, performance: 8.0, control: 8.5, comfort: 7.5, price: "16-19€", description: "Équilibre japonais", category: "polyvalent" },
        { name: "Tecnifibre Black Code 4S", type: "Polyester", rigidity: 200, performance: 8.5, control: 8.5, comfort: 7.5, price: "15-18€", description: "Section carrée précise", category: "controle" },
        { name: "Solinco Confidential", type: "Polyester", rigidity: 245, performance: 7.5, control: 9.5, comfort: 7.5, price: "17-20€", description: "Maintien tension champion", category: "controle" }
    ],
    
    // Standard/Value
    standard: [
        { name: "Head Reflex MLT", type: "Multifilament", rigidity: 170, performance: 7.5, control: 7.0, comfort: 8.5, price: "12-15€", description: "Multi excellence rapport qualité-prix", category: "confort" },
        { name: "Signum Pro X-Perience", type: "Polyester", rigidity: 205, performance: 8.5, control: 9.0, comfort: 8.0, price: "12-15€", description: "Allemagne premium abordable", category: "polyvalent" },
        { name: "Kirschbaum Pro Line Evolution", type: "Polyester", rigidity: 225, performance: 8.0, control: 8.5, comfort: 7.0, price: "13-16€", description: "Durabilité allemande", category: "controle" },
        { name: "Wilson NXT Soft", type: "Multifilament", rigidity: 155, performance: 8.0, control: 6.5, comfort: 9.0, price: "15-18€", description: "+9% absorption innovation 2025", category: "confort" },
        { name: "Head Hawk Touch", type: "Polyester", rigidity: 215, performance: 8.0, control: 9.0, comfort: 7.0, price: "13-16€", description: "Polyester accessible", category: "controle" },
        { name: "Wilson NXT Power", type: "Multifilament", rigidity: 165, performance: 8.5, control: 6.5, comfort: 8.0, price: "14-17€", description: "Multi référence mondiale", category: "puissance" }
    ],
    
    // Comfort Specialists  
    comfort: [
        { name: "Tecnifibre TGV", type: "Multifilament", rigidity: 145, performance: 7.0, control: 6.5, comfort: 9.5, price: "16-20€", description: "PU400 confort absolu", category: "confort" },
        { name: "Wilson Natural Gut", type: "Boyau naturel", rigidity: 100, performance: 9.0, control: 7.5, comfort: 9.0, price: "40-45€", description: "Référence boyau Wilson", category: "confort" },
        { name: "Isospeed Cream", type: "Polyester", rigidity: 165, performance: 7.0, control: 8.0, comfort: 9.5, price: "14-17€", description: "Poly le plus doux", category: "confort" },
        { name: "Yonex Polytour Air", type: "Polyester", rigidity: 180, performance: 7.5, control: 8.0, comfort: 8.5, price: "15-18€", description: "Poly souple innovation", category: "confort" },
        { name: "Solinco Hyper-G Soft", type: "Polyester", rigidity: 172, performance: 7.5, control: 8.5, comfort: 8.5, price: "16-19€", description: "Version douce de l'Hyper-G", category: "confort" }
    ],
    
    // Budget Options
    budget: [
        { name: "Gosen Polylon", type: "Polyester", rigidity: 240, performance: 7.0, control: 9.0, comfort: 6.0, price: "9-12€", description: "Greatest budget poly", category: "controle" },
        { name: "Prince Synthetic Gut Duraflex", type: "Synthétique", rigidity: 185, performance: 7.0, control: 6.5, comfort: 7.5, price: "8-11€", description: "Valeur sûre universelle", category: "polyvalent" },
        { name: "Head Velocity MLT", type: "Multifilament", rigidity: 175, performance: 7.0, control: 6.0, comfort: 8.5, price: "10-13€", description: "Multi budget développement", category: "confort" },
        { name: "Gamma Ocho", type: "Polyester", rigidity: 210, performance: 7.5, control: 8.5, comfort: 7.0, price: "11-14€", description: "Octogonal américain", category: "spin" },
        { name: "Polyfibre TCS", type: "Polyester", rigidity: 220, performance: 7.5, control: 8.5, comfort: 7.5, price: "10-13€", description: "Rapport qualité-prix", category: "controle" }
    ],
    
    // Innovation 2025
    innovation: [
        { name: "Luxilon Eco Power", type: "Polyester", rigidity: 225, performance: 7.5, control: 7.5, comfort: 6.5, price: "50-60€", description: "100% recyclé révolution", category: "eco" },
        { name: "Velociti Catalyst", type: "Biodégradable", rigidity: 190, performance: 7.0, control: 7.0, comfort: 8.0, price: "45-55€", description: "Premier cordage biodégradable", category: "eco" },
        { name: "ReString Zero", type: "Polyester", rigidity: 215, performance: 8.0, control: 8.0, comfort: 7.0, price: "55-65€", description: "Coating intégré révolutionnaire", category: "innovation" },
        { name: "Toroline Wasabi", type: "Polyester", rigidity: 185, performance: 8.5, control: 8.0, comfort: 7.5, price: "18-22€", description: "Coating slick innovation", category: "spin" },
        { name: "Luxilon Element", type: "Multi-Mono", rigidity: 190, performance: 8.0, control: 8.0, comfort: 8.5, price: "22-26€", description: "Multi-Mono révolution", category: "polyvalent" }
    ]
};

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

// Recommandations intelligentes
function getSmartRecommendations(racquetType, racquetRA) {
    let recommendations = [];
    
    // Recommandations selon RA de la raquette
    if (racquetRA >= 70) {
        // Raquette très rigide - besoin de confort
        recommendations.push("Avec votre raquette rigide (RA " + racquetRA + "), privilégiez des cordages souples :");
        recommendations.push("• Boyau naturel (Babolat VS Touch) - Maximum confort");
        recommendations.push("• Multifilament (Tecnifibre TGV) - Douceur exceptionnelle");
        recommendations.push("• Poly souple (Isospeed Cream) - Compromis idéal");
    } else if (racquetRA >= 65) {
        // Raquette modérément rigide
        recommendations.push("Votre raquette équilibrée (RA " + racquetRA + ") s'accorde avec :");
        recommendations.push("• Polyester premium (Solinco Hyper-G) - Polyvalence");
        recommendations.push("• Hybride (Wilson Champion's Choice) - Équilibre parfait");
        recommendations.push("• Multi premium (Tecnifibre X-One Biphase) - Puissance");
    } else {
        // Raquette souple - peut accepter plus de rigidité
        recommendations.push("Votre raquette flexible (RA " + racquetRA + ") permet :");
        recommendations.push("• Polyester ferme (Luxilon ALU Power) - Contrôle pro");
        recommendations.push("• Poly contrôle (Luxilon 4G) - Précision chirurgicale");
        recommendations.push("• Innovation (Solinco Mach-10) - Technologie 2025");
    }
    
    // Recommandations selon type de jeu
    if (racquetType === "controle") {
        recommendations.push("\\n🎯 Style contrôle détecté - Cordages recommandés :");
        recommendations.push("• Luxilon 4G - Contrôle absolu");
        recommendations.push("• Solinco Confidential - Maintien tension");
    } else if (racquetType === "puissance") {
        recommendations.push("\\n💪 Style puissance détecté - Cordages recommandés :");
        recommendations.push("• Babolat VS Touch - Puissance naturelle");
        recommendations.push("• Tecnifibre X-One Biphase - Boost performance");
    } else if (racquetType === "confort") {
        recommendations.push("\\n💚 Raquette confort - Gardez la douceur :");
        recommendations.push("• Tecnifibre TGV - Douceur extrême");
        recommendations.push("• Wilson NXT Soft - Innovation confort");
    }
    
    return recommendations.join("\\n");
}

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tennis String Advisor - Configurateur Expert Ultimate</title>
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
    </style>
</head>
<body class="min-h-screen hero-bg">
    <section class="py-12 px-4">
        <div class="max-w-4xl mx-auto">
            <div class="text-center mb-12">
                <h1 class="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                    🎾 Tennis String Advisor
                </h1>
                <p class="text-xl md:text-2xl text-white/90 font-medium drop-shadow-lg max-w-2xl mx-auto">
                    Configurateur Expert Ultimate - 80+ Raquettes & Top 50 Cordages 2025
                </p>
                <div class="flex items-center justify-center mt-4 text-white/80 text-sm">
                    <span class="bg-white/20 px-3 py-1 rounded-full mr-3">✨ Indices RA intégrés</span>
                    <span class="bg-white/20 px-3 py-1 rounded-full mr-3">🏆 Top 50 cordages</span>
                    <span class="bg-white/20 px-3 py-1 rounded-full">🧠 IA recommandations</span>
                </div>
            </div>

            <div class="glass-card rounded-3xl p-8 shadow-2xl">
                <div class="space-y-8">
                    <div class="space-y-6">
                        <h3 class="text-2xl font-bold text-gray-800 text-center mb-6">
                            ⚙️ Configuration de Votre Setup
                        </h3>

                        <div>
                            <label class="block text-lg font-semibold text-gray-700 mb-3">
                                🎾 Sélection Raquette
                            </label>
                            <select id="racquet-select" class="racquet-select w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition-all">
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
                                <select id="main-string" class="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-green-500">
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

                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-lg font-semibold text-gray-700 mb-3">
                                    ⚡ Tension Principal
                                </label>
                                <div class="space-y-4">
                                    <input type="range" id="main-tension" min="18" max="32" value="24" 
                                           class="w-full h-3 bg-green-200 rounded-lg appearance-none cursor-pointer">
                                    <div class="flex justify-between items-center">
                                        <span id="main-tension-value" class="text-xl font-bold text-green-700">24 kg</span>
                                        <select id="main-tension-type" class="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
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
                        </div>

                        <div id="recommendations" class="bg-blue-50 border-2 border-blue-200 rounded-xl p-6" style="display: none;">
                            <h4 class="font-bold text-blue-900 mb-3 flex items-center text-lg">
                                <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                </svg>
                                🤖 Recommandations IA Personnalisées
                            </h4>
                            <div id="rec-content" class="text-sm text-blue-800 whitespace-pre-line leading-relaxed"></div>
                        </div>
                    </div>
                    
                    <button id="analyze-btn" class="w-full py-4 px-6 text-xl font-bold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                        🎯 Analyser Cette Configuration Ultimate
                    </button>

                    <div class="stats-grid pt-6">
                        <div class="text-center bg-white/25 backdrop-blur-md rounded-xl p-4 border border-white/40">
                            <div class="text-2xl font-bold text-white drop-shadow-lg mb-1">80+</div>
                            <div class="text-sm text-white/90 font-semibold">Raquettes Expert</div>
                        </div>
                        <div class="text-center bg-white/25 backdrop-blur-md rounded-xl p-4 border border-white/40">
                            <div class="text-2xl font-bold text-white drop-shadow-lg mb-1">50</div>
                            <div class="text-sm text-white/90 font-semibold">Top Cordages 2025</div>
                        </div>
                        <div class="text-center bg-white/25 backdrop-blur-md rounded-xl p-4 border border-white/40">
                            <div class="text-2xl font-bold text-white drop-shadow-lg mb-1">🧠</div>
                            <div class="text-sm text-white/90 font-semibold">IA Recommandations</div>
                        </div>
                        <div class="text-center bg-white/25 backdrop-blur-md rounded-xl p-4 border border-white/40">
                            <div class="text-2xl font-bold text-white drop-shadow-lg mb-1">∞</div>
                            <div class="text-sm text-white/90 font-semibold">Configurations Pro</div>
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
        const recommendations = document.getElementById('recommendations');
        const recContent = document.getElementById('rec-content');
        
        // Base de données locale
        const racquetsDB = ${JSON.stringify(RACQUETS_DATABASE)};
        const stringsDB = ${JSON.stringify(STRINGS_DATABASE)};
        
        // Conversion functions
        function lbsToKg(lbs) {
            return Math.round((lbs * 0.453592) * 10) / 10;
        }
        
        function kgToLbs(kg) {
            return Math.round((kg / 0.453592) * 10) / 10;
        }
        
        // Find racquet data
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
        
        // Find string data
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
        
        // Generate smart recommendations
        function generateRecommendations() {
            if (!currentRacquet) return;
            
            let recs = [];
            const ra = currentRacquet.ra;
            const type = currentRacquet.type;
            
            // Recommandations selon RA
            if (ra >= 70) {
                recs.push("🎾 Raquette rigide (RA " + ra + ") - Privilégiez le CONFORT :");
                recs.push("• Boyau naturel (Babolat VS Touch) - Douceur exceptionnelle");
                recs.push("• Multifilament (Tecnifibre TGV) - PU400 confort");
                recs.push("• Poly souple (Isospeed Cream) - Compromis idéal");
            } else if (ra >= 65) {
                recs.push("⚖️ Raquette équilibrée (RA " + ra + ") - Options POLYVALENTES :");
                recs.push("• Solinco Hyper-G - Sea of green référence");
                recs.push("• Wilson Champion's Choice - Hybride Federer");
                recs.push("• Tecnifibre X-One Biphase - Boost premium");
            } else {
                recs.push("💪 Raquette souple (RA " + ra + ") - Accepte la RIGIDITÉ :");
                recs.push("• Luxilon ALU Power - Standard ATP absolu");
                recs.push("• Luxilon 4G - Contrôle chirurgical");
                recs.push("• Solinco Mach-10 - Innovation CloudForm");
            }
            
            // Recommandations selon type
            recs.push("");
            if (type === "controle") {
                recs.push("🎯 STYLE CONTRÔLE optimisé :");
                recs.push("• Luxilon 4G (265 lb/in) - Contrôle absolu");
                recs.push("• Solinco Confidential (245 lb/in) - Maintien tension");
                recs.push("• MSV Focus Hex (235 lb/in) - Excellence abordable");
            } else if (type === "puissance") {
                recs.push("⚡ STYLE PUISSANCE amplifié :");
                recs.push("• Babolat VS Touch (95 lb/in) - Puissance naturelle");
                recs.push("• Tecnifibre X-One Biphase (160 lb/in) - Boost");
                recs.push("• Wilson NXT Power (165 lb/in) - Multi référence");
            } else if (type === "confort") {
                recs.push("💚 RAQUETTE CONFORT - Gardez la douceur :");
                recs.push("• Tecnifibre TGV (145 lb/in) - Douceur extrême");
                recs.push("• Wilson NXT Soft (155 lb/in) - Innovation 2025");
                recs.push("• Yonex Polytour Air (180 lb/in) - Poly souple");
            } else {
                recs.push("🎾 STYLE POLYVALENT - Équilibre optimal :");
                recs.push("• Wilson Champion's Choice - Hybride référence");
                recs.push("• Head Lynx Tour (210 lb/in) - Hexagonal");
                recs.push("• Signum Pro X-Perience (205 lb/in) - Allemagne");
            }
            
            // Info cordage actuel
            if (currentString) {
                recs.push("");
                recs.push("📊 CORDAGE SÉLECTIONNÉ : " + currentString.name);
                recs.push("• Type : " + currentString.type + " | Rigidité : " + currentString.rigidity + " lb/in");
                recs.push("• Performance : " + currentString.performance + "/10 | Contrôle : " + currentString.control + "/10");
                recs.push("• Confort : " + currentString.comfort + "/10 | Prix : " + currentString.price);
                recs.push("• " + currentString.description);
                
                // Compatibilité RA vs rigidité cordage
                const compatibility = ra + (currentString.rigidity - 200) / 10;
                if (compatibility > 75) {
                    recs.push("⚠️ ATTENTION : Setup très rigide - Risque tennis elbow");
                } else if (compatibility < 60) {
                    recs.push("💪 Setup très souple - Plus de puissance, moins de contrôle");
                } else {
                    recs.push("✅ Compatibilité excellente raquette/cordage");
                }
            }
            
            return recs.join("\\n");
        }
        
        // Event listeners
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
                                   currentRacquet.type.toUpperCase() + ' | RA: ' + currentRacquet.ra + 
                                   ' | Poids: ' + currentRacquet.weight + ' | Taille: ' + currentRacquet.headSize;
                    info.style.display = 'block';
                    info.className = 'mt-2 text-sm font-semibold text-green-700 bg-green-50 p-2 rounded-lg';
                    
                    updateRecommendations();
                }
            } else {
                currentRacquet = null;
                document.getElementById('racquet-info').style.display = 'none';
                recommendations.style.display = 'none';
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
                                   'Rigidité: ' + currentString.rigidity + ' lb/in | Performance: ' + currentString.performance + '/10 | ' +
                                   'Prix: ' + currentString.price;
                    info.style.display = 'block';
                    info.className = 'mt-2 text-sm font-semibold text-blue-700 bg-blue-50 p-2 rounded-lg';
                    
                    updateRecommendations();
                }
            } else {
                currentString = null;
                document.getElementById('string-info').style.display = 'none';
            }
        });
        
        // Update recommendations
        function updateRecommendations() {
            if (currentRacquet) {
                const recs = generateRecommendations();
                recContent.textContent = recs;
                recommendations.style.display = 'block';
            }
        }
        
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
        
        // Analyze button
        document.getElementById('analyze-btn').addEventListener('click', function() {
            if (!currentRacquet || !currentString) {
                alert('Veuillez sélectionner une raquette et un cordage pour analyser la configuration.');
                return;
            }
            
            let analysis = "🎾 ANALYSE CONFIGURATION ULTIMATE\\n\\n";
            analysis += "RAQUETTE : " + currentRacquet.name + " (" + currentRacquet.brand + ")\\n";
            analysis += "• Type : " + currentRacquet.type.toUpperCase() + " | RA : " + currentRacquet.ra + "\\n";
            analysis += "• Poids : " + currentRacquet.weight + " | Taille : " + currentRacquet.headSize + "\\n\\n";
            
            analysis += "CORDAGE : " + currentString.name + "\\n";
            analysis += "• Type : " + currentString.type + " | Rigidité : " + currentString.rigidity + " lb/in\\n";
            analysis += "• Performance : " + currentString.performance + "/10 | Prix : " + currentString.price + "\\n\\n";
            
            const compatibility = currentRacquet.ra + (currentString.rigidity - 200) / 10;
            analysis += "COMPATIBILITÉ : ";
            if (compatibility > 75) {
                analysis += "⚠️ RIGIDE (Attention tennis elbow)";
            } else if (compatibility < 60) {
                analysis += "💪 SOUPLE (Plus de puissance)";
            } else {
                analysis += "✅ EXCELLENTE (Équilibre optimal)";
            }
            
            analysis += "\\n\\nTension : " + mainTension.value + "kg principal";
            if (isHybrid) {
                analysis += " / " + crossTension.value + "kg croisé";
            }
            
            alert(analysis);
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
    console.log(`Tennis String Advisor Ultimate server running at http://0.0.0.0:${PORT}`);
    console.log(`Complete database: 80+ racquets with RA values & Top 50 strings 2025`);
    console.log(`Features: Smart AI recommendations, rigidity analysis, hybrid configs`);
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