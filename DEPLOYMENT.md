# Starterkart on Vercel

- Vercel project: `starterkart`
- Assigned production domain: `https://starterkart-six.vercel.app`
- Source commit: `7b1e11d3edd59f62e33a901b04ef68945ee30ec7`
- Source branch: `arena/9d57a8c0-starter-kartt`
- Source repository: `dawar-tariq/Starter-kartt`
- Deployment ID: `dpl_3h7PNXQYcR88tb3CacehqJsbzQvF`

## Deployment method

The Vercel account rejected repository linking because its GitHub Login Connection was missing. To publish without accessing credentials, this deployment uses a small Vercel build wrapper that:

1. Downloads the public repository archive pinned to the exact source commit above.
2. Verifies its SHA-256 digest: `f624e411b33f9acd46a5d5db6f6cfa970ac2a8a070deabebc84557558b4670eb`.
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
