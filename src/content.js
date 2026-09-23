'use strict';

const company = {
  name: 'StudentSpace', siteUrl: 'https://www.studentspace.com',
  edplanUrl: 'https://edplan.vercel.app/home', collegeUrl: 'https://www.studentspace.ai/NNMC',
  address: '802 Early Street, Santa Fe, NM 87505', phone: '+1 (505) 438-7192',
  givebackEmail: 'givingback@studentspace.com', salesEmail: 'sales@studentspace.com',
  supportEmail: 'support@studentspace.com'
};

const projects = [
  {
    slug: 'full-circle-tracking', name: 'Full Circle Tracking', category: 'Student support',
    summary: 'Bring the student journey into view. Connect advising, early alerts and education planning around the people who need support.',
    problem: 'Useful student information often lives in separate campus systems. Advisors need a connected picture before they can offer timely support.',
    history: 'Full Circle Tracking was developed to connect information from student information systems, CRM and learning management systems. Its historical workflows include cohort tracking, advising logs, education planning and early intervention.',
    users: ['Academic advisors', 'Student-support teams', 'Institutional leaders'],
    applications: ['Connected advising workspaces', 'Early-intervention workflows', 'Student journey tools'],
    assets: ['Selected source code', 'Architecture and workflow documentation', 'Product and business knowledge'],
    skills: 'Application development, data integration and an understanding of advising workflows.',
    scope: 'Integration-heavy: the scope depends on campus systems and the selected materials.',
    legacyPath: '/products/full-circle-tracking', source: 'https://www.studentspace.com/full-tracking',
    status: 'Release in preparation', publicationStatus: 'published', maturity: 'Historical institutional product',
    stack: null, repository: null, documentation: null, demo: null, license: null
  },
  {
    slug: 'school-view', name: 'SchoolView', category: 'Institutional insight',
    summary: 'Make institutional data easier to understand, with a shared view of enrollment, operations and student progress.',
    problem: 'Small institutions need useful reporting, but often have limited time and technical capacity to bring data together.',
    history: 'SchoolView organized institutional information into dashboard reports. The historical SchoolView 2020 product describes reporting across enrollment, degrees awarded, admission, retention and advising, including Power BI-based analytics.',
    users: ['Institutional researchers', 'Enrollment and operations teams', 'College leadership'],
    applications: ['Accessible campus dashboards', 'Enrollment reporting tools', 'Data-quality and reporting workflows'],
    assets: ['Selected reporting assets', 'Architecture and data-workflow documentation', 'Product and business knowledge'],
    skills: 'Data modeling, reporting and accessible information design.',
    scope: 'Data-dependent: assess source quality and integration needs before choosing a project.',
    legacyPath: '/products/school-view', source: 'https://www.studentspace.com/school-view-2020',
    status: 'Release in preparation', publicationStatus: 'published', maturity: 'Historical institutional product',
    stack: null, repository: null, documentation: null, demo: null, license: null
  },
  {
    slug: 'assessment-of-student-learning', name: 'Assessment of Student Learning', shortName: 'ASL',
    category: 'Learning outcomes',
    summary: 'Connect learning outcomes with evidence, so educators can understand progress and improve the learning experience.',
    problem: 'Course activity and assessment evidence can be difficult to connect to broader learning outcomes across programs.',
    history: 'Assessment of Student Learning, or ASL, is StudentSpace’s framework and toolset for competency-based learning outcomes. It supports the work of relating learning evidence to course, program and institutional goals.',
    users: ['Faculty and program leads', 'Assessment coordinators', 'Academic leadership'],
    applications: ['Learning-evidence portfolios', 'Competency mapping tools', 'Program assessment workflows'],
    assets: ['Selected assessment code', 'Architecture and product documentation', 'Product and business knowledge'],
    skills: 'Application development, assessment design and collaboration with educators.',
    scope: 'Workflow-dependent: agree on outcome definitions and evidence requirements first.',
    legacyPath: '/products/assessment-of-student-learning', source: 'https://www.studentspace.com/assess',
    status: 'Release in preparation', publicationStatus: 'published', maturity: 'Historical institutional product',
    stack: null, repository: null, documentation: null, demo: null, license: null
  }
];

