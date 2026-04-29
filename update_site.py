from pathlib import Path
import re

root = Path('.')

index = (root/'index.html').read_text()
services = (root/'services.html').read_text()
style = (root/'style.css').read_text()

new_page = '''<!DOCTYPE html>
<html lang="en-GB">
<head>
<title>Jakoma Independent Living Tech | Practical Home Technology Setup for Families</title>
<link rel="canonical" href="https://www.jakoma.org/independent-living-tech.html"/>
<meta name="description" content="Jakoma helps families set up practical home technology to support older relatives to remain safe, independent and connected at home."/>
<meta property="og:site_name" content="Jakoma"/>
<meta property="og:title" content="Jakoma Independent Living Tech"/>
<meta property="og:description" content="Practical home technology setup for families supporting an older relative at home."/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="https://www.jakoma.org/independent-living-tech.html"/>
<meta property="og:image" content="https://www.jakoma.org/logo.jpg"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<link rel="icon" href="favicon.ico" sizes="any"/>
<link rel="icon" type="image/png" sizes="48x48" href="favicon-48.png"/>
<link rel="icon" type="image/png" sizes="192x192" href="favicon-192.png"/>
<link rel="apple-touch-icon" href="apple-touch-icon.png"/>
<link rel="manifest" href="site.webmanifest"/>
<meta name="theme-color" content="#0b2d6b"/>
<link rel="stylesheet" href="style.css"/>
<script id="consent-init">
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'functionality_storage': 'granted',
  'security_storage': 'granted'
});
</script>
<script id="gtm-script">(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id=GTM-WCJBPXM6'+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WCJBPXM6');</script>
<script type="application/ld+json">{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Jakoma Independent Living Tech",
  "provider": {
    "@type": "Organization",
    "name": "Jakoma",
    "url": "https://www.jakoma.org/"
  },
  "url": "https://www.jakoma.org/independent-living-tech.html",
  "serviceType": "Home independence technology setup and support",
  "areaServed": "United Kingdom"
}</script>
</head>
<body data-page="independent-living-tech.html">
<a class="skip-link" href="#main">Skip to content</a>
<noscript><iframe height="0" src="https://www.googletagmanager.com/ns.html?id=GTM-WCJBPXM6" style="display:none;visibility:hidden" width="0"></iframe></noscript>
<div aria-hidden="true" aria-label="Cookie consent" id="cookie-banner" role="dialog" style="display:none;position:fixed;bottom:0;width:100%;background:#eee;padding:1rem;text-align:center;z-index:1000;">We use essential cookies for site function and optional analytics cookies to understand usage. <a href="cookies.html">Learn more</a><button aria-label="Accept cookies" data-cookie="accept" type="button">Accept</button><button aria-label="Decline cookies" data-cookie="decline" type="button">Decline</button></div>
<div aria-hidden="true" class="mobile-menu-overlay"></div><nav aria-label="Mobile menu" class="mobile-menu" id="mobileMenu"><button aria-label="Close menu" class="menu-close" onclick="toggleMenu()" type="button">✕</button><a href="index.html">Home</a><a href="services.html">Services</a><a href="how-we-work.html">How We Work</a><a href="about.html">About</a><a href="products.html">Toolkits</a><div class="mobile-menu-section">Service areas</div><a href="ai-governance.html">AI &amp; Governance</a><a href="data-analytics.html">Data &amp; Analytics</a><a href="apps-automation.html">Apps &amp; Automation</a><a href="strategy-transformation.html">Strategy &amp; Transformation</a><a href="audit-assurance.html">Audit &amp; Assurance</a><a aria-current="page" href="independent-living-tech.html">Independent Living Tech</a><div class="mobile-menu-section">Offers</div><a href="ai-governance-readiness-sprint.html">AI Governance Sprint</a><a href="fractional-governance-leader-retainer.html">Fractional Retainer</a><a href="copilot-workflow-automation-prototype-sprint.html">Prototype Sprint</a><a href="policy.html">Privacy Policy</a><a href="terms.html">Terms of Use</a><a href="cookies.html">Cookie Policy</a></nav>
<header class="site-header service-hero family-hero">
<div class="topbar">
  <button aria-label="Go back" class="back-toggle" id="backButton" type="button"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg></button>
  <div class="brand-wrap"><a class="brand" aria-label="Jakoma home" href="index.html"><img alt="Jakoma logo" loading="lazy" src="logo.jpg" width="92"/></a></div>
  <nav aria-label="Primary" class="desktop-nav"><a href="index.html">Home</a><a href="services.html">Services</a><a href="how-we-work.html">How We Work</a><a href="about.html">About</a><a href="products.html">Toolkits</a><a aria-current="page" href="independent-living-tech.html">Independent Living Tech</a><a class="nav-cta" href="mailto:support@jakoma.org?subject=Jakoma%20Independent%20Living%20Tech%20enquiry">Book an Assessment</a></nav>
  <button aria-controls="mobileMenu" aria-expanded="false" aria-label="Open menu" class="menu-toggle" type="button">☰</button>
</div>
<div class="hero-shell">
  <p class="eyebrow">Jakoma Independent Living Tech</p>
  <h1>Practical home technology setup for families supporting an older relative at home.</h1>
  <p class="hero-copy">We help families choose, install and configure simple technology such as smart buttons, sensors, alerts, routines and reassurance tools so home feels safer, calmer and easier to manage.</p>
  <div class="hero-actions"><a class="cta-button" href="mailto:support@jakoma.org?subject=Book%20a%20home%20assessment">Book an Assessment</a><a class="cta-button ghost" href="#packages">See packages</a></div>
  <p class="hero-note">Non-clinical service. Not an emergency response or medical monitoring service.</p>
</div>
</header>
<main id="main">
<section class="section proof-strip">
  <div class="grid grid-4">
    <div class="card mini-stat"><strong>Assessment first</strong><span>Start with the worries, the home and what your family is actually willing to use.</span></div>
    <div class="card mini-stat"><strong>Simple tech</strong><span>Buttons, sensors, alerts, routines and practical setup using trusted third-party devices.</span></div>
    <div class="card mini-stat"><strong>Family training</strong><span>We show everyone how the setup works and what happens when an alert triggers.</span></div>
    <div class="card mini-stat"><strong>Ongoing support</strong><span>Tweaks, troubleshooting and sensible next steps as needs change.</span></div>
  </div>
</section>
<section class="section split">
  <div class="panel">
    <h2>Who this is for</h2>
    <p class="lead">This service is designed for families who want to help an older relative stay independent at home, without leaving everything to guesswork.</p>
    <ul class="checklist">
      <li>You are worried about night-time movement, doors, routines or reassurance.</li>
      <li>You want a setup that family members can actually use and respond to.</li>
      <li>You need help choosing the right devices and making them work together.</li>
      <li>You want practical support, not jargon and not a pile of unopened boxes.</li>
    </ul>
  </div>
  <div class="panel">
    <h2>Common situations we can support</h2>
    <div class="grid grid-2 compact-grid">
      <div class="card compact-card"><h3>Night reassurance</h3><p>Bed-exit, hallway movement, lighting and overnight alerts.</p></div>
      <div class="card compact-card"><h3>Door and wandering concerns</h3><p>Door sensors, notifications and simple escalation routes.</p></div>
      <div class="card compact-card"><h3>Call-for-help setup</h3><p>Easy buttons and routines that alert the right family members.</p></div>
      <div class="card compact-card"><h3>Home confidence after discharge</h3><p>Practical setup and support when home needs to work differently.</p></div>
    </div>
  </div>
</section>
<section class="section">
  <div class="panel">
    <h2>What Jakoma does</h2>
    <div class="grid grid-3">
      <div class="card route-card"><span class="tag">Step 01</span><h3>Assess</h3><p>We talk through the home, the concerns, the routines, the limits and what success looks like.</p></div>
      <div class="card route-card"><span class="tag">Step 02</span><h3>Set up</h3><p>We source suitable third-party devices, install them, configure alerts and test the setup properly.</p></div>
      <div class="card route-card"><span class="tag">Step 03</span><h3>Support</h3><p>We leave clear instructions, train family members and offer follow-up support as needs change.</p></div>
    </div>
  </div>
</section>
<section class="section" id="packages">
  <h2>Simple starting packages</h2>
  <div class="grid grid-3">
    <div class="card offer-card"><p class="price-kicker">From £149</p><h3>Home Assessment</h3><p>Home visit, risk and routine discussion, practical recommendations and a written next-step plan.</p><p class="center-actions"><a class="cta-button" href="mailto:support@jakoma.org?subject=Home%20Assessment%20enquiry">Enquire now</a></p></div>
    <div class="card offer-card"><p class="price-kicker">From £399 + devices</p><h3>Setup &amp; Installation</h3><p>Supply or configure selected devices, create routines, route alerts, test everything and train the family.</p><p class="center-actions"><a class="cta-button" href="mailto:support@jakoma.org?subject=Setup%20and%20Installation%20enquiry">Enquire now</a></p></div>
    <div class="card offer-card"><p class="price-kicker">From £29/month</p><h3>Ongoing Support</h3><p>Remote tweaks, troubleshooting, settings changes and support when routines or needs shift.</p><p class="center-actions"><a class="cta-button" href="mailto:support@jakoma.org?subject=Ongoing%20Support%20enquiry">Enquire now</a></p></div>
  </div>
</section>
<section class="section split">
  <div class="panel tone-panel">
    <h2>What this service includes</h2>
    <ul class="plain-list">
      <li>Practical recommendations based on the home and the family setup</li>
      <li>Installation and configuration of selected third-party devices</li>
      <li>Alert routing, routine setup and user testing</li>
      <li>Simple written instructions and family handover</li>
      <li>Optional follow-up support</li>
    </ul>
  </div>
  <div class="panel tone-panel caution-panel">
    <h2>What this service does not do</h2>
    <ul class="plain-list">
      <li>It is not a medical device service</li>
      <li>It is not a substitute for clinical advice, emergency response or professional care</li>
      <li>It does not guarantee safety or prevention of incidents</li>
      <li>It does not replace family judgement or professional assessment</li>
      <li>It uses selected third-party devices rather than rebranded Jakoma hardware</li>
    </ul>
  </div>
</section>
<section class="section">
  <div class="panel">
    <h2>Frequently asked questions</h2>
    <div class="faq-list">
      <div class="card faq-card"><h3>Do you need everything to be smart already?</h3><p>No. Many families start with only a few well-chosen devices and build from there.</p></div>
      <div class="card faq-card"><h3>Do you only use one brand?</h3><p>No. We choose from suitable third-party devices depending on the problem, the home and ease of use.</p></div>
      <div class="card faq-card"><h3>Is this for hospitals or care providers?</h3><p>No. This page is aimed at families and home settings rather than organisational consulting clients.</p></div>
      <div class="card faq-card"><h3>Can you help after the first setup?</h3><p>Yes. Ongoing support is available for changes, troubleshooting and refinements.</p></div>
    </div>
  </div>
</section>
<section class="section">
  <div class="cta-band family-cta-band">
    <h2>Want a calmer, clearer setup at home?</h2>
    <p>Tell us what you are worried about in plain language and we will suggest the best starting point.</p>
    <div class="hero-actions"><a class="cta-button" href="mailto:support@jakoma.org?subject=Jakoma%20Independent%20Living%20Tech%20enquiry">Book an assessment</a><a class="cta-button ghost" href="services.html">Back to Jakoma services</a></div>
  </div>
</section>
</main>
<footer class="site-footer"><div class="footer-grid"><div><h3>Jakoma</h3><p>Jakoma is a founder-led consultancy and product studio. Independent Living Tech is a practical home technology service line for families.</p><p class="footer-contact"><a href="mailto:support@jakoma.org">support@jakoma.org</a><br/><a href="https://www.linkedin.com/company/jakoma/" rel="noopener noreferrer" target="_blank">LinkedIn</a></p></div><div><h4>Explore</h4><p><a href="services.html">Services</a><br/><a href="independent-living-tech.html">Independent Living Tech</a><br/><a href="about.html">About</a></p></div><div><h4>Legal</h4><p><a href="policy.html">Privacy</a><br/><a href="terms.html">Terms</a><br/><a href="cookies.html">Cookies</a></p></div></div><p class="footer-meta">© 2025–2026 Jakoma. All rights reserved.</p></footer>
<script defer src="site.js"></script>
</body>
</html>
'''

