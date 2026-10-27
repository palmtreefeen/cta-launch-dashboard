# Creative Technology Academy — Business Launch Dashboard

A standalone, offline-capable project management app for launching an educational services business in Santa Barbara County and becoming an approved Heartland Charter School vendor. "Creative Technology Academy" is a working title; you can change it in **Settings & Backup**.

## How to run

1. Keep these files together in one folder: `index.html`, `styles.css`, `data.js`, `app.js`.
2. Double-click `index.html` (or drag it into Chrome, Edge, Firefox, or Safari).

No install, server, account, or internet connection is needed. Internet is only used when you click an external resource link.

## Where your data is saved

- Everything auto-saves to **localStorage in the browser you opened it with**. The "Saved locally" badge in the top bar confirms each save.
- Data does **not** sync between browsers or devices. If you open the file in a different browser, you'll see a fresh copy.
- Clearing browser data, using private/incognito mode, or moving the files to a new location in some browsers can erase or hide it.
- **Export a JSON backup regularly** (Settings & Backup → Export). Import restores it after validation and a confirmation step.
- Never store passwords, Social Security or tax ID numbers, identity documents, student records, or payment credentials in this app.

## Major features

- **Dashboard:** launch % (required tasks only), completed/remaining/blocked/overdue/in-progress/awaiting-approval counts, a "What should I do next?" panel, the top 5 next actions, 10 readiness indicators, phase progress, deadlines, and a financial summary.
- **Master Checklist:** 186 seeded tasks across 11 phases. You can search them, filter by phase, category, priority, status, required/optional, and evidence label, and sort by deadline, priority, or effort. There are toggles for incomplete-only, blocked, and overdue tasks, plus inline status changes, expandable details, and add/edit/delete.
- **Work in any order (default):** prerequisites are shown as "Suggested after …", not locks. You can check off any task at any time, and the app notes it in the task history. **Ready now** (dashboard card, metric, and checklist toggle) lists everything whose prerequisites are done, so you can work across phases at the same time. Sort by **Recommended order** to go step by step. If you want hard locks, switch Settings → Dependency mode to **Strict**: completing a task early then needs a reason, which is recorded.
- **Evidence gates:** some milestones ask you to check confirmation statements and describe your evidence before they can be marked complete. These are submitting the application, Heartland approval, background checks, delivering the service, submitting payment paperwork, receiving payment, and **First paid student**.
- **Evidence labels:** Verified Current, Verify Current Requirements, User Confirmed, Planning Assumption, and Internal Task. To mark something "Verified Current" you must enter a source and a date.
- **Phase pages:** Heartland Application, Business Setup, Compliance, Website Launch, Marketing (with a privacy-safe inquiry funnel), Operations, Student Enrollment (first-paid-student milestone), and Growth.
- **Course Catalog and builder:** all 14 proposed courses with every requested field, launch-candidate flags, a gated approval status, and modules and lessons built from reusable templates.
- **Pricing Calculator:** five models (individual, small group, multi-week, monthly, online), each with conservative, moderate, and optimistic enrollment, plus a side-by-side comparison. All inputs are labeled **example assumptions**.
- **Financial Tracking:** your actual figures and calculated results. Projections are kept separate and labeled hypothetical. A ledger tracks actual and projected entries.
- **Charter School Tracker:** tracks applications to more than one school. "Approved" requires an approval date and written-approval confirmation.
- **Notes & Communications:** a full communication log plus free-form project notes.
- **Documents:** eight editable templates, including a Heartland inquiry email with 15 key questions. You can save drafts and copy them to the clipboard. The app never sends anything.
- **Resource Library:** 31 official and useful links in 7 sections, with related tasks, verification status, and last-verified date.
- **Settings & Backup:** JSON export and import, print checklist and dashboard, restore deleted default tasks, and a reset that requires typing `RESET`.

## Important limitations

- Requirements are not verified. Every Heartland and government requirement starts as "Verify Current Requirements". The dashboard does not fetch or check official websites, so you must confirm each item and record what you verify.
- External link destinations could not be checked from the build environment. Links open in a new tab, and opening a link never completes or verifies a task.
- There is no multi-device sync and no cloud backup. Use JSON export.
- No emails are sent and no applications are submitted. Documents are drafts only.
- Reminders and notifications aren't included. Deadlines and follow-up dates show inside the app only.
- The print view uses your browser's print dialog. Print to PDF to save a copy.

## Files

| File | Purpose |
|---|---|
| `index.html` | App shell |
| `styles.css` | Layout, responsive, and print styles |
| `data.js` | Seed checklist, courses, resources, templates (edit to change defaults) |
| `app.js` | All application logic |
| `CLAUDE.md` | Persistent instructions for future Claude Code sessions |

When `data.js` gains new tasks in a future version, existing saved progress is preserved and the new tasks are added automatically.
