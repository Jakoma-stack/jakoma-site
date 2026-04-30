# Form Links Action Plan

## Existing form links

| Link | Use | Status |
|---|---|---|
| https://tally.so/r/WO067L | AI Governance Readiness Checklist | Keep |
| https://tally.so/r/3yAx84 | AI Governance Sprint Proposal | Keep |
| https://tally.so/r/KYLADk | General proposal / AI triage request / retainer / prototype / Repurly scale enquiry | Keep for now, but split later |
| https://tally.so/r/yP05lg | Independent Living Tech enquiry / full setup scoping | Keep for full setup or pre-sale enquiries only |

## Changes applied

1. AI Governance Triage wording changed from Book to Request where the button goes to Tally rather than immediate payment.
2. Services page Independent Living Tech CTA changed from Book an assessment to View family tech packages, routing to independent-living-tech.html instead of Tally.
3. Independent Living Tech page now states that after payment the customer should complete a short intake form.
4. Repurly Core/Growth buttons now route to enquiry/discussion rather than direct Stripe checkout. The Founder Pilot remains the main paid route.
5. Repurly page now includes human-in-the-loop / no risky LinkedIn automation wording.

## Forms to add next

### 1. Dedicated AI Governance Triage Request

Recommended. Current KYLADk can handle it for now, but a dedicated form will convert better and keep triage separate from general proposals.

Questions: full name, work email, organisation, role, website, organisation type, reason for looking now, AI tools in use, main concerns, existing policy/guidance, desired outcome, timeframe, comfort with £950 fee, anything else.

Flow: Website → Tally request → review fit → send Stripe invoice/payment link → booking link → delivery.

### 2. Independent Living Tech Post-Payment Intake

Essential. Use it after the customer pays for the £149 assessment, £299 setup or £399 post-discharge pack.

Questions: customer name, email, phone, preferred contact method, assessment address, within Banbridge + approx. 30 miles, who the service is for, whether the person knows/agrees, main concerns, existing tech, Wi-Fi status, cameras, safety/medical/care issues to know before visit, who should be present, preferred visit times, required disclaimer checkbox.

Flow: Stripe payment → Tally intake → appointment arranged.

### 3. Repurly Founder Pilot Onboarding

Strongly recommended. Use it after the £950 Founder Pilot payment.

Questions: name, email, business name, website, LinkedIn profile/page, what you sell, target audience, main offer and price point, current content process, pilot goal, preferred tone, examples/competitors, phrases/topics to avoid.

Flow: Stripe payment → onboarding form → setup call.

### 4. Feedback / testimonial form

Useful after delivery but not urgent.

Note: update_site.py was renamed to archive_update_site_old.py because it contained older page-generation content that could overwrite the updated commercial pages if run accidentally.
