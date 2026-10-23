/**
 * RCS Calculator - Racquet Comfort Score
 * Tennis String Advisor - Proprietary Algorithm
 * © 2025 Tennis String Advisor - A brand of Pleneuf Trading LLC
 * All rights reserved - Reproduction and reverse engineering prohibited
 */

const RCS = {
  _c: [54, 72, 63, 88, 286.9, 18, 30],
  _w: [0.28, 0.42, 0.22, 0.08, 1.02],
  
  get RA_MIN() { return this._c[0]; },
  get RA_MAX() { return this._c[1]; },
  get RA_DEFAULT() { return this._c[2]; },
  get CORDAGE_MIN() { return this._c[3]; },
  get CORDAGE_MAX() { return this._c[4]; },
  get TENSION_MIN() { return this._c[5]; },
  get TENSION_MAX() { return this._c[6]; },

  // TEXTES DES NIVEAUX (11/10/2026, charte F7 : « la santé d'abord »). Ils décrivent ce que l'indice
  // MESURE : sa plage et sa position par rapport aux seuils d'alerte bras du configurateur
  // (src/lib/advanced-rcs.ts : dès 32 pour un bras sensible, dès 35 sinon). Ni public cible, ni effet
  // thérapeutique ou protecteur, ni absolu : une allégation médicale exige une source médicale.
  // Les chiffres cités (plages, seuils, exemples) sont recalculés par le contrôle 20 de
  // `npm run audit:ratings` ; une chaîne qui les contredit ou promet un effet sur la santé le fait échouer.
  DECILES: [
    { 
      min: 11, max: 22, 
      label: 'Very Soft', 
      description: 'At least 11 points under the sensitive-arm alert (32)',
      color: '#006400', 
      textColor: '#ffffff',
      icon: '☁️',
      detailedComment: 'RCS 21 or less. Below both arm alert thresholds of the configurator.',
      targetPlayers: ['RCS 21 or less', 'Sensitive-arm alert: 32', 'Alert for every profile: 35'],
      recommendations: {
        racquet: 'RA 58',
        string: '95 lb/in',
        tension: '20 kg',
        advice: 'Arm alerts of the configurator: from 32 for a sensitive arm, from 35 otherwise. A change of 1 kg in tension moves the index by 0.5 point.'
      }
    },
    { 
      min: 22, max: 24, 
      label: 'Soft', 
      description: '9 to 10 points under the sensitive-arm alert (32)',
      color: '#228B22', 
      textColor: '#ffffff',
      icon: '💚',
      detailedComment: 'RCS 22 to 23. Below both arm alert thresholds of the configurator.',
      targetPlayers: ['RCS 22 to 23', 'Sensitive-arm alert: 32', 'Alert for every profile: 35'],
      recommendations: {
        racquet: 'RA 62',
        string: '150 lb/in',
        tension: '22 kg',
        advice: 'Arm alerts of the configurator: from 32 for a sensitive arm, from 35 otherwise. A change of 1 kg in tension moves the index by 0.5 point.'
      }
    },
    { 
      min: 24, max: 26, 
      label: 'Fairly Soft', 
      description: '7 to 8 points under the sensitive-arm alert (32)',
      color: '#32CD32', 
      textColor: '#000000',
      icon: '🌿',
      detailedComment: 'RCS 24 to 25. Below both arm alert thresholds of the configurator.',
      targetPlayers: ['RCS 24 to 25', 'Sensitive-arm alert: 32', 'Alert for every profile: 35'],
      recommendations: {
        racquet: 'RA 64',
        string: '160 lb/in',
        tension: '23 kg',
        advice: 'Arm alerts of the configurator: from 32 for a sensitive arm, from 35 otherwise. A change of 1 kg in tension moves the index by 0.5 point.'
      }
    },
    { 
      min: 26, max: 27, 
      label: 'Medium-Soft', 
      description: '6 points under the sensitive-arm alert (32)',
      color: '#9ACD32', 
      textColor: '#000000',
      icon: '🌱',
      detailedComment: 'RCS 26. Below both arm alert thresholds of the configurator.',
      targetPlayers: ['RCS 26', 'Sensitive-arm alert: 32', 'Alert for every profile: 35'],
      recommendations: {
        racquet: 'RA 65',
        string: '175 lb/in',
        tension: '24 kg',
        advice: 'Arm alerts of the configurator: from 32 for a sensitive arm, from 35 otherwise. A change of 1 kg in tension moves the index by 0.5 point.'
      }
    },
    { 
      min: 27, max: 28, 
      label: 'Balanced Flexible', 
      description: '5 points under the sensitive-arm alert (32)',
      color: '#FFD700', 
      textColor: '#000000',
      icon: '⚖️',
      detailedComment: 'RCS 27. Below both arm alert thresholds of the configurator.',
      targetPlayers: ['RCS 27', 'Sensitive-arm alert: 32', 'Alert for every profile: 35'],
      recommendations: {
        racquet: 'RA 66',
        string: '180 lb/in',
        tension: '24 kg',
        advice: 'Arm alerts of the configurator: from 32 for a sensitive arm, from 35 otherwise. A change of 1 kg in tension moves the index by 0.5 point.'
      }
    },
    { 
      min: 28, max: 29, 
      label: 'Balanced', 
      description: '4 points under the sensitive-arm alert (32)',
      color: '#FFC000', 
      textColor: '#000000',
      icon: '🎯',
      detailedComment: 'RCS 28. Below both arm alert thresholds of the configurator.',
      targetPlayers: ['RCS 28', 'Sensitive-arm alert: 32', 'Alert for every profile: 35'],
      recommendations: {
        racquet: 'RA 66',
        string: '190 lb/in',
        tension: '24 kg',
        advice: 'Arm alerts of the configurator: from 32 for a sensitive arm, from 35 otherwise. A change of 1 kg in tension moves the index by 0.5 point.'
      }
    },
    { 
      min: 29, max: 31, 
      label: 'Dynamic', 
      description: '2 to 3 points under the sensitive-arm alert (32)',
      color: '#FF8C00', 
      textColor: '#000000',
      icon: '🔥',
      detailedComment: 'RCS 29 to 30. Below both arm alert thresholds of the configurator.',
      targetPlayers: ['RCS 29 to 30', 'Sensitive-arm alert: 32', 'Alert for every profile: 35'],
      recommendations: {
        racquet: 'RA 66',
        string: '200 lb/in',
        tension: '24 kg',
        advice: 'Arm alerts of the configurator: from 32 for a sensitive arm, from 35 otherwise. A change of 1 kg in tension moves the index by 0.5 point.'
      }
    },
    { 
      min: 31, max: 32, 
      label: 'Firm', 
      description: '1 point under the sensitive-arm alert (32)',
      color: '#FF6600', 
      textColor: '#ffffff',
      icon: '💪',
      detailedComment: 'RCS 31. Below both arm alert thresholds of the configurator.',
      targetPlayers: ['RCS 31', 'Sensitive-arm alert: 32', 'Alert for every profile: 35'],
      recommendations: {
        racquet: 'RA 67',
        string: '210 lb/in',
        tension: '25 kg',
        advice: 'Arm alerts of the configurator: from 32 for a sensitive arm, from 35 otherwise. A change of 1 kg in tension moves the index by 0.5 point.'
      }
    },
    { 
      min: 32, max: 34, 
      label: 'Stiff', 
      description: 'Sensitive-arm alert reached (32)',
      color: '#FF4444', 
      textColor: '#ffffff',
      icon: '⚡',
      detailedComment: 'RCS 32 to 33. At or above the arm alert threshold for a sensitive arm; below the threshold for other profiles.',
      targetPlayers: ['RCS 32 to 33', 'Sensitive-arm alert: 32', 'Alert for every profile: 35'],
      recommendations: {
        racquet: 'RA 68',
        string: '220 lb/in',
        tension: '26 kg',
        advice: 'Arm alerts of the configurator: from 32 for a sensitive arm, from 35 otherwise. Lowering the tension by 1 kg lowers the index by 0.5 point; a softer string lowers it too.'
      }
    },
    { 
      min: 34, max: 41, 
      label: 'Extreme', 
      description: 'Above the sensitive-arm alert (32); alert for every profile from 35',
      color: '#CC0000', 
      textColor: '#ffffff',
      icon: '⚠️',
      detailedComment: 'RCS 34 or more. Above the arm alert threshold for a sensitive arm; the threshold for other profiles is reached from 35 (tennis elbow risk).',
      targetPlayers: ['RCS 34 or more', 'Sensitive-arm alert: 32', 'Alert for every profile: 35'],
      recommendations: {
        racquet: 'RA 70',
        string: '245 lb/in',
        tension: '27 kg',
        advice: '⚠️ Arm alerts of the configurator: from 32 for a sensitive arm, from 35 otherwise (tennis elbow risk). Lowering the tension by 1 kg lowers the index by 0.5 point; a softer string lowers it too.'
      }
    }
  ],

  QUINTILES: [
    {
      min: 11, max: 24,
      label: 'Low Index Zone',
      color: '#228B22',
      icon: '💚',
      summary: 'Lowest firmness index',
      description: 'RCS 23 or less. Below both arm alert thresholds of the configurator (from 32 for a sensitive arm, from 35 otherwise).',
      targetRCS: '11-24'
    },
    {
      min: 24, max: 27,
      label: 'Lower-Mid Index Zone',
      color: '#9ACD32',
      icon: '🌿',
      summary: 'Lower-middle firmness index',
      description: 'RCS 24 to 26. Below both arm alert thresholds of the configurator (from 32 for a sensitive arm, from 35 otherwise).',
      targetRCS: '24-27'
    },
    {
      min: 27, max: 29,
      label: 'Mid Index Zone',
      color: '#FFD700',
      icon: '⚖️',
      summary: 'Middle of the scale',
      description: 'RCS 27 to 28. Below both arm alert thresholds of the configurator (from 32 for a sensitive arm, from 35 otherwise).',
      targetRCS: '27-29'
    },
    {
      min: 29, max: 32,
      label: 'Upper-Mid Index Zone',
      color: '#FF8C00',
      icon: '🔥',
      summary: 'Upper-middle, approaching the sensitive-arm alert',
      description: 'RCS 29 to 31. Below both arm alert thresholds of the configurator (from 32 for a sensitive arm, from 35 otherwise).',
      targetRCS: '29-32'
    },
    {
      min: 32, max: 41,
      label: 'High Index Zone',
      color: '#CC0000',
      icon: '⚠️',
      summary: 'Sensitive-arm alert reached or exceeded',
      description: 'RCS 32 or more. The arm alert applies from 32 to a sensitive arm and from 35 to every profile (tennis elbow risk).',
      targetRCS: '32-41'
    }
  ],

  _n1(v) {
    if (v === null || v === undefined) v = this._c[2];
    v = Math.max(this._c[0], Math.min(this._c[1], v));
    return (v - this._c[0]) / (this._c[1] - this._c[0]);
  },

  _n2(v) {
    v = Math.max(this._c[3], Math.min(this._c[4], v));
    return Math.log(v / this._c[3]) / Math.log(this._c[4] / this._c[3]);
  },

  _n3(v) {
    v = Math.max(this._c[5], Math.min(this._c[6], v));
    return (v - this._c[5]) / (this._c[6] - this._c[5]);
  },

  normalizeRA(ra) { return this._n1(ra); },
  normalizeCordage(s) { return this._n2(s); },
  normalizeTension(t) { return this._n3(t); },

  // Constants for hybrid calculation
  HYBRID_MAINS_WEIGHT: 0.60,  // Mains = 60% of impact
  HYBRID_CROSS_WEIGHT: 0.40,  // Crosses = 40% of impact

  /**
   * Calculate equivalent stiffness for hybrid string setup
   * @param {number} mainsStiffness - Mains string stiffness (lb/in)
   * @param {number} crossStiffness - Cross string stiffness (lb/in)
   * @returns {number} Combined equivalent stiffness
   */
  calculateHybridStiffness(mainsStiffness, crossStiffness) {
    return (mainsStiffness * this.HYBRID_MAINS_WEIGHT) + (crossStiffness * this.HYBRID_CROSS_WEIGHT);
  },

  /**
   * RCS calculation for hybrid string configuration
   * @param {number} ra - Racquet stiffness (RA)
   * @param {number} mainsStiffness - Mains string stiffness (lb/in)
   * @param {number} crossStiffness - Cross string stiffness (lb/in)
   * @param {number} tension - Tension (kg)
   * @returns {object} RCS result with hybrid details
   */
  calculateHybrid(ra, mainsStiffness, crossStiffness, tension) {
    const hybridStiffness = this.calculateHybridStiffness(mainsStiffness, crossStiffness);
    const result = this.calculate(ra, hybridStiffness, tension);
    
    // Add hybrid details to result
    result.hybrid = {
      isHybrid: true,
      mainsStiffness: mainsStiffness,
      crossStiffness: crossStiffness,
      combinedStiffness: Math.round(hybridStiffness * 10) / 10,
      mainsContribution: Math.round(mainsStiffness * this.HYBRID_MAINS_WEIGHT * 10) / 10,
      crossContribution: Math.round(crossStiffness * this.HYBRID_CROSS_WEIGHT * 10) / 10,
      formula: `(${mainsStiffness} × ${this.HYBRID_MAINS_WEIGHT}) + (${crossStiffness} × ${this.HYBRID_CROSS_WEIGHT}) = ${Math.round(hybridStiffness * 10) / 10} lb/in`
    };
    
    return result;
  },

  // Formule RCS — MIROIR EXACT de calculateRCS (src/data/strings-database.ts).
  // Harmonisation du 14/08/2026 : ce moteur statique etait reste fige sur une
  // calibration de janvier 2026 (ponderations 0.28/0.42/0.22/0.08, echelle
  // 1-92) pendant que le TypeScript etait recalibre. Un meme montage etait
  // note 28 cote FR et 58 cote EN, sous le meme nom « RCS ».
  // Toute evolution de la formule se fait dans strings-database.ts, PUIS ici.
  calculate(ra, cordageStiffness, tension) {
    const racquetFactor = ra / 70;
    const stringFactor = cordageStiffness / 220;
    const tensionFactor = tension / 24;
    const base = (racquetFactor * 0.4 + stringFactor * 0.4 + tensionFactor * 0.2) * 30;
    const r = Math.round(2 * base - 27);
    const dec = this.getDecile(r);
    const qui = this.getQuintile(r);
    return {
      rcs: r,
      decile: dec,
      quintile: qui,
      details: {
        ra_norm: Math.round(racquetFactor * 1000) / 1000,
        cordage_norm: Math.round(stringFactor * 1000) / 1000,
        tension_norm: Math.round(tensionFactor * 1000) / 1000,
        interaction: 0,
        score_brut: Math.round(base * 1000) / 1000,
        contributions: {
          ra: Math.round(racquetFactor * 0.4 * 30 * 2 * 10) / 10,
          cordage: Math.round(stringFactor * 0.4 * 30 * 2 * 10) / 10,
          tension: Math.round(tensionFactor * 0.2 * 30 * 2 * 10) / 10,
          interaction: 0
        }
      }
    };
  },

  // Bornes = deciles MESURES de la distribution reelle (147 060 combinaisons)
  // sur l'echelle harmonisee. L'ancien floor(rcs/10) supposait une echelle
  // 0-100 qui n'existe plus.
  DECILE_BOUNDS: [22, 24, 26, 27, 28, 29, 31, 32, 34],
  QUINTILE_BOUNDS: [24, 27, 29, 32],

  getDecile(rcs) {
    let i = 0;
    while (i < this.DECILE_BOUNDS.length && rcs >= this.DECILE_BOUNDS[i]) i++;
    return { number: i + 1, ...this.DECILES[i] };
  },

  getQuintile(rcs) {
    let i = 0;
    while (i < this.QUINTILE_BOUNDS.length && rcs >= this.QUINTILE_BOUNDS[i]) i++;
    return { number: i + 1, ...this.QUINTILES[i] };
  },

  findOptimalTension(ra, cordageStiffness, targetRCS) {
    let lo = this._c[5], hi = this._c[6];
    let best = (lo + hi) / 2;
    let bestRes = this.calculate(ra, cordageStiffness, best);
    for (let i = 0; i < 10; i++) {
      const mid = (lo + hi) / 2;
      const res = this.calculate(ra, cordageStiffness, mid);
      if (Math.abs(res.rcs - targetRCS) < Math.abs(bestRes.rcs - targetRCS)) {
        best = mid;
        bestRes = res;
      }
      if (res.rcs < targetRCS) lo = mid;
      else hi = mid;
    }
    return {
      tension: Math.round(best * 10) / 10,
      rcs: bestRes.rcs,
      decile: bestRes.decile,
      quintile: bestRes.quintile
    };
  },

  // armSensitive : profil à bras sensible déclaré. Le configurateur EN pose « tennis_elbow » quand le visiteur
  // coche « Sensitive arm » ou « Fragile shoulder » ; « reeducation » et « senior » ne viennent que du sélecteur
  // de la calculatrice. Ces trois profils sont alertés dès HEALTH_ALERT_SENSITIVE_RCS, les autres dès HEALTH_ALERT_RCS.
  getRecommendations(profile) {
    const p = {
      'reeducation': { targetDecile: [1, 2], rcsRange: [11, 22], description: 'Very low index (RCS 11 to 22)', quintile: 1, armSensitive: true },
      'tennis_elbow': { targetDecile: [1, 3], rcsRange: [11, 24], description: 'Low index (RCS 11 to 24)', quintile: 1, armSensitive: true },
      'senior': { targetDecile: [2, 4], rcsRange: [22, 26], description: 'Low-to-mid index (RCS 22 to 26)', quintile: 2, armSensitive: true },
      'debutant': { targetDecile: [3, 5], rcsRange: [24, 27], description: 'Beginner / Recreational (RCS 24 to 27)', quintile: 2, armSensitive: false },
      'club': { targetDecile: [4, 6], rcsRange: [26, 29], description: 'Club player (RCS 26 to 29)', quintile: 3, armSensitive: false },
      'confirme': { targetDecile: [5, 7], rcsRange: [27, 31], description: 'Advanced club (RCS 27 to 31)', quintile: 3, armSensitive: false },
      'competiteur': { targetDecile: [6, 8], rcsRange: [28, 32], description: 'Competitor (RCS 28 to 32)', quintile: 4, armSensitive: false },
      'expert': { targetDecile: [7, 9], rcsRange: [29, 34], description: 'Expert / Semi-pro (RCS 29 to 34)', quintile: 4, armSensitive: false },
      'pro': { targetDecile: [8, 10], rcsRange: [31, 41], description: 'Pro / Elite (RCS 31 to 41)', quintile: 5, armSensitive: false }
    };
    return p[profile] || p['club'];
  },

  // ABSOLUTE HEALTH THRESHOLD — no player profile can switch it off.
  // Regle 2 du §4 : la sante prime sur la conversion. Avant ce garde-fou, le
  // profil « Pro » (plage 31-41) faisait renvoyer « Configuration optimale »
  // pour un RCS de 40, c'est-a-dire en pleine zone « tres ferme, risque tennis
  // elbow » — l'alerte etait desactivee par la personne qu'elle protege.
  // Valeur alignee sur le palier publie (§1) et sur advanced-rcs.
  HEALTH_ALERT_RCS: 35,

  // Bras sensible déclaré : l'alerte bras du configurateur (advanced-rcs.ts) se déclenche dès 32 pour ces profils,
  // pas dès 35. Même verdict « risque_sante », même icône ; contrôles 9 et 20 de audit:ratings.
  HEALTH_ALERT_SENSITIVE_RCS: 32,

  evaluateForProfile(rcs, profile) {
    const rec = this.getRecommendations(profile);
    const [minRCS, maxRCS] = rec.rcsRange;
    const dec = this.getDecile(rcs);
    if (rcs >= this.HEALTH_ALERT_RCS) {
      return {
        isOk: false,
        status: 'risque_sante',
        message: `Very firm setup (index ${rcs}): tennis elbow risk`,
        suggestion: `Whatever your level, lower the tension or switch to a softer string in the mains. This threshold does not depend on the player profile.`,
        icon: '⚠️'
      };
    }
    if (rec.armSensitive && rcs >= this.HEALTH_ALERT_SENSITIVE_RCS) {
      return {
        isOk: false,
        status: 'risque_sante',
        message: `Firm setup (index ${rcs}): tennis elbow risk for a sensitive arm`,
        suggestion: `Lower the tension or switch to a softer string in the mains. Arm alerts of the configurator: from 32 for a sensitive arm, from 35 otherwise.`,
        icon: '⚠️'
      };
    }
    if (rcs >= minRCS && rcs <= maxRCS) {
      return {
        isOk: true,
        status: 'optimal',
        message: `Index inside the profile range: ${rec.description}`,
        suggestion: dec.recommendations.advice,
        icon: 'ℹ️'
      };
    } else if (rcs < minRCS) {
      return {
        isOk: false,
        status: 'trop_souple',
        message: `Index below the profile range: ${rec.description}`,
        suggestion: `Raising the tension by ${Math.ceil((minRCS - rcs) * 2)} kg or choosing a stiffer string moves the index up toward this range (more control, less comfort). Arm alerts of the configurator: from 32 for a sensitive arm, from 35 otherwise.`,
        icon: '❄️'
      };
    } else {
      return {
        isOk: false,
        status: 'trop_rigide',
        message: `Index above the profile range: ${rec.description}`,
        suggestion: `Lowering the tension by ${Math.ceil((rcs - maxRCS) * 2)} kg or choosing a softer string moves the index down toward this range. Arm alerts of the configurator: from 32 for a sensitive arm, from 35 otherwise.`,
        icon: '🔥'
      };
    }
  },

  // ALERTES DE SANTÉ : seuils 32 (bras sensible) et 35 (tous profils), ceux de advanced-rcs.ts, contrôlés
  // par le contrôle 20. Elles ne se suppriment ni ne s'adoucissent (règle 2) ; seule leur clarté peut changer.
  getHealthWarning(rcs) {
    if (rcs >= 35) {
      return {
        level: 'danger',
        icon: '⚠️',
        title: 'Warning - High stress',
        message: 'Index 35 or more: arm alert threshold for every profile (tennis elbow risk). This configuration generates significant joint stress. Not recommended for occasional players or those with injury history.',
        tips: [
          'Complete warm-up mandatory (15-20 min)',
          'Watch for any signs of elbow or shoulder pain',
          'Limit session duration',
          'Consult a health professional if pain or discomfort persists'
        ]
      };
    } else if (rcs >= 32) {
      return {
        level: 'warning',
        icon: '⚡',
        title: 'Demanding configuration',
        message: 'Index 32 to 34: arm alert threshold for a sensitive arm reached (the threshold for other profiles is 35). Performing but physically demanding setup. Make sure you have good physical condition.',
        tips: [
          'Serious warm-up recommended',
          'Stay well hydrated',
          'Respect your recovery times'
        ]
      };
    }
    return null;
  },

  simulateMatrix(raValues, cordageValues, tensionValues) {
    const results = [];
    for (const ra of raValues) {
      for (const cordage of cordageValues) {
        for (const tension of tensionValues) {
          const result = this.calculate(ra, cordage, tension);
          results.push({ ra, cordage, tension, ...result });
        }
      }
    }
    return results;
  },

  generateDecileDetailHTML(decile) {
    return `
      <div class="decile-detail p-4 rounded-lg border-2" style="border-color: ${decile.color}; background: ${decile.color}15;">
        <div class="flex items-center gap-3 mb-3">
          <span class="text-3xl">${decile.icon}</span>
          <div>
            <h4 class="font-bold text-lg" style="color: ${decile.color};">D${decile.number} - ${decile.label}</h4>
            <p class="text-sm text-gray-600">${decile.description}</p>
          </div>
        </div>
        <p class="text-gray-700 mb-4">${decile.detailedComment}</p>
        <div class="mb-4">
          <h5 class="font-semibold text-sm text-gray-700 mb-2">📍 Key figures:</h5>
          <div class="flex flex-wrap gap-2">
            ${decile.targetPlayers.map(p => `<span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">${p}</span>`).join('')}
          </div>
        </div>
        <div class="bg-white rounded-lg p-3 space-y-2">
          <h5 class="font-semibold text-sm text-gray-700 mb-2">📐 Example inputs for this range:</h5>
          <div class="text-sm space-y-1">
            <p><span class="font-medium">🎾 Racquet:</span> ${decile.recommendations.racquet}</p>
            <p><span class="font-medium">🧵 String:</span> ${decile.recommendations.string}</p>
            <p><span class="font-medium">⚙️ Tension:</span> ${decile.recommendations.tension}</p>
          </div>
          <p class="text-sm mt-2 pt-2 border-t border-gray-200 italic text-gray-600">${decile.recommendations.advice}</p>
        </div>
      </div>
    `;
  },

  generateQuintileHTML(quintile) {
    return `
      <div class="quintile-card p-4 rounded-lg" style="background: ${quintile.color}20; border-left: 4px solid ${quintile.color};">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">${quintile.icon}</span>
          <h4 class="font-bold" style="color: ${quintile.color};">${quintile.label}</h4>
        </div>
        <p class="text-sm font-medium text-gray-700 mb-1">${quintile.summary}</p>
        <p class="text-sm text-gray-600">${quintile.description}</p>
        <p class="text-xs text-gray-500 mt-2">RCS Score: ${quintile.targetRCS}</p>
      </div>
    `;
  },

  generateReport(result, ra, cordage, tension) {
    const { rcs, decile, quintile, details } = result;
    const warning = this.getHealthWarning(rcs);
    let warningHTML = '';
    if (warning) {
      warningHTML = `
        <div class="mt-4 p-4 rounded-lg ${warning.level === 'danger' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}">
          <div class="flex items-center gap-2 font-semibold ${warning.level === 'danger' ? 'text-red-700' : 'text-amber-700'}">
            <span>${warning.icon}</span>
            <span>${warning.title}</span>
          </div>
          <p class="text-sm mt-2 ${warning.level === 'danger' ? 'text-red-600' : 'text-amber-600'}">${warning.message}</p>
          <ul class="mt-2 text-sm ${warning.level === 'danger' ? 'text-red-600' : 'text-amber-600'}">
            ${warning.tips.map(t => `<li>• ${t}</li>`).join('')}
          </ul>
        </div>
      `;
    }
    return `
      <div class="rcs-report" style="font-family: system-ui, sans-serif;">
        <div class="rcs-score" style="text-align: center; padding: 20px; background: ${decile.color}; color: ${decile.textColor}; border-radius: 12px; margin-bottom: 16px;">
          <div style="font-size: 48px; font-weight: bold;">${rcs}</div>
          <div style="font-size: 18px; opacity: 0.9;">RCS Score</div>
        </div>
        <div class="rcs-decile" style="text-align: center; margin-bottom: 16px;">
          <span style="background: ${decile.color}; color: ${decile.textColor}; padding: 8px 16px; border-radius: 20px; font-weight: bold;">
            ${decile.icon} D${decile.number} - ${decile.label}
          </span>
          <p style="color: #666; margin-top: 8px;">${decile.description}</p>
        </div>
        ${this.generateDecileDetailHTML(decile)}
        ${warningHTML}
        <div class="rcs-params" style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h4 style="margin: 0 0 12px 0; color: #333;">Input parameters</h4>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: center;">
            <div>
              <div style="font-size: 24px; font-weight: bold; color: #2563eb;">${ra || 63}</div>
              <div style="font-size: 12px; color: #666;">Racquet RA</div>
            </div>
            <div>
              <div style="font-size: 24px; font-weight: bold; color: #16a34a;">${cordage}</div>
              <div style="font-size: 12px; color: #666;">String lb/in</div>
            </div>
            <div>
              <div style="font-size: 24px; font-weight: bold; color: #dc2626;">${tension}</div>
              <div style="font-size: 12px; color: #666;">Tension kg</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

if (typeof module !== 'undefined' && module.exports) { module.exports = RCS; }
