// Comprehensive racquet database with main brands
const RACQUETS_DATABASE = {
    babolat: [
        { name: "Pure Drive", weight: "300g", headSize: "100in²", type: "puissance" },
        { name: "Pure Aero", weight: "300g", headSize: "100in²", type: "puissance" },
        { name: "Pure Strike", weight: "305g", headSize: "98in²", type: "controle" },
        { name: "Pure Drive VS", weight: "300g", headSize: "100in²", type: "puissance" },
        { name: "Pure Aero VS", weight: "300g", headSize: "100in²", type: "puissance" },
        { name: "Pure Strike VS", weight: "305g", headSize: "98in²", type: "controle" },
        { name: "Pure Drive Tour", weight: "315g", headSize: "100in²", type: "controle" },
        { name: "Pure Aero Tour", weight: "315g", headSize: "100in²", type: "controle" },
        { name: "Pure Strike Tour", weight: "320g", headSize: "98in²", type: "controle" },
        { name: "Pure Drive Lite", weight: "270g", headSize: "100in²", type: "confort" },
        { name: "Pure Aero Lite", weight: "270g", headSize: "100in²", type: "confort" },
        { name: "Boost Drive", weight: "260g", headSize: "103in²", type: "confort" },
        { name: "Boost Aero", weight: "260g", headSize: "103in²", type: "confort" }
    ],
    
    head: [
        { name: "Speed MP", weight: "300g", headSize: "100in²", type: "polyvalent" },
        { name: "Speed Pro", weight: "310g", headSize: "100in²", type: "controle" },
        { name: "Speed Lite", weight: "280g", headSize: "100in²", type: "confort" },
        { name: "Radical MP", weight: "295g", headSize: "98in²", type: "polyvalent" },
        { name: "Radical Pro", weight: "315g", headSize: "98in²", type: "controle" },
        { name: "Radical S", weight: "280g", headSize: "102in²", type: "confort" },
        { name: "Prestige MP", weight: "320g", headSize: "98in²", type: "controle" },
        { name: "Prestige Pro", weight: "330g", headSize: "98in²", type: "controle" },
        { name: "Prestige S", weight: "295g", headSize: "102in²", type: "polyvalent" },
        { name: "Extreme MP", weight: "300g", headSize: "100in²", type: "puissance" },
        { name: "Extreme Pro", weight: "315g", headSize: "100in²", type: "controle" },
        { name: "Extreme S", weight: "285g", headSize: "102in²", type: "confort" },
        { name: "Boom MP", weight: "295g", headSize: "100in²", type: "puissance" },
        { name: "Boom Pro", weight: "310g", headSize: "98in²", type: "controle" }
    ],
    
    wilson: [
        { name: "Clash 100", weight: "295g", headSize: "100in²", type: "confort" },
        { name: "Clash 98", weight: "305g", headSize: "98in²", type: "confort" },
        { name: "Clash 100 Tour", weight: "310g", headSize: "100in²", type: "polyvalent" },
        { name: "Pro Staff RF97", weight: "340g", headSize: "97in²", type: "controle" },
        { name: "Pro Staff 97", weight: "315g", headSize: "97in²", type: "controle" },
        { name: "Pro Staff 97L", weight: "290g", headSize: "97in²", type: "polyvalent" },
        { name: "Blade 98", weight: "305g", headSize: "98in²", type: "polyvalent" },
        { name: "Blade 100", weight: "300g", headSize: "100in²", type: "polyvalent" },
        { name: "Blade 98 v8", weight: "305g", headSize: "98in²", type: "polyvalent" },
        { name: "Ultra 100", weight: "300g", headSize: "100in²", type: "puissance" },
        { name: "Ultra 95", weight: "315g", headSize: "95in²", type: "controle" },
        { name: "Ultra 100L", weight: "280g", headSize: "100in²", type: "confort" },
        { name: "Burn 100", weight: "300g", headSize: "100in²", type: "puissance" },
        { name: "Burn 95", weight: "315g", headSize: "95in²", type: "controle" },
        { name: "Shift 99", weight: "305g", headSize: "99in²", type: "polyvalent" }
    ],
    
    yonex: [
        { name: "Ezone 100", weight: "300g", headSize: "100in²", type: "polyvalent" },
        { name: "Ezone 98", weight: "305g", headSize: "98in²", type: "polyvalent" },
        { name: "Ezone 100L", weight: "285g", headSize: "100in²", type: "confort" },
        { name: "Ezone Tour", weight: "310g", headSize: "100in²", type: "controle" },
        { name: "VCore 100", weight: "300g", headSize: "100in²", type: "puissance" },
        { name: "VCore 98", weight: "305g", headSize: "98in²", type: "controle" },
        { name: "VCore 95", weight: "310g", headSize: "95in²", type: "controle" },
        { name: "VCore Pro 100", weight: "310g", headSize: "100in²", type: "controle" },
        { name: "VCore Pro 97", weight: "315g", headSize: "97in²", type: "controle" },
        { name: "Percept 100", weight: "300g", headSize: "100in²", type: "polyvalent" },
        { name: "Percept 97", weight: "305g", headSize: "97in²", type: "polyvalent" },
        { name: "Astrel 100", weight: "290g", headSize: "100in²", type: "confort" },
        { name: "Astrel 105", weight: "280g", headSize: "105in²", type: "confort" }
    ],
    
    technifibre: [
        { name: "TFight 315", weight: "315g", headSize: "98in²", type: "controle" },
        { name: "TFight 300", weight: "300g", headSize: "98in²", type: "polyvalent" },
        { name: "TFight 280", weight: "280g", headSize: "100in²", type: "confort" },
        { name: "TF40 315", weight: "315g", headSize: "98in²", type: "controle" },
        { name: "TF40 300", weight: "300g", headSize: "100in²", type: "polyvalent" },
        { name: "Tempo 298", weight: "298g", headSize: "100in²", type: "polyvalent" },
        { name: "Tempo 285", weight: "285g", headSize: "100in²", type: "confort" },
        { name: "TFlash 300", weight: "300g", headSize: "98in²", type: "puissance" },
        { name: "TFlash 285", weight: "285g", headSize: "100in²", type: "confort" },
        { name: "TPulse 300", weight: "300g", headSize: "100in²", type: "puissance" },
        { name: "TPulse 285", weight: "285g", headSize: "102in²", type: "confort" }
    ]
};

module.exports = RACQUETS_DATABASE;