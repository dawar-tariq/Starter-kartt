# Verification record — scroll-driven revision

Date: 31 October 2026. Tested against a local Vite **production build**, served on port 4173. These are local lab measurements, not guarantees for the deployed site or physical-device animation performance.

## What changed

The isolated 3D hero has been replaced by a continuous, five-chapter native-scroll narrative:

1. Opening shopping sculpture inside original architectural arches.
2. Brand exploration: rotation, separated handles, and material studies.
3. Experience: the sculpture flattens into a storefront; device panels unfold, a procedural garment appears, and the camera pushes through the transition.
4. Commerce: payment, shipping, and ordering elements connect through animated routes.
5. Launch: the camera pulls back to show the assembled commerce environment.

Every transformation reverses when scrolling backward. Chapter buttons scrub the actual scene progress. A skip link and ambient-motion pause are available. The desktop portfolio is now a scroll-driven perspective gallery, the editorial sections have connected motion, and the sculpture returns as real 3D in the finale. Reduced-motion and graphics-failure modes render the complete story as ordinary readable sections instead of retaining a long empty pinned area.

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

Desktop chapter states, mobile opening/storefront states, tablet framing, perspective gallery, and the closing scene were inspected as rendered screenshots. Refinements included removing an artificial ground-plane intersection that clipped the mobile object, tablet-specific camera framing, keeping actions above the canvas, and correcting chapter/pause accessible names.

## Accessibility

Final axe scans at 390 px and 1440 px using WCAG 2 A/AA and WCAG 2.1 A/AA rules: **zero detected violations**. A separate paused-desktop scan also passed. This is not a full manual screen-reader audit or a claim of complete WCAG conformance.

## Lighthouse — current revision

Both latest runs completed without audit errors:

| Category | Mobile | Desktop |
|---|---:|---:|
| Performance | 99 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

| Collected lab metric | Mobile | Desktop |
|---|---:|---:|
| First contentful paint | 0.8 s | 0.2 s |
| Largest contentful paint | 2.3 s | 0.2 s |
| Total blocking time | 0 ms | 0 ms |
| Cumulative layout shift | 0.007 | 0.005 |

Environment: local production preview, headless Chromium, software-rendered WebGL. Reports are retained in ignored `test-results/lighthouse-{mobile,desktop}.{html,json}`.

**These Lighthouse scores measure initial navigation, not sustained scrolling frame rate or GPU performance.** The audit still flags unused JavaScript, missing source maps, and main-thread work (13.6 s mobile / 3.2 s desktop across the captured trace). Physical Android/iOS hardware and real deployed HTTPS/network testing remain necessary before making real-user smoothness or performance claims. The previous design's audit results are superseded by this record.

## Launch configuration & limits

- No persistent lead backend is configured. The default inquiry flow prepares and reviews a brief; the visitor must still send it in WhatsApp. Backend delivery cannot be verified without a real trusted service.
- Contact details were retained from the original repository; confirm ownership and accuracy before launch.
- The final domain is still needed for canonical and absolute social metadata URLs.
- Portfolio examples remain original concepts, not client Shopify stores. Their buttons open honest concept details.
- Screen-reader, physical-device, field-performance, and full external-service delivery checks are not claimed as completed.
