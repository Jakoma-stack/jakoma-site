/*!
 * Jakoma site.js (unified)
 * - Mobile menu toggle (accessible)
 * - UTM persistence (session) + outbound link decoration
 * - CTA click events (dataLayer)
 * - Cookie consent preference (localStorage) + Google Consent Mode update
 */
(function () {
  'use strict';

  // -----------------------------
  // Helpers
  // -----------------------------
  const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid','msclkid','li_fat_id'];
  const UTM_STORE_KEY = 'jakoma_utm_v1';

  const CONSENT_KEY = 'jakoma_cookie_consent'; // 'accepted' | 'declined'
  const CONSENT_LEGACY_KEYS = ['jakoma_cookie_consent_v1'];

  function safeJSONParse(str) {
    try { return JSON.parse(str || '{}'); } catch (e) { return {}; }
  }

  function parseQuery(qs) {
    const out = {};
    const params = new URLSearchParams(qs || '');
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) out[k] = v;
    }
    return out;
  }

  function getStoredUtm() {
    return safeJSONParse(sessionStorage.getItem(UTM_STORE_KEY));
  }

  function setStoredUtm(obj) {
    try { sessionStorage.setItem(UTM_STORE_KEY, JSON.stringify(obj || {})); } catch (e) {}
  }

  function parseBase(str) {
    if (!str) return {};
    return parseQuery(str.startsWith('?') ? str : '?' + str);
  }

  function getConsent() {
    let v = null;
    try {
      v = localStorage.getItem(CONSENT_KEY);
      if (!v) {
        for (const k of CONSENT_LEGACY_KEYS) {
          const legacy = localStorage.getItem(k);
          if (legacy) { v = legacy; break; }
        }
      }
    } catch (e) { v = null; }
    return v;
  }

  function setConsent(val) {
    try { localStorage.setItem(CONSENT_KEY, val); } catch (e) {}
  }

  function updateGtagConsent(val) {
    // Works whether gtag is present or only dataLayer exists.
    try {
      window.dataLayer = window.dataLayer || [];
      const gtag = window.gtag || function(){ window.dataLayer.push(arguments); };

      if (val === 'accepted' || val === 'granted') {
        gtag('consent', 'update', {
          ad_storage: 'denied',
          analytics_storage: 'granted',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          functionality_storage: 'granted',
          security_storage: 'granted'
        });
      } else if (val === 'declined' || val === 'denied') {
        gtag('consent', 'update', {
          ad_storage: 'denied',
          analytics_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          functionality_storage: 'granted',
          security_storage: 'granted'
        });
      }
    } catch (e) {}
  }

  function whenReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  // -----------------------------
  // Mobile menu (global toggleMenu for inline handlers)
  // -----------------------------
  function setMenuState(isOpen) {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const toggle = document.querySelector('.menu-toggle');
    if (!menu || !overlay) return;

    menu.classList.toggle('open', isOpen);
    overlay.classList.toggle('open', isOpen);

    if (toggle) {
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }

    if (isOpen) {
      overlay.setAttribute('aria-hidden', 'false');
    } else {
      overlay.setAttribute('aria-hidden', 'true');
    }
  }

  window.toggleMenu = function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    if (!menu) return;
    const isOpen = menu.classList.contains('open');
    setMenuState(!isOpen);
  };

  function initMenuBindings() {
    const toggle = document.querySelector('.menu-toggle');
    const overlay = document.querySelector('.mobile-menu-overlay');

    if (toggle && !toggle.__jakomaBound) {
      toggle.addEventListener('click', (e) => {
        // If the button also has onclick="toggleMenu()", prevent double toggles.
        if (toggle.getAttribute('onclick')) return;
        e.preventDefault();
        window.toggleMenu();
      });
      toggle.__jakomaBound = true;
    }

    if (overlay && !overlay.__jakomaBound) {
      overlay.addEventListener('click', (e) => {
        if (overlay.getAttribute('onclick')) return;
        e.preventDefault();
        setMenuState(false);
      });
      overlay.__jakomaBound = true;
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenuState(false);
    });
  }

  // -----------------------------
  // UTM persistence + decoration
  // -----------------------------
  function captureInboundUtm() {
    const inbound = parseQuery(window.location.search);
    const stored = getStoredUtm();
    const merged = Object.assign({}, stored, inbound); // inbound wins
    if (Object.keys(merged).length) setStoredUtm(merged);
  }

  function buildTrackingParamsForLink(a) {
    const stored = getStoredUtm();
    const base = parseBase(a.getAttribute('data-utm-base'));

    // Start with base defaults (for direct traffic), then let stored override most fields.
    const out = Object.assign({}, base);

    for (const k of UTM_KEYS) {
      if (!stored[k]) continue;

      // Keep CTA context: if base provides utm_content, prefer base for that single key.
      if (k === 'utm_content' && base.utm_content) continue;

      out[k] = stored[k];
    }

    // If base doesn't specify content, fall back to stored content.
    if (!out.utm_content && stored.utm_content) out.utm_content = stored.utm_content;

    return out;
  }

  function decorateLink(a) {
    try {
      const href = a.getAttribute('href');
      if (!href) return;

      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      const u = new URL(href, window.location.origin);

      // Only decorate outbound links OR links marked with js-utm/data-utm
      const force = a.classList.contains('js-utm') || a.getAttribute('data-utm') === 'true';
      const outbound = u.origin !== window.location.origin;

      if (!force && !outbound) return;

      const params = buildTrackingParamsForLink(a);
      for (const [k, v] of Object.entries(params)) {
        if (!v) continue;
        if (!u.searchParams.get(k)) u.searchParams.set(k, v);
      }

      a.setAttribute('href', u.toString());
    } catch (e) {}
  }

  function applyUtmDecoration() {
    document.querySelectorAll('a.js-utm, a[data-utm="true"]').forEach(decorateLink);
  }

  // -----------------------------
  // CTA click tracking (dataLayer)
  // -----------------------------
  function initClickTracking() {
    window.dataLayer = window.dataLayer || [];

    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-cta], a[data-track]');
      if (!a) return;

      const cta = a.getAttribute('data-cta') || a.getAttribute('data-track') || '';
      const page = document.body ? (document.body.getAttribute('data-page') || '') : '';
      const href = a.getAttribute('href') || '';
      const text = (a.textContent || '').trim().slice(0, 120);

      window.dataLayer.push({
        event: 'cta_click',
        cta,
        page,
        href,
        text
      });
    }, { passive: true });
  }

  // -----------------------------
  // Cookie banner
  // -----------------------------
  function hideCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.style.display = 'none';
  }

  function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    const pref = getConsent();
    if (pref === 'accepted' || pref === 'declined' || pref === 'granted' || pref === 'denied') {
      // Migrate legacy key to the current key if needed
      if (pref === 'granted') setConsent('accepted');
      if (pref === 'denied') setConsent('declined');
      if (pref === 'accepted' || pref === 'declined') setConsent(pref);
      hideCookieBanner();
      updateGtagConsent(pref === 'granted' ? 'accepted' : pref === 'denied' ? 'declined' : pref);
      return;
    }

    const acceptBtn = banner.querySelector('[data-cookie="accept"]');
    const declineBtn = banner.querySelector('[data-cookie="decline"]');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        setConsent('accepted');
        hideCookieBanner();
        updateGtagConsent('accepted');
      });
    }
    if (declineBtn) {
      declineBtn.addEventListener('click', () => {
        setConsent('declined');
        hideCookieBanner();
        updateGtagConsent('declined');
      });
    }
  }

  // -----------------------------
  // Boot
  // -----------------------------
  captureInboundUtm();

  whenReady(function () {
    initMenuBindings();
    applyUtmDecoration();
    initClickTracking();
    initCookieBanner();
  });
})();
