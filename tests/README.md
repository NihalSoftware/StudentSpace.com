# QA regression tests

Run `npm ci` and `npx playwright install chromium`, then `npm test` and `npm run lint` (Node.js 20+). On a Windows machine with Microsoft Edge installed, use `$env:PLAYWRIGHT_CHANNEL='msedge'` before `npm test` instead of downloading Chromium.

The Node test runner launches the actual server from a temporary copy, with synthetic data and no live email credentials. Tests check browser feedback, validation, API responses, and saved synthetic records. External browser requests are blocked. The temporary directory is removed after the suite. Existing application data is never read or changed.

`npm run lint` checks JavaScript syntax and merge conflict markers; the repository did not have an existing linter or test suite. It is not an ESLint or HTML accessibility audit.
