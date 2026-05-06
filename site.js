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
  const TRACKING_KEYS = UTM_KEYS.concat(['page','service']);

  const CONSENT_KEY = 'jakoma_cookie_consent'; // 'accepted' | 'declined'
  const CONSENT_LEGACY_KEYS = [
    'jakoma_cookie_consent_v1',
    'jakomaCookieConsent' // older pages sometimes used this
  ];
  const CONSENT_COOKIE_DAYS = 365;
  const GTM_ID = 'GTM-WCJBPXM6';
  let gtmLoaded = false;

  function loadGtm() {
    if (gtmLoaded || document.getElementById('gtm-script')) return;
    if (!GTM_ID) return;

    gtmLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    const firstScript = document.getElementsByTagName('script')[0];
    const script = document.createElement('script');
    script.id = 'gtm-script';
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(GTM_ID);
    if (firstScript && firstScript.parentNode) firstScript.parentNode.insertBefore(script, firstScript);
    else document.head.appendChild(script);
  }

  function safeJSONParse(str) {
    try { return JSON.parse(str || '{}'); } catch (e) { return {}; }
  }

  function parseQuery(qs) {
    const out = {};
    const params = new URLSearchParams(qs || '');
    for (const k of TRACKING_KEYS) {
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
        loadGtm();
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
    const inboundAll = parseQuery(window.location.search);
    const inbound = {};
    for (const k of UTM_KEYS) { if (inboundAll[k]) inbound[k] = inboundAll[k]; }
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
    const pref = getConsent();

    if (pref === 'accepted' || pref === 'declined') {
      if (banner) hideCookieBanner();
      updateGtagConsent(pref);
    } else if (banner) {
      showCookieBanner();
    }

    // Bind all consent controls, including the cookie policy page buttons.
    document.querySelectorAll('[data-cookie="accept"], [data-cookie="decline"]').forEach((btn) => {
      if (btn.__jakomaBound) return;
      btn.addEventListener('click', () => {
        const choice = btn.getAttribute('data-cookie') === 'accept' ? 'accepted' : 'declined';
        setConsent(choice);
        hideCookieBanner();
      });
      btn.__jakomaBound = true;
    });
  }



  // -----------------------------
  // Repurly register interest form (static mailto fallback)
  // -----------------------------
  function initRepurlyInterestForm() {
    const form = document.getElementById('repurlyInterestForm');
    if (!form || form.__jakomaBound) return;
    form.__jakomaBound = true;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const get = (name) => (data.get(name) || '').toString().trim();
      const checked = (name) => data.getAll(name).map(v => v.toString().trim()).filter(Boolean).join(', ');
      const stored = getStoredUtm();

      const lines = [
        'Repurly register interest',
        '',
        `Name: ${get('name')}`,
        `Email: ${get('email')}`,
        `Organisation or brand: ${get('organisation')}`,
        `Role: ${get('role')}`,
        `Audience type: ${get('audience_type')}`,
        `LinkedIn pages/profiles managed: ${get('linkedin_profiles_managed')}`,
        `Help wanted: ${checked('help_with')}`,
        `Testing interest: ${get('testing_interest')}`,
        `Current workflow/tools: ${get('current_workflow')}`,
        `Notes: ${get('notes')}`,
        `Consent: ${get('consent')}`,
        '',
        'Tracking context',
        `Page: ${document.body ? (document.body.getAttribute('data-page') || '') : ''}`,
        `URL: ${window.location.href}`,
        `UTM/source data: ${Object.keys(stored).length ? JSON.stringify(stored) : 'not captured'}`
      ];

      const subjectSource = get('organisation') || get('name') || 'website visitor';
      const subject = `Repurly register interest: ${subjectSource}`;
      const mailto = `mailto:support@jakoma.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;

      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'repurly_interest_submit',
          cta: 'repurly_interest_form_submit',
          page: document.body ? (document.body.getAttribute('data-page') || '') : '',
          audience_type: get('audience_type'),
          testing_interest: get('testing_interest')
        });
      } catch (err) {}

      window.location.href = mailto;

      const status = document.getElementById('repurlyFormStatus');
      if (status) status.textContent = 'Your email app should open with the registration details. Please review and send it to complete your interest registration.';
    });
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
    initRepurlyInterestForm();
  });
})();
