# Feature: Process Rail

Last updated: 2026-06-01

## Summary

The floating process rail is a sitewide navigation/education element that explains Dark Matter's service process.

## Current Steps

1. Design
2. Build
3. Launch
4. Maintain

## Implementation

- Shared interaction logic lives in `assets/rail.js`.
- The rail appears across top-level pages and service pages in English and Spanish.
- Rail script links are cache-busted with `?v=20260601-rail-es` so deployed browsers pick up bilingual behavior changes.
- Active state is inferred from the current page path.

## Decision Context

The rail previously used six steps. It was simplified to four steps so the process is easier for business owners to scan. Discovery/planning is folded into Design. Security is folded into Build and Launch.
