# Starterkart on Vercel

- Vercel project: `starterkart`
- Assigned production domain: `https://starterkart-six.vercel.app`
- Source commit: `b80e8ce05fe722b2caa2bff6afcbbb0d4b73be52`
- Source branch: `arena/9d57a8c0-starter-kartt`
- Source repository: `dawar-tariq/Starter-kartt`
- Deployment ID: `dpl_2g4bdZt1t2NDGZpUqVEGT3jfNkMd`
- Verified status: `READY` / `PROMOTED`, production alias assigned with no alias error.
- Public production URL fetched successfully after promotion.

## Responsive update

This revision separates HTML copy and WebGL into independent responsive regions, removes oversized minimum stage heights, fits the camera to transformed model bounds, and refines the camera/ambient/finale choreography. Local production checks passed 40 chapter states plus eight finale compositions, including emulated mobile Desktop-site portrait and landscape, alongside the existing seven-width interaction/fallback/axe regression suite. Physical-device testing is not claimed. See `VERIFICATION.md` for current results and audit limits.

## Deployment method

The Vercel account rejected repository linking because its GitHub Login Connection was missing. To publish without accessing credentials, this deployment uses a small Vercel build wrapper that:

1. Downloads the public repository archive pinned to the exact source commit above.
2. Verifies its SHA-256 digest: `810c05f998c11c12f2d68d72f12b3aaae67758fc1d7cf42df0b9039041c58306`.
3. Extracts the source, runs `npm ci --include=dev`, then `npm run build` on Node 22.
4. Publishes only the generated `dist` assets.

The wrapper is stored with the Vercel deployment. It does not change the application source, expose secrets, or depend on a moving branch reference.

## Future updates

**Git pushes do not automatically update this deployment.** Redeploying this particular wrapper will rebuild the pinned commit, not the newest branch contents.

For automatic deployments, restore the GitHub Login Connection in Vercel account settings, connect this repository to the `starterkart` project, select the intended production branch, and use the normal repository settings:

- Framework: Vite
- Install: `npm ci`
- Build: `npm run build`
- Output: `dist`

Alternatively, create a new direct deployment pinned to the new commit and its verified archive digest.

The project remains in the honest WhatsApp inquiry mode; no lead database or persistent submission endpoint has been configured. The existing separate `starter-kartt` Vercel project was not renamed or replaced.
