/**
 * RCS Calculator - Racquet Comfort Score
 * Tennis String Advisor - Proprietary Algorithm
 * © 2025 Tennis String Advisor - A brand of Pleneuf Trading LLC
 * All rights reserved - Reproduction and reverse engineering prohibited
 */

const RCS = {
  _c: [54, 72, 63, 88, 275, 18, 30],
  _w: [0.28, 0.42, 0.22, 0.08, 1.02],
  
  get RA_MIN() { return this._c[0]; },
  get RA_MAX() { return this._c[1]; },
  get RA_DEFAULT() { return this._c[2]; },
  get CORDAGE_MIN() { return this._c[3]; },
  get CORDAGE_MAX() { return this._c[4]; },
  get TENSION_MIN() { return this._c[5]; },
  get TENSION_MAX() { return this._c[6]; },

  DECILES: [
    { 
      min: 0, max: 10, 
      label: 'Ultra Comfort+', 
      description: 'Post-injury rehabilitation',
      color: '#006400', 
      textColor: '#ffffff',
      icon: '🏥',
      detailedComment: 'Ultra-protective configuration ideal for rehabilitation after an elbow or shoulder injury. Joint stress is minimal, allowing progressive return to tennis without risk of aggravation. Recommended under medical supervision.',
      targetPlayers: ['Players in rehabilitation', 'Post-surgery', 'Severe epicondylitis'],
      recommendations: {
        racquet: 'Very flexible racquet (RA < 60), lightweight (< 280g)',
        string: 'Natural gut or very soft multifilament',
        tension: 'Low tension (18-20 kg)',
        advice: 'Consult a physiotherapist for an adapted recovery program.'
      }
    },
    { 
      min: 10, max: 20, 
      label: 'Ultra Comfort', 
      description: 'Chronic tennis elbow',
      color: '#228B22', 
      textColor: '#ffffff',
      icon: '💚',
      detailedComment: 'Therapeutic setup for players suffering from chronic tennis elbow or persistent joint pain. This configuration effectively absorbs vibrations and significantly reduces stress transmitted to the arm.',
      targetPlayers: ['Chronic tennis elbow', 'Seniors with arthritis', 'Players with injury history'],
      recommendations: {
        racquet: 'Flexible racquet (RA 58-62), medium to large head',
        string: 'Premium multifilament or natural gut',
        tension: 'Low to medium tension (19-22 kg)',
        advice: 'Wear a support elbow brace and warm up well before each session.'
      }
    },
    { 
      min: 20, max: 30, 
      label: 'Very Comfortable', 
      description: 'Seniors / Fragile arm',
      color: '#32CD32', 
      textColor: '#000000',
      icon: '🌿',
      detailedComment: 'Excellent preventive configuration for senior players or those with a sensitive arm. Offers an excellent compromise between comfort and playability, allowing regular play without accumulation of joint fatigue.',
      targetPlayers: ['Active seniors', 'Players with sensitive arm', 'Tennis elbow prevention'],
      recommendations: {
        racquet: 'Comfort racquet (RA 60-64), medium weight',
        string: 'Multifilament or hybrid with multifilament in crosses',
        tension: 'Medium-low tension (21-23 kg)',
        advice: 'Ideal for playing 2-3 times a week while preserving your joint health.'
      }
    },
    { 
      min: 30, max: 40, 
      label: 'Comfortable', 
      description: 'Beginners / Casual play',
      color: '#9ACD32', 
      textColor: '#000000',
      icon: '🌱',
      detailedComment: 'Perfect setup for beginners and recreational players. The racquet forgives off-center hits and generates enough power to compensate for a still-developing swing. Optimal comfort for learning confidently.',
      targetPlayers: ['Beginners', 'Occasional recreational players', 'Tennis comebacks'],
      recommendations: {
        racquet: 'Versatile racquet (RA 62-66), head 100-105 sq in',
        string: 'Multifilament or comfort synthetic',
        tension: 'Medium tension (22-24 kg)',
        advice: 'Take lessons to acquire proper technique and avoid bad habits.'
      }
    },
    { 
      min: 40, max: 50, 
      label: 'Balanced Flexible', 
      description: 'Average club level',
      color: '#FFD700', 
      textColor: '#000000',
      icon: '⚖️',
      detailedComment: 'Balanced configuration slightly favoring comfort. Ideal for average club players who play regularly. Good compromise between power, control and arm preservation.',
      targetPlayers: ['Regular club players', 'Rating 3.5-4.0 NTRP', 'Improving players'],
      recommendations: {
        racquet: 'Tweener racquet (RA 64-67), 295-305g',
        string: 'Soft poly or versatile hybrid',
        tension: 'Medium tension (23-25 kg)',
        advice: 'Vary your sessions with technical work and matches to progress.'
      }
    },
    { 
      min: 50, max: 60, 
      label: 'Balanced', 
      description: 'Advanced club',
      color: '#FFC000', 
      textColor: '#000000',
      icon: '🎯',
      detailedComment: 'Standard setup for advanced club players. Offers an excellent balance between all characteristics. Suitable for most playing styles and allows good technical progression.',
      targetPlayers: ['Advanced players', 'Rating 4.0-4.5 NTRP', 'Occasional competitors'],
      recommendations: {
        racquet: 'Performance racquet (RA 65-68), 300-310g',
        string: 'Medium polyester or co-poly',
        tension: 'Medium-high tension (24-26 kg)',
        advice: 'This is the sweet spot for most players - fine-tune according to your feel.'
      }
    },
    { 
      min: 60, max: 70, 
      label: 'Dynamic', 
      description: 'Regional competitor',
      color: '#FF8C00', 
      textColor: '#000000',
      icon: '🔥',
      detailedComment: 'Performance-oriented configuration for regional competitors. Prioritizes control and precision. Requires good technique and solid physical condition to be fully exploited.',
      targetPlayers: ['Regional competitors', 'Rating 4.5-5.0 NTRP', 'Technical players'],
      recommendations: {
        racquet: 'Control racquet (RA 66-69), 305-315g',
        string: 'Control polyester (ALU Power, Tour Bite)',
        tension: 'High tension (25-27 kg)',
        advice: 'Work on your fitness to handle the stiffness and maximize your performance.'
      }
    },
    { 
      min: 70, max: 80, 
      label: 'Firm', 
      description: 'National competitor',
      color: '#FF6600', 
      textColor: '#ffffff',
      icon: '💪',
      detailedComment: 'Demanding setup for national-level competitors. Offers maximum control but requires excellent technique and trained physique. Beware of injury risk in case of fatigue or poor preparation.',
      targetPlayers: ['National competitors', 'Rating 5.0-5.5 NTRP', 'Physical players'],
      recommendations: {
        racquet: 'Player racquet (RA 68-70), 310-320g',
        string: 'Stiff polyester (Tour Bite, Hyper-G)',
        tension: 'High tension (26-28 kg)',
        advice: 'Thorough warm-up mandatory. Watch for early signs of joint fatigue.'
      }
    },
    { 
      min: 80, max: 90, 
      label: 'Stiff', 
      description: 'Expert / Semi-pro',
      color: '#FF4444', 
      textColor: '#ffffff',
      icon: '⚡',
      detailedComment: 'Configuration reserved for expert and semi-professional players. Ultimate control but significant joint stress. Requires high-level physical preparation and flawless technique.',
      targetPlayers: ['Semi-professionals', 'Very experienced players', 'Big hitters'],
      recommendations: {
        racquet: 'Pro racquet (RA 69-72), 315-330g',
        string: 'High-performance polyester',
        tension: 'Very high tension (27-29 kg)',
        advice: 'Injury prevention protocol essential. Regular string rotation.'
      }
    },
    { 
      min: 90, max: 100, 
      label: 'Extreme', 
      description: 'Pro / Elite big hitter',
      color: '#CC0000', 
      textColor: '#ffffff',
      icon: '👑',
      detailedComment: 'Extreme configuration used by professionals and elite big hitters. Maximum joint stress - reserved for players with medical staff and physical trainer. Not recommended for amateurs.',
      targetPlayers: ['Professional players', 'Top national players', 'Elite hitters'],
      recommendations: {
        racquet: 'Tour racquet (RA 70+), customized',
        string: 'Tour polyester, fresh strings for each match',
        tension: 'Maximum tension (28-30 kg)',
        advice: '⚠️ High-risk configuration. Medical staff recommended. Not for amateurs.'
      }
    }
  ],

  QUINTILES: [
    {
      min: 0, max: 20,
      label: 'Therapeutic Comfort Zone',
      color: '#228B22',
      icon: '💚',
      summary: 'Maximum arm protection',
      description: 'Ultra-comfortable configurations for rehabilitation, tennis elbow or seniors with fragile arms. Absolute priority on joint health.',
      targetRCS: '0-20'
    },
    {
      min: 20, max: 40,
      label: 'Preventive Comfort Zone',
      color: '#9ACD32',
      icon: '🌿',
      summary: 'Comfort and prevention',
      description: 'Ideal for beginners, occasional players or those wishing to prevent injuries. Good balance towards comfort.',
      targetRCS: '20-40'
    },
    {
      min: 40, max: 60,
      label: 'Balanced Zone',
      color: '#FFD700',
      icon: '⚖️',
      summary: 'The versatile sweet spot',
      description: 'Standard configuration for most club players. Optimal balance between comfort, power and control.',
      targetRCS: '40-60'
    },
    {
      min: 60, max: 80,
      label: 'Performance Zone',
      color: '#FF8C00',
      icon: '🔥',
      summary: 'Control and precision',
      description: 'For confirmed competitors seeking more control. Requires good technique and physical condition.',
      targetRCS: '60-80'
    },
    {
      min: 80, max: 100,
      label: 'Expert/Pro Zone',
      color: '#CC0000',
      icon: '👑',
      summary: 'Maximum performance',
      description: 'Reserved for experts and professionals. High joint stress - physical preparation essential.',
      targetRCS: '80-100'
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

  calculate(ra, cordageStiffness, tension) {
    const a = this._n1(ra);
    const b = this._n2(cordageStiffness);
    const c = this._n3(tension);
    const d = a * b * c;
    const e = this._w[0] * a + this._w[1] * b + this._w[2] * c + this._w[3] * d;
    let r = 100 * Math.pow(e, this._w[4]);
    r = Math.max(0, Math.min(100, r));
    r = Math.round(r * 10) / 10;
    const dec = this.getDecile(r);
    const qui = this.getQuintile(r);
    return {
      rcs: r,
      decile: dec,
      quintile: qui,
      details: {
        ra_norm: Math.round(a * 1000) / 1000,
        cordage_norm: Math.round(b * 1000) / 1000,
        tension_norm: Math.round(c * 1000) / 1000,
        interaction: Math.round(d * 1000) / 1000,
        score_brut: Math.round(e * 1000) / 1000,
        contributions: {
          ra: Math.round(this._w[0] * a * 100 * 10) / 10,
          cordage: Math.round(this._w[1] * b * 100 * 10) / 10,
          tension: Math.round(this._w[2] * c * 100 * 10) / 10,
          interaction: Math.round(this._w[3] * d * 100 * 10) / 10
        }
      }
    };
  },

  getDecile(rcs) {
    if (rcs >= 100) return { number: 10, ...this.DECILES[9] };
    if (rcs < 0) return { number: 1, ...this.DECILES[0] };
    const i = Math.min(9, Math.max(0, Math.floor(rcs / 10)));
    return { number: i + 1, ...this.DECILES[i] };
  },

  getQuintile(rcs) {
    if (rcs >= 100) return { number: 5, ...this.QUINTILES[4] };
    if (rcs < 0) return { number: 1, ...this.QUINTILES[0] };
    const i = Math.min(4, Math.max(0, Math.floor(rcs / 20)));
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

  getRecommendations(profile) {
    const p = {
      'reeducation': { targetDecile: [1, 2], rcsRange: [0, 20], description: 'Post-injury rehabilitation', quintile: 1 },
      'tennis_elbow': { targetDecile: [1, 3], rcsRange: [0, 30], description: 'Tennis elbow / Epicondylitis', quintile: 1 },
      'senior': { targetDecile: [2, 4], rcsRange: [10, 40], description: 'Senior / Sensitive arm', quintile: 2 },
      'debutant': { targetDecile: [3, 5], rcsRange: [20, 50], description: 'Beginner / Recreational', quintile: 2 },
      'club': { targetDecile: [4, 6], rcsRange: [30, 60], description: 'Club player', quintile: 3 },
      'confirme': { targetDecile: [5, 7], rcsRange: [40, 70], description: 'Advanced club', quintile: 3 },
      'competiteur': { targetDecile: [6, 8], rcsRange: [50, 80], description: 'Competitor', quintile: 4 },
      'expert': { targetDecile: [7, 9], rcsRange: [60, 90], description: 'Expert / Semi-pro', quintile: 4 },
      'pro': { targetDecile: [8, 10], rcsRange: [70, 100], description: 'Pro / Elite', quintile: 5 }
    };
    return p[profile] || p['club'];
  },

  evaluateForProfile(rcs, profile) {
    const rec = this.getRecommendations(profile);
    const [minRCS, maxRCS] = rec.rcsRange;
    const dec = this.getDecile(rcs);
    if (rcs >= minRCS && rcs <= maxRCS) {
      return {
        isOk: true,
        status: 'optimal',
        message: `Optimal configuration for ${rec.description}`,
        suggestion: dec.recommendations.advice,
        icon: '✅'
      };
    } else if (rcs < minRCS) {
      return {
        isOk: false,
        status: 'trop_souple',
        message: `Configuration too soft for ${rec.description}`,
        suggestion: `Increase tension by ${Math.ceil((minRCS - rcs) / 5)} kg or choose a stiffer string for more control.`,
        icon: '❄️'
      };
    } else {
      return {
        isOk: false,
        status: 'trop_rigide',
        message: `Configuration too stiff for ${rec.description}`,
        suggestion: `Reduce tension by ${Math.ceil((rcs - maxRCS) / 5)} kg or opt for a softer string to protect your arm.`,
        icon: '🔥'
      };
    }
  },

  getHealthWarning(rcs) {
    if (rcs >= 80) {
      return {
        level: 'danger',
        icon: '⚠️',
        title: 'Warning - High stress',
        message: 'This configuration generates significant joint stress. Not recommended for occasional players or those with injury history.',
        tips: [
          'Complete warm-up mandatory (15-20 min)',
          'Watch for any signs of elbow or shoulder pain',
          'Limit session duration',
          'Consult a physio if discomfort persists'
        ]
      };
    } else if (rcs >= 70) {
      return {
        level: 'warning',
        icon: '⚡',
        title: 'Demanding configuration',
        message: 'Performing but physically demanding setup. Make sure you have good physical condition.',
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
          <h5 class="font-semibold text-sm text-gray-700 mb-2">👥 Target profiles:</h5>
          <div class="flex flex-wrap gap-2">
            ${decile.targetPlayers.map(p => `<span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">${p}</span>`).join('')}
          </div>
        </div>
        <div class="bg-white rounded-lg p-3 space-y-2">
          <h5 class="font-semibold text-sm text-gray-700 mb-2">💡 Recommendations:</h5>
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
