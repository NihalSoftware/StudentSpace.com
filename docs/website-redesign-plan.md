# StudentSpace website redesign

## Approved direction

The implementation plan approved in this task supersedes conflicting copy and design requirements in Agents.md and the older build prompts. StudentSpace remains a for-profit company. The two paths are a live education-planning application and an upcoming technology-sharing initiative for New Mexico builders.

- Frontend: React 19.3, Vite 8.3 and Tailwind 4.3, prerendered on Vercel.
- Backend: Node.js 24 Vercel Functions; email through Resend only.
- No new application database, dashboard, eligibility decisions, or code-distribution service.
- EdPlan: https://edplan.vercel.app/home.
- Institution-specific portal: https://www.studentspace.ai/NNMC.

## Audit, 19 September 2026

The local workspace is not currently a Git repository. It contains a dependency-free Node server, public HTML/CSS/JavaScript, two identical root HTML prototypes, older planning documents, and one existing local application record. The application record was inspected only for count and field names. It must remain unchanged and excluded from Git and deployment uploads.

The old client switches hidden views and changes metadata after JavaScript loads. The server returns the same document with status 200 for unknown GET requests. There is no production build, sitemap, canonical metadata, automated verification, or hosting configuration.

The old backend writes applications to a local JSON file, exposes them through an unauthenticated GET endpoint, permits every CORS origin, logs contact information when email is unconfigured, and reports success despite failed or simulated delivery. These behaviors will be removed.

The local prototype has reusable typography, restrained borders, and a mesa illustration. It also publishes unconfirmed availability, eligibility, licensing, and leadership assertions. Turquoise text on the existing sand surface has insufficient contrast for normal text; use dark teal for light-surface links.

The deployed studentspace.com site is a separate Wix-based legacy site, emphasizing institutional software and demo requests. Its history, product explanations, and customer stories are useful source material. This workspace is not its source code. Browser checks confirmed the two supplied EdPlan URLs load; this is not verification of authenticated workflows or statewide availability.

## Content disposition

| Material | Treatment |
| --- | --- |
| 1998 founding, New Mexico roots, company-reported 250+ institutions | Keep with company-source attribution |
| Full Circle Tracking, SchoolView, ASL descriptions | Rewrite for historical product pages and upcoming technology library |
| Santa Fe Community College, Rio Grande, Timothy, Ana G. Mendez stories | Move to historical work; avoid current-partner claims |
| Existing CSR/foundation material | Preserve as historical context; distinguish it from the company |
| Demo-led homepage, global-services sales pitch | Archive context; remove from primary journey |
| Current leadership placeholder titles and biographies | Remove from public cards until confirmed |
| Unconfirmed licenses, deadlines, immediate code access, royalties | Replace with honest pending-availability statements |
| Duplicate root prototypes and older planning documents | Retain locally as reference; exclude from deploys |
| Existing local application record | Preserve privately, without deployment or Git inclusion |

## Source register

- https://www.studentspace.com/ — company history and self-reported institution count.
- https://www.studentspace.com/general-8 — company overview.
- https://www.studentspace.com/full-tracking — historical Full Circle capabilities.
- https://www.studentspace.com/school-view-2020 — historical reporting capabilities.
- https://www.studentspace.com/assess — assessment product history.
- https://www.studentspace.com/santa-fe — Santa Fe Community College historical account.
- https://www.studentspace.com/rio-grande — Rio Grande historical account.
- https://www.studentspace.com/timothy — Timothy historical account.
- https://www.studentspace.com/ana-g-mendez-university — Ana G. Mendez historical account.
- https://www.studentspace.com/general-8-3 — historical CSR context.
- https://www.studentspace.com/general-8-1 — historical contributors; not confirmation of current titles.
- https://www.studentspace.com/contact — office, telephone, general/support email.

## Architecture and phases

1. Record this audit, source register, content decisions, and release dependencies.
2. Create shared templates, structured content, a deterministic static build, navigation, and homepage.
3. Complete mission, EdPlan, story, legacy product and institutional material.
4. Complete libraries, detail pages, audience pathways, participation and policy information.
5. Replace persistence with validated email-only submissions and honest failure handling.
6. Verify generated routes, redirects, SEO, privacy boundaries, API scenarios and responsive browser behavior; prepare Vercel frontend and function configuration.

The build generates one document per route plus a genuine 404. React hydrates the complete documents, adding client navigation, View Transitions, filtering and action-based forms. Same-origin Vercel Functions handle email only. Public configuration contains approved URLs, indexing state, year and asset paths.

## Redirect policy

Redirect old local routes to the new equivalents. Retain the three existing /products/ detail URLs. Redirect legacy Wix product URLs to those product pages, company/about URLs to story, giving-back to mission, customer stories to individual historical pages, and services to a historical-services page. The route manifest is the single source of truth for local preview and Vercel redirects. Unknown URLs return 404 instead of the homepage.

## Confirmation register

| Item | Interim public behavior | Needed before activation |
| --- | --- | --- |
| Technology licenses and release URLs | No downloads or rights promises | Approved per-release terms and cleared resources |
| Eligibility evidence and deadlines | Expressions of interest; no acceptance claims | Business-approved participation rules |
| Current leadership | Company-level accountability and contact details | Approved names, titles, biographies and photographs |
| New impact metrics | Reporting begins as projects launch | Dated evidence and approved definitions |
| 250,000 students metric | Omitted | Verified source and reporting period |
| Mentorship or founder-time commitment | No guaranteed allocation | Confirmed scope and capacity |
| Privacy/website terms | Factual operational notices with pending details | Business/legal review, retention and contact procedure |
| Hosting resources | Deployment configuration and local verification | Vercel project, GitHub integration, branch protection and edge abuse rule |
| Production email | Honest unavailable response when unconfigured | Resend key, verified sender and confirmed recipient inboxes |

No production domain, live application, or legacy website is to be changed simply to complete local verification. Preview/staging validation must precede a production rollout.

## React/Vite migration, 22 September 2026

The latest instruction explicitly removes the database from the earlier proposed migration. No Neon, Postgres, outbox, Cron worker or database-failure behavior is implemented. Email success again means Resend acceptance. The confirmed sender and default recipient are advisor@studentspace.com; previews require a separate test inbox.

The 19 September audit above is historical. This workspace is now linked to NihalSoftware/StudentSpace.com and has a feature branch preserving remote history. The existing local record is unchanged and removed from the branch index; historical Git copies are not purged.

Implementation order: React document/build and shared components; form/actions and Vercel adapters; API regression and seven-width browser checks; deployment guards and documentation; draft PR and hosted preview verification. Production rollout remains gated on configured email, edge abuse protection, approved content and a successful hosted preview.

Editorial page HTML is retained as reviewed source material and parsed into React elements. Interactions are React components; the build serializes only published page content. Tailwind theme tokens and existing design rules live together in app/globals.css.

## JavaScript language update, 23 September 2026

The latest instruction replaces TypeScript with JavaScript throughout the React application, API functions, build configuration and browser tests. React components use JSX; Node helpers use JavaScript modules. The TypeScript compiler, direct type-only development dependencies and tsconfig are removed. `npm run check` now validates JavaScript/JSX syntax with Vite's parser. Build and behavior tests remain required.
