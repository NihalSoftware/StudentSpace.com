# StudentSpace release checklist

React/Vite migration, 23 September 2026. Latest instruction: no database service; Resend sender/recipient advisor@studentspace.com.

## Verified locally

- [x] React 19.3.0, React DOM 19.3.0, Vite 8.3.0 and Tailwind 4.3.3 installed with lockfile.
- [x] JavaScript/JSX conversion [passed CI](https://github.com/NihalSoftware/StudentSpace.com/actions/runs/35825204482) on commit 9e18e56: syntax checks for 34 project files, 31 API/build tests and five browser scenarios after removing TypeScript source and tooling.
- [x] Original 38 public routes preserved; the Projects overview adds /projects, for 39 public routes plus 404. /Projects redirects permanently to the overview.
- [x] Current production bundle checked in CI: 40 documents x 7 widths = 280 checks, no horizontal overflow, missing h1 or hydration failures; no JavaScript errors.
- [x] Required widths: 320, 375, 390, 768, 1024, 1280 and 1440.
- [x] Library search, empty/reset states, React navigation and mobile menu/Escape focus work.
- [x] Mocked form validation focuses errors; provider failure preserves values and unchanged retry succeeds.
- [x] API tests cover type/length validation, allowed reasons, escaping, honeypot, origin restrictions, body limits, provider errors, timeouts, missing configuration and retries.
- [x] API tests additionally cover pre-parsed Vercel bodies, preview recipient safeguards, concurrent retry deduplication and payload conflicts.
- [x] 32 automated API/build tests pass, including Projects content, menu destinations and uppercase redirect behavior.
- [x] Private legacy record is unchanged and untracked in the migration index; no persistence or public application endpoint.
- [x] Reduced-motion CSS disables ordinary and View Transition animations.
- [x] [Projects CI passed](https://github.com/NihalSoftware/StudentSpace.com/actions/runs/35850894710): six browser scenarios cover all 40 documents at seven widths, all documents without JavaScript, back/forward navigation, mobile Escape/focus, reduced-motion navigation, provider failure/timeout retries and private-file 404 checks. The Projects disclosure is additionally checked at 1007px to match the supplied browser comment.
- [ ] Full screen-reader/real-device audit.

## GitHub and Vercel

- [x] Fetched repository history and created feature/react-vite-email-only from origin/main without replacing local work.
- [x] Initial migration was reviewed in [PR #1](https://github.com/NihalSoftware/StudentSpace.com/pull/1), now closed. Projects changes are on the user's active Codex branch; the closed review was not reopened.
- [x] Configure main protection: required PR and passing verify check, up-to-date checks, no force push/deletion, including administrators.
- [x] Previous migration baseline: [GitHub CI passed](https://github.com/NihalSoftware/StudentSpace.com/actions/runs/35823699487) on commit 41e1050, before the JavaScript-only conversion. Reverify the conversion separately.
- [ ] Connect Vercel project to the selected repository; verify PR previews and main deployment settings.
- [ ] Configure edge POST /api/apply rate limiting (5/IP/10 minutes) and test before setting EDGE_RATE_LIMIT_CONFIGURED=true.
- [ ] Configure verified sender, API key and a separate preview recipient. No secrets belong in public VITE_ settings.
- [ ] Confirm preview health, submission acceptance, retries, origin rejection, 404, redirects, CSP and noindex on the hosted URL.
- [ ] Verify preview requests cannot send to production recipients.

The GitHub connector lacked write permissions, so the existing authorized Git credential was used to create the PR and configure branch protection. The Vercel deployment connector reports its deployment tool unavailable, and the local CLI is logged out. Computer Use also failed to initialize on 23 September ("failed to write kernel assets"); the local browser evidence above was collected before that runtime failure. Hosted configuration must use an authorized CLI/browser account; neither a database nor a paid-plan upgrade is required by the code. Confirm any platform billing before resource purchases.

## Content and launch gates

- [ ] Approve privacy/retention notice, website terms and privacy-request procedure.
- [ ] Confirm historical claims and all contact details. Keep current leadership, licenses, dates and release links unpublished until confirmed.
- [ ] Record existing domain configuration and last known-good deployment for rollback.
- [x] Run npm ci, npm run check, npm test, npm run build and npm run test:browser in GitHub CI.
- [ ] Set production SITE_URL, Resend configuration, edge-protection acknowledgement and CONTENT_APPROVED=true after review.
- [ ] Complete an authorized hosted preview submission before merging to main.
- [ ] After release, verify production indexing and separately inspect provider delivery events/inbox receipt.

## Recovery

On email failures, keep user-entered values and reuse the same key for unchanged retries within the documented window. Do not invent a saved application or background retry. Inspect the Resend dashboard without logging messages. Roll back frontend and API to the same verified Vercel deployment. Never restore JSON persistence or the public application listing.

The local legacy record remains private and unchanged; old Git copies remain in history. No record import or history rewrite is included.
