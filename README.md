# Starterkart

An original fashion-focused commerce studio website, built with React 19, TypeScript, Vite, React Three Fiber, Three.js, and GSAP.

## Run

```sh
npm ci
npm run dev -- --host 0.0.0.0
npm run build
npm run preview -- --host 0.0.0.0
```

`npm run build` includes strict TypeScript checking. The production output is `dist/`. The page uses native anchor navigation, so no SPA rewrite rules are required beyond serving `index.html` at the root. Deploy at the domain root; update Vite's `base` if deploying under a subdirectory.

## Design & content

- `src/data/site.ts`: business contact configuration, navigation, services, stages, process, and projects.
- `src/components/ExperienceJourney.tsx`: a five-chapter native-scroll, sticky 3D narrative. GSAP scrubs HTML transitions; a shared progress ref drives the Three.js world without scroll-driven React rendering.
- `src/data/journey.ts`: configurable chapter headlines and explanatory copy.
- `src/components/scene3d/CommerceScene.tsx`: camera choreography, object-to-storefront transformation, lighting, unfolded device panels, and connected commerce routes.
- `ShoppingSculpture.tsx`, `WorldParts.tsx`, and `FinaleScene.tsx`: original reusable procedural geometry and the closing sculpture. No model download or remote environment texture.
- `src/hooks/useProjectGallery.ts`: desktop scroll-driven, perspective portfolio gallery. Mobile/reduced-motion modes use the regular stacked layout.
- `src/styles-journey.css`: cinematic composition, chapter controls, tablet/mobile framing, static fallback, and gallery styles.
- `src/components/sections/`: independent page sections.
- `src/lib/inquiries.ts`: validation, message formatting, and optional backend submission interface.
- `src/index.css`: responsive design system and reduced-motion styles.
- Fonts are self-hosted via Fontsource. Original SVG portfolio illustrations are clearly labelled **concept projects**, not client commissions. There are no fabricated clients, results, prices, or testimonials.
- The phone, email, and Instagram values were retained from the repository's original Contact/Footer components. Confirm these with the owner before publishing.

## Inquiry behavior

### Default: no backend required

The form validates the full brief, displays a review, and opens the configured business WhatsApp with an encoded message. The visitor must press **Send in WhatsApp**. The website never claims that merely preparing or opening a message is a successful submission. The brief can also be downloaded as a text file. Form data is not saved in local storage or sent to a server in this mode.

### Optional persistent submissions

Set `VITE_INQUIRY_ENDPOINT` before building to enable direct submission. This is a **public endpoint URL**, not a secret. The client sends a JSON `POST` with the `Inquiry` shape in `src/lib/inquiries.ts` and a 15-second timeout. Success requires both a successful HTTP response and JSON `{ "success": true }` from the trusted backend. Other results preserve the entered fields and display an error with a direct WhatsApp alternative.

**No lead backend is included or configured.** Do not enable the URL until the service is ready. The service must:

1. Validate types, lengths, email, and allowed options again on the server.
2. Rate-limit submissions and implement server-side spam/bot protection. The client honeypot is only a lightweight deterrent in draft mode, not a security boundary.
3. Restrict CORS to your production origin; enforce HTTPS; limit request sizes.
4. Store inquiries securely, avoid logging sensitive payloads, and define retention/deletion rules.
5. Keep database keys on the server; if using Supabase, use RLS to deny anonymous reads and updates, and do not expose a privileged service key.
6. Return `{ "success": true }` only after the record or delivery is actually accepted.
7. Update the privacy notice to name the real processor and retention practices.

## Accessibility & graphics resilience

Essential text and actions are HTML, independent of WebGL. Local SVG artwork remains visible while the lazy 3D bundle loads, when WebGL is unavailable, if the scene throws, or if the graphics context is lost. Reduced-motion preferences are observed dynamically. Rendering pauses offscreen, mobile/tablet pixel ratio and environment resolution are reduced, and no post-processing pipeline is used. The ambient-motion pause switches the main scene to demand rendering; scroll still moves the camera and object states. Visitors can skip the entire journey, jump between chapters, and reverse all transformations by scrolling back. Reduced-motion and no-WebGL modes turn the pinned narrative into ordinary readable sections instead of leaving an empty scroll tunnel.

The mobile menu supports Escape, a Tab focus loop, visible focus, and focus return. Project details and the privacy notice use native modal dialogs. Services use native details/summary. Validation associates errors with labels and focuses the first invalid field.

## Verify

With the production preview running on port 4173:

```sh
npm test
npm run audit
```

`TEST_URL` can override the default. The scripts use Playwright, axe, Lighthouse, and a dev-only packaged Chromium. In a standard environment you may adapt `scripts/browser.mjs` to use your installed browser. Reports are written to ignored `test-results/`.

See `VERIFICATION.md` for the actual results and limits. Desktop and mobile audits are local lab measurements, not promises of real-user performance.

## Before production launch

- Confirm business contact details retained from the original repository.
- Supply the final domain. Add an absolute canonical URL and absolute Open Graph image URL in `index.html`; no domain has been invented. The social image is available at `public/images/social.png`.
- Keep WhatsApp mode, or implement and secure the lead endpoint described above.
- Replace concepts with licensed real project assets when available; keep the concept labels until then.
- Re-run Lighthouse on the deployed HTTPS site and test on physical Android/iOS devices. Software WebGL in the sandbox is not representative of device GPU performance.
- Configure host-level compression, immutable caching for hashed assets, and appropriate security headers. The shared lazy Three.js bundle is approximately 1 MB before compression (~273 KB gzip); it remains the primary JavaScript performance cost.
