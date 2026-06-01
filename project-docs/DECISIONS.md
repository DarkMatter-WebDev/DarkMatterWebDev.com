# Decisions

## 2026-06-01

Decision:
Ship the Spanish site as a parallel set of fully-translated static pages under `es/` (mirroring filenames), rather than a JavaScript in-place string-swap on shared pages.

Reason:
It matches the existing hand-authored static architecture, gives real Spanish URLs (better SEO/sharing via `hreflang`), works without JavaScript, and keeps each language's markup independently editable. Target dialect is neutral Latin American Spanish.

Alternatives Considered:
- Single set of files with a JS i18n dictionary toggling text in place (larger refactor, JS-dependent, no distinct URLs).
- A server/build-time templating system (no build pipeline exists in this project).

Decision:
Default to English, auto-detect Spanish browsers on first visit (redirect to `es/`), and remember the user's explicit choice in `localStorage` (`dm_lang`).

Reason:
Most chrome and the canonical URLs are English-first, but Spanish-speaking visitors get their language automatically while a manual `EN / ES` toggle always wins and persists. Detection sets no storage, so there is no redirect loop.

Alternatives Considered:
- Manual toggle only (no auto-detect).
- Auto-detect with no persistence.

## 2026-06-01

Decision:
Use Markdown files under `project-docs/` as the project's persistent memory system.

Reason:
Markdown is lightweight, easy for humans and AI agents to read, works without a database or external tool, and can be kept with the website source.

Alternatives Considered:
- Keeping context only in chat history.
- Adding a heavier project management tool.
- Using scattered notes outside the repository.

## 2026-06-01

Decision:
Add `CLIENTS.md` to the project memory system.

Reason:
Dark Matter may manage multiple client websites over time, and client operational details need a clear place that does not store passwords.

Alternatives Considered:
- Tracking client details only in `CURRENT_STATUS.md`.
- Creating separate ad hoc notes per client.

## 2026-06-01

Decision:
Position the advanced custom offering as "Custom Business Web Apps."

Reason:
This wording is clearer for business owners than generic "custom development" and better describes private tools with logins, dashboards, records, reports, automations, and admin access.

Alternatives Considered:
- Custom Development
- Business App
- Web App
- Client Portal

## 2026-06-01

Decision:
Add a premium Team Help Desk tier at `$1,500+/mo`.

Reason:
Supporting an entire business team, individual user accounts, and app users is significantly more involved than basic website updates and should be priced as a premium operational support plan.

Alternatives Considered:
- Include help desk support inside lower care plans.
- Price support only as hourly work.
- Avoid publishing the tier until custom web apps launch.

## 2026-06-01

Decision:
Standardize the floating process rail to four steps: Design, Build, Launch, Maintain.

Reason:
A four-step process is easier to understand across the site while still allowing discovery/planning and security to be folded into Design, Build, and Launch.

Alternatives Considered:
- Six-step process including Find and Secure.
- Different process language for homepage and process page.

## 2026-06-01

Decision:
Group service navigation into Online Services and In-Home & Office Services.

Reason:
Dark Matter is expanding beyond website-only work into local technology setup, including in-home installations, home offices, office networks, Wi-Fi, printers, devices, and workstation setup. Grouping the menu keeps the existing web services clear while creating room for local service growth.

Alternatives Considered:
- Keep one flat Services dropdown.
- Create a separate top-level navigation item for Local Services.
- Delay local services until pricing is finalized.
