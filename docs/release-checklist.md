# StudentSpace release checklist

React/Vite migration, 23 September 2026. Latest instruction: no database service; Resend sender/recipient advisor@studentspace.com.

## Verified locally

- [x] React 19.3.0, React DOM 19.3.0, Vite 8.3.0 and Tailwind 4.3.3 installed with lockfile; TypeScript passes.
- [x] 38 public routes plus 404 prerender as complete documents, preserving titles, descriptions, structured data, links and redirects.
- [x] Production bundle inspected in browser: 39 routes x 7 widths = 273 checks, no horizontal overflow, missing h1 or hydration failures; no JavaScript errors.
- [x] Required widths: 320, 375, 390, 768, 1024, 1280 and 1440.
- [x] Library search, empty/reset states, React navigation and mobile menu/Escape focus work.
- [x] Mocked form validation focuses errors; provider failure preserves values and unchanged retry succeeds.
- [x] API tests cover type/length validation, allowed reasons, escaping, honeypot, origin restrictions, body limits, provider errors, timeouts, missing configuration and retries.
- [x] API tests additionally cover pre-parsed Vercel bodies, preview recipient safeguards, concurrent retry deduplication and payload conflicts.
- [x] 31 automated API/build tests pass, including rejection of inherited-object contact reason names.
- [x] Private legacy record is unchanged and untracked in the migration index; no persistence or public application endpoint.
- [x] Reduced-motion CSS disables ordinary and View Transition animations.
- [ ] Full screen-reader/real-device audit; automated reduced-motion and no-JavaScript scenarios are included in the browser regression suite.

## GitHub and Vercel

- [x] Fetched repository history and created feature/react-vite-email-only from origin/main without replacing local work.
- [ ] Commit/push migration and open draft PR; attach CI evidence.
- [ ] Configure main protection: required PR and passing verify check, up-to-date checks, no force push/deletion.
- [ ] Connect Vercel project to the selected repository; verify PR previews and main deployment settings.
- [ ] Configure edge POST /api/apply rate limiting (5/IP/10 minutes) and test before setting EDGE_RATE_LIMIT_CONFIGURED=true.
- [ ] Configure verified sender, API key and a separate preview recipient. No secrets belong in public VITE_ settings.
- [ ] Confirm preview health, submission acceptance, retries, origin rejection, 404, redirects, CSP and noindex on the hosted URL.
- [ ] Verify preview requests cannot send to production recipients.

The GitHub connector lacks branch-protection administration. The Vercel deployment connector reports its deployment tool unavailable, and the local CLI is logged out. Computer Use also failed to initialize on 23 September ("failed to write kernel assets"); the browser evidence above was collected before that runtime failure. Hosted configuration must use an authorized CLI/browser account; neither a database nor a paid-plan upgrade is required by the code. Confirm any platform billing before resource purchases.

## Content and launch gates

- [ ] Approve privacy/retention notice, website terms and privacy-request procedure.
- [ ] Confirm historical claims and all contact details. Keep current leadership, licenses, dates and release links unpublished until confirmed.
- [ ] Record existing domain configuration and last known-good deployment for rollback.
- [ ] Run npm ci, npm run check, npm test, npm run build and npm run test:browser.
- [ ] Set production SITE_URL, Resend configuration, edge-protection acknowledgement and CONTENT_APPROVED=true after review.
- [ ] Complete an authorized hosted preview submission before merging to main.
- [ ] After release, verify production indexing and separately inspect provider delivery events/inbox receipt.

## Recovery

On email failures, keep user-entered values and reuse the same key for unchanged retries within the documented window. Do not invent a saved application or background retry. Inspect the Resend dashboard without logging messages. Roll back frontend and API to the same verified Vercel deployment. Never restore JSON persistence or the public application listing.

The local legacy record remains private and unchanged; old Git copies remain in history. No record import or history rewrite is included.
