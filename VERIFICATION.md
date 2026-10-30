# Verification record — responsive composition revision

Date: 31 October 2026. Tested against a local Vite **production build**, served on port 4173. These are local lab measurements, not guarantees for the deployed site or physical-device animation performance.

## What changed

The five-chapter native-scroll narrative is retained, with a redesigned responsive composition:

- Copy and WebGL now occupy independent grid cells. Portrait layouts stack text above the scene; desktop and short-landscape layouts use two columns.
- Aspect-ratio breakpoints account for mobile browsers requesting a wide desktop layout viewport. The sticky stage no longer forces a minimum height larger than a phone screen.
- Container-relative typography and compact-height rules keep complete chapter copy and actions inside the text region.
- A shared camera framer calculates distance from the transformed bounds of all visible meshes and the actual canvas aspect, not global screen-width offsets.
- Camera yaw, ambient movement, pointer response, and chapter transitions are more restrained. The aggressive camera dive and sweeping decorative orbit are removed. Lighting no longer depends on a fixed-distance fog volume.
- The closing sculpture also occupies a separate column/row, with a simple plinth rather than rotating rings behind the headline.

Every transformation still reverses when scrolling backward. Chapter navigation, skip, pause, lazy loading, offscreen demand rendering, HTML content, and reduced-motion/graphics-failure document layouts are retained.

## Build & dependencies

- `npm run build`: passed, including strict TypeScript checking.
- `npm audit`: zero reported vulnerabilities.
- Vite still warns about the shared lazy Three.js chunk: ~998 KB raw / 273 KB gzip. The chapter scene (~15 KB raw) and finale (~2 KB raw) reuse it; the core UI is independent of it. This cost is not hidden or described as resolved.

## Browser automation

The final `npm test` run passed:

- 360, 390, 430, 768, 1024, 1440, and 1920 px: no page or heading horizontal overflow.
- Opening content visible at all seven widths.
- Chapter controls move scene progress and camera position in both directions.
- Ambient animation pause/resume state works without disabling scroll navigation.
- Mobile navigation opens/closes, supports Escape, returns focus, and navigates correctly.
- Portfolio concept dialogs and service expansion work.
- Empty-form validation focuses the first invalid field.
- Valid inquiry preparation produces the correct encoded WhatsApp brief, without claiming successful submission.
- Honeypot rejection produces an honest error state.
- All internal link targets exist; no empty or `#` placeholder destinations.
- Reduced-motion behavior removes the pinned animated narrative.
- Graphics context loss and unavailable WebGL restore the local illustration and ordinary readable chapter layout.
- No unexpected browser runtime errors.

### New composition regression suite

`TEST_URL=http://localhost:4173 node scripts/verify-responsive.mjs` passed all five chapter states and the finale in eight configurations:

| Configuration | CSS layout viewport |
|---|---|
| Phone portrait | 390 × 844 |
| Small phone | 360 × 640 |
| Small landscape | 667 × 375 |
| Phone landscape | 844 × 390 |
| Mobile Desktop-site portrait emulation | 980 × 2121, touch, 390 × 844 screen |
| Mobile Desktop-site landscape emulation | 980 × 453, touch, 844 × 390 screen |
| Tablet | 768 × 1024 |
| Desktop | 1440 × 900 |

Assertions check disjoint text/canvas rectangles, complete text/action bounds, no horizontal overflow, a stage no taller than the viewport, an uncropped canvas, and model bounds inside the camera frame. The finale is also checked for text/model separation and framing. Opening, storefront, launch, and finale screenshots were captured; phone, landscape, desktop-site, and desktop closing compositions were visually inspected. Reports and screenshots: ignored `test-results/responsive/`.

**Desktop-site emulation is not proof of behavior on a physical Android/iOS browser.** Actual browser chrome, device GPU behavior, zoom, and browser-specific desktop-mode scaling still warrant device testing.

## Accessibility

Final axe scans at 390 px and 1440 px using WCAG 2 A/AA and WCAG 2.1 A/AA rules: **zero detected violations**. A separate paused-desktop scan also passed. This is not a full manual screen-reader audit or a claim of complete WCAG conformance.

## Lighthouse — current responsive revision

| Category | Mobile | Desktop |
|---|---:|---:|
| Performance | Not scored: capture error | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

The latest mobile run returned `NO_SCREENSHOTS` for Speed Index/filmstrip capture and a navigation-insight error, so **no valid mobile performance score is claimed for this revision**. The previous revision's 99 is not carried forward as a current result. Desktop completed without audit errors: FCP 0.2 s, LCP 0.2 s, TBT 0 ms, CLS 0.002.

Environment: local production preview, headless Chromium, software-rendered WebGL. Reports: ignored `test-results/lighthouse-{mobile,desktop}.{html,json}`. These initial-navigation audits do not measure sustained scroll FPS or physical GPU performance. Unused JavaScript, missing source maps, and main-thread work remain flagged (desktop 2.8 s).

## Launch configuration & limits

- No persistent lead backend is configured. The default inquiry flow prepares and reviews a brief; the visitor must still send it in WhatsApp. Backend delivery cannot be verified without a real trusted service.
- Contact details were retained from the original repository; confirm ownership and accuracy before launch.
- Production is assigned to `https://starterkart-six.vercel.app/`; absolute canonical/social metadata can be configured separately.
- Portfolio examples remain original concepts, not client Shopify stores. Their buttons open honest concept details.
- Screen-reader, physical-device, field-performance, and full external-service delivery checks are not claimed as completed.
