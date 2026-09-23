# StudentSpace

React 19.3, Vite 8.3, TypeScript and Tailwind 4.3. Vercel hosts prerendered pages and the email-only Node API. **No database, queue, scheduled worker or applicant dashboard.** Resend acceptance is required before the form reports success.

## Run locally

Use Node **24.21.0** (recorded in .nvmrc), then run:

```powershell
npm ci
npm run dev
```

Open http://127.0.0.1:5173. Vite and the API share that address. Stop with Ctrl+C. Vite reloads React/CSS edits; restart after changing source content, configuration or API code. If the port is occupied, set PORT and matching ALLOWED_ORIGINS in .env.

Copy .env.example to .env and configure Resend to send real messages. The sender and recipient are advisor@studentspace.com; the sender must be verified in Resend. Without a key, the website works and submissions return an honest unavailable response. Never paste secrets into source code, logs or VITE_ variables.

| Command | Purpose |
| --- | --- |
| npm run check | Generate approved content and run TypeScript checks |
| npm test | API, prerendering, routing, SEO and privacy boundary tests |
| npm run build | Vite bundle and 39 complete HTML documents in dist |
| npm run preview | Serve the production build and real API locally on 5173 |
| npm run test:browser | Playwright regression suite using only a local mock provider |
| npm run check:release | Validate production configuration and content approval |
| npm run config:vercel | Inspect hosting settings without displaying credentials |

Browser tests require `npx playwright install chromium`; CI installs the browser automatically. Production builds remain independent of real email credentials for preview review, while production deployment runs the release gate.

## Architecture

- app: React document, client hydration, prerender entry and CSS-first Tailwind tokens.
- components: navigation, footer, transitions, library filtering and useActionState/useOptimistic form.
- src/content.js: reusable published content, history, sources and redirects. src/pages.js composes reviewed editorial markup; shared prose helpers remain in src/templates.js.
- scripts/prepare.cjs: publishes only public page content into generated data. PageContent converts editorial markup into React elements and replaces interactive regions with components. It does not inject whole-page HTML.
- lib/api.cjs: shared email-only API implementation; api/apply.ts and api/healthz.ts are Vercel adapters. server.js is a local compatibility entry.
- scripts/build.mjs: Vite assets and React server rendering for every route. All page content is present without JavaScript; React Router enhances navigation.
- vercel.cjs and src/hosting.js: clean URLs, legacy redirects, headers and API configuration. There is no catch-all SPA rewrite.

The root HTML prototypes and older briefs are historical references, excluded from deployment. Never serve the workspace root as a static site.

## Vercel setup

Use repository NihalSoftware/StudentSpace.com and the feature branch feature/react-vite-email-only. Connect a Vercel project to GitHub, framework Vite, Node 24.x, install `npm ci`, output `dist`. The programmatic configuration selects `npm run build` for previews and `npm run check:release && npm run build` for production. Vercel manages Node minor/patch releases.

| Server setting | Purpose |
| --- | --- |
| RESEND_API_KEY | Secret, scoped separately to Production and Preview |
| RESEND_FROM_EMAIL | advisor@studentspace.com; verify domain/sender in Resend |
| NOTIFY_EMAIL | Production recipient; defaults to advisor@studentspace.com |
| PREVIEW_NOTIFY_EMAIL | Separate test inbox required in Preview; production addresses are refused |
| SITE_URL | Approved HTTPS canonical origin |
| ALLOWED_ORIGINS | Additional exact approved origins, comma separated; no wildcards |
| EDGE_RATE_LIMIT_CONFIGURED | true only after applying the Vercel Firewall rule below |
| CONTENT_APPROVED | true in Production only after company policy/content approval |

Exact VERCEL_URL and VERCEL_BRANCH_URL origins are added from Vercel's trusted environment. Production SITE_URL is also allowed. Browser calls stay same-origin at /api/apply; no PUBLIC_API_BASE_URL or Render service is used. Public config contains only canonical/indexing settings, year and asset paths.

