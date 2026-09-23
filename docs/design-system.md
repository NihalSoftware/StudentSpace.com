# StudentSpace design system

## Direction

A light editorial site grounded in New Mexico. Students and builders have equal prominence. The homepage uses one original mesa/pathway illustration; supporting pages rely on typography, spacing and useful content. No card shadows, repeated landscape motifs or decorative animations are needed.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| Paper | `#F3EFE3` | Primary background and light text on navy/teal |
| Sand | `#E9DFC7` | Selected sections and information panels |
| Text | `#1C2229` | Primary text |
| Ink | `#141D26` | Footer and selected explanatory sections |
| Teal | `#216E67` | Links, buttons and focus on light surfaces |
| Turquoise | `#3AA79C` | Decorative accents and focus on dark surfaces |
| Muted | `#545E60` | Supporting light-surface text |
| Line | `#CECBBD` | Decorative hairline separators |
| Gold | `#D8A63C` | Hero sun only |
| Chile red | `#B93F2E` | Small brand detail and error borders |

Normal-size text uses dark teal on paper/sand, not turquoise. Error text uses darker `#8C2D22`. Form borders use `#727C70`. Decorative hairlines are not the only indicator of a control or state.

Headlines use Space Grotesk, weights 500–700. Body copy uses Libre Franklin, weights 400–700. Google Fonts load with display swap and sans-serif fallbacks. Headings are left aligned; fluid sizes adapt to mobile and desktop. Body line height is 1.7, with long prose limited to about 760px.

## Layout

Maximum content width: 1280px. Desktop side spacing is 56px, then 32px, 20px and 16px on narrower screens. Most sections use 90px vertical padding, reducing to 65px and 48px. Navigation collapses below 1001px so its six labels and CTA do not crowd medium screens.

Grids become single-column reading flows. Project cards use a two-column intermediate arrangement, then stack on small phones. Keep image dimensions in markup to reserve space. The hero is the only large illustration.

## Shared components

| Component | Contract |
| --- | --- |
| Header | Six primary links, ordinary URLs, current-page state, Explore Opportunities CTA |
| Mobile navigation | Native toggle; expanded state; Escape closes and returns focus |
| Footer | Contextual audience/company links, contact information and policies |
| Breadcrumb | Home plus title; matching BreadcrumbList metadata |
| Page hero | One h1, concise introduction, relevant actions |
| Status | Written availability label; never color alone |
| Project/idea card | Descriptive heading link, summary and explicit next action |
| Timeline | Date/period, claim and source; no implied current partnership |
| Process | Ordered list only when actions form a sequence |
| FAQ | Native details/summary; works without JavaScript |
| Filter | Search, category, result count, empty state and reset |
| Form | Visible labels, required markers, contextual fields, errors and status |

Unavailable resources are stated in text. Do not show fake repository, download or demo buttons.

## Accessibility behavior

Every page has one h1, semantic main/header/footer and a skip link. Visible focus uses a 3px outline with 5px offset: teal on light backgrounds, turquoise on navy, paper on teal. Forms focus the first invalid field or submission status. Failures preserve values; success displays a receipt and disables repeated submission. Submit starts disabled until React hydrates. No-JavaScript visitors receive email/phone alternatives; form data cannot become a GET query string.

All routes, content, links and FAQ disclosures work without JavaScript. Filtering and online submission require JavaScript. Mobile navigation stays visible when scripting is disabled.

Reduced-motion CSS removes smooth scrolling and transitions. Verify 320px reflow, zoom, keyboard order, disclosures, errors, contrast and screen-reader announcements after meaningful changes. Current checks appear in the release checklist; they are not a complete WCAG certification.

## Extending the design

Edit tokens and shared rules in `app/globals.css` (@theme with the PostCSS integration) and shared React UI in `components`. Prefer an existing section, column layout or card before adding a component. Use one clear primary action per decision. Keep hosting details out of public journeys.

React ViewTransition boundaries animate navigation and the mobile menu with addTransitionType. Motion is short and optional; reduced-motion disables pseudo-element animations. Native links, disclosures, visible focus and full prerendered content remain the foundation.
