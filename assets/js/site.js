/*!
 * Jakoma site.js
 * - Mobile menu toggle
 * - UTM persistence (session) + outbound link decoration
 * - CTA click events (dataLayer)
 * - Cookie banner preference (localStorage)
 */
(function () {
  'use strict';

  // ---------- Mobile menu ----------
  window.toggleMenu = function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const toggle = document.querySelector('.menu-toggle');
    if (!menu || !overlay) return;

    const isOpen = menu.classList.toggle('open');
    overlay.classList.toggle('open', isOpen);

    if (toggle) {
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }
  };

  // ---------- UTM persistence ----------
  const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid','msclkid','li_fat_id'];
  const STORE_KEY = 'jakoma_utm_v1';

  function parseQuery(qs) {
    const out = {};
    const params = new URLSearchParams(qs || '');
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) out[k] = v;
    }
    return out;
  }

  function getStored() {
    try { return JSON.parse(sessionStorage.getItem(STORE_KEY) || '{}'); } catch (e) { return {}; }
  }

  function store(obj) {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(obj)); } catch (e) {}
  }

  const inbound = parseQuery(window.location.search);
  const merged = Object.assign({}, getStored(), inbound); // inbound wins
  if (Object.keys(merged).length) store(merged);

  function parseBase(str) {
    if (!str) return {};
    return parseQuery(str.startsWith('?') ? str : '?' + str);
  }

  function decorateLink(a, utmObj) {
    try {
      const href = a.getAttribute('href');
      if (!href) return;

      // Ignore anchors / tel / mailto
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      const u = new URL(href, window.location.origin);

      // Only decorate outbound links (different origin) OR links marked with js-utm
      const force = a.classList.contains('js-utm') || a.getAttribute('data-utm') === 'true';
      const outbound = u.origin !== window.location.origin;

      if (!force && !outbound) return;

      for (const [k, v] of Object.entries(utmObj)) {
        if (!u.searchParams.get(k)) u.searchParams.set(k, v);
      }
      a.setAttribute('href', u.toString());
    } catch (e) {}
  }

  function applyUtmDecoration() {
    const stored = getStored();
    document.querySelectorAll('a.js-utm, a[data-utm="true"]').forEach(a => {
      const defaults = parseBase(a.getAttribute('data-utm-base'));
      const utmToUse = Object.keys(stored).length ? stored : defaults;
      if (Object.keys(utmToUse).length) decorateLink(a, utmToUse);
    });
  }

  // ---------- CTA click events ----------
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-cta]');
    if (!a) return;
    window.dataLayer.push({
      event: 'cta_click',
      cta: a.getAttribute('data-cta') || '',
      page: document.body.getAttribute('data-page') || '',
      href: a.getAttribute('href') || ''
    });
  }, { passive: true });

  // ---------- Cookie banner (simple preference) ----------
  const CONSENT_KEY = 'jakoma_cookie_consent_v1'; // 'accepted' | 'declined'
  function hideCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.style.display = 'none';
  }

  function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    try {
      const pref = localStorage.getItem(CONSENT_KEY);
      if (pref === 'accepted' || pref === 'declined') {
        hideCookieBanner();
        return;
      }
    } catch (e) {}

    const acceptBtn = banner.querySelector('[data-cookie="accept"]');
    const declineBtn = banner.querySelector('[data-cookie="decline"]');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch (e) {}
        hideCookieBanner();
      });
    }
    if (declineBtn) {
      declineBtn.addEventListener('click', () => {
        try { localStorage.setItem(CONSENT_KEY, 'declined'); } catch (e) {}
        hideCookieBanner();
      });
    }
  }

  // Run
  applyUtmDecoration();
  initCookieBanner();
})();
