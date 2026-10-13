[junglestar.org](https://junglestar.org) — static Astro site, hosted on Cloudflare Workers (static assets).

[![Live](https://img.shields.io/website?url=https%3A%2F%2Fjunglestar.org&label=junglestar.org&up_message=online&down_message=down)](https://junglestar.org)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
![Astro](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-60A5FA?logo=biome&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white)
![Node](https://img.shields.io/badge/Node-24.15.0-5FA04E?logo=nodedotjs&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8?logo=pwa&logoColor=white)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey?logo=creativecommons&logoColor=white)](#warning)

---

## Warning

Despite this repo being public, it doesn't mean that all these assets, nor the concept, are open-source and/or copyright free, or even that you may use any of them. In fact they are released under CC-BY-NC-SA [Creative Commons License](https://creativecommons.org/licenses/by-nc-sa/4.0/).
We answer you, please, ask for permission first by contacting us: info@junglestar.org
All photos & videos © 2025–2026 Rokma. All rights reserved.
Thanks,
Junglestar team.

---

## CREDITS

A complete list of © credits is coming soon! (Feather, ...)
Including all the icons used here and the respective [creators](https://thenounproject.com/creator/rokma/) on [thenounproject](https://thenounproject.com/creators/)

1.ASTRO FRAMEWORK

Commands (pnpm only, Node 24.15.0)

| Command          | Action                                                         |
| :--------------- | :------------------------------------------------------------- |
| `pnpm install`   | Install dependencies (needs sibling `../bookbat` repo)         |
| `pnpm dev`       | Dev server at `localhost:4321`                                 |
| `pnpm covers`    | Cache `/books` covers → `public/book-covers/` (add-only)       |
| `pnpm build`     | Production build to `./dist/` (runs `covers` first)            |
| `pnpm preview`   | Preview the build locally                                      |
| `pnpm format`    | Biome format `src`                                             |
| `pnpm lint`      | Biome lint `src`                                               |
| `pnpm deploy:cf` | Build + `wrangler deploy` to Cloudflare — see [DEPLOY.md](DEPLOY.md) |

👀 Learn more? Feel free to check [Astro documentation](https://docs.astro.build) or jump into Astro [Discord server](https://astro.build/chat).

2.DESIGN & CONCEPT

Yes, we done this. Check what we do here: [JUNGLESTAR](https://junglestar.org)