# Insert homepage teaser before final CTA section
teaser = '''<section class="section">
  <div class="panel family-feature-panel">
    <div class="split align-center">
      <div>
        <p class="eyebrow section-eyebrow">New service line</p>
        <h2>Jakoma Independent Living Tech</h2>
        <p class="lead">A dedicated service for families who want practical help setting up home technology for an older relative. This sits alongside Jakoma's consultancy work as a separate, family-focused offer.</p>
        <ul class="checklist">
          <li>Home assessments and practical recommendations</li>
          <li>Setup of smart buttons, sensors, alerts and routines</li>
          <li>Clear non-clinical positioning and family training</li>
        </ul>
      </div>
      <div class="card family-feature-card">
        <strong>Best fit for</strong>
        <p>Adult children and families trying to make home feel safer, calmer and easier to manage after discharge, during recovery or when reassurance matters.</p>
        <p class="center-actions"><a class="cta-button" href="independent-living-tech.html">Explore the family service</a></p>
      </div>
    </div>
  </div>
</section>
'''
index = index.replace('<section class="section">\n  <div class="cta-band">', teaser + '<section class="section">\n  <div class="cta-band">', 1)

# Update services page with dedicated card and CTA band text
services = services.replace('</div></div></section>\n<section class="section split">', '<div class="card emphasis-card"><h3>Independent Living Tech</h3><p>A dedicated family-facing service line for practical home technology setup, including alerts, routines, sensors and ongoing support for older relatives at home.</p><p class="center-actions"><a class="cta-button" href="independent-living-tech.html">Open family service page</a></p></div></div></div></section>\n<section class="section split">', 1)
services = services.replace('Choose the right route, then move with confidence', 'Choose the right route, then move with confidence')
services = services.replace('<div class="hero-actions"><a class="cta-button" href="about.html">Read about Jakoma</a><a class="cta-button ghost js-utm"', '<div class="hero-actions"><a class="cta-button" href="about.html">Read about Jakoma</a><a class="cta-button ghost" href="independent-living-tech.html">Family-facing service</a><a class="cta-button ghost js-utm"', 1)

