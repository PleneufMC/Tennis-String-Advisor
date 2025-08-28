const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3006;

// HTML content embedded directly
const HTML_CONTENT = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tennis String Advisor - Configurateur Complet</title>
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
        .hybrid-toggle { transition: all 0.3s ease; }
        .hybrid-active { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; }
        .string-section { transition: all 0.3s ease; }
        .string-section.disabled { opacity: 0.5; pointer-events: none; }
    </style>
</head>
<body class="font-sans antialiased bg-white">
    <section class="relative min-h-screen hero-bg">
        <div class="absolute inset-0 bg-black/40"></div>
        
        <div class="relative container mx-auto px-6 py-20 flex items-center min-h-screen">
            <div class="grid lg:grid-cols-2 gap-12 items-center w-full">
                <div class="space-y-8">
                    <div class="inline-flex items-center space-x-3 bg-white/25 backdrop-blur-md text-white px-6 py-3 rounded-full text-lg font-bold border border-white/40">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span>Configurateur Expert</span>
                    </div>

                    <div class="space-y-6">
                        <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl">
                            Configurez Votre
                            <span class="block text-yellow-300 drop-shadow-2xl mt-2">Setup Parfait</span>
                            <span class="block mt-2">Raquette & Cordage</span>
                        </h1>
                        <p class="text-xl md:text-2xl text-white/95 max-w-3xl leading-relaxed drop-shadow-lg font-medium">
                            Sélectionnez votre raquette, choisissez votre cordage et définissez la tension pour créer la configuration idéale.
                        </p>
                    </div>

                    <div class="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50">
                        <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <svg class="w-7 h-7 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                            </svg>
                            Configurateur de Setup Complet
                        </h3>
                        
                        <div class="space-y-6 mb-8">
                            <div>
                                <label class="block text-lg font-bold text-gray-800 mb-3">🎾 Choisir une Raquette</label>
                                <select id="racquet-select" class="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition-all">
                                    <option value="">Sélectionnez votre raquette</option>
                                    <optgroup label="🔥 Raquettes Populaires">
                                        <option value="babolat-pure-drive">Babolat Pure Drive (300g, 100in²)</option>
                                        <option value="wilson-clash-100">Wilson Clash 100 (295g, 100in²)</option>
                                        <option value="head-speed-mp">Head Speed MP (300g, 100in²)</option>
                                        <option value="yonex-ezone-100">Yonex Ezone 100 (300g, 100in²)</option>
                                    </optgroup>
                                    <optgroup label="⚡ Raquettes Puissance">
                                        <option value="babolat-pure-aero">Babolat Pure Aero (300g, 100in²)</option>
                                        <option value="wilson-ultra-100">Wilson Ultra 100 (300g, 100in²)</option>
                                        <option value="prince-textreme-tour">Prince Textreme Tour (305g, 100in²)</option>
                                    </optgroup>
                                    <optgroup label="🎯 Raquettes Contrôle">
                                        <option value="wilson-pro-staff-rf97">Wilson Pro Staff RF97 (340g, 97in²)</option>
                                        <option value="head-prestige-mp">Head Prestige MP (320g, 98in²)</option>
                                        <option value="wilson-blade-98">Wilson Blade 98 (305g, 98in²)</option>
                                    </optgroup>
                                </select>
                            </div>
                            
                            <div class="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                                <div class="flex items-center justify-between mb-3">
                                    <label class="text-lg font-bold text-gray-800">🔧 Configuration</label>
                                    <button id="hybrid-toggle" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hybrid-toggle hover:bg-gray-300 transition-all">
                                        💡 Passer en Hybride
                                    </button>
                                </div>
                                <p id="config-description" class="text-sm text-gray-600">
                                    Configuration standard avec un seul type de cordage
                                </p>
                            </div>

                            <div id="main-string-section" class="string-section">
                                <label class="block text-lg font-bold text-gray-800 mb-3">🧵 Cordage Principal</label>
                                <select id="main-string-select" class="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition-all">
                                    <option value="">Sélectionnez un cordage</option>
                                    <optgroup label="🔥 Polyester (Contrôle & Durabilité)">
                                        <option value="luxilon-alu-power">Luxilon ALU Power 16L</option>
                                        <option value="babolat-rpm-blast">Babolat RPM Blast 17</option>
                                        <option value="solinco-hyper-g">Solinco Hyper-G 17</option>
                                        <option value="head-lynx">Head Lynx 17</option>
                                        <option value="wilson-revolve">Wilson Revolve 16</option>
                                    </optgroup>
                                    <optgroup label="💎 Multifilament (Confort & Puissance)">
                                        <option value="wilson-nxt">Wilson NXT 16</option>
                                        <option value="babolat-xcel">Babolat Xcel 16</option>
                                        <option value="tecnifibre-x-one">Tecnifibre X-One Biphase 16</option>
                                    </optgroup>
                                    <optgroup label="🥇 Boyau Naturel (Maximum Confort)">
                                        <option value="wilson-natural-gut">Wilson Natural Gut 16</option>
                                        <option value="babolat-vs-gut">Babolat VS Gut 16</option>
                                    </optgroup>
                                </select>
                            </div>

                            <div id="cross-string-section" class="string-section disabled" style="display: none;">
                                <label class="block text-lg font-bold text-gray-800 mb-3">🔄 Cordage Croisé (Hybride)</label>
                                <select id="cross-string-select" class="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all">
                                    <option value="">Sélectionnez le cordage croisé</option>
                                    <optgroup label="💎 Multifilament (Recommandé pour hybride)">
                                        <option value="wilson-nxt">Wilson NXT 16</option>
                                        <option value="babolat-xcel">Babolat Xcel 16</option>
                                        <option value="tecnifibre-x-one">Tecnifibre X-One Biphase 16</option>
                                    </optgroup>
                                    <optgroup label="🥇 Boyau Naturel (Premium)">
                                        <option value="wilson-natural-gut">Wilson Natural Gut 16</option>
                                        <option value="babolat-vs-gut">Babolat VS Gut 16</option>
                                    </optgroup>
                                </select>
                            </div>

                            <div>
                                <label class="block text-lg font-bold text-gray-800 mb-3">⚖️ Tension Principale</label>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <input type="range" id="main-tension" min="40" max="70" value="55" 
                                               class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                                        <div class="flex justify-between text-sm text-gray-600 mt-1">
                                            <span>40 lbs</span>
                                            <span id="main-tension-value" class="font-bold text-green-600">55 lbs</span>
                                            <span>70 lbs</span>
                                        </div>
                                    </div>
                                    <select class="px-4 py-3 border-2 border-gray-300 rounded-xl bg-white">
                                        <option value="lbs">livres (lbs)</option>
                                        <option value="kg">kilos (kg)</option>
                                    </select>
                                </div>
                            </div>

                            <div id="cross-tension-section" style="display: none;">
                                <label class="block text-lg font-bold text-gray-800 mb-3">⚖️ Tension Croisée</label>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <input type="range" id="cross-tension" min="40" max="70" value="53" 
                                               class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                                        <div class="flex justify-between text-sm text-gray-600 mt-1">
                                            <span>40 lbs</span>
                                            <span id="cross-tension-value" class="font-bold text-blue-600">53 lbs</span>
                                            <span>70 lbs</span>
                                        </div>
                                    </div>
                                    <select class="px-4 py-3 border-2 border-gray-300 rounded-xl bg-white">
                                        <option value="lbs">livres (lbs)</option>
                                        <option value="kg">kilos (kg)</option>
                                    </select>
                                </div>
                            </div>

                            <div id="recommendations" class="bg-blue-50 border-2 border-blue-200 rounded-xl p-4" style="display: none;">
                                <h4 class="font-bold text-blue-900 mb-2 flex items-center">
                                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                    </svg>
                                    Recommandations Automatiques
                                </h4>
                                <div id="rec-content" class="text-sm text-blue-800"></div>
                            </div>
                        </div>
                        
                        <button class="w-full py-4 px-6 text-xl font-bold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                            🎯 Analyser Cette Configuration
                        </button>
                    </div>

                    <div class="grid grid-cols-3 gap-6 pt-6">
                        <div class="text-center bg-white/25 backdrop-blur-md rounded-xl p-4 border border-white/40">
                            <div class="text-2xl font-bold text-white drop-shadow-lg mb-1">50+</div>
                            <div class="text-sm text-white/90 font-semibold">Raquettes</div>
                        </div>
                        <div class="text-center bg-white/25 backdrop-blur-md rounded-xl p-4 border border-white/40">
                            <div class="text-2xl font-bold text-white drop-shadow-lg mb-1">100+</div>
                            <div class="text-sm text-white/90 font-semibold">Cordages</div>
                        </div>
                        <div class="text-center bg-white/25 backdrop-blur-md rounded-xl p-4 border border-white/40">
                            <div class="text-2xl font-bold text-white drop-shadow-lg mb-1">∞</div>
                            <div class="text-sm text-white/90 font-semibold">Configurations</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <script>
        let isHybrid = false;
        
        const hybridToggle = document.getElementById('hybrid-toggle');
        const configDescription = document.getElementById('config-description');
        const crossStringSection = document.getElementById('cross-string-section');
        const crossTensionSection = document.getElementById('cross-tension-section');
        const mainTension = document.getElementById('main-tension');
        const crossTension = document.getElementById('cross-tension');
        const mainTensionValue = document.getElementById('main-tension-value');
        const crossTensionValue = document.getElementById('cross-tension-value');
        
        hybridToggle.addEventListener('click', function() {
            isHybrid = !isHybrid;
            
            if (isHybrid) {
                hybridToggle.textContent = '🎾 Configuration Standard';
                hybridToggle.classList.add('hybrid-active');
                configDescription.textContent = 'Configuration hybride avec cordages différents pour vertical et horizontal';
                crossStringSection.style.display = 'block';
                crossTensionSection.style.display = 'block';
                setTimeout(() => {
                    crossStringSection.classList.remove('disabled');
                }, 50);
            } else {
                hybridToggle.textContent = '💡 Passer en Hybride';
                hybridToggle.classList.remove('hybrid-active');
                configDescription.textContent = 'Configuration standard avec un seul type de cordage';
                crossStringSection.classList.add('disabled');
                setTimeout(() => {
                    crossStringSection.style.display = 'none';
                    crossTensionSection.style.display = 'none';
                }, 300);
            }
        });
        
        mainTension.addEventListener('input', function() {
            mainTensionValue.textContent = this.value + ' lbs';
        });
        
        crossTension.addEventListener('input', function() {
            crossTensionValue.textContent = this.value + ' lbs';
        });
        
        document.getElementById('racquet-select').addEventListener('change', updateRecommendations);
        document.getElementById('main-string-select').addEventListener('change', updateRecommendations);
        
        function updateRecommendations() {
            const racquet = document.getElementById('racquet-select').value;
            const string = document.getElementById('main-string-select').value;
            const recommendations = document.getElementById('recommendations');
            const recContent = document.getElementById('rec-content');
            
            if (racquet && string) {
                recommendations.style.display = 'block';
                
                let tensionRec = '';
                if (string.includes('luxilon') || string.includes('rpm') || string.includes('hyper')) {
                    tensionRec = 'Tension recommandée: 48-58 lbs (polyester)';
                } else if (string.includes('nxt') || string.includes('xcel')) {
                    tensionRec = 'Tension recommandée: 52-62 lbs (multifilament)';
                } else if (string.includes('natural') || string.includes('gut')) {
                    tensionRec = 'Tension recommandée: 50-60 lbs (boyau naturel)';
                }
                
                recContent.innerHTML = \`
                    <strong>Raquette:</strong> \${racquet.replace(/-/g, ' ').toUpperCase()}<br>
                    <strong>Cordage:</strong> \${string.replace(/-/g, ' ').toUpperCase()}<br>
                    <strong>\${tensionRec}</strong>
                \`;
            } else {
                recommendations.style.display = 'none';
            }
        }
    </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Serve the embedded HTML for all requests
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
    });
    res.end(HTML_CONTENT);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Tennis String Advisor server running at http://0.0.0.0:${PORT}`);
    console.log('Serving complete configurator with racquet/string/tension selection');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\\nShutting down server gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\\nTerminating server...');
    server.close(() => {
        process.exit(0);
    });
});