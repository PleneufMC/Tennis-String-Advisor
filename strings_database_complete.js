// Base de données complète des cordages tennis - Top 50 2025
// Basé sur le dossier de référence complet avec indices de rigidité et catégories

const STRINGS_DATABASE = {
    // Catégorie Polyester - Contrôle et durabilité
    polyester: [
        // Top Tier Performance
        { name: "Luxilon ALU Power", brand: "Luxilon", type: "polyester", rigidity: 230, performance: 9.8, control: 9.5, comfort: 7.0, durability: 9.0, versatility: 9.5, innovation: 8.0, price: "18-22€", category: "elite" },
        { name: "Solinco Hyper-G", brand: "Solinco", type: "polyester", rigidity: 218, performance: 9.5, control: 9.0, comfort: 8.5, durability: 8.5, versatility: 9.0, innovation: 8.5, price: "15-18€", category: "premium" },
        { name: "Babolat RPM Blast", brand: "Babolat", type: "polyester", rigidity: 240, performance: 9.2, control: 9.0, comfort: 7.5, durability: 8.0, versatility: 8.5, innovation: 8.0, price: "16-20€", category: "premium" },
        { name: "Luxilon 4G", brand: "Luxilon", type: "polyester", rigidity: 265, performance: 9.0, control: 10.0, comfort: 7.0, durability: 9.5, versatility: 8.5, innovation: 8.0, price: "20-24€", category: "elite" },
        { name: "Head Lynx Tour", brand: "Head", type: "polyester", rigidity: 210, performance: 8.5, control: 9.0, comfort: 8.0, durability: 8.5, versatility: 9.0, innovation: 7.5, price: "14-17€", category: "premium" },
        { name: "Solinco Tour Bite", brand: "Solinco", type: "polyester", rigidity: 255, performance: 9.0, control: 10.0, comfort: 6.5, durability: 9.0, versatility: 8.0, innovation: 8.0, price: "16-19€", category: "premium" },
        { name: "Solinco Mach-10", brand: "Solinco", type: "polyester", rigidity: 195, performance: 9.5, control: 8.5, comfort: 8.0, durability: 9.5, versatility: 8.5, innovation: 10.0, price: "60-70€", category: "innovation" },
        { name: "MSV Focus Hex", brand: "MSV", type: "polyester", rigidity: 235, performance: 8.0, control: 9.5, comfort: 7.0, durability: 9.0, versatility: 8.5, innovation: 8.0, price: "12-15€", category: "value" },
        { name: "Solinco Confidential", brand: "Solinco", type: "polyester", rigidity: 245, performance: 7.5, control: 9.5, comfort: 7.5, durability: 10.0, versatility: 8.0, innovation: 7.5, price: "17-20€", category: "premium" },
        { name: "Head Hawk Touch", brand: "Head", type: "polyester", rigidity: 215, performance: 8.0, control: 9.0, comfort: 7.0, durability: 8.5, versatility: 8.5, innovation: 7.0, price: "13-16€", category: "standard" },
        { name: "Tecnifibre Black Code 4S", brand: "Tecnifibre", type: "polyester", rigidity: 200, performance: 8.5, control: 8.5, comfort: 7.5, durability: 8.0, versatility: 8.0, innovation: 8.0, price: "15-18€", category: "premium" },
        { name: "Weiss Cannon Ultra Cable", brand: "Weiss Cannon", type: "polyester", rigidity: 250, performance: 8.0, control: 8.0, comfort: 6.5, durability: 8.5, versatility: 7.5, innovation: 8.5, price: "14-17€", category: "standard" },
        { name: "Yonex Poly Tour Pro", brand: "Yonex", type: "polyester", rigidity: 220, performance: 8.0, control: 8.5, comfort: 7.5, durability: 8.5, versatility: 8.5, innovation: 7.5, price: "16-19€", category: "premium" },
        { name: "Kirschbaum Pro Line Evolution", brand: "Kirschbaum", type: "polyester", rigidity: 225, performance: 8.0, control: 8.5, comfort: 7.0, durability: 9.0, versatility: 8.0, innovation: 8.0, price: "13-16€", category: "value" },
        { name: "Signum Pro X-Perience", brand: "Signum Pro", type: "polyester", rigidity: 205, performance: 8.5, control: 9.0, comfort: 8.0, durability: 8.0, versatility: 8.5, innovation: 7.5, price: "12-15€", category: "value" },
        { name: "Gamma Ocho", brand: "Gamma", type: "polyester", rigidity: 210, performance: 7.5, control: 8.5, comfort: 7.0, durability: 8.0, versatility: 8.0, innovation: 8.0, price: "11-14€", category: "budget" },
        { name: "Volkl Cyclone", brand: "Volkl", type: "polyester", rigidity: 230, performance: 7.5, control: 8.5, comfort: 6.5, durability: 8.5, versatility: 8.0, innovation: 7.0, price: "13-16€", category: "standard" },
        { name: "Toroline Wasabi", brand: "Toroline", type: "polyester", rigidity: 185, performance: 8.5, control: 8.0, comfort: 7.5, durability: 8.0, versatility: 7.5, innovation: 9.5, price: "18-22€", category: "innovation" },
        { name: "Isospeed Cream", brand: "Isospeed", type: "polyester", rigidity: 165, performance: 7.0, control: 8.0, comfort: 9.5, durability: 8.0, versatility: 8.5, innovation: 7.5, price: "14-17€", category: "comfort" },
        { name: "Polyfibre TCS", brand: "Polyfibre", type: "polyester", rigidity: 220, performance: 7.5, control: 8.5, comfort: 7.5, durability: 8.0, versatility: 8.0, innovation: 7.5, price: "10-13€", category: "budget" },
        { name: "Gosen Polylon", brand: "Gosen", type: "polyester", rigidity: 240, performance: 7.0, control: 9.0, comfort: 6.0, durability: 8.5, versatility: 7.5, innovation: 6.5, price: "9-12€", category: "budget" },
        { name: "Yonex Polytour Air", brand: "Yonex", type: "polyester", rigidity: 180, performance: 7.5, control: 8.0, comfort: 8.5, durability: 7.5, versatility: 8.0, innovation: 8.0, price: "15-18€", category: "comfort" },
        { name: "MSV Swift", brand: "MSV", type: "polyester", rigidity: 175, performance: 7.5, control: 8.0, comfort: 8.5, durability: 8.5, versatility: 7.5, innovation: 8.5, price: "11-14€", category: "value" },
        { name: "Toroline Caviar", brand: "Toroline", type: "polyester", rigidity: 200, performance: 8.0, control: 8.5, comfort: 7.0, durability: 8.0, versatility: 7.5, innovation: 8.5, price: "16-20€", category: "premium" },
        { name: "Wilson Revolve", brand: "Wilson", type: "polyester", rigidity: 205, performance: 7.5, control: 8.0, comfort: 7.0, durability: 8.0, versatility: 7.5, innovation: 8.0, price: "12-15€", category: "standard" },
        { name: "Luxilon Eco Power", brand: "Luxilon", type: "polyester", rigidity: 225, performance: 7.5, control: 7.5, comfort: 6.5, durability: 8.5, versatility: 7.5, innovation: 9.5, price: "50-60€", category: "innovation" },
        { name: "Solinco Hyper-G Soft", brand: "Solinco", type: "polyester", rigidity: 172, performance: 7.5, control: 8.5, comfort: 8.5, durability: 8.0, versatility: 8.0, innovation: 7.5, price: "16-19€", category: "comfort" },
        { name: "Velociti Catalyst", brand: "Velociti", type: "polyester", rigidity: 190, performance: 7.0, control: 7.0, comfort: 8.0, durability: 7.5, versatility: 7.5, innovation: 10.0, price: "45-55€", category: "innovation" },
        { name: "Kirschbaum Black Shark", brand: "Kirschbaum", type: "polyester", rigidity: 235, performance: 7.5, control: 8.5, comfort: 6.5, durability: 8.5, versatility: 7.5, innovation: 7.5, price: "12-15€", category: "value" },
        { name: "ReString Zero", brand: "ReString", type: "polyester", rigidity: 215, performance: 8.0, control: 8.0, comfort: 7.0, durability: 9.5, versatility: 7.5, innovation: 9.5, price: "55-65€", category: "innovation" },
        { name: "Gamma AMP", brand: "Gamma", type: "polyester", rigidity: 220, performance: 7.5, control: 8.0, comfort: 6.5, durability: 9.0, versatility: 7.5, innovation: 7.0, price: "10-13€", category: "budget" },
        { name: "Polyfibre Hexablade", brand: "Polyfibre", type: "polyester", rigidity: 240, performance: 7.0, control: 8.5, comfort: 6.5, durability: 8.0, versatility: 7.0, innovation: 7.5, price: "9-12€", category: "budget" },
        { name: "Head Hawk Power", band: "Head", type: "polyester", rigidity: 225, performance: 8.0, control: 7.5, comfort: 6.5, durability: 8.0, versatility: 7.5, innovation: 7.0, price: "12-15€", category: "standard" },
        { name: "MSV Focus Hex Plus", brand: "MSV", type: "polyester", rigidity: 240, performance: 7.5, control: 8.5, comfort: 7.5, durability: 8.5, versatility: 7.5, innovation: 7.0, price: "13-16€", category: "value" },
        { name: "Weiss Cannon Silverstring", brand: "Weiss Cannon", type: "polyester", rigidity: 250, performance: 7.0, control: 8.0, comfort: 6.0, durability: 8.5, versatility: 7.5, innovation: 6.5, price: "11-14€", category: "budget" }
    ],
    
    // Catégorie Multifilament - Confort et puissance
    multifilament: [
        { name: "Tecnifibre X-One Biphase", brand: "Tecnifibre", type: "multifilament", rigidity: 160, performance: 9.0, control: 7.0, comfort: 8.5, durability: 7.5, versatility: 8.5, innovation: 8.0, price: "18-22€", category: "premium" },
        { name: "Head Reflex MLT", brand: "Head", type: "multifilament", rigidity: 170, performance: 7.5, control: 7.0, comfort: 8.5, durability: 8.0, versatility: 9.0, innovation: 7.0, price: "12-15€", category: "value" },
        { name: "Wilson NXT Soft", brand: "Wilson", type: "multifilament", rigidity: 155, performance: 8.0, control: 6.5, comfort: 9.0, durability: 7.5, versatility: 8.5, innovation: 9.0, price: "15-18€", category: "comfort" },
        { name: "Tecnifibre TGV", brand: "Tecnifibre", type: "multifilament", rigidity: 145, performance: 7.0, control: 6.5, comfort: 9.5, durability: 7.0, versatility: 8.0, innovation: 7.0, price: "16-20€", category: "comfort" },
        { name: "Wilson NXT Power", brand: "Wilson", type: "multifilament", rigidity: 165, performance: 8.5, control: 6.5, comfort: 8.0, durability: 7.5, versatility: 8.5, innovation: 7.0, price: "14-17€", category: "standard" },
        { name: "Head Velocity MLT", brand: "Head", type: "multifilament", rigidity: 175, performance: 7.0, control: 6.0, comfort: 8.5, durability: 7.5, versatility: 8.5, innovation: 6.5, price: "10-13€", category: "budget" },
        { name: "Dunlop Iconic All", brand: "Dunlop", type: "multifilament", rigidity: 170, performance: 7.5, control: 7.0, comfort: 8.0, durability: 8.0, versatility: 8.5, innovation: 7.0, price: "11-14€", category: "value" },
        { name: "Tecnifibre Multifeel", brand: "Tecnifibre", type: "multifilament", rigidity: 170, performance: 7.0, control: 6.5, comfort: 8.0, durability: 7.0, versatility: 8.0, innovation: 6.5, price: "12-15€", category: "standard" },
        { name: "Tecnifibre Triax", brand: "Tecnifibre", type: "multifilament", rigidity: 165, performance: 7.0, control: 7.5, comfort: 8.5, durability: 8.0, versatility: 8.0, innovation: 6.5, price: "14-17€", category: "standard" },
        { name: "Head RIP Control", brand: "Head", type: "multifilament", rigidity: 180, performance: 6.0, control: 7.5, comfort: 7.0, durability: 7.5, versatility: 7.0, innovation: 8.0, price: "9-12€", category: "budget" }
    ],
    
    // Catégorie Boyau Naturel - Excellence performance
    naturalGut: [
        { name: "Babolat VS Touch", brand: "Babolat", type: "boyau", rigidity: 95, performance: 9.5, control: 8.0, comfort: 9.5, durability: 10.0, versatility: 8.5, innovation: 7.0, price: "45-50€", category: "premium" },
        { name: "Wilson Natural Gut", brand: "Wilson", type: "boyau", rigidity: 100, performance: 9.0, control: 7.5, comfort: 9.0, durability: 10.0, versatility: 8.0, innovation: 6.5, price: "40-45€", category: "premium" }
    ],
    
    // Catégorie Hybride et Spéciaux
    hybrid: [
        { name: "Wilson Champion's Choice", brand: "Wilson", type: "hybride", rigidity: 165, performance: 8.5, control: 9.0, comfort: 9.0, durability: 9.0, versatility: 9.5, innovation: 7.5, price: "25-30€", category: "premium" },
        { name: "Luxilon Element", brand: "Luxilon", type: "multi-mono", rigidity: 190, performance: 8.0, control: 8.0, comfort: 8.5, durability: 7.5, versatility: 8.5, innovation: 9.0, price: "22-26€", category: "innovation" }
    ],
    
    // Catégorie Synthétique
    synthetic: [
        { name: "Prince Synthetic Gut Duraflex", brand: "Prince", type: "synthetique", rigidity: 185, performance: 7.0, control: 6.5, comfort: 7.5, durability: 8.0, versatility: 8.5, innovation: 6.0, price: "8-11€", category: "budget" }
    ]
};

