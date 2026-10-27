# CLAUDE.md — Creative Technology Education Business (Santa Barbara)

## Purpose
Launch a legitimate, sustainable educational services business that teaches creative technology to homeschool students in Santa Barbara County. The business is aimed mainly at families whose charter schools fund approved outside vendors. This repo holds the business launch dashboard and the project's working records.

**Stage:** Pre-launch. No application has been submitted, no course or price is approved, and no revenue has been earned. Business name not yet chosen. "Creative Technology Academy" is a working title.

## Business goals (in priority order)
1. Keep startup costs and admin work to a minimum. Separate mandatory costs from optional ones.
2. Get approved as a **Heartland Charter School** vendor. This is the first vendor objective.
3. Launch a small, high-quality initial catalog (2–4 courses), not all courses at once.
4. Set pricing that is sustainable and compatible with confirmed school rules.
5. Enroll the first students, deliver instruction, and set up a repeatable order → authorization → instruction → invoice → payment cycle.
6. Expand to other charter schools and more courses only after demand is validated.

## Initial course offerings (proposals, not approved)
- **A · Audio Engineering & Music Production:** Intro to Audio Engineering, Home Recording Studio Fundamentals, Music Production Fundamentals, Recording & Mixing, Podcast Production, Electronic Music Production, Advanced Audio Engineering.
- **B · Software Development & App Building:** Intro to App Development, Build Your First Web App, Programming Fundamentals, React App Development, AI-Assisted App Development, App Design & Prototyping, Build Your First Startup.
- Courses are project-based and each ends in a tangible result (mixed song, podcast episode, working web app, prototype). Never invent instructor credentials.

## Heartland vendor application objective
Confirm the current requirements from official sources, prepare the application materials, apply, and track the application through approval, agreement, onboarding, and catalog listing.

Official starting points (always re-check these, never assume they're unchanged):
- Vendor info: https://sites.google.com/heartlandcharterschool.com/heartland-vendor-contacts/home
- Become a vendor: https://sites.google.com/heartlandcharterschool.com/heartland-vendor-contacts/for-vendors/become-a-vendor
- FAQs: https://sites.google.com/heartlandcharterschool.com/heartland-vendor-contacts/for-vendors/faqs
- Contacts: https://heartlandcharterschool.com/contact/department-contacts

## Research & verification standards
Label every requirement or claim with one of these:
- **VERIFIED CURRENT:** confirmed from current official documentation or direct written confirmation. Record the source and date.
- **REQUIRES CONFIRMATION:** plausible but unconfirmed. In the app this shows as "Verify Current Requirements".
- **PLANNING ASSUMPTION:** used for planning, not a fact.
- **USER CONFIRMED:** Carlos personally confirmed or completed it.

When official sources conflict, flag the conflict and recommend contacting Heartland. Don't build forecasts on unverified funding amounts or pricing limits. Separate legal requirements from Heartland contract requirements and from prudent practice. Questions that need a lawyer, tax professional, or insurance broker should be written up as specific questions for that professional.

## Technical requirements (dashboard in `/cta-dashboard` or repo root)
- Vanilla HTML/CSS/JS with no build step, no backend, no paid APIs, and no login. Runs by opening `index.html`.
- Files: `index.html`, `styles.css`, `data.js` (seed data), `app.js` (logic), `README.md`.
- Storage: localStorage key `cta-launch-dashboard`, versioned (`version`, `seedVersion`). New seed tasks merge in without overwriting progress. Deleted seed IDs are tracked in `deletedSeedIds`.
- Must keep: JSON export/import with validation, print views, confirmation before destructive actions, evidence gates on milestones, and responsive/accessible UI.
- Test hook: `window.__CTA` exposes state and calculators for automated checks. A Playwright acceptance suite (31 checks) was used for v1. Re-run equivalent checks after changes.

## Rules
1. Never represent an unverified requirement as fact.
2. Prefer current official sources for vendor requirements and legal obligations.
3. Clearly distinguish verified facts, planning assumptions, and items requiring confirmation.
4. Never mark a business milestone complete without evidence or Carlos's confirmation.
5. Preserve existing user data and application functionality when modifying the dashboard.
6. Test changes before declaring them complete.
7. Keep the application simple, reliable, and usable without a backend.
8. Update this file and the README when important decisions or milestones change.
9. Do not store passwords, sensitive identity documents, or confidential student information in the project.
10. Always identify the most important next action for launching the business.

## Working conventions
- Answer directly and practically. Break complex work into steps and name the blocker precisely.
- Never claim to have contacted an organization, submitted a form, or received approval. Don't submit or commit to anything on Carlos's behalf without explicit authorization.
- Say whether a decision can wait until after vendor approval or must be made before applying.
- Don't recommend expensive software, space, equipment, or branding without a clear reason.
- Record confirmed decisions below with date and evidence label.

## Verified vendor requirements (from official pages, read 2026-10-26; pages undated)
Apply: public website, electronic list of services (monthly rates), résumé/qualifications, online application. After approval: W-9, DOJ background verification form, mandated reporter training form, GL COI ($2M aggregate / $1M occurrence / $500K personal & advertising injury, Heartland additional insured), business license or exemption letter, photo ID. Then e-sign agreement → catalog. All steps within 120 days. Open questions for vendors@heartlandcharterschool.com: course eligibility, group classes, rate limits.

## Decision & milestone log
| Date | Decision / milestone | Label | Evidence |
|---|---|---|---|
| 2026-10-26 | Dashboard published on GitHub Pages: https://palmtreefeen.github.io/cta-launch-dashboard/ (repo palmtreefeen/cta-launch-dashboard, public) | USER CONFIRMED | Files committed by Carlos; live page checked |
| 2026-10-26 | Dashboard v1 built (186 tasks, 11 phases) | Built — awaiting Carlos's review | Acceptance tests 31/31 passed |

## Current next action
Dashboard now opens in simple mode (Vendor Fast Track, tasks V-01–V-14). **P2-01 — Read the official Heartland "Become a Vendor" instructions** and record each requirement with its source and date. Then send the vendor inquiry email (P2-04), which is drafted in the dashboard's Documents section.
