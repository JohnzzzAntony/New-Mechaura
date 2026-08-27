# Handoff Spec: Responsive System & Aeonik Typography

**Scope:** all 30 pages · **Stack:** static HTML + CSS + vanilla JS (Vite build)
**Verified at:** 375 / 768 / 1440 px · **Date:** 26 August 2026

---

## Overview

The site rendered correctly on desktop but broke in several places on mobile:
one page scrolled sideways to more than twice the viewport width, touch targets
were as small as 20 px, and body text ran as low as 6.4 px. Typography moved
from Space Grotesk / Inter to Aeonik.

---

## 1. Aeonik — licensing and how it loads

Aeonik is a **commercial typeface from CoType Foundry**. It cannot be bundled in
this repo or served from a CDN without a licence, so it is wired up but not
included.

**To activate it,** drop three licensed files into `public/fonts/`:

```
Aeonik-Regular.woff2    400
Aeonik-Medium.woff2     500
Aeonik-Bold.woff2       700
```

The `@font-face` rules already point at those exact paths. No code change is
needed — the next build picks them up.

**Until then,** the stack falls through to **Switzer** (Fontshare, free for
commercial use), a geometric grotesque with near-identical proportions to
Aeonik. The site reads as designed either way.

```css
--font-heading: 'Aeonik', 'Switzer', 'Space Grotesk', system-ui, sans-serif;
--font-body:    'Aeonik', 'Switzer', 'Inter', system-ui, sans-serif;
```

---

## 2. Design tokens

### Type scale — fluid, clamped

| Token | Value | Usage |
|---|---|---|
| `--fs-display` | `clamp(2.4rem, 1.4rem + 4.6vw, 5rem)` | Hero, mega footer text |
| `--fs-h1` | `clamp(2rem, 1.3rem + 3.2vw, 3.6rem)` | Page titles |
| `--fs-h2` | `clamp(1.6rem, 1.2rem + 2vw, 2.6rem)` | Section titles |
| `--fs-h3` | `clamp(1.1rem, 0.98rem + 0.6vw, 1.35rem)` | Card titles |
| `--fs-body-lg` | `clamp(1rem, 0.96rem + 0.25vw, 1.12rem)` | Lead paragraphs |
| `--fs-body` | `clamp(0.94rem, 0.92rem + 0.14vw, 1rem)` | Body copy |
| `--fs-small` | `clamp(0.85rem, 0.83rem + 0.1vw, 0.9rem)` | Secondary copy |
| `--fs-label` | `clamp(0.75rem, 0.73rem + 0.1vw, 0.8rem)` | Eyebrows, labels — **never below 12 px** |

Every size interpolates with viewport width, so there are no jumps at
breakpoints and no separate mobile font-size declarations to maintain.

### Spacing

| Token | Value |
|---|---|
| `--space-2xs` … `--space-xl` | `0.5rem` · `0.75rem` · `1rem` · `1.5rem` · `2.5rem` · `4rem` |
| `--space-2xl` | `clamp(4rem, 2rem + 8vw, 8rem)` |

### Interaction

| Token | Value | Usage |
|---|---|---|
| `--tap-min` | `44px` | Minimum touch target (WCAG 2.5.5) |

---

## 3. Breakpoints

Previously four inconsistent values were in use (768 / 900 / 992 / 1024).
Now three, applied consistently:

| Breakpoint | Range | Key changes |
|---|---|---|
| Desktop | `> 1024px` | Default. Multi-column grids, sticky product gallery, row CTAs |
| Tablet | `≤ 1024px` | Product gallery unsticks; `.rel-grid` → 2 columns |
| Mobile | `≤ 768px` | All grids → 1 column; CTAs full-width stacked; tables scroll; scroll cue hidden; forms single column at 16px |
| Small | `≤ 480px` | Container padding 1rem; hero stats 2×2; thumbs 3-up; trust grid 1 column |

---

## 4. Bugs found and fixed