// Classifications et recommandations
const STRING_CLASSIFICATIONS = {
    byRigidity: {
        ultraSoft: { range: [0, 120], label: "Ultra-souple", description: "Boyau naturel premium" },
        soft: { range: [120, 170], label: "Souple", description: "Multifilaments, polys soft" },
        moderate: { range: [170, 200], label: "Modéré", description: "Polyesters modernes confortables" },
        firm: { range: [200, 230], label: "Ferme", description: "Polyesters standard" },
        rigid: { range: [230, 260], label: "Rigide", description: "Polyesters contrôle maximum" },
        ultraRigid: { range: [260, 999], label: "Ultra-rigide", description: "Polys spécialisés contrôle" }
    },
    
    byPlayStyle: {
        baselineAggressive: {
            recommended: ["Luxilon 4G", "Solinco Tour Bite", "Babolat RPM Blast", "MSV Focus Hex"],
            description: "Contrôle absolu pour gros frappeurs"
        },
        allCourt: {
            recommended: ["Wilson Champion's Choice", "Luxilon ALU Power", "Head Lynx Tour", "Luxilon Element"],
            description: "Équilibre parfait pour jeu complet"
        },
        control: {
            recommended: ["Luxilon 4G", "Solinco Confidential", "Signum Pro X-Perience", "Gosen Polylon"],
            description: "Précision chirurgicale"
        },
        powerComfort: {
            recommended: ["Babolat VS Touch", "Tecnifibre X-One Biphase", "Wilson NXT Soft", "Wilson Champion's Choice"],
            description: "Puissance naturelle + confort"
        },
        spin: {
            recommended: ["Solinco Tour Bite", "Weiss Cannon Ultra Cable", "Babolat RPM Blast", "Toroline Wasabi"],
            description: "Maximum de lift"
        },
        comfort: {
            recommended: ["Tecnifibre TGV", "Head Reflex MLT", "Isospeed Cream", "Wilson Champion's Choice"],
            description: "Arm-friendly prioritaire"
        }
    },
    
    byBudget: {
        budget: { max: 13, label: "Budget", description: "Performance accessible" },
        value: { max: 17, label: "Rapport qualité-prix", description: "Excellence abordable" },
        standard: { max: 22, label: "Standard", description: "Qualité confirmée" },
        premium: { max: 30, label: "Premium", description: "Performance élevée" },
        elite: { max: 50, label: "Elite", description: "Excellence absolue" },
        innovation: { max: 999, label: "Innovation", description: "Technologie breakthrough" }
    }
};

// Fonction pour obtenir tous les cordages par catégorie
function getAllStringsByCategory() {
    const allStrings = [];
    Object.entries(STRINGS_DATABASE).forEach(([category, strings]) => {
        strings.forEach(string => {
            allStrings.push({ ...string, category: category });
        });
    });
    return allStrings;
}

// Fonction pour obtenir la classification de rigidité
function getRigidityClassification(rigidity) {
    for (const [key, classification] of Object.entries(STRING_CLASSIFICATIONS.byRigidity)) {
        if (rigidity >= classification.range[0] && rigidity < classification.range[1]) {
            return classification;
        }
    }
    return STRING_CLASSIFICATIONS.byRigidity.ultraRigid;
}

module.exports = {
    STRINGS_DATABASE,
    STRING_CLASSIFICATIONS,
    getAllStringsByCategory,
    getRigidityClassification
};