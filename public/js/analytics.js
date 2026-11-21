// Google Analytics 4 (GA4)

// Paramètres d'URL transmis à GA4 : liste blanche, miroir de
// src/components/analytics/url-allowlist.ts (même filtre, mêmes cas vérifiés par
// `npm run audit:analytics-url`). Sans elle, gtag joint l'URL complète de la page
// et de la page précédente à chaque événement ; le caviardage du flux GA4 ne
// couvre que ce qui a la forme d'une adresse e-mail. Seuls sortent l'origine, le
// chemin (lu par A3) et les cinq utm, jamais un utm portant un @, jamais le
// fragment (#…).
var TSA_GA4_URL_PARAM_ALLOWLIST = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

function tsaDecodeUrlPart(s) {
  try {
    return decodeURIComponent(s.replace(/\+/g, ' '));
  } catch (e) {
    return s;
  }
}

function tsaSanitizeUrlForAnalytics(raw, base) {
  var url;
  try {
    url = new URL(raw, base);
  } catch (e) {
    return raw.split(/[?#]/)[0];
  }
  var kept = url.search.slice(1).split('&').filter(function (pair) {
    if (!pair) return false;
    var eq = pair.indexOf('=');
    var key = tsaDecodeUrlPart(eq === -1 ? pair : pair.slice(0, eq));
    var value = eq === -1 ? '' : tsaDecodeUrlPart(pair.slice(eq + 1));
    return TSA_GA4_URL_PARAM_ALLOWLIST.indexOf(key) !== -1 && !/@|%40/i.test(value);
  });
  var prefix = url.protocol === 'http:' || url.protocol === 'https:' ? url.origin : url.protocol + '//' + url.host;
  return prefix + url.pathname + (kept.length ? '?' + kept.join('&') : '');
}

function tsaAnalyticsPageContext(href, referrer) {
  var context = { page_location: tsaSanitizeUrlForAnalytics(href) };
  if (referrer) context.page_referrer = tsaSanitizeUrlForAnalytics(referrer);
  return context;
}

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
// `set` couvre tous les événements de la page, y compris ceux que gtag émet seul
// (scroll, user_engagement…) et les appels directs d'une page (newsletter EN) ;
// `config` porte le même contexte pour le page_view automatique.
gtag('set', tsaAnalyticsPageContext(window.location.href, document.referrer));
gtag('config', 'G-YSSLHJ5WYD', tsaAnalyticsPageContext(window.location.href, document.referrer));

// =============================================
// Custom Event Tracking for Tennis String Advisor
// =============================================

// Track custom events
// Le contexte de page nettoyé est joint en dernier : aucun appelant ne le remplace.
function trackEvent(eventName, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, Object.assign({}, params, tsaAnalyticsPageContext(window.location.href, document.referrer)));
    console.log('📊 Event tracked:', eventName, params);
  }
}

// =============================================
// Configurator Events
// =============================================

// Track configurator step progression
function trackConfiguratorStep(step, stepName) {
  trackEvent('configurator_step', {
    step_number: step,
    step_name: stepName,
    event_category: 'configurator'
  });
}

// Track configurator completion
function trackConfiguratorComplete(racquet, string, tension) {
  trackEvent('configurator_complete', {
    recommended_racquet: racquet,
    recommended_string: string,
    recommended_tension: tension,
    event_category: 'configurator'
  });
}

// Track selection in configurator
function trackConfiguratorSelection(step, option) {
  trackEvent('configurator_selection', {
    step: step,
    selected_option: option,
    event_category: 'configurator'
  });
}

// =============================================
// Premium / Conversion Events
// =============================================

// Track Premium CTA clicks
function trackPremiumClick(location) {
  trackEvent('premium_cta_click', {
    // cta_location : MEME nom de parametre que le React
    // (src/components/analytics/analytics.tsx). Auparavant 'click_location'
    // cote statique — une dimension GA4 perdait donc systematiquement la
    // moitie des clics (audit 13/08/2026).
    cta_location: location, // 'header', 'results_cta', 'sticky_bar', 'paywall'
    event_category: 'conversion'
  });
}

