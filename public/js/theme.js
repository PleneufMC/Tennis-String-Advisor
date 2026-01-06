// =============================================
// Theme Management (Dark Mode)
// =============================================

(function() {
  // Apply theme immediately to prevent flash
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
})();

// Toggle dark mode
function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon();
  
  // Track event
  if (typeof trackEvent === 'function') {
    trackEvent('theme_toggle', { theme: isDark ? 'dark' : 'light' });
  }
}

// Update theme icon
function updateThemeIcon() {
  const isDark = document.documentElement.classList.contains('dark');
  const icons = document.querySelectorAll('.theme-icon');
  icons.forEach(icon => {
    icon.textContent = isDark ? '☀️' : '🌙';
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', updateThemeIcon);

// Make function global
window.toggleDarkMode = toggleDarkMode;

// =============================================
// Back to Top Button
// =============================================

function initBackToTop() {
  // Create button if it doesn't exist
  if (!document.getElementById('backToTop')) {
    const btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.innerHTML = '↑';
    btn.className = 'fixed bottom-6 right-6 w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-all duration-300 opacity-0 invisible z-50 flex items-center justify-center text-xl font-bold dark:bg-green-500';
    btn.setAttribute('aria-label', 'Retour en haut');
    btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(btn);
  }

  const btn = document.getElementById('backToTop');
  
  // Show/hide based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.remove('opacity-0', 'invisible');
      btn.classList.add('opacity-100', 'visible');
    } else {
      btn.classList.remove('opacity-100', 'visible');
      btn.classList.add('opacity-0', 'invisible');
    }
  });
}

document.addEventListener('DOMContentLoaded', initBackToTop);