const ideas = [
  {
    slug: 'earlier-student-support', name: 'Help advisors act earlier', category: 'Student support',
    summary: 'A clearer path from a student-support signal to a useful conversation.',
    problem: 'Advisors can spend valuable time piecing together context instead of helping a student decide what to do next.',
    audience: 'Academic advisors, student-support teams and the students they serve.',
    historicalApproach: 'Full Circle Tracking connected advising logs, early-alert workflows and education planning.',
    whyNow: 'A focused tool could make the handoff between a concern, a conversation and follow-up easier to manage.',
    approach: 'Explore a small, accessible advising workspace with clear ownership and follow-up steps. Begin with synthetic data and educator feedback.',
    ai: 'A possible future use is summarizing authorized advising notes for human review. Any such feature would need privacy review and careful evaluation.',
    business: 'One possible model is a service or software subscription for institutions. Customer interest and willingness to pay would need independent validation.',
    complexity: 'Integration and privacy requirements will drive complexity.',
    project: 'full-circle-tracking', publicationStatus: 'published', status: 'Opportunity brief'
  },
  {
    slug: 'clearer-campus-reporting', name: 'Make campus reporting clearer', category: 'Institutional insight',
    summary: 'Help smaller colleges turn scattered data into understandable institutional questions and answers.',
    problem: 'Small teams can spend too much time assembling recurring reports and too little time interpreting them.',
    audience: 'Institutional researchers, enrollment teams and college leadership.',
    historicalApproach: 'SchoolView brought enrollment, retention and advising information into dashboard reports.',
    whyNow: 'A narrowly scoped reporting workflow could reduce repeated manual work and make data limitations more visible.',
    approach: 'Start with one reporting question, a documented data import and an accessible dashboard that explains its definitions.',
    ai: 'A possible extension is assisted explanation of report definitions, with every answer grounded in approved documentation.',
    business: 'A reporting implementation service or a focused institutional subscription could be explored; neither is a validated offer.',
    complexity: 'Data quality, connectors and reporting definitions determine the scope.',
    project: 'school-view', publicationStatus: 'published', status: 'Opportunity brief'
  },
  {
    slug: 'evidence-of-learning', name: 'Make learning evidence useful', category: 'Learning outcomes',
    summary: 'Connect what students create with the learning outcomes educators want to understand.',
    problem: 'Assessment evidence is often collected in ways that make it hard to reuse in program-level reflection.',
    audience: 'Faculty, assessment coordinators and academic program leads.',
    historicalApproach: 'ASL focused on competency-based learning outcomes and their relationship to institutional goals.',
    whyNow: 'A clear evidence workflow could support thoughtful assessment without making educators maintain another disconnected system.',
    approach: 'Explore an evidence-mapping prototype with transparent rubrics and educator-controlled interpretation.',
    ai: 'A potential extension is suggesting evidence tags for educator review. It should not make consequential judgments about students.',
    business: 'An assessment-workflow service or licensed institutional tool is a possible direction requiring customer validation.',
    complexity: 'Pedagogical requirements, integrations and student privacy determine the scope.',
    project: 'assessment-of-student-learning', publicationStatus: 'published', status: 'Opportunity brief'
  }
];

const timeline = [
  { date: '1998', title: 'A beginning in Santa Fe', text: 'StudentSpace began with a belief that smaller colleges deserve useful, affordable tools and personal attention.', source: 'https://www.studentspace.com/general-8' },
  { date: 'Over the years', title: 'Built alongside institutions', text: 'Work with colleges shaped tools for student tracking, advising, assessment and reporting. StudentSpace reports serving more than 250 institutions.', source: 'https://www.studentspace.com/' },
  { date: 'Along the way', title: 'A practice of giving back', text: 'The company’s published history describes free tools for under-resourced schools and CSR work connected to New Mexico and California.', source: 'https://www.studentspace.com/general-8-3' },
  { date: 'Today', title: 'Two paths forward', text: 'EdPlan is available online. A separate technology-sharing initiative is being prepared for New Mexico builders.', source: null }
];

const metrics = [
  { value: '1998', label: 'Our beginning in Santa Fe', source: 'https://www.studentspace.com/general-8', publicationStatus: 'published' },
  { value: '250+', label: 'Institutions served over our history', source: 'https://www.studentspace.com/', publicationStatus: 'published' },
  { value: '3', label: 'Historical products to explore', source: '/our-work', publicationStatus: 'published' }
];