// Clic sur un lien d'affiliation « ou acheter ».
// Meme nom d'evenement ET memes parametres que le React
// (trackAffiliateClick dans src/components/analytics/analytics.tsx) :
// sans cela, les 28 pages statiques n'emettaient AUCUN affiliate_click et
// le jalon « premiere commission » n'etait attribuable a aucun canal.
function trackAffiliateClick(merchant, product, linkType, location) {
  var params = {
    merchant: merchant,
    product: product,
    // Meme parametre que le React : distingue un deep-link Awin tracke d'un
    // lien direct non remunere. C'est la seule preuve lisible en production
    // que l'activation Awin a bien ete suivie d'un redeploiement.
    // Cote statique aucun deep-link n'est encore construit -> 'direct'.
    link_type: linkType || 'direct',
    event_category: 'conversion'
  };
  // Meme parametre que le React (31/08) : surface d'emission du clic
  // ('configurator_result' | 'catalog_card'). Optionnel et SANS defaut :
  // absent -> "(not set)" dans GA4 = emetteur pas encore migre, jamais une
  // surface devinee.
  if (location) params.location = location;
  trackEvent('affiliate_click', params);
}

// Track paywall shown
function trackPaywallShown() {
  trackEvent('paywall_shown', {
    event_category: 'conversion'
  });
}

// Track signup start
function trackSignupStart(method) {
  trackEvent('signup_start', {
    signup_method: method, // 'email', 'google'
    event_category: 'conversion'
  });
}

// =============================================
// Content Engagement Events
// =============================================

// Track blog article view
function trackBlogView(articleTitle, articleCategory) {
  trackEvent('blog_view', {
    article_title: articleTitle,
    article_category: articleCategory,
    event_category: 'engagement'
  });
}

// Track catalog filter usage
function trackCatalogFilter(filterType, filterValue) {
  trackEvent('catalog_filter', {
    filter_type: filterType,
    filter_value: filterValue,
    event_category: 'engagement'
  });
}

// Track product view (racquet or string detail)
function trackProductView(productType, productName, productBrand) {
  trackEvent('product_view', {
    product_type: productType, // 'racquet', 'string'
    product_name: productName,
    product_brand: productBrand,
    event_category: 'engagement'
  });
}

// Track RCS calculator usage
function trackRCSCalculation(score, decile) {
  trackEvent('rcs_calculation', {
    rcs_score: score,
    rcs_decile: decile,
    event_category: 'tool_usage'
  });
}

// =============================================
// Share Events
// =============================================

// Track result sharing
function trackShare(method, content) {
  trackEvent('share', {
    method: method, // 'copy_link', 'twitter', 'whatsapp', 'facebook'
    content_type: content, // 'configurator_result', 'article'
    event_category: 'engagement'
  });
}

// =============================================
// Auto-tracking on page load
// =============================================

document.addEventListener('DOMContentLoaded', function() {
  // Track Premium button clicks in header
  document.querySelectorAll('a[href*="premium"]').forEach(function(link) {
    link.addEventListener('click', function() {
      const location = this.closest('header') ? 'header' : 
                       this.closest('#ctaPremiumSection') ? 'results_cta' :
                       this.closest('#stickyBottomBar') ? 'sticky_bar' :
                       this.closest('#configuratorPaywall') ? 'paywall' : 'other';
      trackPremiumClick(location);
    });
  });

  // Track signup/login button clicks
  document.querySelectorAll('a[href*="auth"]').forEach(function(link) {
    link.addEventListener('click', function() {
      trackEvent('auth_click', { 
        link_text: this.textContent.trim(),
        event_category: 'conversion'
      });
    });
  });
});

// Make functions globally available
window.trackEvent = trackEvent;
window.trackConfiguratorStep = trackConfiguratorStep;
window.trackConfiguratorComplete = trackConfiguratorComplete;
window.trackConfiguratorSelection = trackConfiguratorSelection;
window.trackPremiumClick = trackPremiumClick;
window.trackAffiliateClick = trackAffiliateClick;
window.trackPaywallShown = trackPaywallShown;
window.trackSignupStart = trackSignupStart;
window.trackBlogView = trackBlogView;
window.trackCatalogFilter = trackCatalogFilter;
window.trackProductView = trackProductView;
window.trackRCSCalculation = trackRCSCalculation;
window.trackShare = trackShare;
