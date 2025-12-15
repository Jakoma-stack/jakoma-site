/*!
 * Jakoma site.js (unified)
 * - Mobile menu toggle (works with or without inline onclick)
 * - UTM persistence + outbound link decoration (.js-utm)
 * - CTA click events (dataLayer)
 * - Cookie banner preference (localStorage/sessionStorage) + Consent Mode update
 */
(function () {
  'use strict';

  // ---------- Utilities ----------
  const win = window;
  const doc = document;

  win.dataLayer = win.dataLayer || [];
  win.gtag = win.gtag || function(){ win.dataLayer.push(arguments); };

  function safeGet(storage, key) {
    try { return storage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(storage, key, value) {
    try { storage.setItem(key, value); } catch (e) {}
  }

  // ---------- Mobile menu ----------
  function setMenuState(isOpen) {
    const menu = doc.getElementById('mobileMenu');
    const overlay = doc.querySelector('.mobile-menu-overlay');
    const toggle = doc.querySelector('.menu-toggle');
    if (!menu || !overlay) return;

    menu.classList.toggle('open', isOpen);
    overlay.classList.toggle('open', isOpen);

    if (toggle) {
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }
  }

  win.toggleMenu = function toggleMenu() {
    const menu = doc.getElementById('mobileMenu');
    if (!menu) return;
    setMenuState(!menu.classList.contains('open'));
  };

  function bindMenu() {
    const toggle = doc.querySelector('.menu-toggle');
    const overlay = doc.querySelector('.mobile-menu-overlay');
    const menu = doc.getElementById('mobileMenu');
    if (toggle && !toggle.__jakomaBound) {
      toggle.addEventListener('click', (e) => { e.preventDefault(); win.toggleMenu(); });
      toggle.__jakomaBound = true;
    }
    if (overlay && !overlay.__jakomaBound) {
      overlay.addEventListener('click', () => setMenuState(false));
      overlay.__jakomaBound = true;
    }
    if (menu && !menu.__jakomaBound) {
      menu.addEventListener('click', (e) => {
        const a = e.target && e.target.closest && e.target.closest('a[href]');
        if (a) setMenuState(false);
      });
      menu.__jakomaBound = true;
    }
    doc.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenuState(false);
    });
  }

  // ---------- UTM persistence ----------
  const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid','msclkid','li_fat_id'];
  const STORE_KEY = 'jakoma_utm_v1';

  function parseQuery(qs) {
    const out = {};
    const params = new URLSearchParams((qs || '').replace(/^\?/, ''));
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) out[k] = v;
    }
    return out;
  }

  function readStoredUtm() {
    const raw = safeGet(win.sessionStorage, STORE_KEY) || safeGet(win.localStorage, STORE_KEY);
    if (!raw) return {};
    try { return JSON.parse(raw) || {}; } catch (e) { return {}; }
  }

  function storeUtm(obj) {
    const json = JSON.stringify(obj || {});
    safeSet(win.sessionStorage, STORE_KEY, json);
    safeSet(win.localStorage, STORE_KEY, json);
  }

  // Store UTMs from landing URL if present
  (function initUtmStore() {
    const current = parseQuery(win.location.search || '');
    if (Object.keys(current).length) {
      const merged = { ...readStoredUtm(), ...current };
      storeUtm(merged);
    }
  })();

  function buildDecoratedUrl(href, baseParams) {
    try {
      const url = new URL(href, win.location.origin);
      const stored = readStoredUtm();

      // Apply base defaults first
      if (baseParams) {
        for (const [k,v] of Object.entries(baseParams)) {
          if (v && !url.searchParams.get(k)) url.searchParams.set(k, v);
        }
      }

      // Preserve original acquisition UTMs where available
      for (const k of ['utm_source','utm_medium','utm_campaign','utm_term','gclid','fbclid','msclkid','li_fat_id']) {
        if (stored[k]) url.searchParams.set(k, stored[k]);
      }

      // Prefer link-level utm_content if provided; otherwise keep stored utm_content
      if (baseParams && baseParams.utm_content) {
        url.searchParams.set('utm_content', baseParams.utm_content);
      } else if (stored.utm_content) {
        url.searchParams.set('utm_content', stored.utm_content);
      }

      return url.toString();
    } catch (e) {
      return href;
    }
  }

  function applyUtmDecoration() {
    const links = Array.from(doc.querySelectorAll('a.js-utm[href]'));
    if (!links.length) return;

    for (const a of links) {
      const base = (a.getAttribute('data-utm-base') || '').trim();
      const baseParams = base ? Object.fromEntries(new URLSearchParams(base)) : null;
      const original = a.getAttribute('href');

      // Don’t decorate anchors/mailto/tel
      if (!original || original.startsWith('#') || original.startsWith('mailto:') || original.startsWith('tel:')) continue;

      a.setAttribute('href', buildDecoratedUrl(original, baseParams));
    }
  }

  // ---------- CTA click tracking ----------
  function trackCtaClicks() {
    doc.addEventListener('click', (e) => {
      const a = e.target && e.target.closest && e.target.closest('a');
      if (!a) return;

      const cta = a.getAttribute('data-cta') || a.getAttribute('data-track');
      if (!cta) return;

      win.dataLayer.push({
        event: 'cta_click',
        cta_id: cta,
        page: doc.body && doc.body.getAttribute('data-page') || '',
        href: a.getAttribute('href') || '',
        text: (a.textContent || '').trim().slice(0, 100)
      });
    }, { passive: true });
  }

  // ---------- Cookie banner + Consent Mode ----------
  const CONSENT_KEY = 'jakoma_cookie_consent'; // values: 'accepted' | 'declined'
  const LEGACY_KEYS = ['jakoma_cookie_consent_v1']; // if any older script used this

  function getConsentValue() {
    return safeGet(win.localStorage, CONSENT_KEY)
      || safeGet(win.sessionStorage, CONSENT_KEY)
      || LEGACY_KEYS.map(k => safeGet(win.localStorage, k) || safeGet(win.sessionStorage, k)).find(Boolean)
      || null;
  }

  function setConsentValue(value) {
    safeSet(win.localStorage, CONSENT_KEY, value);
    safeSet(win.sessionStorage, CONSENT_KEY, value);
    for (const k of LEGACY_KEYS) {
      safeSet(win.localStorage, k, value);
      safeSet(win.sessionStorage, k, value);
    }
  }

  function hideCookieBanner() {
    const banner = doc.getElementById('cookie-banner');
    if (banner) banner.style.display = 'none';
  }

  function updateConsentMode(value) {
    // Your template sets ad_storage denied; keep that.
    if (value === 'accepted') {
      win.gtag('consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'granted',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted'
      });
    } else if (value === 'declined') {
      win.gtag('consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted'
      });
    }
  }

  function initCookieBanner() {
    const banner = doc.getElementById('cookie-banner');
    if (!banner) return;

    const existing = getConsentValue();
    if (existing === 'accepted' || existing === 'declined') {
      hideCookieBanner();
      updateConsentMode(existing);
      return;
    }

    // Support BOTH styles:
    // 1) data-cookie="accept"/"decline"
    // 2) aria-label / button text containing Accept/Decline
    const buttons = Array.from(banner.querySelectorAll('button'));
    const acceptBtn =
      banner.querySelector('button[data-cookie="accept"]') ||
      buttons.find(b => /accept/i.test(b.getAttribute('aria-label') || '') || /^accept$/i.test((b.textContent || '').trim()));
    const declineBtn =
      banner.querySelector('button[data-cookie="decline"]') ||
      buttons.find(b => /decline|reject/i.test(b.getAttribute('aria-label') || '') || /^(decline|reject)$/i.test((b.textContent || '').trim()));

    if (acceptBtn && !acceptBtn.__jakomaBound) {
      acceptBtn.addEventListener('click', () => {
        setConsentValue('accepted');
        updateConsentMode('accepted');
        hideCookieBanner();
        win.dataLayer.push({ event: 'cookie_consent', status: 'accepted' });
      });
      acceptBtn.__jakomaBound = true;
    }
    if (declineBtn && !declineBtn.__jakomaBound) {
      declineBtn.addEventListener('click', () => {
        setConsentValue('declined');
        updateConsentMode('declined');
        hideCookieBanner();
        win.dataLayer.push({ event: 'cookie_consent', status: 'declined' });
      });
      declineBtn.__jakomaBound = true;
    }
  }

  // ---------- Run ----------
  bindMenu();
  applyUtmDecoration();
  trackCtaClicks();
  initCookieBanner();
})();
