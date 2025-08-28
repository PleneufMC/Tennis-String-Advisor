const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3006;

// Store configurations in memory (in production, use a database)
let configurations = [];
let nextId = 1;

// HTML content with rating system
const HTML_CONTENT = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tennis String Advisor - Configurateur avec Système de Rating</title>
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
        
        /* Star Rating Styles */
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
        
        /* Saved Configurations Panel */
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
        
        <div class="relative container mx-auto px-6 py-20 flex items-center min-h-screen">
            <div class="grid lg:grid-cols-2 gap-12 items-center w-full">
                <div class="space-y-8">
                    <div class="inline-flex items-center space-x-3 bg-white/25 backdrop-blur-md text-white px-6 py-3 rounded-full text-lg font-bold border border-white/40">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span>Configurateur Expert avec Rating</span>
                    </div>

                    <div class="space-y-6">
                        <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl">
                            Configurez et Évaluez
                            <span class="block text-yellow-300 drop-shadow-2xl mt-2">Votre Setup Parfait</span>
                        </h1>
                        <p class="text-xl md:text-2xl text-white/95 max-w-3xl leading-relaxed drop-shadow-lg font-medium">
                            Créez, sauvegardez et notez vos configurations de raquette et cordage préférées.
                        </p>
                    </div>

                    <div class="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50">
                        <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <svg class="w-7 h-7 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                            </svg>
                            Configuration de Setup
                        </h3>
                        
                        <!-- Configuration Name -->
                        <div class="mb-6">
                            <label class="block text-lg font-bold text-gray-800 mb-3">📝 Nom de la Configuration</label>
                            <input type="text" id="config-name" placeholder="Ex: Ma config tournoi 2024" 
                                   class="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition-all">
                        </div>
                        
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
                            
                            <div>
                                <label class="block text-lg font-bold text-gray-800 mb-3">🧵 Cordage Principal (Vertical)</label>
                                <select id="main-string-select" class="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition-all">
                                    <option value="">Sélectionnez votre cordage</option>
                                    <optgroup label="🥇 Polyester">
                                        <option value="luxilon-alu-power">Luxilon ALU Power 1.25mm</option>
                                        <option value="babolat-rpm-blast">Babolat RPM Blast 1.25mm</option>
                                        <option value="solinco-hyper-g">Solinco Hyper-G 1.25mm</option>
                                    </optgroup>
                                    <optgroup label="💪 Multifilament">
                                        <option value="wilson-nxt">Wilson NXT 1.30mm</option>
                                        <option value="technifibre-xcel">Technifibre X-One Biphase 1.30mm</option>
                                    </optgroup>
                                    <optgroup label="👑 Boyau Naturel">
                                        <option value="babolat-natural-gut">Babolat VS Touch 1.30mm</option>
                                        <option value="wilson-natural-gut">Wilson Natural Gut 1.30mm</option>
                                    </optgroup>
                                </select>
                            </div>
                            
                            <div id="cross-string-section" class="string-section" style="display: none;">
                                <label class="block text-lg font-bold text-gray-800 mb-3">🧵 Cordage Croisé (Horizontal)</label>
                                <select id="cross-string-select" class="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition-all">
                                    <option value="">Sélectionnez votre cordage croisé</option>
                                    <optgroup label="🥇 Polyester">
                                        <option value="luxilon-alu-power-cross">Luxilon ALU Power 1.25mm</option>
                                        <option value="babolat-rpm-blast-cross">Babolat RPM Blast 1.25mm</option>
                                    </optgroup>
                                    <optgroup label="💪 Multifilament">
                                        <option value="wilson-nxt-cross">Wilson NXT 1.30mm</option>
                                        <option value="technifibre-xcel-cross">Technifibre X-One Biphase 1.30mm</option>
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
                                </div>
                            </div>
                        </div>
                        
                        <!-- Save and Rate Section -->
                        <div class="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
                            <h4 class="font-bold text-gray-900 mb-3 flex items-center">
                                ⭐ Évaluer cette configuration
                            </h4>
                            <div class="star-rating" id="star-rating">
                                <span class="star" data-rating="1">★</span>
                                <span class="star" data-rating="2">★</span>
                                <span class="star" data-rating="3">★</span>
                                <span class="star" data-rating="4">★</span>
                                <span class="star" data-rating="5">★</span>
                            </div>
                            <p class="text-sm text-gray-600 mt-2">Cliquez pour noter cette configuration</p>
                        </div>
                        
                        <button id="save-config-btn" class="w-full py-4 px-6 text-xl font-bold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 mb-4">
                            💾 Sauvegarder Cette Configuration
                        </button>
                        
                        <button id="analyze-config-btn" class="w-full py-4 px-6 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                            🎯 Analyser Cette Configuration
                        </button>
                    </div>
                </div>
                
                <!-- Saved Configurations Panel -->
                <div class="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50 max-h-[80vh] overflow-y-auto">
                    <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <svg class="w-7 h-7 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                        </svg>
                        Configurations Sauvegardées
                    </h3>
                    
                    <div id="saved-configs-list">
                        <p class="text-gray-500 text-center py-8">Aucune configuration sauvegardée pour le moment</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <script>
        let isHybrid = false;
        let currentRating = 0;
        let savedConfigurations = [];
        
        // Load saved configurations from localStorage
        function loadSavedConfigurations() {
            const saved = localStorage.getItem('tennisConfigurations');
            if (saved) {
                savedConfigurations = JSON.parse(saved);
                updateSavedConfigsList();
            }
        }
        
        // Save configurations to localStorage
        function saveToLocalStorage() {
            localStorage.setItem('tennisConfigurations', JSON.stringify(savedConfigurations));
        }
        
        // Update the saved configurations display
        function updateSavedConfigsList() {
            const listContainer = document.getElementById('saved-configs-list');
            
            if (savedConfigurations.length === 0) {
                listContainer.innerHTML = '<p class="text-gray-500 text-center py-8">Aucune configuration sauvegardée pour le moment</p>';
                return;
            }
            
            // Sort by rating (highest first)
            const sortedConfigs = [...savedConfigurations].sort((a, b) => b.rating - a.rating);
            
            listContainer.innerHTML = sortedConfigs.map(config => {
                const stars = '★'.repeat(config.rating) + '☆'.repeat(5 - config.rating);
                return \`
                    <div class="saved-config-item">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="font-bold text-gray-900">\${config.name || 'Configuration sans nom'}</h4>
                            <span class="text-yellow-500 text-lg">\${stars}</span>
                        </div>
                        <div class="text-sm text-gray-600 space-y-1">
                            <p><strong>Raquette:</strong> \${config.racquet.replace(/-/g, ' ')}</p>
                            <p><strong>Cordage:</strong> \${config.mainString.replace(/-/g, ' ')}</p>
                            \${config.crossString ? \`<p><strong>Cordage croisé:</strong> \${config.crossString.replace(/-/g, ' ')}</p>\` : ''}
                            <p><strong>Tension:</strong> \${config.mainTension} lbs \${config.crossTension ? \`/ \${config.crossTension} lbs\` : ''}</p>
                            <p class="text-xs text-gray-400">Sauvegardé le: \${new Date(config.createdAt).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div class="mt-3 flex gap-2">
                            <button onclick="loadConfiguration('\${config.id}')" class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition">
                                Charger
                            </button>
                            <button onclick="deleteConfiguration('\${config.id}')" class="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition">
                                Supprimer
                            </button>
                        </div>
                    </div>
                \`;
            }).join('');
        }
        
        // Load a configuration
        window.loadConfiguration = function(configId) {
            const config = savedConfigurations.find(c => c.id === configId);
            if (!config) return;
            
            // Set form values
            document.getElementById('config-name').value = config.name || '';
            document.getElementById('racquet-select').value = config.racquet;
            document.getElementById('main-string-select').value = config.mainString;
            document.getElementById('main-tension').value = config.mainTension;
            document.getElementById('main-tension-value').textContent = config.mainTension + ' lbs';
            
            if (config.crossString) {
                // Enable hybrid mode
                isHybrid = true;
                updateHybridMode();
                document.getElementById('cross-string-select').value = config.crossString;
                document.getElementById('cross-tension').value = config.crossTension;
                document.getElementById('cross-tension-value').textContent = config.crossTension + ' lbs';
            } else {
                isHybrid = false;
                updateHybridMode();
            }
            
            // Set rating
            currentRating = config.rating;
            updateStarDisplay();
            
            alert('Configuration chargée avec succès !');
        }
        
        // Delete a configuration
        window.deleteConfiguration = function(configId) {
            if (confirm('Êtes-vous sûr de vouloir supprimer cette configuration ?')) {
                savedConfigurations = savedConfigurations.filter(c => c.id !== configId);
                saveToLocalStorage();
                updateSavedConfigsList();
            }
        }
        
        // Star rating functionality
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                currentRating = index + 1;
                updateStarDisplay();
            });
            
            star.addEventListener('mouseenter', () => {
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
        
        document.getElementById('star-rating').addEventListener('mouseleave', () => {
            updateStarDisplay();
        });
        
        function updateStarDisplay() {
            stars.forEach((star, index) => {
                star.classList.remove('active');
                if (index < currentRating) {
                    star.classList.add('filled');
                } else {
                    star.classList.remove('filled');
                }
            });
        }
        
        // Hybrid mode toggle
        const hybridToggle = document.getElementById('hybrid-toggle');
        const configDescription = document.getElementById('config-description');
        const crossStringSection = document.getElementById('cross-string-section');
        const crossTensionSection = document.getElementById('cross-tension-section');
        
        function updateHybridMode() {
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
        }
        
        hybridToggle.addEventListener('click', function() {
            isHybrid = !isHybrid;
            updateHybridMode();
        });
        
        // Tension sliders
        const mainTension = document.getElementById('main-tension');
        const crossTension = document.getElementById('cross-tension');
        const mainTensionValue = document.getElementById('main-tension-value');
        const crossTensionValue = document.getElementById('cross-tension-value');
        
        mainTension.addEventListener('input', function() {
            mainTensionValue.textContent = this.value + ' lbs';
        });
        
        crossTension.addEventListener('input', function() {
            crossTensionValue.textContent = this.value + ' lbs';
        });
        
        // Save configuration
        document.getElementById('save-config-btn').addEventListener('click', function() {
            const racquet = document.getElementById('racquet-select').value;
            const mainString = document.getElementById('main-string-select').value;
            const configName = document.getElementById('config-name').value;
            
            if (!racquet || !mainString) {
                alert('Veuillez sélectionner au moins une raquette et un cordage principal');
                return;
            }
            
            if (currentRating === 0) {
                alert('Veuillez donner une note à cette configuration');
                return;
            }
            
            const newConfig = {
                id: Date.now().toString(),
                name: configName || \`Config \${new Date().toLocaleDateString('fr-FR')}\`,
                racquet: racquet,
                mainString: mainString,
                crossString: isHybrid ? document.getElementById('cross-string-select').value : null,
                mainTension: mainTension.value,
                crossTension: isHybrid ? crossTension.value : null,
                rating: currentRating,
                createdAt: new Date().toISOString()
            };
            
            savedConfigurations.push(newConfig);
            saveToLocalStorage();
            updateSavedConfigsList();
            
            alert('Configuration sauvegardée avec succès !');
            
            // Reset form
            document.getElementById('config-name').value = '';
            currentRating = 0;
            updateStarDisplay();
        });
        
        // Analyze configuration
        document.getElementById('analyze-config-btn').addEventListener('click', function() {
            const racquet = document.getElementById('racquet-select').value;
            const mainString = document.getElementById('main-string-select').value;
            
            if (!racquet || !mainString) {
                alert('Veuillez sélectionner au moins une raquette et un cordage principal');
                return;
            }
            
            // Simulate analysis
            const analysis = \`
                🎾 Analyse de votre configuration:
                
                Raquette: \${racquet.replace(/-/g, ' ').toUpperCase()}
                Cordage: \${mainString.replace(/-/g, ' ').toUpperCase()}
                Tension: \${mainTension.value} lbs
                
                📊 Caractéristiques:
                - Puissance: ⭐⭐⭐⭐
                - Contrôle: ⭐⭐⭐
                - Confort: ⭐⭐⭐⭐
                - Durabilité: ⭐⭐⭐
                
                💡 Recommandation:
                Cette configuration convient parfaitement aux joueurs de niveau intermédiaire à avancé recherchant un bon équilibre entre puissance et contrôle.
            \`;
            
            alert(analysis);
        });
        
        // Load saved configurations on page load
        loadSavedConfigurations();
    </script>
</body>
</html>`;

// Handle HTTP requests
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // API endpoints for future enhancements
    if (parsedUrl.pathname === '/api/configurations' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(configurations));
        return;
    }
    
    if (parsedUrl.pathname === '/api/configurations' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const config = JSON.parse(body);
                config.id = nextId++;
                config.createdAt = new Date().toISOString();
                configurations.push(config);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(config));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }
    
    // Serve the HTML for all other requests
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
    });
    res.end(HTML_CONTENT);
});

server.listen(PORT, () => {
    console.log(`🎾 Tennis String Advisor with Rating System`);
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📊 Features:`);
    console.log(`   - Save configurations with custom names`);
    console.log(`   - Rate configurations with 1-5 stars`);
    console.log(`   - View and manage saved configurations`);
    console.log(`   - Load previously saved configurations`);
    console.log(`   - Support for hybrid string setups`);
    console.log(`   - Persistent storage using localStorage`);
});