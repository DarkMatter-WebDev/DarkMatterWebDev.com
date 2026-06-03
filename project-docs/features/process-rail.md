# Feature: Process Rail

Last updated: 2026-06-02

## Summary

The floating process rail is a sitewide navigation/education element that explains Dark Matter's service process.

## Current Steps

1. Design
2. Build
3. Launch
4. Maintain

## Implementation

- Shared interaction logic lives in `assets/rail.js`.
- The rail appears across top-level pages, service pages, and the Website Preference Builder / free mockup page in English and Spanish.
- Rail script links are cache-busted with `?v=20260602-rail-active` so deployed browsers pick up active-state and link behavior changes.
- Active state is inferred from the current page path.
- Current active-state mapping:
  - Design: homepage, `preference-builder.html`, consultation, website design, brand/rebranding.
  - Build: Custom Business Web Apps.
  - Launch: Process page, complete website management, managed hosting, SEO foundations.
  - Maintain: website care plans, in-home tech services, office network setup.
- Process page intentionally highlights Launch because the Launch rail icon routes to `process.html`.

## Decision Context

The rail previously used six steps. It was simplified to four steps so the process is easier for business owners to scan. Discovery/planning is folded into Design. Security is folded into Build and Launch.
