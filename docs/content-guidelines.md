# StudentSpace content guidelines

## Editorial principle

Explain what people can do today and what is being prepared. The redesign brief governs conflicts with older sales-led prompts. StudentSpace is a for-profit company with a community commitment; historical foundation activity does not change its legal status.

## Content classifications

| Classification | Appropriate wording | Avoid |
| --- | --- | --- |
| Current evidenced availability | EdPlan is available online; features may require sign-in | Statewide adoption or all workflows tested |
| Historical capability | SchoolView's historical reporting included… | Implying a release includes every past feature |
| Historical relationship | The company's historical account describes… | Current partner logos, endorsements or contracts |
| Upcoming program | Releases and terms are being prepared; express interest | Immediate code access or guaranteed acceptance |
| Opportunity idea | One possible application/business approach… | Guaranteed market, customers or income |
| Unknown business detail | Details will be published before access begins | Public TODOs, invented dates, licenses or bios |
| Future impact | Impact reporting will begin as projects launch | Invented jobs, startups, participants or revenue |

The company-reported 250+ institutions figure is historical context, not independently audited new-program impact. Omit the unsupported 250,000-student metric. Prefer the founding year to an aging “27 years” claim.

## Sources and publication

`src/content.js` holds projects, ideas, FAQs, timelines, metrics, institution stories and source notes. Projects have stable slugs, historical capabilities, possible uses, maturity and availability. Unconfirmed releases, stack details and licenses are null rather than invented links.

Sources appear through dated notes at `/our-work/sources`. Original legacy addresses appear as text because the redirects will replace those pages. These are evidence summaries, not a full archive. Obtain stronger authorized source documents before publishing claims that need them.

Before adding or changing a public record:

1. Record its source, date, scope and historical/current/proposed classification.
2. Confirm business approval and any metric definition.
3. Mark publication status and include only approved material in page composition.
4. Check links, source anchors, metadata and related FAQs.
5. Run the build and tests; keep unapproved claims in the internal register.

The confirmation register in `website-redesign-plan.md` holds pending eligibility, licenses, deadlines, leadership, releases and policies. Internal documents are not generated into `dist`.

## Application destinations

Use `https://edplan.vercel.app/home` as the primary EdPlan destination. Explain exploring options, considering requirements and planning next steps without promising unverified automation.

Present `https://www.studentspace.ai/NNMC` as the separate Northern New Mexico College portal. Visible navigation proves an interface exists, not that every authenticated workflow works or institution-wide adoption exists.

## Forms and privacy

Call `/apply` an expression of interest. Ask for name, email, intent and message; request optional context only when relevant. Do not request student records, identity documents, credentials or eligibility evidence.

Success means provider acceptance. Never claim inbox delivery, applicant approval or database storage. The site creates no contact database, but email providers/mailboxes may retain messages. The privacy notice also describes hosting request processing, temporary abuse controls and external font requests.

Company approval of policies, retention, privacy requests and sender/inbox ownership remains necessary before production.

## Tone and maintenance

Use plain, welcoming language and concrete verbs. Avoid scarcity, unsupported superlatives and “no catch” promises. Prefer “shared technology” until an actual release license supports a more specific label.

Maintain existing product URLs and redirect legacy addresses to equivalent historical material. Do not redirect unrelated pages to home. Slug changes need permanent redirects without chains or loops.

When a release launches, update links, license, status, scope and FAQ together. Publish dated outcomes only after approval of evidence and definitions.

## Migration clarification, 22 September 2026
The current implementation remains email-only on Vercel. Default sender and recipient: advisor@studentspace.com. Do not claim database storage, durable queues, automatic background retries or inbox delivery. Provider failures retain form values for an explicit retry. Preview messages require a separate test recipient. Leadership, licensing, releases and policy approvals remain in the internal register.
