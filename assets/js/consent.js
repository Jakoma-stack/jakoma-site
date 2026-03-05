(function () {
  const COOKIE_NAME = "jakoma_cookie_consent";
  const COOKIE_VALUE_ACCEPT = "accepted";
  const COOKIE_VALUE_DECLINE = "declined";
  const MAX_AGE_DAYS = 365;

  function getCookie(name) {
    return document.cookie.split("; ").reduce((acc, part) => {
      const [k, v] = part.split("=");
      return k === name ? decodeURIComponent(v) : acc;
    }, null);
  }

  function setCookie(name, value) {
    const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie =
      `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; Domain=.jakoma.org; SameSite=Lax${secure}`;
  }

  function hasChoice() {
    const v = getCookie(COOKIE_NAME);
    return v === COOKIE_VALUE_ACCEPT || v === COOKIE_VALUE_DECLINE;
  }

  function loadAnalytics() {
    // Example: load GTM only after consent
    // Replace 'GTM-XXXXXXX' with your container ID if you use GTM
    const gtmId = "GTM-XXXXXXX";
    if (!gtmId || gtmId.includes("XXXX")) return;

    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    document.head.appendChild(s);
  }

  function showBanner() {
    const banner = document.createElement("div");
    banner.style.position = "fixed";
    banner.style.left = "0";
    banner.style.right = "0";
    banner.style.bottom = "0";
    banner.style.padding = "16px";
    banner.style.background = "#111";
    banner.style.color = "#fff";
    banner.style.zIndex = "9999";
    banner.innerHTML = `
      <div style="max-width:1000px;margin:0 auto;display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:space-between;">
        <div style="flex:1;min-width:260px;">
          We use cookies to improve the site and measure usage. You can accept or decline non-essential cookies.
          <a href="/cookies.html" style="color:#fff;text-decoration:underline;">Cookie policy</a>
        </div>
        <div style="display:flex;gap:10px;">
          <button id="jakoma-decline" style="padding:10px 14px;">Decline</button>
          <button id="jakoma-accept" style="padding:10px 14px;">Accept</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById("jakoma-accept").onclick = () => {
      setCookie(COOKIE_NAME, COOKIE_VALUE_ACCEPT);
      banner.remove();
      loadAnalytics();
    };

    document.getElementById("jakoma-decline").onclick = () => {
      setCookie(COOKIE_NAME, COOKIE_VALUE_DECLINE);
      banner.remove();
    };
  }

  // On page load:
  const choice = getCookie(COOKIE_NAME);

  if (!hasChoice()) {
    showBanner();
  } else if (choice === COOKIE_VALUE_ACCEPT) {
    loadAnalytics();
  }
})();
