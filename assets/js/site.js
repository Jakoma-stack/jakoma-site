/* Jakoma shared behaviours (single source of truth)
   - Hamburger menu (mobile drawer)
   - Cookie consent (Consent Mode friendly)
   - Click tracking hooks (dataLayer events)

   Include on every page:
   <script src="/assets/js/site.js" defer></script>
*/
(function () {
  "use strict";

  // -------------------------
  // Hamburger menu
  // -------------------------
  const menuBtn = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobileMenu");
  const overlay = document.querySelector(".mobile-menu-overlay");

  function setMenuState(open) {
    if (!menu || !overlay) return;
    menu.classList.toggle("open", open);
    overlay.classList.toggle("open", open);
    if (menuBtn) menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("menu-open", open);
  }

  function toggleMenu() {
    const isOpen = !!(menu && menu.classList.contains("open"));
    setMenuState(!isOpen);
  }

  // Backwards compatibility (in case any page still calls toggleMenu inline)
  window.toggleMenu = toggleMenu;

  if (menuBtn) {
    menuBtn.setAttribute("aria-controls", "mobileMenu");
    menuBtn.setAttribute("aria-expanded", "false");
    if (!menuBtn.getAttribute("aria-label")) menuBtn.setAttribute("aria-label", "Open menu");
    menuBtn.addEventListener("click", toggleMenu);
  }

  if (overlay) overlay.addEventListener("click", () => setMenuState(false));

  if (menu) {
    // Close menu after any nav click (mobile UX)
    menu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setMenuState(false));
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenuState(false);
  });

  // -------------------------
  // Cookie consent
  // -------------------------
  const banner = document.getElementById("cookie-banner");
  const STORAGE_KEY = "jakoma_cookie_consent"; // accepted | declined | granted | denied (legacy)

  // Always provide gtag helper (Consent Mode uses dataLayer)
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  // If head didn't initialise Consent Mode (should), do it safely here as a fallback
  if (!window.__jakomaConsentInitialised) {
    gtag("consent", "default", {
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "granted",
      security_storage: "granted",
    });
    window.__jakomaConsentInitialised = true;
  }

  function hideBanner() {
    if (banner) banner.style.display = "none";
  }

  function readConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function writeConsent(val) {
    try { localStorage.setItem(STORAGE_KEY, val); } catch (e) { /* ignore */ }
  }

  function applyConsent(choice) {
    // Normalise legacy values
    const accepted = (choice === "accepted" || choice === "granted");
    const declined = (choice === "declined" || choice === "denied");

    if (accepted) {
      gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "granted",
        ad_user_data: "denied",
        ad_personalization: "denied",
        functionality_storage: "granted",
        security_storage: "granted",
      });
    } else if (declined) {
      gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        functionality_storage: "granted",
        security_storage: "granted",
      });
    }
  }

  function setConsent(choice) {
    writeConsent(choice);
    applyConsent(choice);
    hideBanner();
  }

  // Wire cookie banner buttons (uses aria-labels)
  if (banner) {
    const buttons = banner.querySelectorAll("button");
    buttons.forEach((btn) => {
      const label = (btn.getAttribute("aria-label") || "").toLowerCase();
      btn.addEventListener("click", () => {
        if (label.includes("accept")) setConsent("accepted");
        else if (label.includes("decline")) setConsent("declined");
        else hideBanner();
      });
    });

    // Apply previously saved choice (and hide banner)
    const saved = readConsent();
    if (saved) {
      applyConsent(saved);
      hideBanner();
    }
  }

  // -------------------------
  // Lightweight click tracking (GTM-friendly)
  // Add data-track="..." to links/buttons you want to measure.
  // -------------------------
  function trackClick(el, label) {
    try {
      const payload = {
        event: "jakoma_click",
        click_label: label || "",
        click_text: (el.textContent || "").trim().slice(0, 120),
        click_href: el.getAttribute("href") || "",
        page_path: window.location.pathname,
      };
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);
    } catch (e) { /* ignore */ }
  }

  document.querySelectorAll("a[data-track], button[data-track]").forEach((el) => {
    el.addEventListener("click", () => trackClick(el, el.getAttribute("data-track")));
  });
})();
