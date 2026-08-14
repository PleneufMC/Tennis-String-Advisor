/**
 * RCS Calculator - Recommandation Confort Score
 * Tennis String Advisor - Algorithme Propriétaire
 * © 2025 Tennis String Advisor - Une marque de Pleneuf Trading LLC
 * Tous droits réservés - Reproduction et ingénierie inverse interdites
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
      min: 11, max: 22, 
      label: 'Ultra Confort+', 
      description: 'Rééducation post-blessure',
      color: '#006400', 
      textColor: '#ffffff',
      icon: '🏥',
      detailedComment: 'Configuration ultra-protectrice idéale pour la rééducation après une blessure au coude ou à l\'épaule. La sollicitation articulaire est minimale, permettant une reprise progressive du tennis sans risque d\'aggravation. Recommandé sous supervision médicale.',
      targetPlayers: ['Joueurs en rééducation', 'Post-opératoire', 'Épicondylite sévère'],
      recommendations: {
        racquet: 'Raquette très flexible (RA < 60), légère (< 280g)',
        string: 'Boyau naturel ou multifilament très souple',
        tension: 'Tension basse (18-20 kg)',
        advice: 'Consultez un kinésithérapeute pour un programme de reprise adapté.'
      }
    },
    { 
      min: 22, max: 24, 
      label: 'Ultra Confort', 
      description: 'Tennis elbow chronique',
      color: '#228B22', 
      textColor: '#ffffff',
      icon: '💚',
      detailedComment: 'Setup thérapeutique pour les joueurs souffrant de tennis elbow chronique ou de douleurs articulaires persistantes. Cette configuration absorbe efficacement les vibrations et réduit considérablement le stress transmis au bras.',
      targetPlayers: ['Tennis elbow chronique', 'Seniors avec arthrose', 'Joueurs avec historique de blessures'],
      recommendations: {
        racquet: 'Raquette flexible (RA 58-62), tête moyenne à grande',
        string: 'Multifilament premium ou boyau naturel',
        tension: 'Tension basse à moyenne (19-22 kg)',
        advice: 'Portez une coudière de soutien et échauffez-vous bien avant chaque session.'
      }
    },
    { 
      min: 24, max: 26, 
      label: 'Très Confortable', 
      description: 'Seniors / Bras fragile',
      color: '#32CD32', 
      textColor: '#000000',
      icon: '🌿',
      detailedComment: 'Configuration préventive excellente pour les joueurs seniors ou ceux ayant un bras sensible. Offre un excellent compromis entre confort et jouabilité, permettant de jouer régulièrement sans accumulation de fatigue articulaire.',
      targetPlayers: ['Seniors actifs', 'Joueurs au bras sensible', 'Prévention tennis elbow'],
      recommendations: {
        racquet: 'Raquette confort (RA 60-64), poids moyen',
        string: 'Multifilament ou hybride avec multifilament en travers',
        tension: 'Tension moyenne-basse (21-23 kg)',
        advice: 'Idéal pour jouer 2-3 fois par semaine en préservant votre santé articulaire.'
      }
    },
    { 
      min: 26, max: 27, 
      label: 'Confortable', 
      description: 'Débutants / Loisir doux',
      color: '#9ACD32', 
      textColor: '#000000',
      icon: '🌱',
      detailedComment: 'Setup parfait pour les débutants et les joueurs de loisir. La raquette pardonne les erreurs de centrage et génère suffisamment de puissance pour compenser un swing encore en développement. Confort optimal pour apprendre sereinement.',
      targetPlayers: ['Débutants', 'Joueurs loisir occasionnels', 'Reprise du tennis'],
      recommendations: {
        racquet: 'Raquette polyvalente (RA 62-66), tête 100-105 sq in',
        string: 'Multifilament ou synthétique confort',
        tension: 'Tension moyenne (22-24 kg)',
        advice: 'Prenez des cours pour acquérir les bons gestes et éviter les mauvaises habitudes.'
      }
    },
    { 
      min: 27, max: 28, 
      label: 'Équilibré Souple', 
      description: 'Club niveau moyen',
      color: '#FFD700', 
      textColor: '#000000',
      icon: '⚖️',
      detailedComment: 'Configuration équilibrée privilégiant légèrement le confort. Idéale pour les joueurs de club de niveau moyen qui jouent régulièrement. Bon compromis entre puissance, contrôle et préservation du bras.',
      targetPlayers: ['Joueurs de club réguliers', 'Classement 30 à 15/4', 'Joueurs en progression'],
      recommendations: {
        racquet: 'Raquette tweener (RA 64-67), 295-305g',
        string: 'Poly souple ou hybride polyvalent',
        tension: 'Tension moyenne (23-25 kg)',
        advice: 'Variez vos sessions avec du travail technique et des matchs pour progresser.'
      }
    },
    { 
      min: 28, max: 29, 
      label: 'Équilibré', 
      description: 'Club confirmé',
      color: '#FFC000', 
      textColor: '#000000',
      icon: '🎯',
      detailedComment: 'Setup standard pour les joueurs de club confirmés. Offre un excellent équilibre entre toutes les caractéristiques. Convient à la majorité des styles de jeu et permet une bonne progression technique.',
      targetPlayers: ['Joueurs confirmés', 'Classement 15/4 à 5/6', 'Compétiteurs occasionnels'],
      recommendations: {
        racquet: 'Raquette performance (RA 65-68), 300-310g',
        string: 'Polyester médium ou co-poly',
        tension: 'Tension moyenne-haute (24-26 kg)',
        advice: 'C\'est le sweet spot pour la plupart des joueurs - ajustez finement selon vos sensations.'
      }
    },
    { 
      min: 29, max: 31, 
      label: 'Dynamique', 
      description: 'Compétiteur régional',
      color: '#FF8C00', 
      textColor: '#000000',
      icon: '🔥',
      detailedComment: 'Configuration orientée performance pour les compétiteurs régionaux. Privilégie le contrôle et la précision. Nécessite une bonne technique et une condition physique solide pour être pleinement exploitée.',
      targetPlayers: ['Compétiteurs régionaux', 'Classement 4/6 à 1/6', 'Joueurs techniques'],
      recommendations: {
        racquet: 'Raquette contrôle (RA 66-69), 305-315g',
        string: 'Polyester contrôle (ALU Power, Tour Bite)',
        tension: 'Tension haute (25-27 kg)',
        advice: 'Travaillez votre physique pour supporter la rigidité et maximiser vos performances.'
      }
    },
    { 
      min: 31, max: 32, 
      label: 'Ferme', 
      description: 'Compétiteur national',
      color: '#FF6600', 
      textColor: '#ffffff',
      icon: '💪',
      detailedComment: 'Setup exigeant pour les compétiteurs de niveau national. Offre un contrôle maximal mais demande une excellente technique et un physique entraîné. Attention au risque de blessure en cas de fatigue ou de mauvaise préparation.',
      targetPlayers: ['Compétiteurs nationaux', 'Classement 0 à -2/6', 'Joueurs physiques'],
      recommendations: {
        racquet: 'Raquette player (RA 68-70), 310-320g',
        string: 'Polyester rigide (Tour Bite, Hyper-G)',
        tension: 'Tension haute (26-28 kg)',
        advice: 'Échauffement rigoureux obligatoire. Surveillez les premiers signes de fatigue articulaire.'
      }
    },
    { 
      min: 32, max: 34, 
      label: 'Rigide', 
      description: 'Expert / Semi-pro',
      color: '#FF4444', 
      textColor: '#ffffff',
      icon: '⚡',
      detailedComment: 'Configuration réservée aux joueurs experts et semi-professionnels. Contrôle ultime mais sollicitation articulaire importante. Requiert une préparation physique de haut niveau et une technique irréprochable.',
      targetPlayers: ['Semi-professionnels', 'Joueurs très expérimentés', 'Gros frappeurs'],
      recommendations: {
        racquet: 'Raquette pro (RA 69-72), 315-330g',
        string: 'Polyester haute performance',
        tension: 'Tension très haute (27-29 kg)',
        advice: 'Protocole de prévention des blessures indispensable. Rotation régulière des cordages.'
      }
    },
    { 
      min: 34, max: 41, 
      label: 'Extrême', 
      description: 'Pro / Gros frappeur élite',
      color: '#CC0000', 
      textColor: '#ffffff',
      icon: '👑',
      detailedComment: 'Configuration extrême utilisée par les professionnels et les gros frappeurs d\'élite. Sollicitation articulaire maximale - réservé aux joueurs avec un staff médical et un préparateur physique. Non recommandé pour les amateurs.',
      targetPlayers: ['Joueurs professionnels', 'Top joueurs nationaux', 'Frappeurs d\'élite'],
      recommendations: {
        racquet: 'Raquette tour (RA 70+), customisée',
        string: 'Polyester tour, cordage frais à chaque match',
        tension: 'Tension maximale (28-30 kg)',
        advice: '⚠️ Configuration à haut risque. Staff médical recommandé. Pas pour les amateurs.'
      }
    }
  ],

  QUINTILES: [
    {
      min: 11, max: 24,
      label: 'Zone Confort Thérapeutique',
      color: '#228B22',
      icon: '💚',
      summary: 'Protection maximale du bras',
      description: 'Configurations ultra-confortables pour la rééducation, le tennis elbow ou les seniors avec bras fragile. Priorité absolue à la santé articulaire.',
      targetRCS: '11-24'
    },
    {
      min: 24, max: 27,
      label: 'Zone Confort Préventive',
      color: '#9ACD32',
      icon: '🌿',
      summary: 'Confort et prévention',
      description: 'Idéal pour les débutants, joueurs occasionnels ou ceux souhaitant prévenir les blessures. Bon équilibre vers le confort.',
      targetRCS: '24-27'
    },
    {
      min: 27, max: 29,
      label: 'Zone Équilibrée',
      color: '#FFD700',
      icon: '⚖️',
      summary: 'Le sweet spot polyvalent',
      description: 'Configuration standard pour la majorité des joueurs de club. Équilibre optimal entre confort, puissance et contrôle.',
      targetRCS: '27-29'
    },
    {
      min: 29, max: 32,
      label: 'Zone Performance',
      color: '#FF8C00',
      icon: '🔥',
      summary: 'Contrôle et précision',
      description: 'Pour les compétiteurs confirmés recherchant plus de contrôle. Nécessite bonne technique et condition physique.',
      targetRCS: '29-32'
    },
    {
      min: 32, max: 41,
      label: 'Zone Expert/Pro',
      color: '#CC0000',
      icon: '👑',
      summary: 'Performance maximale',
      description: 'Réservé aux experts et professionnels. Sollicitation articulaire élevée - préparation physique indispensable.',
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

  // Constantes pour calcul hybride
  HYBRID_MAINS_WEIGHT: 0.60,  // Montants = 60% de l'impact
  HYBRID_CROSS_WEIGHT: 0.40,  // Travers = 40% de l'impact

  /**
   * Calcule la rigidité équivalente d'un cordage hybride
   * @param {number} mainsStiffness - Rigidité des montants (lb/in)
   * @param {number} crossStiffness - Rigidité des travers (lb/in)
   * @returns {number} Rigidité équivalente combinée
   */
  calculateHybridStiffness(mainsStiffness, crossStiffness) {
    return (mainsStiffness * this.HYBRID_MAINS_WEIGHT) + (crossStiffness * this.HYBRID_CROSS_WEIGHT);
  },

  /**
   * Calcul RCS pour configuration hybride
   * @param {number} ra - Rigidité raquette (RA)
   * @param {number} mainsStiffness - Rigidité cordage montants (lb/in)
   * @param {number} crossStiffness - Rigidité cordage travers (lb/in)
   * @param {number} tension - Tension (kg)
   * @returns {object} Résultat RCS avec détails hybrides
   */
  calculateHybrid(ra, mainsStiffness, crossStiffness, tension) {
    const hybridStiffness = this.calculateHybridStiffness(mainsStiffness, crossStiffness);
    const result = this.calculate(ra, hybridStiffness, tension);
    
    // Ajouter les détails hybrides au résultat
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

  getRecommendations(profile) {
    const p = {
      'reeducation': { targetDecile: [1, 2], rcsRange: [11, 22], description: 'Rééducation post-blessure', quintile: 1 },
      'tennis_elbow': { targetDecile: [1, 3], rcsRange: [11, 24], description: 'Tennis elbow / Épicondylite', quintile: 1 },
      'senior': { targetDecile: [2, 4], rcsRange: [22, 26], description: 'Senior / Bras sensible', quintile: 2 },
      'debutant': { targetDecile: [3, 5], rcsRange: [24, 27], description: 'Débutant / Loisir', quintile: 2 },
      'club': { targetDecile: [4, 6], rcsRange: [26, 29], description: 'Joueur de club', quintile: 3 },
      'confirme': { targetDecile: [5, 7], rcsRange: [27, 31], description: 'Club confirmé', quintile: 3 },
      'competiteur': { targetDecile: [6, 8], rcsRange: [28, 32], description: 'Compétiteur', quintile: 4 },
      'expert': { targetDecile: [7, 9], rcsRange: [29, 34], description: 'Expert / Semi-pro', quintile: 4 },
      'pro': { targetDecile: [8, 10], rcsRange: [31, 41], description: 'Pro / Élite', quintile: 5 }
    };
    return p[profile] || p['club'];
  },

  // SEUIL DE SANTE ABSOLU — aucun profil ne peut le desactiver.
  // Regle 2 du §4 : la sante prime sur la conversion. Avant ce garde-fou, le
  // profil « Pro » (plage 31-41) faisait renvoyer « Configuration optimale »
  // pour un RCS de 40, c'est-a-dire en pleine zone « tres ferme, risque tennis
  // elbow » — l'alerte etait desactivee par la personne qu'elle protege.
  // Valeur alignee sur le palier publie (§1) et sur advanced-rcs.
  HEALTH_ALERT_RCS: 35,

  evaluateForProfile(rcs, profile) {
    const rec = this.getRecommendations(profile);
    const [minRCS, maxRCS] = rec.rcsRange;
    const dec = this.getDecile(rcs);
    if (rcs >= this.HEALTH_ALERT_RCS) {
      return {
        isOk: false,
        status: 'risque_sante',
        message: `Montage tres ferme (indice ${rcs}) : risque de tennis elbow`,
        suggestion: `Quel que soit votre niveau, baissez la tension ou passez a un cordage plus souple sur les montants. Ce seuil ne depend pas du profil de joueur.`,
        icon: '⚠️'
      };
    }
    if (rcs >= minRCS && rcs <= maxRCS) {
      return {
        isOk: true,
        status: 'optimal',
        message: `Configuration optimale pour ${rec.description}`,
        suggestion: dec.recommendations.advice,
        icon: '✅'
      };
    } else if (rcs < minRCS) {
      return {
        isOk: false,
        status: 'trop_souple',
        message: `Configuration trop souple pour ${rec.description}`,
        suggestion: `Augmentez la tension de ${Math.ceil((minRCS - rcs) * 2)} kg ou choisissez un cordage plus rigide pour plus de contrôle.`,
        icon: '❄️'
      };
    } else {
      return {
        isOk: false,
        status: 'trop_rigide',
        message: `Configuration trop rigide pour ${rec.description}`,
        suggestion: `Réduisez la tension de ${Math.ceil((rcs - maxRCS) * 2)} kg ou optez pour un cordage plus souple pour protéger votre bras.`,
        icon: '🔥'
      };
    }
  },

  getHealthWarning(rcs) {
    if (rcs >= 35) {
      return {
        level: 'danger',
        icon: '⚠️',
        title: 'Attention - Sollicitation élevée',
        message: 'Cette configuration génère une sollicitation articulaire importante. Non recommandé pour les joueurs occasionnels ou ayant des antécédents de blessures.',
        tips: [
          'Échauffement complet obligatoire (15-20 min)',
          'Surveillez tout signe de douleur au coude ou épaule',
          'Limitez la durée des sessions',
          'Consultez un kiné en cas de gêne persistante'
        ]
      };
    } else if (rcs >= 32) {
      return {
        level: 'warning',
        icon: '⚡',
        title: 'Configuration exigeante',
        message: 'Setup performant mais exigeant physiquement. Assurez-vous d\'avoir une bonne condition physique.',
        tips: [
          'Échauffement sérieux recommandé',
          'Hydratation importante',
          'Respectez vos temps de récupération'
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
          <h5 class="font-semibold text-sm text-gray-700 mb-2">👥 Profils ciblés :</h5>
          <div class="flex flex-wrap gap-2">
            ${decile.targetPlayers.map(p => `<span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">${p}</span>`).join('')}
          </div>
        </div>
        <div class="bg-white rounded-lg p-3 space-y-2">
          <h5 class="font-semibold text-sm text-gray-700 mb-2">💡 Recommandations :</h5>
          <div class="text-sm space-y-1">
            <p><span class="font-medium">🎾 Raquette :</span> ${decile.recommendations.racquet}</p>
            <p><span class="font-medium">🧵 Cordage :</span> ${decile.recommendations.string}</p>
            <p><span class="font-medium">⚙️ Tension :</span> ${decile.recommendations.tension}</p>
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
        <p class="text-xs text-gray-500 mt-2">Score RCS : ${quintile.targetRCS}</p>
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
          <div style="font-size: 18px; opacity: 0.9;">Score RCS</div>
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
          <h4 style="margin: 0 0 12px 0; color: #333;">Paramètres d'entrée</h4>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: center;">
            <div>
              <div style="font-size: 24px; font-weight: bold; color: #2563eb;">${ra || 63}</div>
              <div style="font-size: 12px; color: #666;">RA Raquette</div>
            </div>
            <div>
              <div style="font-size: 24px; font-weight: bold; color: #16a34a;">${cordage}</div>
              <div style="font-size: 12px; color: #666;">lb/in Cordage</div>
            </div>
            <div>
              <div style="font-size: 24px; font-weight: bold; color: #dc2626;">${tension}</div>
              <div style="font-size: 12px; color: #666;">kg Tension</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

if (typeof module !== 'undefined' && module.exports) { module.exports = RCS; }
