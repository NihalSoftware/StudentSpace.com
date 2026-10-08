# StudentSpace Website

Public-facing website for StudentSpace, its New Mexico initiatives, Startup Access, and education technology products. It includes company and program information, client stories, product pages, a dashboard playground, and two contact/application workflows.

This repository implements the website and intake APIs. It does not contain the underlying Full Circle Tracking, SchoolView, ASL, or edplan.ai products, a student account system, or live institutional analytics.

> Before collecting real personal information, review [Security and data privacy](#security-and-data-privacy). The current server exposes submitted records through unauthenticated read endpoints and logs submission details.

## Contents

- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Run locally](#run-locally)
- [Configuration](#configuration)
- [Pages and routes](#pages-and-routes)
- [Frontend and design](#frontend-and-design)
- [API reference](#api-reference)
- [Storage and email](#storage-and-email)
- [Editing the website](#editing-the-website)
- [Verification and troubleshooting](#verification-and-troubleshooting)
- [Deployment](#deployment)
- [Security and data privacy](#security-and-data-privacy)
- [Known limitations](#known-limitations)
- [License](#license)

## Architecture

| Layer | Implementation |
| --- | --- |
| Server | Node.js built-in `http`, `https`, `fs`, `path`, and `crypto` modules |
| Frontend | HTML, CSS, and vanilla browser JavaScript |
| Navigation | History API router; all page views share one HTML document |
| Persistence | Two JSON-array files in `data/` |
| Email | Optional Resend HTTPS request for contact applications |
| Fonts | Space Grotesk and Libre Franklin via Google Fonts, with system fallbacks |
| Build step | None; source files are served directly |
| Dependencies | No runtime or development dependencies declared in the current `package.json` |

There is no React, Express, database service, or bundler in the current application. Extra packages in a developer's local `node_modules/` directory are not declared project dependencies.

    Browser â†’ Node HTTP server â†’ public/index.html, CSS, JavaScript and images
    Contact form â†’ POST /api/apply â†’ applications.json â†’ optional Resend notification
    Startup form â†’ POST /api/startup-access â†’ startup_access_applications.json

The server serves files from `public/`. For page requests, it returns the HTML shell; `public/app.js` selects the active view and updates its title and description.

## Project structure

    StudentSpace.com/
    â”œâ”€â”€ package.json                  # Metadata and start/dev scripts
    â”œâ”€â”€ package-lock.json             # npm lockfile
    â”œâ”€â”€ server.js                     # HTTP server, APIs, storage, email
    â”œâ”€â”€ readme.md                     # This documentation
    â”œâ”€â”€ data/
    â”‚   â”œâ”€â”€ applications.json         # Contact / Give Back submissions
    â”‚   â””â”€â”€ startup_access_applications.json
    â””â”€â”€ public/
        â”œâ”€â”€ index.html               # All views, forms, header and footer
        â”œâ”€â”€ app.js                   # Router, menus, tabs, FAQ and form handlers
        â”œâ”€â”€ style.css                # Shared tokens, components and responsive rules
        â”œâ”€â”€ home.css                 # Homepage-specific layouts and photography
        â”œâ”€â”€ clients.css              # Client directory and testimonials
        â”œâ”€â”€ logo.png
        â””â”€â”€ assets/
            â”œâ”€â”€ studentspace-logo*.png
            â”œâ”€â”€ clients/
            â”œâ”€â”€ home/
            â”œâ”€â”€ leadership/
            â””â”€â”€ nihal-foundation/

A local `lib/` directory exists but contains no tracked source files. `node_modules/` is installation output. This checkout has no tracked tests, linter configuration, CI workflow, or hosting configuration.

## Run locally

Prerequisites: Node.js with npm, a modern browser with JavaScript enabled, and write permission for `data/`.

The repository does not declare a Node.js engine range. Documentation syntax checks were performed with Node.js **22.22.1**.

From the repository root:

    npm start

Open [http://localhost:3000](http://localhost:3000).

You can also run:

    node server.js

`npm run dev` starts the same process as `npm start`. It does not provide hot reload or automatic server restarts. Restart Node after server changes and reload the browser after frontend changes.

No installation or build command is needed for the currently declared dependency-free application. If dependencies are added later, keep `package.json` and `package-lock.json` synchronized.

To use another port in PowerShell:

    $env:PORT = '3001'
    npm start

Then open [http://localhost:3001](http://localhost:3001). Stop the process with `Ctrl+C`.

Use the Node server rather than opening `index.html` directly as a local file. Form requests and direct route entry depend on HTTP routing.

## Configuration

The server reads its process environment:

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | HTTP listening port |
| `RESEND_API_KEY` | Unset | Enables contact-form notification requests to Resend |
| `NOTIFY_EMAIL` | `givingback@studentspace.com` | Contact-notification recipient |

PowerShell example with placeholders:

    $env:PORT = '3000'
    $env:RESEND_API_KEY = '<your-resend-api-key>'
    $env:NOTIFY_EMAIL = '<approved-staff-notification-address>'
    npm start

Use runtime secret configuration for real credentials. Do not commit credentials or real submissions. There is no automatic `.env` loader; creating a `.env` file alone does not configure the server.

The sender is hardcoded in `server.js` as `StudentSpace <onboarding@resend.dev>`. No sender environment variable exists. Changing it requires a code change and appropriate email-provider configuration.

For local testing, leave `RESEND_API_KEY` unset and use synthetic data. No real email request is made in that mode, although the simulation currently logs submitted details.

## Pages and routes

Page definitions must agree between `APP_ROUTES` in `server.js` and `ROUTE_MAP` in `public/app.js`.

| URL | View ID | Purpose |
| --- | --- | --- |
| `/`, `/home` | `view-home` | Homepage and program entry points |
| `/our-story` | `view-story` | Company history |
| `/founder` | `view-founder` | Founder profile |
| `/leadership` | `view-team` | Leadership team |
| `/research-innovation` | `view-research` | Research and education topics |
| `/technology` | `view-technology` | Technology and interoperability |
| `/new-mexico` | `view-new-mexico` | New Mexico initiatives |
| `/community-partners` | `view-community` | Community and partnerships |
| `/open-knowledge` | `view-knowledge` | Code and documentation access |
| `/give-back` | `view-giveback` | Give Back program |
| `/startup-access` | `view-startup-access` | Startup program, FAQ and application |
| `/edplan-ai` | `view-edplan` | edplan.ai information |
| `/clients` | `view-clients` | Client directory and testimonials |
| `/nihal-foundation` | `view-foundation` | Foundation and community projects |
| `/press-release` | `view-press-release` | SEWA project announcement |
| `/new-mexico-projects` | `view-regional-projects` | Northern New Mexico project history |
| `/playground`, `/projects` | `view-playground` | Demonstration dashboards |
| `/products/full-circle-tracking` | `view-fct` | Full Circle Tracking |
| `/products/school-view` | `view-schoolview` | SchoolView |
| `/products/assessment-of-student-learning` | `view-asl` | Assessment of Student Learning |
| `/faq` | `view-faq` | Give Back FAQ |
| `/contact` | `view-contact` | Contact / application inquiry form |

Section links include `/startup-access#apply` and these dashboard tabs:

- `/playground#admission`
- `/playground#advising`
- `/playground#early-alert`
- `/playground#retention`

The playground uses hardcoded example charts, percentages and tables. Its tabs are interactive; its displayed values are not connected to a live student-data API.

Unknown GET paths currently receive the HTML shell and the client router falls back to the homepage. Missing assets can therefore receive HTML rather than an asset 404. Query parameters are not preserved by current client navigation.

## Frontend and design

`public/app.js` runs in a browser IIFE and handles:

- Internal navigation through `data-route` links and browser back/forward events.
- Page visibility using `.page-view.active`.
- Document title, description and `aria-current` updates.
- Focus transfer to the selected page view.
- Mobile menus and dropdowns.
- Playground tab selection and hashes.
- Startup FAQ accordion expansion.
- Form pre-validation, JSON requests and response handling.

Views stay in the same DOM; navigation does not fetch separate HTML pages.

Styles load in order: `style.css`, `clients.css`, then `home.css`. Shared colors, borders, radius and layout width are CSS custom properties near the top of `style.css`. Later page-specific rules can override earlier rules.

Accessibility hooks include a skip link, form labels, alt text, focus styles, focusable views, menu/tab/accordion ARIA attributes, and reduced-motion CSS. Responsive rules include the 920px mobile-navigation breakpoint and page-specific tablet/phone layouts. These hooks do not establish full accessibility compliance; verify keyboard operation, announcements, contrast and narrow layouts after UI changes.

## API reference

All handlers are in `server.js`. Browser forms send JSON. POST handlers also accept URL-encoded bodies; other content types are parsed as JSON.

The server sets wildcard CORS headers and answers OPTIONS requests with HTTP 204. No authentication middleware exists.

| Method | Endpoint | Current behavior |
| --- | --- | --- |
| POST | `/api/apply` | Validate/save a contact application; attempt optional staff notification |
| GET | `/api/applications` | Return all contact applications without authentication |
| POST | `/api/startup-access` | Validate/save a startup application |
| GET | `/api/startup-access` | Return all startup applications without authentication |
| OPTIONS | Any path | Return CORS preflight response |

### POST /api/apply

| Field | Server requirement | Notes |
| --- | --- | --- |
| `name` | Required nonempty string | Trimmed |
| `email` | Required email format | Trimmed; basic pattern validation |
| `message` | Required nonempty string | Trimmed |
| `reason` | Optional | Defaults to `give_back`; server does not enforce an enum |
| `city` | Optional | Stored as `New Mexico` when empty |

The form offers `give_back`, `edplan_school`, `fct_transfer`, `schoolview_transfer`, `asl_transfer`, `media_partnership` and `other` as inquiry types.

Synthetic local example, with no configured email key:

    $body = @{
      name = 'Example Applicant'
      email = 'developer@example.invalid'
      reason = 'other'
      city = 'Example City'
      message = 'Synthetic local test.'
    } | ConvertTo-Json

    Invoke-RestMethod -Uri 'http://localhost:3000/api/apply' `
      -Method Post -ContentType 'application/json' -Body $body

This writes a record to the local contact file. Test writes in an isolated development copy.

### POST /api/startup-access

Required server fields:

| Field | Meaning |
| --- | --- |
| `fullName` | Applicant name; `name` is accepted as a fallback |
| `email` | Email with basic format validation |
| `companyName` | Company/startup name |
| `nmConnection` | New Mexico connection or commitment |
| `problem` | Problem being addressed |
| `customer` | Intended customer |
| `product` | Product description |
| `techFit` | Fit with StudentSpace technology |

Additional stored fields:

| Group | Fields |
| --- | --- |
| Contact/location | `phone`, `linkedin`, `city`, `state` |
| Company | `website`, `stage`, `incorporated`, `incorporatedWhere` |
| Technology | `technologies` |
| Execution | `commitment`, `team`, `progress`, `nmImpact` |
| Supporting links | `pitchDeckUrl`, `screenshotsUrl`, `demoUrl`, `githubUrl`, `otherUrl` |

Defaults are `stage: "Idea"`, `incorporated: "No"` and `commitment: "Exploring"`. `technologies` is stored as an array; a supplied single value is wrapped in an array.

The browser additionally requires `agreeNoGuarantee` and `agreeContact`. The server currently neither enforces nor stores those acknowledgements. Optional URLs are not comprehensively validated by application code. Supporting materials are links only; there is no binary-upload endpoint.

### Responses and limits

Successful POST requests return HTTP 200:

    {
      "success": true,
      "id": "<generated UUID>",
      "message": "<submission confirmation>"
    }

Validation failures return HTTP 400:

    {
      "success": false,
      "message": "Validation failed.",
      "errors": {
        "email": "<field-specific validation message>"
      }
    }

Records receive a UUID and ISO `created_at` timestamp. Server failures return HTTP 500. Malformed JSON or unexpected field types can also reach the generic 500 handler rather than a structured input error.

Read endpoints return `success`, `count` and an `applications` array. Avoid requesting real records until access control is implemented.

The body guards destroy the connection when accumulated string length exceeds `1e6` for contact requests or `2e6` for startup requests. These are string-length guards, not precise byte limits, and do not return a structured HTTP 413 response.

## Storage and email

On startup, the server creates `data/` and either missing JSON file, initializing new files with an empty array. A valid submission reads the relevant array, appends a record, and synchronously rewrites the entire file.

Storage paths are fixed relative to `server.js`. There is no data-directory environment variable, migration system, retention job, or record-editing/deletion endpoint.

The JSON files are currently tracked in Git. Keep real records out of source control. Do not delete or reset populated files to troubleshoot a problem; arrange authorized backup/recovery first.

Only `/api/apply` calls the notification function:

1. Validate and save the record.
2. If `RESEND_API_KEY` is missing, log a simulated notification.
3. Otherwise, send an HTTPS request to `https://api.resend.com/emails`.
4. Return submission success after the notification function resolves.

Email-provider errors are logged and resolve as unsuccessful notifications; the saved submission can still return success. A successful form response therefore does not prove delivery.

Startup applications do not trigger notifications. Neither form sends applicant confirmation emails. There is no notification retry queue, delivery webhook, or explicit email-request timeout.

## Editing the website

| Change | Files |
| --- | --- |
| Copy, sections, forms, header/footer | `public/index.html` |
| URLs and SEO metadata | `public/app.js` and `server.js` |
| Shared theme and components | `public/style.css` |
| Homepage layout | `public/home.css` |
| Client directory/testimonials | `public/clients.css` |
| Images and logos | `public/assets/` |
| API validation, storage/email | `server.js` |
| Browser validation/feedback | `public/app.js` |

To add a page:

1. Add a unique `main` view in HTML with `class="page-view"` and `tabindex="-1"`.
2. Add its URL, view ID, title and description to `ROUTE_MAP`.
3. Register the URL in `APP_ROUTES`.
4. Add links with matching `href` and `data-route` values.
5. Check direct entry, reload, back/forward, focus, active navigation and mobile layouts.

When changing a form field, update its label/ID/name, browser payload and validation, server validation, stored schema and error mapping together. A required marker does not create a server-side requirement.

Preserve JavaScript-linked IDs, descriptive alt text, visible keyboard focus and responsive behavior. Confirm program eligibility, public contact details and product licensing statements with the content owner before changing those claims.

## Verification and troubleshooting

There are no `npm test`, `npm run lint`, or `npm run build` scripts in this checkout. Locally installed tools do not imply project support.

Read-only JavaScript syntax checks:

    node --check server.js
    node --check public/app.js

These parse JavaScript; they do not test behavior, validate HTML/CSS, or audit accessibility.

Manually check direct page URLs, navigation/back/reload, mobile dropdowns, startup FAQ, playground tabs, keyboard focus, reduced motion and phone/tablet layouts. Use synthetic submissions in an isolated copy to verify required fields, invalid email, saved records, server errors and network failures.

| Symptom | What to check |
| --- | --- |
| `EADDRINUSE` | Stop the existing process or choose another `PORT` |
| UI edit does not appear | Reload; inspect stylesheet order and page-specific selectors |
| Server edit does not appear | Restart Node; `dev` has no watcher |
| API request returns HTML | Check the Node backend and route; a static-only host/fallback cannot process submissions |
| Submission succeeds, email absent | Check key/recipient, hardcoded sender and provider response; startup email is not implemented |
| Contact feedback invisible | Handler sets inline `display:none` without restoring it after completion |
| Generic startup server error | Response handler does not map the server's field-specific `errors` |
| Wrong inquiry or retained draft | CTAs share `/contact` and routing reuses the form without resetting context |
| Image fails unusually | Check asset path; absent assets can receive the HTML fallback |

## Deployment

The complete application needs a Node.js process and writable persistent storage at `data/`. Static hosting can display frontend content with route rewrites, but does not supply the form APIs, storage, or email transport.

| Setting | Requirement |
| --- | --- |
| Working directory | Repository root |
| Start command | `npm start` |
| Build command | None |
| Port | Host-provided `PORT`, otherwise `3000` |
| Storage | Persistent writable `data/`, or a redesigned durable data store |
| Secrets | Runtime environment configuration outside source control |
| HTTPS | Hosting platform/reverse proxy; this server creates an HTTP listener |

No hosting-specific configuration or dedicated health-check endpoint is included. An HTML response on an unknown path does not establish storage/API health.

Resolve the privacy issues below before production intake. Verify persistence across restarts/deploys and design coordination before using multiple instances; whole-file writes are not intended for concurrent multi-instance storage.

## Security and data privacy

Observed issues in the implementation:

- Both submission-read endpoints expose full records without authentication or authorization.
- CORS permits any origin; it does not replace access control.
- Notification simulation logs names, email and messages; save logs include personal/business details.
- Runtime records are tracked in Git and written as plain JSON by the application.
- No application-level rate limiting, bot protection, or comprehensive type/length/URL validation exists.
- Startup consent acknowledgements are enforced only by browser JavaScript.
- Writes are not transactional. Read/parse failures become empty arrays, so a later write can replace existing records.
- No retention/deletion workflow, backup/recovery mechanism, or protected administration UI is implemented.

Before accepting real student/applicant data, protect record access, remove sensitive logs, separate runtime records from Git, enforce required validation/consent on the server, and establish durable storage and a data-lifecycle process. This documentation does not establish privacy or accessibility compliance.

## Known limitations

- Playground data is static.
- Forms retain drafts and lack entry-specific inquiry context.
- Contact success/error feedback can remain hidden.
- Startup server field errors are not associated with individual fields.
- Client navigation discards query parameters.
- Unknown GET paths and missing assets can receive HTML.
- Contact success does not establish email delivery.
- Startup notifications and applicant confirmation emails are absent.
- Internal legal placeholder copy remains in the FAQ.
- The displayed U.S. phone number differs from its `tel:` target; an approved number is needed.
- Regression, lint, accessibility and deployment checks are not defined in this checkout.

## License

`package.json` declares **ISC**; no standalone `LICENSE` file is present. Confirm the intended repository license and permissions before redistribution.

Program descriptions for Give Back and Startup Access do not replace applicable agreements governing product or source-code transfers.
