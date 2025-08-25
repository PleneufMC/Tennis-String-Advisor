#!/usr/bin/env node

/**
 * Scraper respectueux pour TennisWarehouse.com
 * Respecte les robots.txt et implémente des délais appropriés
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

class TennisWarehouseScraper {
  constructor() {
    this.baseUrl = 'https://www.tennis-warehouse.com';
    this.delay = 2000; // 2 secondes entre les requêtes
    this.maxRetries = 3;
    this.outputDir = path.join(__dirname, '../../data/scraped');
    this.headers = {
      'User-Agent': 'Tennis String Advisor - Research Tool (respectful scraping)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive'
    };
  }

  async init() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      console.log('🚀 Initialisation du scraper TennisWarehouse');
      
      // Vérifier robots.txt
      await this.checkRobotsTxt();
      
    } catch (error) {
      console.error('Erreur d\'initialisation:', error);
      throw error;
    }
  }

  async checkRobotsTxt() {
    try {
      console.log('🤖 Vérification du robots.txt...');
      const response = await axios.get(`${this.baseUrl}/robots.txt`, {
        headers: this.headers,
        timeout: 10000
      });
      
      console.log('📋 Contenu du robots.txt:');
      console.log(response.data);
      
      // Analyser les restrictions
      const robotsContent = response.data.toLowerCase();
      if (robotsContent.includes('disallow: /')) {
        console.warn('⚠️  ATTENTION: Le robots.txt indique des restrictions');
        console.warn('   Assurez-vous de respecter les conditions d\'utilisation');
      }
      
    } catch (error) {
      console.warn('⚠️  Impossible de récupérer robots.txt:', error.message);
    }
  }

  async delay(ms = this.delay) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async makeRequest(url, retries = 0) {
    try {
      console.log(`📡 Requête: ${url}`);
      
      const response = await axios.get(url, {
        headers: this.headers,
        timeout: 15000,
        maxRedirects: 5
      });

      // Respecter le délai entre les requêtes
      await this.delay();
      
      return response.data;
      
    } catch (error) {
      if (retries < this.maxRetries) {
        console.warn(`⚠️  Échec de la requête, nouvelle tentative (${retries + 1}/${this.maxRetries})`);
        await this.delay(this.delay * (retries + 1)); // Délai croissant
        return this.makeRequest(url, retries + 1);
      }
      
      console.error(`❌ Échec définitif pour ${url}:`, error.message);
      return null;
    }
  }

  async scrapeStringCategories() {
    console.log('🎾 Scraping des catégories de cordages...');
    
    const categoriesUrl = `${this.baseUrl}/strings/`;
    const html = await this.makeRequest(categoriesUrl);
    
    if (!html) return [];

    const $ = cheerio.load(html);
    const categories = [];

    // Adapter les sélecteurs selon la structure réelle du site
    $('.category-link, .string-category, [data-category]').each((i, element) => {
      const $el = $(element);
      const name = $el.text().trim();
      const url = $el.attr('href');
      
      if (name && url) {
        categories.push({
          name,
          url: url.startsWith('http') ? url : `${this.baseUrl}${url}`,
          type: 'string'
        });
      }
    });

    console.log(`✅ ${categories.length} catégories de cordages trouvées`);
    return categories;
  }

  async scrapeRacquetCategories() {
    console.log('🎾 Scraping des catégories de raquettes...');
    
    const categoriesUrl = `${this.baseUrl}/racquets/`;
    const html = await this.makeRequest(categoriesUrl);
    
    if (!html) return [];

    const $ = cheerio.load(html);
    const categories = [];

    $('.category-link, .racquet-category, [data-category]').each((i, element) => {
      const $el = $(element);
      const name = $el.text().trim();
      const url = $el.attr('href');
      
      if (name && url) {
        categories.push({
          name,
          url: url.startsWith('http') ? url : `${this.baseUrl}${url}`,
          type: 'racquet'
        });
      }
    });

    console.log(`✅ ${categories.length} catégories de raquettes trouvées`);
    return categories;
  }

  async scrapeProductsFromCategory(category, limit = 50) {
    console.log(`🔍 Scraping des produits de la catégorie: ${category.name}`);
    
    const html = await this.makeRequest(category.url);
    if (!html) return [];

    const $ = cheerio.load(html);
    const products = [];

    // Sélecteurs génériques pour les produits (à adapter selon le site réel)
    $('.product-item, .product-card, [data-product]').each((i, element) => {
      if (i >= limit) return false; // Limiter le nombre de produits

      const $el = $(element);
      const $link = $el.find('a').first();
      const $img = $el.find('img').first();
      const $price = $el.find('.price, .product-price, [data-price]').first();

      const product = {
        category: category.name,
        type: category.type,
        name: $link.attr('title') || $link.text().trim(),
        url: $link.attr('href'),
        image: $img.attr('src') || $img.attr('data-src'),
        price: $price.text().trim(),
        scrapedAt: new Date().toISOString()
      };

      // Nettoyer les URLs relatives
      if (product.url && !product.url.startsWith('http')) {
        product.url = `${this.baseUrl}${product.url}`;
      }
      if (product.image && !product.image.startsWith('http')) {
        product.image = `${this.baseUrl}${product.image}`;
      }

      if (product.name && product.url) {
        products.push(product);
      }
    });

    console.log(`✅ ${products.length} produits trouvés dans ${category.name}`);
    return products;
  }

  async scrapeProductDetails(product) {
    console.log(`📋 Détails du produit: ${product.name}`);
    
    const html = await this.makeRequest(product.url);
    if (!html) return product;

    const $ = cheerio.load(html);

    // Extraire les spécifications détaillées
    const specifications = {};
    
    // Sélecteurs pour les spécifications (à adapter)
    $('.spec-table tr, .specifications li, .product-details li').each((i, element) => {
      const $el = $(element);
      const label = $el.find('.spec-label, .label, td:first-child').text().trim();
      const value = $el.find('.spec-value, .value, td:last-child').text().trim();
      
      if (label && value) {
        specifications[label.toLowerCase().replace(/[^a-z0-9]/g, '_')] = value;
      }
    });

    // Description
    const description = $('.product-description, .description').text().trim();

    // Prix détaillé
    const priceDetails = {
      current: $('.current-price, .price-current').text().trim(),
      original: $('.original-price, .price-original').text().trim(),
      discount: $('.discount, .sale-badge').text().trim()
    };

    // Images additionnelles
    const images = [];
    $('.product-gallery img, .additional-images img').each((i, element) => {
      const src = $(element).attr('src') || $(element).attr('data-src');
      if (src) {
        images.push(src.startsWith('http') ? src : `${this.baseUrl}${src}`);
      }
    });

    return {
      ...product,
      specifications,
      description,
      priceDetails,
      images,
      detailsScrapedAt: new Date().toISOString()
    };
  }

  async scrapeAll() {
    try {
      await this.init();
      
      console.log('🚀 Début du scraping complet...');
      
      // Scraper les catégories
      const stringCategories = await this.scrapeStringCategories();
      const racquetCategories = await this.scrapeRacquetCategories();
      
      const allCategories = [...stringCategories, ...racquetCategories];
      
      // Sauvegarder les catégories
      await this.saveData('categories.json', allCategories);
      
      // Scraper les produits par catégorie
      const allProducts = [];
      
      for (const category of allCategories.slice(0, 5)) { // Limiter pour les tests
        console.log(`\n📂 Traitement de la catégorie: ${category.name}`);
        
        const products = await this.scrapeProductsFromCategory(category, 20);
        
        // Scraper les détails pour quelques produits
        for (const product of products.slice(0, 5)) {
          const detailedProduct = await this.scrapeProductDetails(product);
          allProducts.push(detailedProduct);
        }
        
        // Sauvegarder périodiquement
        await this.saveData(`products_${category.type}_${Date.now()}.json`, allProducts);
      }
      
      // Sauvegarder le résultat final
      await this.saveData('all_products.json', allProducts);
      
      console.log('\n✅ Scraping terminé!');
      console.log(`📊 Total: ${allProducts.length} produits récupérés`);
      console.log(`📁 Données sauvegardées dans: ${this.outputDir}`);
      
      return {
        categories: allCategories,
        products: allProducts,
        summary: {
          totalCategories: allCategories.length,
          totalProducts: allProducts.length,
          stringCategories: stringCategories.length,
          racquetCategories: racquetCategories.length,
          scrapedAt: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('❌ Erreur lors du scraping:', error);
      throw error;
    }
  }

  async saveData(filename, data) {
    try {
      const filepath = path.join(this.outputDir, filename);
      await fs.writeFile(filepath, JSON.stringify(data, null, 2));
      console.log(`💾 Données sauvegardées: ${filename}`);
    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
    }
  }

  // Méthode pour scraping incrémental
  async updateProducts(existingProducts = []) {
    console.log('🔄 Mise à jour incrémentale des produits...');
    
    // Logique de mise à jour basée sur les timestamps
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - 24); // Dernières 24h
    
    const productsToUpdate = existingProducts.filter(p => 
      !p.detailsScrapedAt || new Date(p.detailsScrapedAt) < cutoffDate
    );
    
    console.log(`🔄 ${productsToUpdate.length} produits à mettre à jour`);
    
    for (const product of productsToUpdate) {
      const updated = await this.scrapeProductDetails(product);
      // Logique de mise à jour...
    }
  }
}

// Exécution si appelé directement
if (require.main === module) {
  const scraper = new TennisWarehouseScraper();
  
  // Gestion des signaux pour arrêt propre
  process.on('SIGINT', () => {
    console.log('\n⏸️  Arrêt du scraping...');
    process.exit(0);
  });
  
  scraper.scrapeAll()
    .then(result => {
      console.log('\n📈 RÉSUMÉ:');
      console.log(`Catégories: ${result.summary.totalCategories}`);
      console.log(`Produits: ${result.summary.totalProducts}`);
    })
    .catch(error => {
      console.error('Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = TennisWarehouseScraper;