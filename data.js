/* Creative Technology Academy — Launch Dashboard seed data.
   Seed content only. Nothing here is a verified requirement: every external
   requirement starts as "Verify Current Requirements" until the user confirms it. */
(function () {
  'use strict';

  var SEED_VERSION = 1;

  var CATEGORIES = {
    FORM: 'Business Formation & Administration',
    HEART: 'Heartland Vendor Application',
    COMP: 'Compliance & Documentation',
    COURSE: 'Course Development',
    PRICE: 'Pricing & Financial Planning',
    WEB: 'Website & Marketing',
    ACQ: 'Student Acquisition',
    OPS: 'Operational Readiness',
    FIRST: 'First Paid Enrollment',
    GROWTH: 'Business Growth'
  };

  var PHASES = {
    P1: 'Phase 1 · Business Model & Market Research',
    P2: 'Phase 2 · Heartland Vendor Application',
    P3: 'Phase 3 · Business Registration & Tax Administration',
    P4: 'Phase 4 · Compliance & Student Safety',
    P5: 'Phase 5 · Course Development',
    P6: 'Phase 6 · Pricing & Financial Planning',
    P7: 'Phase 7 · Business Website',
    P8: 'Phase 8 · Marketing & Student Acquisition',
    P9: 'Phase 9 · Operational Readiness',
    P10: 'Phase 10 · First Student & First Payment',
    P11: 'Phase 11 · Growth (optional)'
  };

  var U = {
    HL_HOME: 'https://sites.google.com/heartlandcharterschool.com/heartland-vendor-contacts/home',
    HL_BECOME: 'https://sites.google.com/heartlandcharterschool.com/heartland-vendor-contacts/for-vendors/become-a-vendor',
    HL_FAQ: 'https://sites.google.com/heartlandcharterschool.com/heartland-vendor-contacts/for-vendors/faqs',
    HL_CONTACT: 'https://heartlandcharterschool.com/contact/department-contacts',
    SOS: 'https://www.sos.ca.gov/',
    BIZFILE: 'https://bizfileonline.sos.ca.gov/',
    FTB: 'https://www.ftb.ca.gov/',
    CDTFA: 'https://www.cdtfa.ca.gov/',
    EDD: 'https://edd.ca.gov/',
    CALGOLD: 'https://www.calgold.ca.gov/',
    DOJ: 'https://oag.ca.gov/fingerprints',
    MANDREP: 'https://mandatedreporterca.com/',
    CDE: 'https://www.cde.ca.gov/sp/ch/',
    IRS: 'https://www.irs.gov/',
    IRS_EIN: 'https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number',
    IRS_SE: 'https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center',
    IRS_W9: 'https://www.irs.gov/forms-pubs/about-form-w-9',
    SBA: 'https://www.sba.gov/',
    SBA_MKT: 'https://www.sba.gov/business-guide/manage-your-business/marketing-sales',
    COPPA: 'https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa',
    EDPRIV: 'https://studentprivacy.ed.gov/',
    CITY: 'https://santabarbaraca.gov/',
    COUNTY: 'https://www.countyofsb.org/',
    CDI: 'https://www.insurance.ca.gov/',
    ABLETON: 'https://learningmusic.ableton.com/',
    AUDACITY: 'https://www.audacityteam.org/',
    MDN: 'https://developer.mozilla.org/',
    REACT: 'https://react.dev/',
    SCORE: 'https://www.score.org/',
    ICANN: 'https://lookup.icann.org/',
    GBP: 'https://www.google.com/business/'
  };

  var V = { REQ: 'Verify Current Requirements', VER: 'Verified Current', USER: 'User Confirmed', ASSUME: 'Planning Assumption', INTERNAL: 'Internal Task' };

  // T(id, title, priority, required, effortHrs, deps, cat, verification, resourceKey, instructions, criteria, extra)
  var rows = [];
  function T(id, title, pri, req, eff, deps, cat, ver, res, ins, crit, extra) {
    rows.push(Object.assign({ id: id, title: title, priority: pri, required: req, effort: eff, deps: deps || [], category: CATEGORIES[cat], verification: V[ver], resource: res ? U[res] : '', instructions: ins, criteria: crit }, extra || {}));
  }

  /* ---------------- PHASE 1 ---------------- */
  T('P1-01', 'Define the business concept and target market', 'Critical', true, 2, [], 'FORM', 'INTERNAL', '',
    'Write a one-paragraph description of the business: creative technology courses (audio engineering & music production; software development & app building) for homeschool students in Santa Barbara County whose charter schools may fund approved educational services. Name the primary customer (parents) and the learner (students).',
    'A written concept statement saved in this task\'s notes or in Documents.');
  T('P1-02', 'Decide whether to operate under an existing legal entity or establish a new one', 'High', true, 2, ['P1-01'], 'FORM', 'INTERNAL', 'SOS',
    'List the options (sole proprietorship, existing entity, new LLC or corporation). Note liability, tax, banking and vendor-application implications of each. Take open questions to a qualified tax professional or attorney before deciding.',
    'Decision recorded in notes with the reasoning and any professional advice received.',
    { notes: 'If you already own a business entity, whether it is appropriate for an education business is a question for your tax professional — not assumed here.' });
  T('P1-03', 'Choose a business name', 'High', true, 3, ['P1-01'], 'FORM', 'INTERNAL', '',
    'Shortlist 3–5 names. Check that each is easy to spell, describes creative technology education, and works as a domain. "Creative Technology Academy" is a working title only.',
    'A chosen name plus two backups recorded in notes.');
  T('P1-04', 'Check business name availability', 'High', true, 1, ['P1-03'], 'FORM', 'REQ', 'BIZFILE',
    'Search the California Secretary of State business search and the Santa Barbara County fictitious business name index for conflicts. Do a basic web and trademark search. Availability in a search is not the same as registration.',
    'Search results (date + where searched) recorded in notes; no direct conflict found.');
  T('P1-05', 'Check domain name availability', 'Medium', true, 0.5, ['P1-03'], 'WEB', 'INTERNAL', 'ICANN',
    'Check .com and alternatives for the chosen name with any domain registrar. Do not buy until the name is final.',
    'Available domain options recorded in notes.');
  T('P1-06', 'Investigate whether a fictitious business name (DBA) filing is required', 'High', true, 1, ['P1-02', 'P1-03'], 'FORM', 'REQ', 'COUNTY',
    'Whether an FBN filing applies depends on your legal structure and whether you operate under a name other than your legal name or entity name. Check the Santa Barbara County Clerk-Recorder information for current rules and fees.',
    'Written determination (required / not required) with source and date in notes.');
  T('P1-07', 'Research Santa Barbara business licensing requirements', 'High', true, 1.5, ['P1-08'], 'FORM', 'REQ', 'CITY',
    'Determine whether your location is inside City of Santa Barbara limits or unincorporated county, then check the applicable business tax certificate / license requirements. CalGold can list permits by city and business type.',
    'Requirement documented with official source and verification date.');
  T('P1-08', 'Decide whether the business will operate from home, a rented facility, or online', 'High', true, 1, ['P1-01'], 'OPS', 'INTERNAL', '',
    'Compare home-based, rented/borrowed space (library rooms, community centers, studios) and online delivery. Consider student safety, equipment, cost, and whether Heartland permits each delivery mode (see P2-08 and P2-09).',
    'Operating location decision recorded.');
  T('P1-09', 'Investigate zoning and home-occupation requirements (if applicable)', 'Medium', true, 1, ['P1-08'], 'FORM', 'REQ', 'CITY',
    'Only applies if you will teach students at your home. Check city/county home-occupation rules on client visits, parking and signage. Mark as optional if you will not teach at home.',
    'Determination recorded with source and date, or task marked optional because it does not apply.');
  T('P1-10', 'Define the initial course offerings', 'Critical', true, 3, ['P1-01'], 'COURSE', 'INTERNAL', '',
    'Pick a small launch catalog (2–4 courses) from the 14 proposed courses. Favor courses that are easiest to teach with equipment you already own and that end with a tangible project (a mixed song, a podcast episode, a working web app).',
    'Launch courses marked "Launch candidate" in the Course Catalog.');
  T('P1-11', 'Identify intended student age ranges', 'High', true, 1, ['P1-10'], 'COURSE', 'ASSUME', '',
    'Set a proposed age/grade range for each launch course. Confirm with Heartland which grades you may serve (TK–12 programs vary).',
    'Age range entered for each launch course in the catalog.');
  T('P1-12', 'Research local demand for audio engineering education', 'Medium', true, 2, ['P1-01'], 'ACQ', 'INTERNAL', '',
    'Ask local homeschool parents and groups whether they would enroll in music production/recording courses. Note questions they ask and price sensitivity. Record findings as research, not guarantees.',
    'At least 5 conversations or data points summarized in notes.');
  T('P1-13', 'Research local demand for app development education', 'Medium', true, 2, ['P1-01'], 'ACQ', 'INTERNAL', '',
    'Same as P1-12 for coding and app development courses.',
    'At least 5 conversations or data points summarized in notes.');
  T('P1-14', 'Research competing educational providers', 'Medium', true, 2, ['P1-01'], 'ACQ', 'INTERNAL', '',
    'List local and online providers offering music technology or coding for homeschool students, including other charter-school vendors. Note format, ages, and published prices.',
    'Competitor list with at least 5 entries in notes.');
  T('P1-15', 'Investigate other charter schools that accept outside vendors', 'Low', false, 2, ['P1-01'], 'GROWTH', 'REQ', 'CDE',
    'List other California charter schools serving Santa Barbara County families that use outside vendors. Add each to the Charter School Tracker. Requirements differ by school.',
    'Schools added to the Charter School Tracker.');
  T('P1-16', 'Develop an initial startup budget', 'High', true, 2, ['P1-10'], 'PRICE', 'ASSUME', '',
    'Separate required costs (only those confirmed as required), potential costs (pending verification, e.g., insurance, background checks), and optional costs. Enter the total in Financial Tracking.',
    'Startup budget entered in Financial Tracking with categories in notes.');
  T('P1-17', 'Establish a realistic monthly revenue target', 'Medium', true, 1, ['P1-16'], 'PRICE', 'ASSUME', '',
    'Use the Pricing Calculator with conservative assumptions. Do not base the target on unverified funding amounts. Label it as a target, not a forecast.',
    'Monthly revenue target entered in Financial Tracking.');
  T('P1-18', 'Decide time allocation for instruction, preparation, and administration', 'Medium', true, 1, ['P1-10'], 'OPS', 'INTERNAL', '',
    'Decide how many hours per week you can commit to teaching, prep, and admin alongside your other work.',
    'Weekly hour budget recorded in notes.');

  /* ---------------- PHASE 2 ---------------- */
  var H = 'HEART';
  T('P2-01', 'Read the official Heartland vendor application instructions', 'Critical', true, 1, [], H, 'REQ', 'HL_BECOME',
    'Read the current "Become a Vendor" page and the vendor home page in full. Record every requirement you see, with the date you read it. Treat older documents as unverified.',
    'Requirements list with source URLs and read date saved in notes or Documents.');
  T('P2-02', 'Review current vendor eligibility requirements', 'Critical', true, 1, ['P2-01'], H, 'REQ', 'HL_FAQ',
    'From official pages and the FAQs, list eligibility criteria (business type, documents, insurance, background checks, etc.). Mark each one Verified Current only if it comes from current official documentation or written confirmation.',
    'Eligibility checklist recorded with a verification label on each item.');
  T('P2-03', 'Confirm Santa Barbara County is within the applicable service area', 'Critical', true, 0.5, ['P2-01'], H, 'REQ', 'HL_HOME',
    'Check whether Heartland serves families in Santa Barbara County and whether vendors must be in specific counties. If unclear, include it in your vendor inquiry (P2-04).',
    'Written or official-source confirmation recorded.');
  T('P2-04', 'Contact the vendor department to confirm the application process is current', 'Critical', true, 1, ['P2-01'], H, 'REQ', 'HL_CONTACT',
    'Use the "Vendor inquiry email" template in Documents. Send it yourself (this app never sends email). Log the contact in Notes & Communications.',
    'Inquiry sent and logged in the Communication Log.');
  T('P2-05', 'Ask whether new vendors are currently being accepted', 'Critical', true, 0.25, ['P2-04'], H, 'REQ', 'HL_CONTACT', 'Include in the vendor inquiry. Record the answer verbatim.', 'Answer recorded in the Communication Log.');
  T('P2-06', 'Ask whether audio engineering courses qualify', 'Critical', true, 0.25, ['P2-04'], H, 'REQ', 'HL_CONTACT', 'Ask specifically about audio engineering, music production, and podcast production courses.', 'Answer recorded in the Communication Log.');
  T('P2-07', 'Ask whether app development courses qualify', 'Critical', true, 0.25, ['P2-04'], H, 'REQ', 'HL_CONTACT', 'Ask specifically about programming, web/app development, and AI-assisted development courses.', 'Answer recorded in the Communication Log.');
  T('P2-08', 'Confirm whether online instruction is permitted', 'High', true, 0.25, ['P2-04'], H, 'REQ', 'HL_CONTACT', 'Ask whether live online instruction is permitted and whether any conditions apply.', 'Answer recorded in the Communication Log.');
  T('P2-09', 'Confirm whether in-person instruction is permitted in Santa Barbara', 'High', true, 0.25, ['P2-04'], H, 'REQ', 'HL_CONTACT', 'Ask about in-person rules, including location restrictions (home, studio, public venue).', 'Answer recorded in the Communication Log.');
  T('P2-10', 'Obtain the current application form', 'Critical', true, 0.5, ['P2-01'], H, 'REQ', 'HL_BECOME', 'Download or request the current application. Note its version or date. Do not complete an outdated form.', 'Current application form saved (outside this app) and its date noted.');
  T('P2-11', 'Determine whether a business website is required before applying', 'High', true, 0.25, ['P2-01'], H, 'REQ', 'HL_FAQ', 'Check official documentation or ask the vendor department.', 'Answer recorded with source.');
  T('P2-12', 'Prepare the required business website', 'High', true, 1, ['P2-11', 'P7-18'], H, 'REQ', '',
    'Confirm your published website (Phase 7) meets any stated Heartland requirements. If a website is not required, mark this task optional.',
    'Website reviewed against stated requirements.');
  T('P2-13', 'Prepare a professional instructor biography', 'High', true, 2, ['P1-10'], H, 'INTERNAL', '', 'Use the Instructor biography template in Documents. Include only real, verifiable experience. Never invent credentials.', 'Final bio saved in Documents.');
  T('P2-14', 'Prepare a résumé documenting relevant qualifications', 'High', true, 3, [], H, 'INTERNAL', '', 'Focus on audio engineering, music production, software development, and any teaching or mentoring experience you actually have.', 'Résumé finalized (stored outside this app).');
  T('P2-15', 'Prepare descriptions of the proposed educational services', 'High', true, 3, ['P1-10', 'P2-06', 'P2-07'], H, 'INTERNAL', '', 'Write parent-friendly descriptions for each launch course using the Course Catalog fields. Follow any format Heartland requires.', 'Descriptions complete for every launch course.');
  T('P2-16', 'Prepare an initial price list', 'High', true, 2, ['P6-03', 'P6-12'], H, 'ASSUME', '', 'Draft prices using the Pricing Calculator after confirming vendor pricing restrictions. Prices are proposals until accepted in the ordering catalog.', 'Price list saved; each price consistent with confirmed restrictions.');
  T('P2-17', 'Confirm how service descriptions and prices are submitted for the ordering catalog', 'High', true, 0.5, ['P2-04'], H, 'REQ', 'HL_CONTACT', 'Ask what format, units (hourly, monthly, per course) and limits apply to catalog listings.', 'Answer recorded in the Communication Log.');
  T('P2-18', 'Submit the application', 'Critical', true, 2, ['P2-02', 'P2-03', 'P2-10', 'P2-12', 'P2-13', 'P2-14', 'P2-15', 'P2-16', 'P2-17'], H, 'REQ', 'HL_BECOME',
    'Submit the application yourself through the official channel. This app does not submit anything.',
    'You personally submitted the application and saved the confirmation.',
    { gate: ['I personally submitted the application through Heartland\'s official process.', 'I saved a copy or confirmation of the submission.'] });
  T('P2-19', 'Record the application submission date', 'High', true, 0.1, ['P2-18'], H, 'USER', '', 'Enter the date in the Charter School Tracker (Heartland row).', 'Submission date present in the tracker.');
  T('P2-20', 'Record the application reference number (if provided)', 'Medium', true, 0.1, ['P2-18'], H, 'USER', '', 'Enter it in the Charter School Tracker. If none is given, note that.', 'Reference number (or "none provided") in the tracker.');
  T('P2-21', 'Track the application status', 'High', true, 1, ['P2-18'], H, 'USER', '', 'Update the tracker status and next follow-up date after every contact.', 'Tracker status current within the last 14 days.');
  T('P2-22', 'Record correspondence with the vendor department', 'High', true, 0.5, [], H, 'INTERNAL', '', 'Log every email/call in Notes & Communications, including questions asked and answers received.', 'All correspondence logged.');
  T('P2-23', 'Respond to requests for additional information', 'High', true, 2, ['P2-18'], H, 'REQ', '', 'Respond promptly and log each request and response.', 'All requests answered and logged.');
  T('P2-24', 'Confirm application approval', 'Critical', true, 0.25, ['P2-18'], H, 'REQ', '',
    'Only mark complete when you have written approval from Heartland.',
    'Written approval received and saved.',
    { gate: ['I received written approval from Heartland (email, letter, or portal notice).', 'I saved the approval and recorded the approval date in the Charter School Tracker.'] });
  T('P2-25', 'Sign the required vendor agreement', 'Critical', true, 1, ['P2-24', 'P4-15'], H, 'REQ', '', 'Read the agreement fully (see P4-15) before signing. Consider professional review for anything unclear.', 'Signed agreement saved (outside this app).');
  T('P2-26', 'Complete the final vendor onboarding process', 'Critical', true, 2, ['P2-25'], H, 'REQ', '', 'Complete any remaining onboarding steps Heartland lists.', 'Heartland confirms onboarding is complete.');
  T('P2-27', 'Confirm the business appears in the vendor directory or ordering catalog', 'High', true, 0.25, ['P2-26'], H, 'REQ', '', 'Check that your listing, course names, and prices are correct.', 'Listing seen and verified as accurate.');
  T('P2-28', 'Confirm the exact process for receiving student orders', 'High', true, 0.5, ['P2-24'], H, 'REQ', 'HL_FAQ', 'Ask how orders reach you and how you accept or decline them.', 'Process documented in notes.');
  T('P2-29', 'Confirm the process for service certificates or other authorizations', 'High', true, 0.5, ['P2-24'], H, 'REQ', 'HL_FAQ', 'Determine what authorization must exist before you deliver any instruction.', 'Process documented in notes.');
  T('P2-30', 'Confirm payment procedures and timelines', 'High', true, 0.5, ['P2-24'], H, 'REQ', 'HL_FAQ', 'Ask how to invoice, what documentation is needed, and typical payment timing.', 'Process documented in notes.');

  /* ---------------- PHASE 3 ---------------- */
  T('P3-01', 'Decide on the appropriate legal business structure', 'High', true, 2, ['P1-02'], 'FORM', 'INTERNAL', 'SOS', 'Finalize the decision from P1-02. Registration requirements depend on this choice.', 'Structure decision recorded.');
  T('P3-02', 'Determine whether to use an existing business entity', 'High', true, 1, ['P1-02'], 'FORM', 'INTERNAL', '', 'Confirm with a tax professional whether operating under an existing entity is appropriate for an education business.', 'Decision and professional input recorded.');
  T('P3-03', 'Consult a qualified tax professional (if necessary)', 'Medium', false, 1.5, ['P1-02'], 'FORM', 'INTERNAL', '', 'Bring a written list of questions: entity choice, estimated taxes, deductible expenses, how vendor payments are reported.', 'Consultation notes saved.');
  T('P3-04', 'Determine whether an EIN is needed', 'High', true, 0.5, ['P3-01'], 'FORM', 'REQ', 'IRS_EIN', 'Depends on structure and whether Heartland requires one for tax forms. Apply only through irs.gov (free).', 'Determination recorded; EIN obtained if needed.');
  T('P3-05', 'Determine whether a California seller\'s permit is relevant', 'Medium', true, 0.5, ['P3-01'], 'FORM', 'REQ', 'CDTFA', 'Services alone generally differ from sales of tangible goods; confirm with CDTFA whether selling materials or equipment would change this.', 'Determination recorded with source.');
  T('P3-06', 'Investigate California and federal tax obligations', 'High', true, 2, ['P3-01'], 'FORM', 'REQ', 'FTB', 'Review FTB and IRS self-employment guidance, estimated tax payments, and recordkeeping duties for your structure.', 'Summary of obligations with sources in notes.');
  T('P3-07', 'Decide whether to separate business and personal banking', 'Medium', true, 1, ['P3-01'], 'FORM', 'INTERNAL', '', 'A separate account simplifies bookkeeping and reconciliation of vendor payments.', 'Decision recorded; account opened if chosen.');
  T('P3-08', 'Establish bookkeeping procedures', 'High', true, 2, ['P3-07'], 'FORM', 'INTERNAL', '', 'Choose a simple method (spreadsheet or low-cost software). Decide weekly/monthly cadence.', 'Bookkeeping method documented.');
  T('P3-09', 'Set up expense tracking', 'Medium', true, 1, ['P3-08'], 'FORM', 'INTERNAL', '', 'Use the Financial Tracking ledger for summaries; keep receipts outside this app.', 'Expense tracking in use.');
  T('P3-10', 'Create a system for recording revenue', 'Medium', true, 1, ['P3-08'], 'FORM', 'INTERNAL', '', 'Record each payment with date, payer (school), invoice reference, and amount.', 'Revenue recording method documented.');
  T('P3-11', 'Determine how vendor payments will be reconciled', 'Medium', true, 1, ['P3-10', 'P2-30'], 'FORM', 'INTERNAL', '', 'Match each school payment to the invoice and the authorized service it covers.', 'Reconciliation steps documented.');
  T('P3-12', 'Investigate applicable business insurance', 'High', true, 2, [], 'COMP', 'REQ', 'CDI', 'Coordinate with P4-08: Heartland may specify coverage types and limits. Do not buy until requirements are confirmed.', 'Insurance options summarized.');
  T('P3-13', 'Investigate whether a local business license is required', 'High', true, 1, ['P1-07'], 'FORM', 'REQ', 'CITY', 'Confirm the requirement for your exact location and obtain it if required.', 'Determination recorded; license obtained if required.');
  T('P3-14', 'Establish recordkeeping procedures', 'Medium', true, 1, [], 'FORM', 'INTERNAL', '', 'Decide where contracts, approvals, attendance records, invoices and receipts are stored securely (not in this app).', 'Recordkeeping plan documented.');
  T('P3-15', 'Set up a calendar for tax and administrative deadlines', 'Medium', true, 1, ['P3-06'], 'FORM', 'INTERNAL', '', 'Add estimated tax dates, license renewals, insurance renewals, and Heartland renewal dates to your calendar.', 'Deadlines added to calendar.');

  /* ---------------- PHASE 4 ---------------- */
  var C = 'COMP';
  T('P4-01', 'Obtain the current vendor compliance checklist', 'Critical', true, 0.5, ['P2-04'], C, 'REQ', 'HL_BECOME', 'Request or download Heartland\'s current list of compliance documents for vendors.', 'Current checklist obtained and its date recorded.');
  T('P4-02', 'Determine applicable background check requirements', 'Critical', true, 0.5, ['P4-01'], C, 'REQ', 'HL_FAQ', 'Confirm who must be checked and what type of check is required.', 'Requirement recorded with source.');
  T('P4-03', 'Confirm whether fingerprinting is required and how it must be completed', 'High', true, 0.5, ['P4-01'], C, 'REQ', 'DOJ', 'If required, confirm whether Live Scan is used and which forms/agency codes apply.', 'Requirement recorded with source.');
  T('P4-04', 'Determine whether the school requires a specific background check provider or process', 'High', true, 0.25, ['P4-01'], C, 'REQ', 'HL_CONTACT', 'Ask before paying any provider.', 'Answer recorded.');
  T('P4-05', 'Complete required background checks', 'Critical', true, 3, ['P4-02', 'P4-03', 'P4-04'], C, 'REQ', 'DOJ', 'Complete only the checks confirmed as required, through the specified process.', 'Clearance confirmation received.', { gate: ['I completed the background check through the process Heartland specified.', 'I received confirmation that the check is complete.'] });
  T('P4-06', 'Complete mandated reporter training (if required)', 'High', true, 3, ['P4-01'], C, 'REQ', 'MANDREP', 'Confirm whether required and which course is accepted.', 'Training completed or confirmed not required.');
  T('P4-07', 'Save training completion certificates', 'Medium', true, 0.25, ['P4-06'], C, 'USER', '', 'Store certificates securely outside this app.', 'Certificates saved.');
  T('P4-08', 'Confirm applicable insurance requirements', 'Critical', true, 0.5, ['P4-01'], C, 'REQ', 'HL_FAQ', 'Confirm coverage types, limits, and certificate wording required by Heartland.', 'Requirements recorded with source.');
  T('P4-09', 'Obtain appropriate insurance quotes', 'High', true, 2, ['P4-08'], C, 'INTERNAL', 'CDI', 'Get at least two quotes that match confirmed requirements. Verify the agent is licensed.', 'Quotes compared in notes.');
  T('P4-10', 'Purchase required insurance after confirming coverage requirements', 'High', true, 1, ['P4-09', 'P4-12'], C, 'REQ', '', 'Purchase only the coverage confirmed as required (plus any you choose for prudence).', 'Policy in force.');
  T('P4-11', 'Obtain a certificate of insurance', 'High', true, 0.5, ['P4-10'], C, 'REQ', '', 'Request a COI matching required wording.', 'COI received.');
  T('P4-12', 'Confirm additional-insured wording with insurer and school', 'High', true, 0.5, ['P4-08'], C, 'REQ', '', 'Confirm exact wording before purchase.', 'Wording confirmed in writing.');
  T('P4-13', 'Complete required tax forms', 'High', true, 0.5, ['P4-01', 'P3-04'], C, 'REQ', 'IRS_W9', 'Complete only forms Heartland requests (often a W-9 for vendors — confirm). Never store tax IDs in this app.', 'Forms submitted to the school.');
  T('P4-14', 'Complete required identification verification', 'Medium', true, 0.5, ['P4-01'], C, 'REQ', '', 'Follow the school\'s process. Do not store identity documents in this app.', 'Verification complete.');
  T('P4-15', 'Review the vendor agreement', 'Critical', true, 2, ['P2-24'], C, 'REQ', '', 'Read every clause, especially payment, cancellation, insurance, indemnification and records. Seek professional review if needed.', 'Questions resolved; ready to sign.');
  T('P4-16', 'Review student privacy requirements', 'High', true, 2, ['P4-01'], C, 'REQ', 'EDPRIV', 'Review Heartland requirements and applicable laws for student data and online services for minors (FERPA/COPPA may be relevant — confirm applicability).', 'Summary with sources in notes.');
  T('P4-17', 'Establish procedures for working with minors', 'High', true, 2, ['P4-16'], C, 'INTERNAL', '', 'Written policy covering supervision, parent presence, communication (via parents), and in-person/online conduct.', 'Policy written and saved.');
  T('P4-18', 'Determine whether parental consent forms are needed', 'Medium', true, 1, ['P4-16'], C, 'REQ', '', 'Consider media/recording consent (audio courses record student voices) and online platform consent.', 'Determination recorded; forms drafted if needed.');
  T('P4-19', 'Establish cancellation, absence, refund, and make-up policies', 'High', true, 2, ['P6-09'], C, 'INTERNAL', '', 'Must be consistent with Heartland\'s ordering and nonattendance rules.', 'Policy written and saved.');
  T('P4-20', 'Establish procedures for online instruction', 'Medium', true, 1, ['P4-16', 'P2-08'], C, 'INTERNAL', '', 'Platform choice, link sharing via parents, recording policy, and conduct rules.', 'Procedure written.');
  T('P4-21', 'Confirm requirements for collecting and storing student information', 'High', true, 1, ['P4-16'], C, 'REQ', '', 'Collect the minimum necessary. This dashboard must never store student records.', 'Requirements recorded; storage plan set.');
  T('P4-22', 'Confirm whether other local, state, or school-specific requirements apply', 'Medium', true, 1, ['P4-01'], C, 'REQ', 'CALGOLD', 'Ask Heartland directly and check CalGold for your location.', 'Answer recorded.');

  /* ---------------- PHASE 5 ---------------- */
  T('P5-01', 'Select 2–4 launch courses from the catalog', 'Critical', true, 1, ['P1-10'], 'COURSE', 'INTERNAL', '', 'Mark chosen courses as "Launch candidate" in the Course Catalog. Prefer courses with low equipment cost and clear final projects.', 'Launch courses flagged in the catalog.');
  T('P5-02', 'Complete all catalog fields for each launch course', 'High', true, 4, ['P5-01'], 'COURSE', 'INTERNAL', '', 'Fill description, objectives, ages, prerequisites, duration, hours, format, class size, equipment, software and prep time.', 'No empty required fields for launch courses.');
  T('P5-03', 'Build the module and lesson outline for each launch course', 'High', true, 6, ['P5-02'], 'COURSE', 'INTERNAL', '', 'Use the course builder and lesson templates.', 'Each launch course has modules and lessons.');
  T('P5-04', 'Define final projects and assessment criteria', 'High', true, 2, ['P5-03'], 'COURSE', 'INTERNAL', '', 'Each course should end with something tangible (song, podcast episode, web app).', 'Final project and assessment criteria written for each launch course.');
  T('P5-05', 'List required equipment and software per course', 'Medium', true, 1, ['P5-02'], 'COURSE', 'INTERNAL', 'AUDACITY', 'Favor free or student-accessible software where practical.', 'Lists complete in the catalog.');
  T('P5-06', 'Estimate prep time and materials cost per course', 'Medium', true, 1, ['P5-03'], 'PRICE', 'ASSUME', '', 'Feed these into the Pricing Calculator.', 'Values entered in the catalog.');
  T('P5-07', 'Run a dry-run of the first lesson', 'Medium', true, 2, ['P5-03'], 'COURSE', 'INTERNAL', '', 'Rehearse with a friend or family member to check timing and tech setup.', 'Dry-run done; adjustments noted.');
  T('P5-08', 'Confirm catalog listing format and course approval process', 'High', true, 0.5, ['P2-17'], 'COURSE', 'REQ', 'HL_CONTACT', 'Confirm how each course is reviewed and listed.', 'Process recorded.');

  /* ---------------- PHASE 6 ---------------- */
  var P = 'PRICE';
  T('P6-01', 'Confirm current student Planning Amounts', 'High', true, 0.25, ['P2-04'], P, 'REQ', 'HL_FAQ', 'Do not use any funding figure in projections until confirmed from current official information.', 'Amount and source recorded, or noted as not disclosed.');
  T('P6-02', 'Confirm current ordering rules', 'High', true, 0.5, ['P2-04'], P, 'REQ', 'HL_FAQ', 'How families request services from vendors.', 'Rules recorded with source.');
  T('P6-03', 'Confirm current vendor pricing restrictions', 'Critical', true, 0.25, ['P2-04'], P, 'REQ', 'HL_FAQ', 'Ask about rate caps, pricing units, and changes after approval.', 'Restrictions recorded with source.');
  T('P6-04', 'Confirm whether group classes are permitted', 'High', true, 0.25, ['P2-04'], P, 'REQ', 'HL_CONTACT', 'And how group pricing must be expressed.', 'Answer recorded.');
  T('P6-05', 'Confirm whether multi-week courses must be billed monthly', 'High', true, 0.25, ['P2-04'], P, 'REQ', 'HL_CONTACT', 'Affects how course pricing is structured.', 'Answer recorded.');
  T('P6-06', 'Confirm whether students can enroll in multiple courses', 'Medium', true, 0.25, ['P2-04'], P, 'REQ', 'HL_CONTACT', 'Do not assume a student can spend their whole allocation with one vendor.', 'Answer recorded.');
  T('P6-07', 'Confirm monthly service authorization requirements', 'High', true, 0.25, ['P2-04'], P, 'REQ', 'HL_FAQ', 'What must be authorized each month before service.', 'Answer recorded.');
  T('P6-08', 'Confirm payment timelines', 'High', true, 0.25, ['P2-04'], P, 'REQ', 'HL_FAQ', 'Needed for cash-flow planning.', 'Answer recorded.');
  T('P6-09', 'Confirm cancellation and nonattendance policies', 'High', true, 0.25, ['P2-04'], P, 'REQ', 'HL_FAQ', 'Determines what you can bill when a student misses a session.', 'Answer recorded.');
  T('P6-10', 'Confirm restrictions on materials and equipment charges', 'Medium', true, 0.25, ['P2-04'], P, 'REQ', 'HL_FAQ', 'Whether materials can be billed and how.', 'Answer recorded.');
  T('P6-11', 'Model pricing scenarios in the Pricing Calculator', 'High', true, 2, ['P5-06'], P, 'ASSUME', '', 'Compare individual, small-group, multi-week, monthly and online models with conservative/moderate/optimistic enrollment.', 'Scenarios saved; preferred model noted.');
  T('P6-12', 'Set initial proposed prices', 'High', true, 1, ['P6-03', 'P6-04', 'P6-11'], P, 'ASSUME', '', 'Choose prices consistent with confirmed restrictions. They remain proposals until listed in the ordering catalog.', 'Proposed prices entered in the catalog.');

  /* ---------------- PHASE 7 ---------------- */
  var W = 'WEB';
  T('P7-01', 'Choose a domain', 'Medium', true, 0.5, ['P1-05', 'P1-04'], W, 'INTERNAL', 'ICANN', 'Register the domain for the final business name.', 'Domain registered.');
  T('P7-02', 'Choose a hosting method', 'Medium', true, 1, [], W, 'INTERNAL', '', 'A simple static site or low-cost website builder is enough to start.', 'Hosting chosen.');
  T('P7-03', 'Create the business website', 'High', true, 4, ['P7-01', 'P7-02'], W, 'INTERNAL', '', 'Set up the site structure and pages.', 'Draft site exists.');
  T('P7-04', 'Write the homepage', 'High', true, 2, ['P7-03'], W, 'INTERNAL', '', 'Who you serve, what students build, how to inquire.', 'Homepage written.');
  T('P7-05', 'Create the instructor biography page', 'High', true, 1, ['P7-03', 'P2-13'], W, 'INTERNAL', '', 'Real, verifiable experience only.', 'Bio page live on draft site.');
  T('P7-06', 'Create the audio engineering page', 'Medium', true, 1.5, ['P7-03'], W, 'INTERNAL', '', 'Describe the audio division and its courses.', 'Page complete.');
  T('P7-07', 'Create the app development page', 'Medium', true, 1.5, ['P7-03'], W, 'INTERNAL', '', 'Describe the software division and its courses.', 'Page complete.');
  T('P7-08', 'Create individual course descriptions', 'Medium', true, 3, ['P7-03', 'P5-02'], W, 'INTERNAL', '', 'Consistent with the Course Catalog.', 'All launch courses described.');
  T('P7-09', 'Add contact information', 'High', true, 0.25, ['P7-03'], W, 'INTERNAL', '', 'Business email and phone you are comfortable publishing.', 'Contact info on site.');
  T('P7-10', 'Add a parent inquiry form', 'Medium', true, 1, ['P7-03'], W, 'INTERNAL', '', 'Collect only what you need (parent name, email, interest). Avoid collecting student details online.', 'Form works and delivers to you.');
  T('P7-11', 'Add a frequently asked questions page', 'Medium', true, 1, ['P7-03'], W, 'INTERNAL', '', 'Use the Parent FAQ template in Documents.', 'FAQ page complete.');
  T('P7-12', 'Add a privacy policy matching the site\'s actual data practices', 'High', true, 1, ['P7-10'], W, 'REQ', 'COPPA', 'Describe only what the site actually collects and how it is used.', 'Privacy policy published.');
  T('P7-13', 'Add a cancellation policy', 'Medium', true, 0.5, ['P4-19'], W, 'INTERNAL', '', 'Publish the policy from P4-19.', 'Policy on site.');
  T('P7-14', 'Add a clear explanation of how charter school ordering works', 'Medium', true, 1, ['P6-02'], W, 'REQ', '', 'Describe the process accurately; never imply funding or reimbursement is guaranteed.', 'Explanation reviewed for accuracy.');
  T('P7-15', 'Display the vendor approval status accurately', 'Critical', true, 0.25, ['P7-03'], W, 'INTERNAL', '', 'Until approval is confirmed, state that approval is pending or not yet applied for.', 'Site reflects true current status.');
  T('P7-16', 'Test the website on mobile devices', 'Medium', true, 0.5, ['P7-04'], W, 'INTERNAL', '', 'Check on at least one phone and tablet.', 'No layout issues found.');
  T('P7-17', 'Test all contact forms and links', 'Medium', true, 0.5, ['P7-10'], W, 'INTERNAL', '', 'Submit a test inquiry and click every link.', 'All forms and links work.');
  T('P7-18', 'Publish the website', 'High', true, 0.5, ['P7-04', 'P7-05', 'P7-09', 'P7-12', 'P7-15', 'P7-16', 'P7-17'], W, 'INTERNAL', '', 'Go live on your domain.', 'Site live at your domain.');
  T('P7-19', 'Test the published website', 'Medium', true, 0.5, ['P7-18'], W, 'INTERNAL', '', 'Repeat link and form tests on the live site.', 'Live site passes tests.');
  T('P7-20', 'Keep course pricing consistent with the approved ordering catalog', 'High', true, 0.5, ['P2-27'], W, 'INTERNAL', '', 'Update the site whenever catalog prices change.', 'Site prices match the catalog.');

  /* ---------------- PHASE 8 ---------------- */
  var M = 'ACQ';
  T('P8-01', 'Develop the business brand', 'Medium', true, 3, ['P1-03'], 'WEB', 'INTERNAL', '', 'Simple logo, colors and tone. Avoid expensive branding packages at this stage.', 'Basic brand guide saved.');
  T('P8-02', 'Define the ideal customer', 'Medium', true, 1, ['P1-12', 'P1-13'], M, 'INTERNAL', '', 'Describe the parent and the student you serve best.', 'Customer profile written.');
  T('P8-03', 'Prepare a one-page course brochure', 'Low', false, 2, ['P8-01', 'P5-02'], M, 'INTERNAL', '', 'Use the Brochure template in Documents. State approval status accurately.', 'Brochure final.');
  T('P8-04', 'Prepare a parent-facing course catalog', 'Medium', true, 2, ['P5-02'], M, 'INTERNAL', '', 'Only list courses with accurate approval status.', 'Catalog final.');
  T('P8-05', 'Identify homeschool communities in Santa Barbara County', 'Medium', true, 2, [], M, 'INTERNAL', '', 'Co-ops, parent groups, libraries, and community centers.', 'List of communities in notes.');
  T('P8-06', 'Research local homeschool groups and educational events', 'Medium', true, 2, ['P8-05'], M, 'INTERNAL', '', 'Note upcoming events where you could present.', 'Event list with dates.');
  T('P8-07', 'Investigate community advertising opportunities', 'Low', false, 1, ['P8-05'], M, 'INTERNAL', '', 'Low-cost options first (newsletters, bulletin boards).', 'Options listed.');
  T('P8-08', 'Create a parent inquiry tracking system', 'Medium', true, 0.5, [], M, 'INTERNAL', '', 'Use the Inquiry Funnel on the Marketing page (counts only — no personal data stored here).', 'Funnel in use.');
  T('P8-09', 'Create a lead follow-up process', 'Medium', true, 1, ['P8-08'], M, 'INTERNAL', '', 'Respond within 24–48 hours; follow up after one week.', 'Process documented.');
  T('P8-10', 'Develop an introductory course presentation', 'Medium', true, 3, ['P5-02'], M, 'INTERNAL', '', 'A short talk for parents and homeschool groups.', 'Presentation ready.');
  T('P8-11', 'Prepare a demonstration lesson', 'Medium', true, 2, ['P5-03'], M, 'INTERNAL', '', 'A 20–30 minute sample that ends with something students made.', 'Demo lesson ready.');
  T('P8-12', 'Build a referral strategy', 'Low', false, 1, [], M, 'INTERNAL', '', 'Ask satisfied families to share with their groups.', 'Strategy documented.');
  T('P8-13', 'Research additional charter school vendor programs', 'Low', false, 2, ['P1-15'], 'GROWTH', 'REQ', 'CDE', 'Use the Charter School Tracker.', 'Schools researched and tracked.');
  T('P8-14', 'Contact other charter schools about vendor requirements', 'Low', false, 2, ['P8-13'], 'GROWTH', 'REQ', '', 'Log each contact.', 'Contacts logged.');
  T('P8-15', 'Maintain a list of applications to other schools', 'Low', false, 0.5, ['P8-14'], 'GROWTH', 'USER', '', 'Keep the Charter School Tracker current.', 'Tracker up to date.');
  T('P8-16', 'Track inquiry-to-enrollment conversion rates', 'Medium', true, 0.5, ['P8-08'], M, 'INTERNAL', '', 'Review the Inquiry Funnel monthly.', 'Conversion rate reviewed monthly.');

  /* ---------------- PHASE 9 ---------------- */
  var O = 'OPS';
  T('P9-01', 'Decide on teaching locations', 'High', true, 1, ['P1-08', 'P2-09'], O, 'INTERNAL', '', 'Confirm the location is permitted and appropriate for minors.', 'Location(s) confirmed.');
  T('P9-02', 'Determine equipment needs', 'Medium', true, 1, ['P5-05'], O, 'INTERNAL', '', 'List what you have vs. what you need. Buy only what launch courses require.', 'Needs list complete.');
  T('P9-03', 'Set up an audio engineering teaching environment', 'Medium', true, 3, ['P9-02'], O, 'INTERNAL', 'ABLETON', 'Interfaces, headphones, mics, DAW access.', 'Environment tested.');
  T('P9-04', 'Prepare software development teaching environments', 'Medium', true, 3, ['P9-02'], O, 'INTERNAL', 'MDN', 'Browser-based or free tools students can access at home.', 'Environment tested.');
  T('P9-05', 'Confirm software licensing and student access', 'High', true, 1, ['P5-05'], O, 'REQ', '', 'Check licenses and age requirements for any software or platform students use.', 'Licensing confirmed per tool.');
  T('P9-06', 'Create a standard lesson plan template', 'Medium', true, 1, [], O, 'INTERNAL', '', 'Start from the templates in the course builder.', 'Template saved.');
  T('P9-07', 'Create a class attendance procedure', 'High', true, 1, ['P2-29'], O, 'REQ', '', 'Match the documentation Heartland requires for payment.', 'Procedure written.');
  T('P9-08', 'Create a parent communication procedure', 'Medium', true, 1, ['P4-17'], O, 'INTERNAL', '', 'Channels, response times, and progress updates.', 'Procedure written.');
  T('P9-09', 'Create a scheduling system', 'Medium', true, 1, [], O, 'INTERNAL', '', 'A calendar with class times and booking.', 'System in use.');
  T('P9-10', 'Create a student onboarding process', 'Medium', true, 1, ['P9-08'], O, 'INTERNAL', '', 'Welcome message, equipment checklist, first-day instructions.', 'Process written.');
  T('P9-11', 'Establish cancellation procedures', 'Medium', true, 0.5, ['P4-19'], O, 'INTERNAL', '', 'Operational steps to apply the cancellation policy.', 'Procedure written.');
  T('P9-12', 'Establish a process for recording completed instructional hours', 'High', true, 1, ['P9-07'], O, 'REQ', '', 'Records must support any payment request.', 'Process written.');
  T('P9-13', 'Establish a process for confirming authorization before instruction', 'Critical', true, 0.5, ['P2-29'], O, 'REQ', '', 'Never deliver services before the required authorization exists.', 'Checklist step in place.');
  T('P9-14', 'Establish a process for submitting payment requests or invoices', 'High', true, 1, ['P2-30'], O, 'REQ', '', 'Follow Heartland\'s required format and timing.', 'Process written.');
  T('P9-15', 'Establish a payment reconciliation procedure', 'Medium', true, 0.5, ['P3-11'], O, 'INTERNAL', '', 'Monthly match of payments to invoices.', 'Procedure written.');
  T('P9-16', 'Create a monthly financial review', 'Medium', true, 0.5, ['P3-08'], O, 'INTERNAL', '', 'Compare actual revenue and expenses to targets in Financial Tracking.', 'First review completed.');
  T('P9-17', 'Create a system for gathering parent feedback', 'Medium', true, 0.5, [], O, 'INTERNAL', '', 'A short survey after each course.', 'Survey ready.');
  T('P9-18', 'Create a system for improving courses', 'Low', true, 0.5, ['P9-17'], O, 'INTERNAL', '', 'Review feedback each term and update the catalog.', 'Process documented.');

  /* ---------------- PHASE 10 ---------------- */
  var F = 'FIRST';
  T('P10-01', 'Confirm vendor approval', 'Critical', true, 0.25, ['P2-24'], F, 'REQ', '', 'Approval must be confirmed in writing (P2-24).', 'Written approval on file.');
  T('P10-02', 'Confirm the course is approved and listed correctly', 'Critical', true, 0.25, ['P2-27'], F, 'REQ', '', 'Check the exact listing in the ordering catalog.', 'Listing verified.');
  T('P10-03', 'Confirm the student\'s order is accepted', 'Critical', true, 0.25, ['P10-02'], F, 'REQ', '', 'Through the official ordering process.', 'Order acceptance confirmed.');
  T('P10-04', 'Obtain any required service authorization', 'Critical', true, 0.25, ['P10-03', 'P2-29'], F, 'REQ', '', 'Do not schedule instruction until this exists.', 'Authorization on file.');
  T('P10-05', 'Confirm authorized dates, services, and hours', 'Critical', true, 0.25, ['P10-04'], F, 'REQ', '', 'Instruction must match the authorization exactly.', 'Details recorded (no student personal data here).');
  T('P10-06', 'Confirm the payment process', 'High', true, 0.25, ['P2-30'], F, 'REQ', '', 'Re-check the process for this order.', 'Process confirmed.');
  T('P10-07', 'Schedule the student', 'High', true, 0.25, ['P10-05'], F, 'INTERNAL', '', 'Within the authorized dates.', 'Session(s) scheduled.');
  T('P10-08', 'Deliver the authorized service', 'Critical', true, 4, ['P10-07'], F, 'USER', '', 'Teach the authorized sessions.', 'Instruction actually took place.', { gate: ['Instruction actually took place on the authorized dates.', 'The service delivered matches the authorization.'] });
  T('P10-09', 'Maintain required attendance records', 'High', true, 0.5, ['P10-08'], F, 'REQ', '', 'Keep records securely outside this app.', 'Records complete.');
  T('P10-10', 'Submit the required payment documentation', 'Critical', true, 0.5, ['P10-09', 'P9-14'], F, 'REQ', '', 'Submit through the official process yourself.', 'Documentation submitted.', { gate: ['I personally submitted the payment documentation through the official process.'] });
  T('P10-11', 'Confirm payment is received', 'Critical', true, 0.25, ['P10-10'], F, 'USER', '', 'Confirm funds have arrived in your account.', 'Payment visible in your business account.', { gate: ['The payment has been received in my account (not just promised or scheduled).'] });
  T('P10-12', 'Record the revenue', 'High', true, 0.25, ['P10-11'], F, 'USER', '', 'Add it to the Financial Tracking ledger as Actual revenue.', 'Ledger entry added.');
  T('P10-13', 'Calculate actual delivery costs', 'Medium', true, 0.5, ['P10-08'], F, 'INTERNAL', '', 'Hours plus materials plus any platform costs.', 'Costs recorded.');
  T('P10-14', 'Review the parent\'s feedback', 'Medium', true, 0.5, ['P10-08', 'P9-17'], F, 'INTERNAL', '', 'Ask for feedback; record themes (no personal data here).', 'Feedback reviewed.');
  T('P10-15', 'Refine the course', 'Medium', true, 2, ['P10-14'], F, 'INTERNAL', '', 'Update the course builder with improvements.', 'Course updated.');
  T('P10-16', 'Determine whether additional enrollment is appropriate', 'Medium', true, 0.5, ['P10-13', 'P10-14'], F, 'INTERNAL', '', 'Based on actual costs, hours, and feedback.', 'Decision recorded.');
  T('P10-17', 'MILESTONE: First paid student', 'Critical', true, 0, ['P10-08', 'P10-11'], F, 'USER', '',
    'Marks the business milestone of the first paid enrollment. Interest, inquiries, or a pending order do NOT count.',
    'Instruction occurred AND payment was received.',
    { gate: ['Authorized instruction was actually delivered to the student.', 'Payment for that instruction was received in my account.', 'This is not based only on interest, an inquiry, or a pending order.'], milestone: true });

  /* ---------------- PHASE 11 ---------------- */
  var G = 'GROWTH';
  ['Add additional courses', 'Expand to additional charter school programs', 'Offer more group classes', 'Improve course materials', 'Develop advanced course sequences', 'Build partnerships with other educators', 'Evaluate whether to hire instructors', 'Develop instructor onboarding procedures', 'Expand geographic reach', 'Evaluate whether to build a larger educational brand'].forEach(function (t, i) {
    var id = 'P11-' + String(i + 1).padStart(2, '0');
    T(id, t, 'Low', false, 4, ['P10-17'], G, 'INTERNAL', '', 'Optional growth work. Start only after the first paid enrollment and when the core business is stable.', 'Decision or work documented in notes.');
  });

  /* ---------------- COURSES ---------------- */
  var courseList = [
    ['A1', 'A', 'Introduction to Audio Engineering', 'Sound basics, microphones, signal flow, and a first multitrack recording.', 'A short recorded and edited audio piece'],
    ['A2', 'A', 'Home Recording Studio Fundamentals', 'Setting up a simple home studio: interfaces, mics, acoustics, and workflow.', 'A recording made in the student\'s own setup'],
    ['A3', 'A', 'Music Production Fundamentals', 'Beat-making, arrangement, and DAW skills (e.g., Ableton Live).', 'An original produced track'],
    ['A4', 'A', 'Recording and Mixing', 'Tracking, editing, EQ, compression, and balancing a mix.', 'A recorded and mixed song'],
    ['A5', 'A', 'Podcast Production', 'Planning, recording, editing, and publishing-ready audio.', 'A complete podcast episode'],
    ['A6', 'A', 'Electronic Music Production', 'Synthesis, sampling, sound design, and electronic arrangement.', 'An original electronic composition'],
    ['A7', 'A', 'Advanced Audio Engineering', 'Advanced mixing, mastering concepts, and studio workflow.', 'A portfolio-ready mix'],
    ['B1', 'B', 'Introduction to App Development', 'What apps are, how they are built, and a first interactive project.', 'A simple working app'],
    ['B2', 'B', 'Build Your First Web App', 'HTML, CSS, and JavaScript to build and publish a small web app.', 'A working web application'],
    ['B3', 'B', 'Programming Fundamentals', 'Variables, logic, loops, functions, and problem solving.', 'A documented programming project'],
    ['B4', 'B', 'React App Development', 'Components, state, and building a multi-screen React app.', 'A working React app'],
    ['B5', 'B', 'AI-Assisted App Development', 'Using AI coding tools responsibly to plan, build, and test apps.', 'A functional prototype built with AI assistance'],
    ['B6', 'B', 'App Design and Prototyping', 'User research, wireframes, and clickable prototypes.', 'A tested prototype'],
    ['B7', 'B', 'Build Your First Startup', 'Turning an idea into a simple product, pitch, and launch plan.', 'A prototype and pitch']
  ];
  var courses = courseList.map(function (c) {
    return {
      id: c[0], division: c[1], title: c[2],
      description: 'DRAFT: ' + c[3],
      purpose: '', objectives: '', ageRange: '', prerequisites: '', duration: '', hoursPerMonth: '',
      format: 'Undecided', maxClassSize: '', equipment: '', software: '', prepTime: '',
      proposedPrice: '', pricePerStudent: '', materialsCost: '',
      approvalStatus: 'Not submitted', catalogStatus: 'Not listed', curriculumStatus: 'Idea',
      launchCandidate: false,
      finalProject: c[4] + ' (proposed)', assessment: '', materials: '',
      modules: []
    };
  });

  /* ---------------- LESSON TEMPLATES ---------------- */
  var lessonTemplates = [
    { name: 'Hands-on skill lesson (60 min)', objectives: 'Students can …', activities: '10 min: warm-up / review\n15 min: demonstration\n25 min: guided hands-on practice\n10 min: share & recap', assignment: 'Practice task to complete before next session', materials: '' },
    { name: 'Project work session (90 min)', objectives: 'Students make measurable progress on their final project', activities: '10 min: goals check-in\n65 min: independent project work with 1:1 coaching\n15 min: show progress & next steps', assignment: 'Next milestone for the project', materials: '' },
    { name: 'Critique & review session', objectives: 'Students give and receive constructive feedback', activities: 'Each student presents work → structured feedback (what works / what to try) → revision plan', assignment: 'Apply one piece of feedback', materials: '' },
    { name: 'Online live lesson (45 min)', objectives: 'Students can …', activities: '5 min: tech check\n15 min: screen-share demo\n20 min: follow-along build\n5 min: recap & assignment', assignment: '', materials: 'Video platform link shared via parent' }
  ];

  /* ---------------- RESOURCES ---------------- */
  function R(group, name, desc, key, tasks) { return { group: group, name: name, description: desc, url: U[key], tasks: tasks || [], lastVerified: '', verification: 'Verify Current Requirements', notes: '' }; }
  var resources = [
    R('Heartland official documentation', 'Heartland vendor information (home)', 'Vendor contacts site — starting point for vendor information.', 'HL_HOME', ['P2-01', 'P2-03']),
    R('Heartland official documentation', 'Become a vendor', 'Official vendor application instructions.', 'HL_BECOME', ['P2-01', 'P2-10', 'P4-01']),
    R('Heartland official documentation', 'Vendor FAQs', 'Frequently asked questions for vendors.', 'HL_FAQ', ['P2-02', 'P2-11', 'P6-01', 'P6-02', 'P6-03']),
    R('Heartland official documentation', 'Department contacts', 'Heartland department contact information.', 'HL_CONTACT', ['P2-04']),
    R('California government resources', 'California Secretary of State', 'Business entities and filings.', 'SOS', ['P1-02', 'P3-01']),
    R('California government resources', 'bizfile Online (CA SOS)', 'Business name search and entity filings.', 'BIZFILE', ['P1-04']),
    R('California government resources', 'Franchise Tax Board', 'California income/franchise tax.', 'FTB', ['P3-06']),
    R('California government resources', 'CDTFA', 'Seller\'s permits and sales/use tax.', 'CDTFA', ['P3-05']),
    R('California government resources', 'EDD', 'Employer registration (relevant only if you hire).', 'EDD', ['P11-07']),
    R('California government resources', 'CalGold', 'Find permits and licenses by location and business type.', 'CALGOLD', ['P1-07', 'P4-22']),
    R('California government resources', 'CA DOJ — Fingerprints / Live Scan', 'Background check and Live Scan information.', 'DOJ', ['P4-03', 'P4-05']),
    R('California government resources', 'California Department of Education — Charter Schools', 'General charter school information.', 'CDE', ['P1-15', 'P8-13']),
    R('Federal government resources', 'IRS', 'Federal tax information.', 'IRS', ['P3-06']),
    R('Federal government resources', 'IRS — Get an EIN', 'Apply for an EIN (free, only on irs.gov).', 'IRS_EIN', ['P3-04']),
    R('Federal government resources', 'IRS — Self-Employed Tax Center', 'Self-employment tax basics.', 'IRS_SE', ['P3-06']),
    R('Federal government resources', 'IRS — Form W-9', 'Commonly requested vendor tax form.', 'IRS_W9', ['P4-13']),
    R('Federal government resources', 'U.S. SBA', 'Small business planning resources.', 'SBA', []),
    R('Federal government resources', 'FTC — COPPA Rule', 'Children\'s online privacy rule.', 'COPPA', ['P4-16', 'P7-12']),
    R('Federal government resources', 'U.S. Dept. of Education — Student Privacy', 'FERPA and student privacy guidance.', 'EDPRIV', ['P4-16']),
    R('Santa Barbara local requirements', 'City of Santa Barbara', 'City business tax certificate and home occupation info.', 'CITY', ['P1-07', 'P1-09', 'P3-13']),
    R('Santa Barbara local requirements', 'County of Santa Barbara', 'County Clerk-Recorder (fictitious business names) and unincorporated-area rules.', 'COUNTY', ['P1-06']),
    R('Insurance and compliance', 'California Department of Insurance', 'Verify insurance agent licenses; consumer guidance.', 'CDI', ['P3-12', 'P4-09']),
    R('Insurance and compliance', 'California Mandated Reporter Training', 'State mandated-reporter training site.', 'MANDREP', ['P4-06']),
    R('Course development', 'Ableton — Learning Music', 'Free browser-based music fundamentals.', 'ABLETON', ['P9-03']),
    R('Course development', 'Audacity', 'Free audio editor.', 'AUDACITY', ['P5-05']),
    R('Course development', 'MDN Web Docs', 'Web development reference.', 'MDN', ['P9-04']),
    R('Course development', 'React documentation', 'Official React docs.', 'REACT', []),
    R('Marketing and business operations', 'SCORE', 'Free small-business mentoring.', 'SCORE', []),
    R('Marketing and business operations', 'SBA — Marketing & sales', 'Marketing basics for small businesses.', 'SBA_MKT', []),
    R('Marketing and business operations', 'ICANN Lookup', 'Domain registration lookup.', 'ICANN', ['P1-05', 'P7-01']),
    R('Marketing and business operations', 'Google Business Profile', 'Local business listing.', 'GBP', [])
  ];

  /* ---------------- DOCUMENT TEMPLATES ---------------- */
  var docTemplates = [
    { type: 'Vendor inquiry email', title: 'Vendor inquiry — Heartland', body:
'Subject: New vendor inquiry — creative technology courses (Santa Barbara County)\n\nHello Heartland Vendor Department,\n\nMy name is [Your Name]. I am preparing to apply as an educational services vendor offering project-based courses in audio engineering/music production and software/app development for students in Santa Barbara County.\n\nBefore I apply, could you help me confirm the following?\n\n1. Are new vendors currently being accepted, and is the application on the vendor website current?\n2. Do audio engineering / music production courses qualify as educational services?\n3. Do programming / app development courses qualify?\n4. Is Santa Barbara County within your service area for families and vendors?\n5. Is live online instruction permitted? Is in-person instruction permitted in Santa Barbara, and are there location restrictions?\n6. Are group classes permitted, and how should group pricing be expressed?\n7. What documentation, background checks, fingerprinting, training, and insurance (types, limits, additional-insured wording) are required?\n8. Is a business website required before applying?\n9. Are there vendor pricing restrictions or required pricing units?\n10. How are courses and prices submitted to the ordering catalog?\n11. What authorization is required before instruction, and are there monthly authorization rules?\n12. How and when are vendors paid, and what documentation is required?\n13. What are the cancellation and nonattendance policies?\n14. Can a student enroll in multiple courses from the same vendor?\n15. What is the typical timeline from application to approval?\n\nThank you for your time.\n\n[Your Name]\n[Business name — if established]\n[Phone] · [Email]' },
    { type: 'Follow-up email', title: 'Follow-up — application status', body: 'Subject: Follow-up — vendor application [reference # if any]\n\nHello [Contact name],\n\nI am following up on my [inquiry/application] sent on [date]. Could you let me know the current status and whether you need anything else from me?\n\nThank you,\n[Your Name]' },
    { type: 'Course description', title: 'Course description — [Course]', body: '[Course title]\nAges: [proposed range]\nFormat: [in person / online / both — subject to approval]\nDuration: [weeks] · [hours per month]\n\nWhat students do: [1–2 sentences]\nWhat students leave with: [tangible final project]\nPrerequisites: [none / …]\nEquipment & software: [list]\n\nApproval status: [Not yet approved by any school]' },
    { type: 'Instructor biography', title: 'Instructor biography', body: '[Your Name] teaches creative technology in Santa Barbara.\n\nExperience to describe (only include what is true and verifiable):\n- Audio engineering and music production — [years, projects]\n- Digital audio workstations including Ableton Live and Pro Tools — [how used]\n- Software development and app building — [projects]\n- AI-assisted development tools — [how used]\n- Teaching / mentoring experience — [if any]\n\nTeaching approach: practical, project-based learning where every student finishes something real.' },
    { type: 'Course brochure', title: 'One-page brochure', body: '[Business name]\nCreative technology courses for homeschool students in Santa Barbara County\n\nAudio Engineering & Music Production\n- [Course] — [one line]\n\nSoftware Development & App Building\n- [Course] — [one line]\n\nCharter school families: we are [not yet approved / approved] as a vendor with [school]. Eligibility for school funding is determined by each school; availability is not guaranteed.\n\nContact: [email] · [phone] · [website]' },
    { type: 'Parent-facing FAQ', title: 'Parent FAQ', body: 'Q: Can I use my charter school funds for these courses?\nA: Only if our business and the specific course are approved by your school and your school authorizes the order. Please check with your school. We will update this page as approvals are confirmed.\n\nQ: What ages do you teach?\nA: [ranges]\n\nQ: Online or in person?\nA: [details — subject to school rules]\n\nQ: What equipment does my child need?\nA: [list]\n\nQ: What is your cancellation policy?\nA: [policy]' },
    { type: 'Business planning notes', title: 'Business planning notes', body: 'Decision:\nDate:\nReasoning:\nLabel (Verified Current / Requires Confirmation / Planning Assumption / User Confirmed):\nNext action:' },
    { type: 'Vendor application preparation notes', title: 'Application prep notes', body: 'Requirement:\nOfficial source:\nDate verified:\nApplies to my business? (Y/N/Unknown):\nAction required:\nEvidence of completion:\nMust Heartland confirm directly? (Y/N):' }
  ];

  window.CTA_SEED = {
    version: SEED_VERSION, categories: CATEGORIES, phases: PHASES, verificationLevels: V,
    tasks: rows, courses: courses, lessonTemplates: lessonTemplates, resources: resources, docTemplates: docTemplates
  };
})();
