/* Jakoma shared site behaviours: hamburger menu + cookie consent (Consent Mode) */
(function () {
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

    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    }
    document.body.classList.toggle("menu-open", open);
  }

  function toggleMenu() {
    const isOpen = menu?.classList.contains("open");
    setMenuState(!isOpen);
  }

  // Backwards compatibility: pages that call toggleMenu() inline
  window.toggleMenu = toggleMenu;

  if (menuBtn) {
    menuBtn.setAttribute("aria-controls", "mobileMenu");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
  }

  // Close menu when any menu link is clicked
  if (menu) {
    menu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setMenuState(false));
    });
  }

  // Close menu when overlay is clicked
  if (overlay) {
    overlay.addEventListener("click", () => setMenuState(false));
  }

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenuState(false);
  });

  // -------------------------
  // Cookie consent (basic + Consent Mode)
  // -------------------------
  const banner = document.getElementById("cookie-banner");
  const STORAGE_KEY = "jakoma_cookie_consent"; // "accepted" | "declined"

  function hideBanner() {
    if (banner) banner.style.display = "none";
  }

  // Consent Mode default (deny analytics until accepted)
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }

  gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    personalization_storage: "denied",
    security_storage: "granted",
  });

  function setConsent(choice) {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch (e) {
      // If storage is blocked, still honour choice for this session by hiding banner.
    }

    if (choice === "accepted") {
      gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "granted",
        functionality_storage: "granted",
        personalization_storage: "denied",
        security_storage: "granted",
      });
    } else {
      gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied",
        functionality_storage: "granted",
        personalization_storage: "denied",
        security_storage: "granted",
      });
    }

    hideBanner();
  }

  // Wire up banner buttons if they exist
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

    // Hide banner if already decided
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}

    if (saved === "accepted") setConsent("accepted");
    else if (saved === "declined") setConsent("declined");
  }
})();
