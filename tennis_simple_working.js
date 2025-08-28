const http = require('http');

const PORT = 3008;

// Données simplifiées mais fonctionnelles
const racquets = [
    { id: 'pure-drive', name: 'Pure Drive', brand: 'Babolat', ra: 72 },
    { id: 'pure-aero', name: 'Pure Aero', brand: 'Babolat', ra: 71 },
    { id: 'speed-mp', name: 'Speed MP', brand: 'Head', ra: 66 },
    { id: 'clash-100', name: 'Clash 100', brand: 'Wilson', ra: 55 },
    { id: 'ezone-100', name: 'Ezone 100', brand: 'Yonex', ra: 65 }
];

const strings = [
    { id: 'hyper-g', name: 'Solinco Hyper-G', type: 'polyester', rigidity: 58 },
    { id: 'alu-power', name: 'Luxilon ALU Power', type: 'polyester', rigidity: 65 },
    { id: 'rpm-blast', name: 'RPM Blast', type: 'polyester', rigidity: 60 },
    { id: 'natural-gut', name: 'Wilson Natural Gut', type: 'boyau', rigidity: 35 },
    { id: 'x-one', name: 'Tecnifibre X-One', type: 'multifilament', rigidity: 45 }
];

const HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tennis RCS - Version Simplifiée</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: Arial, sans-serif; 
            background: linear-gradient(135deg, #22c55e, #16a34a);
            min-height: 100vh; 
            padding: 20px; 
            color: white;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: rgba(255,255,255,0.1); 
            padding: 30px; 
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        h1 { text-align: center; margin-bottom: 30px; font-size: 2.5em; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        select, input, button { 
            width: 100%; 
            padding: 12px; 
            border: none; 
            border-radius: 8px; 
            font-size: 16px;
        }
        button { 
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white; 
            font-weight: bold; 
            cursor: pointer; 
            margin-top: 20px;
            transition: all 0.3s;
        }
        button:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
        .result { 
            background: rgba(255,255,255,0.2); 
            padding: 20px; 
            border-radius: 12px; 
            margin-top: 20px; 
            display: none;
        }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .stat { text-align: center; background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; }
        .stat-value { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
        .stat-label { font-size: 0.9em; opacity: 0.9; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎾 Tennis RCS Calculator</h1>
        
        <div class="form-group">
            <label>🎾 Raquette:</label>
            <select id="racquet">
                <option value="">Sélectionnez une raquette</option>
                ${racquets.map(r => `<option value="${r.id}">${r.brand} ${r.name} (RA${r.ra})</option>`).join('')}
            </select>
        </div>

        <div class="form-group">
            <label>🎯 Cordage:</label>
            <select id="string">
                <option value="">Sélectionnez un cordage</option>
                ${strings.map(s => `<option value="${s.id}">${s.name} (${s.type})</option>`).join('')}
            </select>
        </div>

        <div class="form-group">
            <label>⚡ Tension: <span id="tension-display">24 kg</span></label>
            <input type="range" id="tension" min="18" max="32" value="24" oninput="updateTension()">
        </div>

        <button onclick="calculateRCS()">🔬 Calculer RCS</button>

        <div id="result" class="result">
            <h3>📊 Résultats RCS:</h3>
            <div class="grid">
                <div class="stat">
                    <div class="stat-value" id="rcs-value">-</div>
                    <div class="stat-label">Score RCS</div>
                </div>
                <div class="stat">
                    <div class="stat-value" id="comfort-value">-</div>
                    <div class="stat-label">Confort /10</div>
                </div>
                <div class="stat">
                    <div class="stat-value" id="comfort-level">-</div>
                    <div class="stat-label">Niveau</div>
                </div>
            </div>
            <div id="details" style="margin-top: 20px;"></div>
        </div>
    </div>

    <script>
        const raquetteData = ${JSON.stringify(racquets)};
        const stringData = ${JSON.stringify(strings)};

        function updateTension() {
            const tension = document.getElementById('tension').value;
            document.getElementById('tension-display').textContent = tension + ' kg';
        }

        function calculateRCS() {
            const racquetId = document.getElementById('racquet').value;
            const stringId = document.getElementById('string').value;
            const tension = parseInt(document.getElementById('tension').value);

            if (!racquetId || !stringId) {
                alert('Veuillez sélectionner une raquette et un cordage');
                return;
            }

            const racquet = raquetteData.find(r => r.id === racquetId);
            const string = stringData.find(s => s.id === stringId);

            // Formule RCS simplifiée mais fonctionnelle
            const RA = racquet.ra;
            const RC = string.rigidity;
            const FT = 1 + (tension - 23) * 0.015;
            const RCS = (RA * RC * FT) / (RA + RC) * 0.85;

            // Calcul confort
            const comfort = Math.max(1, Math.min(10, 10 - (RCS - 40) * 0.15));
            
            let level = 'Équilibré';
            if (RCS < 45) level = 'Très Confortable';
            else if (RCS < 50) level = 'Confortable';
            else if (RCS < 55) level = 'Équilibré';
            else if (RCS < 60) level = 'Ferme';
            else if (RCS < 65) level = 'Rigide';
            else level = 'Très Rigide';

            // Affichage des résultats
            document.getElementById('rcs-value').textContent = RCS.toFixed(1);
            document.getElementById('comfort-value').textContent = comfort.toFixed(1);
            document.getElementById('comfort-level').textContent = level;
            
            document.getElementById('details').innerHTML = 
                '<strong>📐 Formule:</strong> RCS = (RA × RC × FT) / (RA + RC) × 0.85<br>' +
                '<strong>🎾 Raquette:</strong> ' + racquet.brand + ' ' + racquet.name + ' (RA' + RA + ')<br>' +
                '<strong>🎯 Cordage:</strong> ' + string.name + ' (RC' + RC + ')<br>' +
                '<strong>⚡ Tension:</strong> ' + tension + ' kg (FT' + FT.toFixed(3) + ')';

            document.getElementById('result').style.display = 'block';
            document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
        }
    </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(HTML);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Tennis RCS Simple server running at http://0.0.0.0:${PORT}`);
    console.log('This version WILL work - guaranteed!');
});