# Add footer explore link to index/footer if present
index = index.replace('<p><a href="services.html">Services</a><br/><a href="how-we-work.html">How We Work</a><br/><a href="audit-assurance.html">For Audit &amp; Assurance</a></p>', '<p><a href="services.html">Services</a><br/><a href="how-we-work.html">How We Work</a><br/><a href="independent-living-tech.html">Independent Living Tech</a><br/><a href="audit-assurance.html">For Audit &amp; Assurance</a></p>', 1)
services = services.replace('<p><a href="services.html">Services</a><br/><a href="how-we-work.html">How We Work</a><br/><a href="audit-assurance.html">For Audit &amp; Assurance</a></p>', '<p><a href="services.html">Services</a><br/><a href="how-we-work.html">How We Work</a><br/><a href="independent-living-tech.html">Independent Living Tech</a><br/><a href="audit-assurance.html">For Audit &amp; Assurance</a></p>', 1)

extra_css = '''

.section-eyebrow {
  color: var(--brand-blue);
  background: var(--brand-sky);
  border: 1px solid var(--brand-line);
}

.family-feature-panel {
  background: linear-gradient(135deg, #ffffff 0%, #f3f8ff 100%);
}

.family-feature-card,
.emphasis-card,
.compact-card,
.faq-card {
  height: 100%;
}

.family-feature-card {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.align-center {
  align-items: center;
}

.service-hero.family-hero {
  background: linear-gradient(135deg, #0a1d3f 0%, #0f3f73 45%, #2c7c8b 100%);
}

.hero-note {
  margin-top: 1rem;
  color: rgba(255,255,255,0.82);
  font-size: 0.98rem;
}

.compact-grid {
  gap: 1rem;
}

.compact-card h3,
.faq-card h3,
.emphasis-card h3 {
  margin-top: 0;
}

.tone-panel {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.caution-panel {
  border: 1px solid rgba(180, 95, 72, 0.18);
  background: linear-gradient(180deg, #ffffff 0%, #fff7f4 100%);
}

.faq-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.family-cta-band {
  background: linear-gradient(135deg, #0a1d3f 0%, #0f3f73 55%, #2c7c8b 100%);
}

@media (max-width: 860px) {
  .faq-list {
    grid-template-columns: 1fr;
  }
}
'''

(root/'independent-living-tech.html').write_text(new_page)
(root/'index.html').write_text(index)
(root/'services.html').write_text(services)
(root/'style.css').write_text(style + extra_css)
print('updated files')
