# Jakoma site review and monetisation action plan

Updated in this zip: conversion flow, Independent Living service area wording, primary CTAs, UTM tracking, and clearer enquiry-first journeys.

## What changed in the site files

1. Independent Living pages now use the short enquiry form as the main first step instead of pushing direct payment too early.
2. Direct payment links remain available on package/pricing cards where appropriate.
3. The long intake form is positioned as an after-booking form, not the first public CTA.
4. Service area wording now uses a profitable 3-zone model:
   - Banbridge + approx. 30 miles = standard visits.
   - Outside 30 miles = enquire anyway; travel supplement or remote advice may apply.
   - Property/provider projects = wider Northern Ireland considered where project value makes sense.
5. Smart Stay remains a separate property/short-term rental service line.
6. Tally, Stripe and WhatsApp links now include UTM/source context and page/service parameters where appropriate.
7. Duplicate bottom CTA links were simplified to reduce friction.

---

# Immediate next steps

## Step 1 — Upload and test the new zip

1. Unzip the package.
2. Upload the contents to your web host, replacing the existing site files.
3. Open the live homepage.
4. Open and test these pages:
   - `/independent-living-tech.html`
   - `/technology-for-older-relatives.html`
   - `/technology-for-people-living-alone.html`
   - `/rental-property-safety-tech.html`
   - `/supported-living-technology.html`
   - `/post-hospital-home-setup.html`
   - `/short-term-rental-tech-setup.html`
5. Click every main button.
6. Check each button opens the expected Tally, Stripe or WhatsApp destination.
7. Submit one test enquiry with the name `TEST PLEASE IGNORE`.

---

# Forms you need

## Form A — Jakoma Home Tech Enquiry

Status: already exists.

Use this as the main public website form.

Current likely URL:
`https://tally.so/r/yP05lg`

Purpose: first enquiry / lead capture before payment.

Keep it short. It should take 2-3 minutes.

### Keep these fields

- Full name
- Email
- Phone
- Preferred contact method
- Best time to contact
- Who is this enquiry for?
- Town or postcode
- Is the property within Banbridge + 30 miles?
- Main concerns
- Brief description of situation
- What are you hoping for help with?
- How did you hear about Jakoma?
- Anything else?
- Consent checkboxes

### Make these optional or move to the long intake form

- Broadband available
- Working Wi-Fi
- Cameras/video doorbells
- Does the person know this enquiry is being made?

These are useful, but they slow down first enquiry conversion.

### Add this field

Question:
`What level of support are you considering?`

Options:
- Initial advice / assessment only
- Setup help
- More complete home setup
- Ongoing support
- Not sure yet

Optional price-guidance version:
- Assessment around £149
- Setup usually from £249+
- More complete setup usually £399+
- Not sure yet

### Add hidden fields

Add these Tally hidden fields exactly:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `page`
- `service`

---

## Form B — Home Tech Assessment Intake

Status: already exists.

Current likely URL:
`https://tally.so/r/loBlE10`

Purpose: after payment / after booking only.

Use it when:
- someone has paid for the £149 assessment;
- someone has booked a visit;
- you need visit preparation detail.

Do not use this as the main public website CTA. It is too long for first conversion.

Add the same hidden fields:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `page`
- `service`

---

## Form C — Smart Stay enquiry

Status: create this next.

Purpose: Airbnb, serviced accommodation and short-term rental tech enquiries.

Suggested fields:

- Name
- Email
- Phone
- Property town/postcode
- Number of properties
- Property type: Airbnb / serviced accommodation / holiday let / HMO / other
- Are you live now or launching soon?
- What do you need help with?
  - Smart lock / access
  - Guest Wi-Fi
  - QR welcome guide
  - Heating controls
  - Leak sensors
  - Noise monitoring
  - Guest instructions
  - Owner remote access
  - Not sure
- Budget range
- Preferred contact method
- Consent checkbox

Hidden fields:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `page`
- `service`

After creating it, replace Smart Stay links on:

- `short-term-rental-tech-setup.html`
- Smart Stay blocks on `index.html`
- Smart Stay blocks on `services.html`

Current site temporarily routes Smart Stay to the general Home Tech Enquiry form.

---

## Form D — Rental Property Safety Tech enquiry

Status: create after Smart Stay form.

Purpose: long-term landlords, letting agents, tenants and rental safety tech.

Suggested fields:

- Name
- Email
- Phone
- Are you a landlord, letting agent, tenant, family member or other?
- Property town/postcode
- Number of properties
- Main interest:
  - safer rental for older tenant
  - person living alone
  - leak detection
  - lighting/routines
  - doorbell/access
  - move-in setup
  - landlord pack
  - not sure
- Is landlord permission needed?
- Budget range
- Preferred contact method
- Consent checkbox

---