Configure an edge Firewall rate-limit rule for **POST /api/apply**, keyed by client IP, **5 requests per 10 minutes**, returning 429. Cover preview aliases and production. Check the current team plan supports the rule before launch; no plan upgrade has been purchased. The API also keeps bounded per-instance counters, which reset on cold starts and are supplementary, not a global limit. Email readiness on Vercel fails closed until the edge-rule setup is acknowledged with EDGE_RATE_LIMIT_CONFIGURED=true. Test the actual rule before setting that flag.

Preview forms cannot fall back to a production inbox. Missing preview recipient, email key or abuse configuration gives 503. Previews always use noindex metadata, robots exclusion and X-Robots-Tag. A production test must separately verify provider acceptance and inbox receipt; readiness alone proves neither sender verification nor delivery.

GitHub main protection: require pull requests and the `verify` CI status, require up-to-date checks, prevent force pushes and deletion. The connector returned 403 for branch-protection management; account administration is still required if no authorized CLI session is available. Do not merge until hosted preview verification succeeds. Git integration then deploys merged main automatically.

## API and retries

POST /api/apply accepts JSON or URL-encoded bodies up to 16 KiB. Required: name (120), email (254), intent (40), message (5000 characters). Optional: city (120), organization (160), product slug (80), legacy reason (80), empty honeypot website (200). Allowed intents and existing reason values are retained. No student records or eligibility documents are requested.

Success is `{ "success": true, "id": "<Resend-id>", "message": "Your message has been submitted." }`. It means provider acceptance, not inbox delivery or application approval. Failure is `success:false` with a safe message and field errors where applicable. Codes: 400 validation/spam, 403 origin, 405 method, 409 idempotency conflict, 413 size, 415 format, 429 rate limit, 503 missing configuration/provider failure/timeout.

UUIDv4 Idempotency-Key is forwarded to Resend. Unchanged retries reuse the same key and payload in the open page. Concurrent deduplication and changed-payload conflicts are enforced by Resend, including across Vercel instances. There is no local record of sends. Resend's deduplication window is 24 hours; the UI stops unchanged retries after 23 hours and asks the visitor to contact the company. Editing content or reloading starts a new submission. Values and keys are held in page memory only; no localStorage persistence. Older clients without a key still work but do not gain cross-request deduplication.

No success is shown during optimistic feedback. Failure keeps values; acceptance disables repeated submission while leaving a receipt visible. There is no background retry worker because the site stores no requests. A disconnected visitor must retry from the open page or contact the company. GET /api/applications stays removed. /api/healthz and /healthz return generic 200/503 readiness without credentials or records.

## Diagnostics and rollback

For 503, check configuration without printing secrets. Inspect Resend authentication, sender verification, quota and events in its dashboard. For 403, compare the actual origin to approved origins. For 409, wait and retry unchanged. For 429, wait for the window and inspect the Firewall rule. If accepted mail is missing, check delivery/bounce events and spam handling using its provider ID. Logs must never include form bodies.

Record the last verified Vercel deployment and Git commit before rollout. Roll back the entire frontend/API deployment together, then check health, origin rejection and a test submission. No database migration exists. Do not roll back to JSON persistence or the unauthenticated application-listing API.

## Private records and remaining confirmations

The local data/applications.json is preserved byte-for-byte and removed from the new Git index. Historical Git commits already contain a copy; this migration does not rewrite history. Keep private backups outside source control. Both deployment exclusion and a build asset whitelist prevent publishing it.

Leadership biographies, licenses, release links, detailed eligibility/deadlines and approved privacy/retention terms remain in the internal confirmation register. Public pages state availability honestly. Email-only does not mean no storage: Resend and mailboxes may retain messages; Vercel processes request metadata.

See docs/website-redesign-plan.md, docs/design-system.md, docs/content-guidelines.md and docs/release-checklist.md for the migration and evidence.