const stories = [
  { slug: 'santa-fe-community-college', name: 'Santa Fe Community College', location: 'New Mexico', text: 'StudentSpace’s historical account describes work around grant-supported student tracking and support at Santa Fe Community College. It is part of the company’s early New Mexico story.', source: 'https://www.studentspace.com/santa-fe' },
  { slug: 'university-of-rio-grande', name: 'University of Rio Grande', location: 'Ohio', text: 'The company’s published customer history includes the University of Rio Grande and Rio Grande Community College, reflecting experience with institutions serving a range of academic pathways.', source: 'https://www.studentspace.com/rio-grande' },
  { slug: 'timothy-leadership-training', name: 'Timothy Leadership Training', location: 'Historical institutional work', text: 'StudentSpace’s published account describes work with Timothy Leadership Training. Its historical testimonial discusses responsive support and adapting to evolving needs.', source: 'https://www.studentspace.com/timothy' },
  { slug: 'ana-g-mendez-university', name: 'Ana G. Mendez University', location: 'Puerto Rico', text: 'The company’s historical customer material includes Ana G. Mendez University and describes the need for education software to evolve alongside a growing institution.', source: 'https://www.studentspace.com/ana-g-mendez-university' }
];

const faqs = [
  { category: 'The new chapter', q: 'What is changing at StudentSpace?', a: 'We are organizing our next chapter around education planning for students and preparing selected technology and product knowledge for New Mexico builders. Our institutional software history is the foundation for this work.' },
  { category: 'The new chapter', q: 'Is StudentSpace a nonprofit or government program?', a: 'No. StudentSpace is a for-profit education-technology company. Its community commitments are company-supported initiatives. Historical foundation and CSR activity should not be confused with the company’s legal status.' },
  { category: 'EdPlan', q: 'Can I explore EdPlan today?', a: 'Yes. The EdPlan application is available online. A separate Northern New Mexico College planning portal is also available. Access to specific features may require signing in.', href: company.edplanUrl, link: 'Visit EdPlan' },
  { category: 'EdPlan', q: 'Is EdPlan officially available to every New Mexico student?', a: 'Broad access for New Mexico students is our direction. We do not claim statewide adoption, government sponsorship or universal institutional coverage. Contact us about your school’s needs.' },
  { category: 'EdPlan', q: 'Where should I ask about a student account or saved plan?', a: 'Use the support contact for the application you are using. For StudentSpace support, email support@studentspace.com. Do not send student records through this marketing website’s contact form.' },
  { category: 'Taking part', q: 'Do I need an existing registered business?', a: 'You can express interest as an individual, student, team or founder. Formal participation requirements will be published before technology access begins. An expression of interest is not an acceptance decision.' },
  { category: 'Taking part', q: 'Can non-technical people express interest?', a: 'Yes. Educators and people with product or business experience can start a conversation. The skills needed to develop a particular project will depend on the technology and the team.' },
  { category: 'Taking part', q: 'Is there an application deadline?', a: 'No application deadline has been announced. The current form collects expressions of interest while the program is being prepared.' },
  { category: 'Taking part', q: 'Who is the technology-sharing initiative for?', a: 'The initiative is being developed for people and early-stage businesses connected to New Mexico. Detailed eligibility and any evidence requirements will be published before access begins.' },
  { category: 'Technology and rights', q: 'Can I download code now?', a: 'Public code releases are not available through this website yet. Project pages explain the historical products and the materials being considered for release.' },
  { category: 'Technology and rights', q: 'What license will govern the code?', a: 'Licensing terms are still being prepared. Each release will identify its applicable terms before access is offered. This website does not grant rights to use, modify or distribute StudentSpace code.' },
  { category: 'Technology and rights', q: 'Can I build an independent business?', a: 'Supporting independent New Mexico builders is the intention. Commercial use, modification, intellectual-property rights and other permissions will depend on the approved terms for each release.' },
  { category: 'Technology and rights', q: 'Is the initiative open source?', a: 'We use “shared technology” while release terms are being prepared. We will describe each release according to its actual license rather than label the entire initiative open source.' },
  { category: 'Funding and outcomes', q: 'Will StudentSpace provide funding or customers?', a: 'No funding, investment, customers, income or employment is promised. The initiative is intended to share selected technology and experience, with participation details to follow.' },
  { category: 'Funding and outcomes', q: 'What will participation cost?', a: 'StudentSpace intends to make selected materials available without charge. The final scope and participation terms will be stated before a release. No payment is collected on this website.' },
  { category: 'Funding and outcomes', q: 'Do participants have to contribute back?', a: 'No contribution requirement is being asserted here. Any obligations will be stated in the applicable terms. We welcome voluntary conversations about what people are building.' },
  { category: 'Privacy and contact', q: 'What happens to my contact message?', a: 'Our backend sends it through Resend to the appropriate StudentSpace inbox. This website does not create an application database. Email providers and recipient mailboxes process and may retain the message.' },
  { category: 'Privacy and contact', q: 'How can an educator or community organization get involved?', a: 'Tell us about the people you support and the education or technology problem you are working on. We will use that context to direct your inquiry; no partnership is implied by contacting us.' }
].map(item => ({ ...item, publicationStatus: 'published' }));

