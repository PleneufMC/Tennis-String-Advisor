// Google Analytics 4 (GA4)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-YSSLHJ5WYD');

// =============================================
// Custom Event Tracking for Tennis String Advisor
// =============================================

// Track custom events
function trackEvent(eventName, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
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
    click_location: location, // 'header', 'results_cta', 'sticky_bar', 'paywall'
    event_category: 'conversion'
  });
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
window.trackPaywallShown = trackPaywallShown;
window.trackSignupStart = trackSignupStart;
window.trackBlogView = trackBlogView;
window.trackCatalogFilter = trackCatalogFilter;
window.trackProductView = trackProductView;
window.trackRCSCalculation = trackRCSCalculation;
window.trackShare = trackShare;
