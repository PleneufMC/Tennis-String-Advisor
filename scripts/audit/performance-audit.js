#!/usr/bin/env node

/**
 * Script d'audit de performance automatisé
 * Utilise Lighthouse pour analyser les Core Web Vitals et performances
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs').promises;
const path = require('path');

class PerformanceAuditor {
  constructor(url = 'https://tennisstringadvisor.org') {
    this.url = url;
    this.reportDir = path.join(__dirname, '../../reports');
  }

  async init() {
    try {
      await fs.mkdir(this.reportDir, { recursive: true });
    } catch (error) {
      console.error('Error creating report directory:', error);
    }
  }

  async runLighthouseAudit() {
    console.log(`🚀 Démarrage de l'audit de performance pour ${this.url}`);
    
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = {
      logLevel: 'info',
      output: 'html',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port,
    };

    try {
      const runnerResult = await lighthouse(this.url, options);
      
      // Générer le rapport HTML
      const reportHtml = runnerResult.report;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const reportPath = path.join(this.reportDir, `lighthouse-${timestamp}.html`);
      
      await fs.writeFile(reportPath, reportHtml);
      console.log(`📊 Rapport Lighthouse sauvegardé: ${reportPath}`);

      // Extraire les métriques clés
      const lhr = runnerResult.lhr;
      return this.extractKeyMetrics(lhr);

    } finally {
      await chrome.kill();
    }
  }

  extractKeyMetrics(lhr) {
    const metrics = {
      performance: lhr.categories.performance.score * 100,
      accessibility: lhr.categories.accessibility.score * 100,
      bestPractices: lhr.categories['best-practices'].score * 100,
      seo: lhr.categories.seo.score * 100,
      coreWebVitals: {
        fcp: lhr.audits['first-contentful-paint'].displayValue,
        lcp: lhr.audits['largest-contentful-paint'].displayValue,
        cls: lhr.audits['cumulative-layout-shift'].displayValue,
        fid: lhr.audits['max-potential-fid']?.displayValue || 'N/A',
        tti: lhr.audits['interactive'].displayValue,
      },
      opportunities: lhr.categories.performance.auditRefs
        .filter(ref => lhr.audits[ref.id].score < 1 && lhr.audits[ref.id].details)
        .map(ref => ({
          id: ref.id,
          title: lhr.audits[ref.id].title,
          description: lhr.audits[ref.id].description,
          score: lhr.audits[ref.id].score,
          savings: lhr.audits[ref.id].details.overallSavingsMs || 0
        }))
        .sort((a, b) => b.savings - a.savings)
        .slice(0, 10)
    };

    return metrics;
  }

  generateRecommendations(metrics) {
    const recommendations = {
      critical: [],
      important: [],
      suggested: []
    };

    // Recommandations critiques (score < 50)
    if (metrics.performance < 50) {
      recommendations.critical.push({
        issue: 'Performance critique',
        priority: 'CRITIQUE',
        description: 'Score de performance très faible, impact majeur sur l\'expérience utilisateur',
        solutions: [
          'Implémenter le Server-Side Rendering (SSR)',
          'Optimiser les images (WebP, lazy loading)',
          'Réduire la taille des bundles JavaScript',
          'Utiliser un CDN pour les assets statiques'
        ]
      });
    }

    if (metrics.seo < 70) {
      recommendations.critical.push({
        issue: 'SEO défaillant',
        priority: 'CRITIQUE',
        description: 'Référencement naturel compromis',
        solutions: [
          'Ajouter les balises meta title et description',
          'Implémenter les données structurées (JSON-LD)',
          'Optimiser la structure HTML sémantique',
          'Générer un sitemap XML automatique'
        ]
      });
    }

    // Recommandations importantes (score < 70)
    if (metrics.accessibility < 70) {
      recommendations.important.push({
        issue: 'Accessibilité insuffisante',
        priority: 'IMPORTANT',
        description: 'Non-conformité aux standards WCAG',
        solutions: [
          'Ajouter les attributs ARIA appropriés',
          'Améliorer les contrastes de couleurs',
          'Implémenter la navigation clavier',
          'Ajouter les textes alternatifs pour les images'
        ]
      });
    }

    // Opportunités d'amélioration spécifiques
    metrics.opportunities.forEach(opp => {
      if (opp.savings > 1000) { // Plus d'1 seconde d'amélioration potentielle
        recommendations.important.push({
          issue: opp.title,
          priority: 'IMPORTANT',
          description: opp.description,
          savings: `${(opp.savings / 1000).toFixed(1)}s`,
          solutions: this.getSpecificSolutions(opp.id)
        });
      }
    });

    return recommendations;
  }

  getSpecificSolutions(auditId) {
    const solutions = {
      'unused-javascript': [
        'Implementer le code splitting par route',
        'Utiliser le tree shaking pour éliminer le code mort',
        'Lazy loading des composants non critiques'
      ],
      'render-blocking-resources': [
        'Déplacer les CSS critiques inline',
        'Différer le chargement des CSS non-critiques',
        'Optimiser l\'ordre de chargement des ressources'
      ],
      'unminified-css': [
        'Activer la minification CSS en production',
        'Utiliser PostCSS avec cssnano',
        'Supprimer les styles inutilisés'
      ],
      'unused-css-rules': [
        'Utiliser PurgeCSS ou Tailwind CSS purge',
        'Analyser et supprimer les styles orphelins',
        'Implémenter CSS-in-JS avec élimination automatique'
      ],
      'efficient-animated-content': [
        'Utiliser CSS transforms au lieu de layout changes',
        'Optimiser les animations avec will-change',
        'Préférer opacity et transform pour les animations'
      ],
      'modern-image-formats': [
        'Convertir les images en WebP/AVIF',
        'Implémenter responsive images avec srcset',
        'Utiliser un service d\'optimisation d\'images (Cloudinary)'
      ]
    };

    return solutions[auditId] || ['Consulter la documentation Lighthouse pour plus de détails'];
  }

  async generateReport(metrics, recommendations) {
    const report = {
      timestamp: new Date().toISOString(),
      url: this.url,
      summary: {
        overall: Math.round((metrics.performance + metrics.accessibility + metrics.bestPractices + metrics.seo) / 4),
        performance: Math.round(metrics.performance),
        accessibility: Math.round(metrics.accessibility),
        bestPractices: Math.round(metrics.bestPractices),
        seo: Math.round(metrics.seo)
      },
      coreWebVitals: metrics.coreWebVitals,
      recommendations: recommendations,
      nextSteps: [
        'Prioriser les améliorations critiques',
        'Implémenter SSR/SSG avec Next.js',
        'Optimiser les assets (images, CSS, JS)',
        'Améliorer l\'accessibilité et le SEO',
        'Mettre en place un monitoring continu'
      ]
    };

    const reportPath = path.join(this.reportDir, 'performance-audit-latest.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`📋 Rapport JSON sauvegardé: ${reportPath}`);

    return report;
  }

  async run() {
    try {
      await this.init();
      console.log('🔍 Audit de Performance - Tennis String Advisor');
      console.log('================================================');

      const metrics = await this.runLighthouseAudit();
      const recommendations = this.generateRecommendations(metrics);
      const report = await this.generateReport(metrics, recommendations);

      // Afficher le résumé
      console.log('\n📊 RÉSULTATS DE L\'AUDIT');
      console.log('========================');
      console.log(`Score global: ${report.summary.overall}/100`);
      console.log(`Performance: ${report.summary.performance}/100`);
      console.log(`Accessibilité: ${report.summary.accessibility}/100`);
      console.log(`Bonnes pratiques: ${report.summary.bestPractices}/100`);
      console.log(`SEO: ${report.summary.seo}/100`);

      console.log('\n⚡ Core Web Vitals:');
      Object.entries(metrics.coreWebVitals).forEach(([key, value]) => {
        console.log(`  ${key.toUpperCase()}: ${value}`);
      });

      console.log(`\n🔴 Problèmes critiques: ${recommendations.critical.length}`);
      console.log(`🟡 Améliorations importantes: ${recommendations.important.length}`);
      console.log(`🟢 Suggestions: ${recommendations.suggested.length}`);

      if (recommendations.critical.length > 0) {
        console.log('\n⚠️  ACTIONS CRITIQUES REQUISES:');
        recommendations.critical.forEach((rec, i) => {
          console.log(`${i + 1}. ${rec.issue}`);
          console.log(`   ${rec.description}`);
          rec.solutions.forEach(solution => console.log(`   • ${solution}`));
        });
      }

      console.log(`\n📋 Rapport détaillé disponible dans: ${this.reportDir}`);
      
      return report;

    } catch (error) {
      console.error('❌ Erreur lors de l\'audit:', error);
      throw error;
    }
  }
}

// Exécution si appelé directement
if (require.main === module) {
  const auditor = new PerformanceAuditor();
  auditor.run().catch(console.error);
}

module.exports = PerformanceAuditor;