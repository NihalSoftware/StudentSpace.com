import { company } from '../lib/site';
import { SiteLink } from './SiteLink';
const groups = [
  ['Explore', [['/edplan','EdPlan.ai'],['/build','Build With Us'],['/technology','Technology'],['/ideas','Ideas'],['/our-work','Our Work']]],
  ['Take part', [['/developers','Developers'],['/startups','Founders'],['/educators','Educators'],['/how-it-works','How it works'],['/eligibility','Eligibility'],['/apply','Express interest']]],
  ['StudentSpace', [['/mission','Mission'],['/story','Our Story'],['/leadership','Leadership'],['/community','Community'],['/impact','Impact'],['/faq','FAQ'],['/contact','Contact']]],
] as const;
export function Footer({ year }: { year: number }) {
  return <footer className="site-footer"><div className="wrap"><div className="footer-grid">
    <div className="footer-brand"><SiteLink className="brand" href="/">StudentSpace<span className="brand-dot" aria-hidden="true">.</span></SiteLink><p>Built in New Mexico.<br/>Shared for what comes next.</p><address>{company.address}<br/><a href="tel:+15054387192">{company.phone}</a></address></div>
    {groups.map(([title, links]) => <div className="footer-group" key={title}><h2>{title}</h2>{links.map(([href, label]) => <SiteLink key={href} href={href}>{label}</SiteLink>)}</div>)}
  </div><div className="footer-contact"><span>Have a question?</span>{[company.givebackEmail, company.salesEmail, company.supportEmail].map(email => <a key={email} href={'mailto:' + email}>{email}</a>)}</div>
    <div className="footer-bottom"><p>© {year} StudentSpace · A for-profit company with New Mexico roots.</p><nav aria-label="Policies">{[['/privacy','Privacy'],['/terms','Website terms'],['/licensing','Licensing'],['/accessibility','Accessibility']].map(([href, label]) => <SiteLink key={href} href={href}>{label}</SiteLink>)}</nav></div>
  </div></footer>;
}