| # | Issue | Cause | Fix |
|---|---|---|---|
| 1 | `/products/*` scrolled to **815 px** on a 375 px screen | `.pd-gallery` / `.pd-image-box` existed only in `product-detail.html`'s inline `<style>`. Generated product pages never got them, so the 800 px image was unconstrained | Moved the rules into `style.css`; added `min-width: 0` to grid children |
| 2 | Hero subtitle **invisible on every page load** | CSS set `opacity: 0` with a `/* JS reveal */` comment, but no such animation was ever written | Added the reveal to the GSAP timeline in `main.js`, plus a no-JS fallback |
| 3 | Product page H1 at **40 % opacity** | Stray `color: rgba(255,255,255,0.4) !important` | Reset to `--text-primary` |
| 4 | `/contact` overflowed by 12 px | 40 px card padding + a non-wrapping email string | Card padding → 1.5 rem on mobile; `overflow-wrap: anywhere` on emails and phone numbers |
| 5 | Scroll cue overlapped the stats bar | Both absolutely placed in a stacked hero | Cue hidden below 768 px — the stats already sit at the fold |
| 6 | Touch targets 20–39 px | No minimum enforced | `--tap-min: 44px` on nav toggle, footer links, buttons, thumbs, social icons; invisible 44 px hit area on carousel bullets |
| 7 | Text at 6.4 / 9.6 / 11.2 px | Hardcoded `rem` values below the legibility floor | All label-class elements now use `--fs-label` (12 px minimum) |
| 8 | iOS zoomed on form focus | Inputs below 16 px | Form controls forced to `16px` at ≤ 768 px |

---

## 5. Responsive behaviour by component

| Component | Desktop | Tablet | Mobile |
|---|---|---|---|
| Hero | Full-height, row CTAs, 4-col stats | Same, reduced type | Auto-height, stacked full-width CTAs, 2×2 stats, no scroll cue |
| Product gallery | Sticky, 2-col with info | Unsticks, stacks | Stacks; thumbs 3-up at ≤ 480 |
| Spec / comparison tables | Full width | Full width | Horizontally scrollable, cells wrap |
| Services / sectors / related | 3–4 columns | 2 columns | 1 column |
| Why-choose-us | 5fr/7fr split | Stacked | Stacked, cards 1-up |
| Contact | 2-col form + info | Stacked | Stacked, 1.5 rem padding, 16 px inputs |
| Footer | 3-column | 3-column | Stacked, 72 px bottom clearance for the fixed nav |

---

## 6. States and interactions

| Element | State | Behaviour |
|---|---|---|
| Nav link | Hover | Colour → accent, underline wipe |
| Nav link | Focus-visible | 2 px accent outline, 3 px offset |
| Primary CTA | Hover | Arrow translates 3 px right |
| Primary CTA | Mobile | Full width, centred |
| Product thumb | Active | Accent border + ring |
| Product thumb | Hover | Lifts 3 px |
| FAQ item | Expanded | `aria-expanded="true"`, chevron rotates |
| Any control | Focus-visible | 2 px accent outline — previously invisible |
| All motion | `prefers-reduced-motion` | Animations reduced to 0.01 ms |

---

## 7. Accessibility

- **Touch targets:** every interactive element ≥ 44 × 44 px. Inline links inside
  prose keep their natural size, which WCAG 2.5.5 explicitly permits.
- **Text:** nothing below 12 px anywhere on the site.
- **Focus:** visible 2 px accent ring on all controls. This did not exist before —
  keyboard users had no indication of position.
- **Motion:** full `prefers-reduced-motion` support.
- **Forms:** 16 px inputs prevent iOS zoom-on-focus, which otherwise breaks layout.

---

## 8. Verification

| Check | Result |
|---|---|
| Horizontal scroll — 13 pages × 375 px | None |
| Horizontal scroll — 768 px, 1440 px | None |
| Touch targets < 44 px | None (excluding permitted inline prose links) |
| Text < 12 px | None |
| `npm run audit` | No per-page issues |

Re-run any time with:

```bash
npm run build && npm run audit
```

---

## 9. Follow-ups not in this change

- **Aeonik files** — supply the licensed `.woff2` files to replace Switzer.
- **Testimonials** are still placeholders; replace with real, consented quotes.
- **Brand marquee** lists SKF, Parker, Sandvik and others — trim to brands you
  genuinely source.
- **Real-device testing** — this was verified with emulated viewports. Worth a
  pass on a physical iPhone and mid-range Android before launch, particularly
  for the sticky gallery and the fixed bottom nav.