## Form E — Supported Living / Provider Review

Status: create when you start outreach to providers.

Purpose: B2B supported living, small care providers, charities, housing bodies.

Suggested fields:

- Organisation name
- Contact name
- Email
- Phone
- Type of setting
- Number of residents / units
- Main issue
- Existing technology
- Privacy/consent concerns
- Staff workflow issues
- Preferred next step
- Consent checkbox

Do not push instant full payment here. Use a review deposit or quote manually.

---

# Payment links you need

## Existing payment links already used

These are already referenced in the site:

- Independent Living Tech Assessment — £149
- Quick Reassurance Setup — from £299 + devices
- Post-Discharge Home Confidence Pack — from £399 + devices
- Independent Living Basic Support — monthly
- Independent Living Family Support — monthly
- AI Governance toolkits and Repurly links

## Create these Stripe links next

### Smart Stay

1. `Smart Stay Starter Setup — £249`
   - Guest Wi-Fi, QR guide, basic device setup, handover.

2. `Smart Stay Remote Host Pack — £499`
   - Smart access workflow, heating control, guest guide, remote-owner handover.

3. `Smart Stay Protection Pack Deposit — £699`
   - Leak/noise/heating/access setup deposit. Devices separate unless specified.

4. `Smart Stay Support — £49/month`
   - Ongoing help for small adjustments and host tech issues.

### Rental / Landlords

5. `Rental Property Tech Assessment — £199`
   - Rental property review and practical recommendation.

6. `Rental Property Setup Deposit — £299`
   - Deposit for setup work, devices separate.

7. `Portfolio Review — from £499`
   - Use payment link or invoice depending on scope.

### Supported Living

8. `Provider Review Deposit — £249`
   - Initial review only. Larger work quoted manually.

Do not create too many public buy buttons at once. Use the payment links after enquiry until demand is proven.

---

# Recommended sales flow

Use this flow for Independent Living, older relatives and living-alone enquiries:

1. Website visitor clicks `Send quick enquiry`.
2. They submit short Tally form.
3. You reply personally by phone, WhatsApp or email.
4. You decide if the right next step is:
   - £149 assessment;
   - setup package;
   - post-hospital setup;
   - remote advice;
   - not suitable.
5. You send the correct Stripe payment link.
6. After payment, send the long intake form.
7. Do the visit/setup.
8. Offer support plan if useful.

Use this flow for Smart Stay:

1. Website visitor clicks `Request Smart Stay setup`.
2. They complete Smart Stay form.
3. You quote Starter / Remote Host / Protection Pack.
4. Send payment link or invoice.
5. Carry out setup and handover.
6. Offer monthly support.

---

# What to sell first

For the next 30 days, keep the offer simple.

Push only these:

1. Independent Living Home Assessment — £149
2. Smart Stay Starter Setup — £249
3. Rental Property Tech Assessment — £199

Do not push everything at once. Measure which one gets real enquiries.

---

# Outreach plan

## Day 1

Upload the site. Test all links. Submit test forms.

## Day 2

Create or amend forms:

1. Add hidden UTM fields to Home Tech Enquiry.
2. Add hidden UTM fields to Assessment Intake.
3. Create Smart Stay enquiry form.

## Day 3

Create payment links:

1. Smart Stay Starter Setup — £249
2. Smart Stay Remote Host Pack — £499
3. Rental Property Tech Assessment — £199
4. Provider Review Deposit — £249

## Day 4

Replace Smart Stay site links with the new Smart Stay form URL.

## Day 5

Start outreach.

Message for families:

`I’ve launched Jakoma Independent Living — practical home technology support for older relatives, people living alone and families who want reassurance at home. It covers simple devices, routines, alerts, communication and setup. If you know someone who might need help, the enquiry page is: https://jakoma.org/independent-living-tech.html`

Message for landlords / hosts:

`I’ve also launched Jakoma Smart Stay — practical tech setup for short-term rentals and rental properties, including smart access, guest Wi-Fi, QR guides, heating controls, leak sensors and owner handover. If you know landlords, Airbnb hosts or serviced accommodation operators, the page is: https://jakoma.org/short-term-rental-tech-setup.html`

---

# 30-day targets

Aim for:

- 10 enquiries
- 3 paid assessments/setups
- 1 landlord/host customer conversation
- 1 referral partner
- 1 anonymised case study

This is enough to find which offer deserves the most attention.

---

# Important tracking check

After the first real enquiry, check Tally submissions for:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `page`
- `service`

If these are blank, the hidden fields have not been added correctly in Tally.

---

# Current judgement

The site is now commercially usable. The main remaining work is outside the site:

1. Trim the public form.
2. Create the dedicated Smart Stay form.
3. Create the missing payment links.
4. Start outreach immediately.
5. Track which segment converts.
