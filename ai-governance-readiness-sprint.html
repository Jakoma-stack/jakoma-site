/*!
 * Jakoma site.js (unified)
 * - Mobile menu toggle (accessible)
 * - UTM persistence (session) + outbound link decoration
 * - CTA click events (dataLayer)
 * - Cookie consent preference (COOKIE) + Google Consent Mode update
 * - Back navigation (top-left button if present)
 */
(function () {
  'use strict';

  // -----------------------------
  // Helpers / constants
  // -----------------------------
  const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_id','gclid','gbraid','wbraid','fbclid','ttclid','msclkid','li_fat_id'];
  const UTM_STORE_KEY = 'jakoma_utm_v1';

  const CONSENT_KEY = 'jakoma_cookie_consent'; // 'accepted' | 'declined'
  const CONSENT_LEGACY_KEYS = [
    'jakoma_cookie_consent_v1',
    'jakomaCookieConsent' // older pages sometimes used this
  ];
  const CONSENT_COOKIE_DAYS = 365;

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

  // -----------------------------
  // Cookie helpers (consent)
  // -----------------------------
  function isJakomaDomain() {
    const h = (window.location.hostname || '').toLowerCase();
    // ✅ PATCH: include www.jakoma.org so consent persists regardless of entry host
    return h === 'jakoma.org' || h === 'www.jakoma.org' || h.endsWith('.jakoma.org');
  }

  function getCookie(name) {
    try {
      const parts = document.cookie ? document.cookie.split('; ') : [];
      for (const part of parts) {
        const idx = part.indexOf('=');
        if (idx === -1) continue;
        const k = part.slice(0, idx);
        const v = part.slice(idx + 1);
        if (k === name) return decodeURIComponent(v);
      }
    } catch (e) {}
    return null;
  }

  function setCookie(name, value, days) {
    try {
      const maxAge = (days || 365) * 24 * 60 * 60;
      const secure = window.location.protocol === 'https:' ? '; Secure' : '';
      const domain = isJakomaDomain() ? '; Domain=.jakoma.org' : '';
      document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/${domain}; SameSite=Lax${secure}`;
    } catch (e) {}
  }

  function deleteCookie(name) {
    try {
      const secure = window.location.protocol === 'https:' ? '; Secure' : '';
      const domain = isJakomaDomain() ? '; Domain=.jakoma.org' : '';
      document.cookie = `${name}=; Max-Age=0; Path=/${domain}; SameSite=Lax${secure}`;
    } catch (e) {}
  }

  function normaliseConsent(v) {
    if (!v) return null;
    if (v === 'granted') return 'accepted';
    if (v === 'denied') return 'declined';
    if (v === 'accepted' || v === 'declined') return v;
    return null;
  }

  function getConsent() {
    // 1) Prefer cookie (works across pages + subdomains)
    const fromCookie = normaliseConsent(getCookie(CONSENT_KEY));
    if (fromCookie) return fromCookie;

    // 2) Migrate from localStorage (older implementation)
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

    const norm = normaliseConsent(v);
    if (norm) {
      // write-through migration so visitor doesn’t get prompted again
      setCookie(CONSENT_KEY, norm, CONSENT_COOKIE_DAYS);
      try { localStorage.setItem(CONSENT_KEY, norm); } catch (e) {}
      return norm;
    }

    return null;
  }

  function setConsent(val) {
    const norm = normaliseConsent(val);
    if (!norm) return;

    // Persist site-wide via cookie
    setCookie(CONSENT_KEY, norm, CONSENT_COOKIE_DAYS);

    // Optional mirror to localStorage during transition (prevents old inline scripts misbehaving)
    try { localStorage.setItem(CONSENT_KEY, norm); } catch (e) {}

    updateGtagConsent(norm);
  }

  function resetConsent() {
    deleteCookie(CONSENT_KEY);
    try {
      localStorage.removeItem(CONSENT_KEY);
      for (const k of CONSENT_LEGACY_KEYS) localStorage.removeItem(k);
    } catch (e) {}
  }

  // Expose a small API for your Cookie Policy page buttons
  window.jakomaConsent = {
    get: getConsent,
    set: setConsent,
    reset: function () {
      resetConsent();
      // simplest behaviour: refresh so banner can reappear naturally
      window.location.reload();
    }
  };

  // -----------------------------
  // Google Consent Mode
  // -----------------------------
  function updateGtagConsent(val) {
    // Works whether gtag is present or only dataLayer exists.
    try {
      window.dataLayer = window.dataLayer || [];
      const gtag = window.gtag || function(){ window.dataLayer.push(arguments); };

      if (val === 'accepted') {
        gtag('consent', 'update', {
          ad_storage: 'denied',
          analytics_storage: 'granted',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          functionality_storage: 'granted',
          security_storage: 'granted'
        });
      } else if (val === 'declined') {
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

  // Optional: default to denied until a choice is made (helps Consent Mode behaviour)
  function setDefaultConsentIfNone() {
    try {
      const pref = getConsent();
      if (pref) return;
      window.dataLayer = window.dataLayer || [];
      const gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
      gtag('consent', 'default', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted'
      });
    } catch (e) {}
  }

  // -----------------------------
  // DOM ready helper
  // -----------------------------
  function whenReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  // -----------------------------
  // Back button (optional)
  // -----------------------------
  function initBackButton() {
    const btn = document.getElementById('backButton');
    if (!btn) return;

    let sameOriginReferrer = false;
    try {
      sameOriginReferrer = document.referrer && new URL(document.referrer).origin === window.location.origin;
    } catch (e) { sameOriginReferrer = false; }

    // Hide if there’s nowhere sensible to go back to (keeps homepage clean)
    if (!sameOriginReferrer && (!window.history || window.history.length <= 1)) {
      btn.style.display = 'none';
      return;
    }

    btn.addEventListener('click', () => {
      if (sameOriginReferrer) window.history.back();
      // ✅ PATCH: avoid '/' assumptions; keep relative navigation consistent
      else window.location.href = 'index.html';
    });
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

    overlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
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
    document.querySelectorAll('a').forEach(decorateLink);
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
    if (banner) {
      banner.style.display = 'none';
      banner.setAttribute('aria-hidden', 'true');
    }
  }

  function showCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.style.display = '';
      banner.setAttribute('aria-hidden', 'false');
    }
  }

  function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    const pref = getConsent();
    if (pref === 'accepted' || pref === 'declined') {
      hideCookieBanner();
      updateGtagConsent(pref);
      return;
    }

    showCookieBanner();

    const acceptBtn = banner.querySelector('[data-cookie="accept"]');
    const declineBtn = banner.querySelector('[data-cookie="decline"]');

    if (acceptBtn && !acceptBtn.__jakomaBound) {
      acceptBtn.addEventListener('click', () => {
        setConsent('accepted');
        hideCookieBanner();
      });
      acceptBtn.__jakomaBound = true;
    }

    if (declineBtn && !declineBtn.__jakomaBound) {
      declineBtn.addEventListener('click', () => {
        setConsent('declined');
        hideCookieBanner();
      });
      declineBtn.__jakomaBound = true;
    }
  }

  // -----------------------------
  // Boot
  // -----------------------------
  captureInboundUtm();
  setDefaultConsentIfNone();

  whenReady(function () {
    initBackButton();
    initMenuBindings();
    applyUtmDecoration();
    initClickTracking();
    initCookieBanner();
  });
})();
