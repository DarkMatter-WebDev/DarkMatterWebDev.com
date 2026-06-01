# Dark Matter Web Services - Project Overview

This is the first file future AI sessions and contributors should read.

## Purpose

Dark Matter Web Services is a marketing website for managed website services, custom business web apps, hosting, care plans, branding, SEO foundations, ongoing support, and local in-home/office technology setup for small businesses and homes.

## Business Goals

- Present Dark Matter as an outsourced website and local technology partner for Southwest Florida businesses.
- Sell managed website packages, care plans, custom business web apps, rebranding services, and on-site tech setup.
- Make complex web/app services feel practical and approachable for busy business owners.
- Support lead generation through clear service pages, case studies, contact forms, and "powered by" referral links.

## Target Audience

- Southwest Florida small businesses and professional offices.
- Business owners who want professional websites without managing hosting, security, updates, or multiple vendors.
- Companies that may need private business web apps with staff/customer logins, reporting, automation, and support.
- Home offices, small offices, and local clients that need practical in-person setup for Wi-Fi, devices, printers, workstations, and networking.

## Tech Stack

- Static HTML pages.
- Tailwind CSS via CDN on page templates.
- Shared CSS in `assets/*.css`.
- Shared JavaScript in `assets/rail.js` plus inline page scripts where needed.
- Material Symbols icons loaded from Google Fonts.
- Netlify Forms on `contact.html`.
- Static image/video assets in `assets/`.

## Deployment

- Netlify configuration exists in `netlify.toml`.
- Contact forms use Netlify form attributes and POST handling.
- Local preview commonly runs from the project root at `http://127.0.0.1:4173/`.

## High-Level Summary

The site is a dark, premium, space-inspired marketing site for Dark Matter Web Services. It includes homepage, services index, individual service pages, process page, case studies, contact page, and a "Website powered by Dark Matter" referral page. Recent positioning emphasizes custom business web apps, premium team help desk support, and a new local on-site services category for in-home tech and office network setup.

## Session Startup Protocol

At the beginning of every future AI session:

1. Read `project-docs/PROJECT_OVERVIEW.md`.
2. Read `project-docs/CURRENT_STATUS.md`.
3. Read `project-docs/TASKS.md`.
4. Read `project-docs/DECISIONS.md`.
5. Summarize the current project state before making changes.
6. Ask for clarification only when the local docs and code do not provide a safe answer.

## Session Shutdown Protocol

Before ending any meaningful work session:

1. Update `project-docs/CURRENT_STATUS.md`.
2. Update `project-docs/TASKS.md`.
3. Record important decisions in `project-docs/DECISIONS.md`.
4. Add meaningful changes to `project-docs/CHANGELOG.md`.
5. Update `project-docs/ARCHITECTURE.md` if structure, hosting, integrations, auth, or deployment changed.
