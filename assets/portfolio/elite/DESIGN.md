---
name: Nautical Prestige
colors:
  surface: '#faf9fc'
  surface-dim: '#dadadd'
  surface-bright: '#faf9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f6'
  surface-container: '#eeedf0'
  surface-container-high: '#e8e8eb'
  surface-container-highest: '#e3e2e5'
  on-surface: '#1a1c1e'
  on-surface-variant: '#42474d'
  inverse-surface: '#2f3033'
  inverse-on-surface: '#f1f0f3'
  outline: '#73777e'
  outline-variant: '#c3c7ce'
  surface-tint: '#406182'
  primary: '#001629'
  on-primary: '#ffffff'
  primary-container: '#002b49'
  on-primary-container: '#7293b6'
  inverse-primary: '#a8caef'
  secondary: '#5d5e5f'
  on-secondary: '#ffffff'
  secondary-container: '#e0dfdf'
  on-secondary-container: '#626363'
  tertiary: '#260e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#441f01'
  on-tertiary-container: '#bd835b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cfe5ff'
  primary-fixed-dim: '#a8caef'
  on-primary-fixed: '#001d34'
  on-primary-fixed-variant: '#274969'
  secondary-fixed: '#e3e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#fab98d'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#683c1a'
  background: '#faf9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e3e2e5'
  ocean-deep: '#001A2C'
  yacht-white: '#F8FAFC'
  chrome-shine: '#E2E8F0'
  horizon-blue: '#005B96'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-padding: 80px
---

## Brand & Style

The design system is engineered to evoke the high-stakes precision and absolute luxury of the yachting industry in Southwest Florida. The brand personality is elite, meticulous, and authoritative. It targets high-net-worth individuals who demand perfection for their maritime assets.

The visual style blends **Minimalism** with **Glassmorphism**. By using expansive white space, we mirror the "clean" result of the service, while frosted glass elements and subtle chrome gradients reflect the physical materials of a yacht—polished fiberglass, stainless steel, and clear waters. The interface should feel as aerodynamic and high-end as the vessels themselves.

## Colors

The palette is rooted in the maritime environment.
- **Primary:** A deep Navy (#002B49) representing the depths of the ocean and professional stability. Use this for primary branding, headers, and call-to-action buttons.
- **Secondary:** Silver (#C0C0C0) used for accents and borders to simulate chrome finishes.
- **Neutral:** A crisp, nearly-white gray (#F8FAFC) serves as the primary background color, providing a clinical, clean "freshly detailed" feel.
- **Accent:** "Horizon Blue" is used sparingly for interactive states or highlighting premium features like ceramic coating services.

## Typography

This design system utilizes a pairing of **Montserrat** for headlines and **Manrope** for body text. 
- **Montserrat** provides a geometric, modern, and sturdy feel that mirrors luxury automotive and nautical branding. High-level headers should use tight letter-spacing for a sophisticated, "magazine" look.
- **Manrope** is chosen for its exceptional legibility and technical clarity, making service lists and pricing easy to digest.
- **Label-caps** should be used for section eyebrows (e.g., "OUR SERVICES") to establish clear information hierarchy.

## Layout & Spacing

The layout follows a **fluid-to-fixed grid** model. On desktop, content is centered within a 1280px container using a 12-column grid. On mobile, the system shifts to a single-column layout with generous 20px side margins to ensure the UI doesn't feel cramped.

The spacing rhythm is "airy." We use large vertical section padding (80px+) to allow the high-resolution imagery of yachts to breathe. Components are spaced using an 8px base unit to maintain mathematical harmony.

## Elevation & Depth

To reflect the reflective surfaces of a premium yacht, depth is achieved through **Glassmorphism** and **Ambient Shadows**.
- **Surfaces:** Use backdrop-blur (12px to 20px) on navigation bars and floating cards to create a sense of layered glass.
- **Shadows:** Avoid harsh, black shadows. Use "Ocean Tints"—soft, diffused shadows with a hint of the primary navy (#002B49) at very low opacity (5-8%).
- **Interactive Depth:** When a user hovers over a service card, the shadow should subtly expand, and a 1px "Chrome" border (#E2E8F0) should brighten to simulate light catching a polished edge.

## Shapes

The shape language is **Soft (0.25rem)**. While yachts have organic curves, luxury branding often relies on structured, architectural lines. This subtle rounding prevents the UI from feeling "bubbly" or "childish," maintaining a professional and serious tone. 

- **Standard Elements:** 4px radius (buttons, inputs).
- **Featured Cards:** 8px radius (rounded-lg).
- **Imagery:** Should remain sharp or use the 8px radius to keep the focus on the precision of the detailing work.

## Components

### Buttons
Primary buttons use the Primary Navy background with white Montserrat bold text. They should have a subtle linear gradient (Top: Primary, Bottom: Ocean-Deep) to give a slight 3D "molded" feel. Secondary buttons use a "Chrome" ghost style: a 1px silver border with a light gray hover state.

### Cards
Service cards should feature a top-aligned high-resolution image. The content area below uses a white background with a very soft ambient shadow. Use the "Label-caps" typography for service categories (e.g., "EXTERIOR REFINISHING").

### Input Fields
Fields should be minimalist with a 1px border (#E2E8F0). Upon focus, the border transitions to Primary Navy. Use Manrope for all placeholder and input text to ensure clarity during the booking process.

### Chips / Tags
Use these for yacht sizes (e.g., "30ft - 50ft") or service status. They should be pill-shaped with a light Navy tint background and Navy text, keeping them subtle and secondary to the main content.

### Gallery Component
A custom "Before/After" slider is essential. This component should use a high-contrast silver handle to mimic a polishing tool, allowing users to physically "reveal" the shine.