const intents = [
  ['edplan', 'I’m interested in EdPlan.ai'],
  ['build', 'I want to build with StudentSpace technology'],
  ['startup', 'I have a startup idea'],
  ['developer', 'I’m a developer'],
  ['educator', 'I’m an educator'],
  ['college', 'I represent a college'],
  ['partner', 'I represent a community partner'],
  ['other', 'I have another question']
];

const redirects = {
  '/home': '/', '/our-story': '/story', '/edplan-ai': '/edplan', '/give-back': '/build',
  '/full-tracking': '/products/full-circle-tracking', '/school-view-2020': '/products/school-view',
  '/assess': '/products/assessment-of-student-learning', '/products': '/our-work',
  '/general-8': '/story', '/clients-1': '/story', '/general-8-1': '/leadership',
  '/general-8-3': '/mission', '/clients': '/our-work',
  '/santa-fe': '/our-work/santa-fe-community-college', '/rio-grande': '/our-work/university-of-rio-grande',
  '/timothy': '/our-work/timothy-leadership-training', '/ana-g-mendez-university': '/our-work/ana-g-mendez-university',
  '/global': '/our-work/services', '/general-6': '/our-work/services',
  '/general-6-1': '/our-work/services', '/general-6-2': '/our-work/services',
  '/playground': '/our-work'
};

// Dated notes preserve provenance even after the legacy domain serves the redesign.
const sourceNotes = [
  { id: 'home', url: 'https://www.studentspace.com/', title: 'Company history and scale', note: 'The legacy homepage described StudentSpace as a software company founded in 1998, reported serving more than 250 institutions, and listed Full Circle Tracking, SchoolView and ASL. The count is company-reported historical experience, not independently audited program impact.' },
  { id: 'general-8', url: 'https://www.studentspace.com/general-8', title: 'Company overview', note: 'The company overview described the institutional student-tracking and retention business. The approved company brief identifies Santa Fe as the company’s founding location.' },
  ...projects.map(p => ({ id: new URL(p.source).pathname.slice(1), url: p.source, title: p.name + ' history', note: p.history, publicationStatus: p.publicationStatus })),
  ...stories.map(s => ({ id: new URL(s.source).pathname.slice(1), url: s.source, title: s.name + ' historical account', note: s.text })),
  { id: 'general-8-3', url: 'https://www.studentspace.com/general-8-3', title: 'Historical CSR activity', note: 'The published Giving Back material described foundation and CSR activity, including free tools for under-resourced schools and work connected to New Mexico and California. It does not establish that StudentSpace itself is a nonprofit.' },
  { id: 'global', url: 'https://www.studentspace.com/global', title: 'Historical technical services', note: 'The legacy website described database management, business intelligence and business analytics services. Those descriptions are retained as historical background, not a statement of present service availability.' }
];
// Publication controls are separate from release availability.
// Draft/held records stay out of every page and the API's permitted product list.
const published = records => records.filter(item => item.publicationStatus === 'published');
module.exports = {
  company, intents, redirects,
  projects: published(projects),
  ideas: published(ideas).map(item => ({ ...item, sources: [projects.find(p => p.slug === item.project).source] })),
  timeline: published(timeline.map(item => ({ publicationStatus: 'published', ...item }))),
  metrics: published(metrics),
  stories: published(stories.map(item => ({ publicationStatus: 'published', ...item }))),
  faqs: published(faqs),
  sourceNotes: published(sourceNotes.map(item => ({ publicationStatus: 'published', recordedAt: '2026-09-19', ...item })))
};
