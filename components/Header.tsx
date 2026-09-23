import { addTransitionType, startTransition, useEffect, useRef, useState, ViewTransition } from 'react';
import { useLocation } from 'react-router';
import { nav } from '../lib/site';
import { SiteLink } from './SiteLink';
export function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => setEnhanced(true), []);
  const close = () => startTransition(() => { addTransitionType('menu'); setOpen(false); });
  return <><a className="skip-link" href="#main">Skip to content</a>
    <header className={'site-header' + (enhanced ? ' enhanced' : '')} onKeyDown={event => {
      if (event.key === 'Escape' && open) { close(); toggle.current?.focus(); }
    }}><div className="wrap header-row">
      <SiteLink className="brand" href="/" aria-label="StudentSpace home" onClick={close}><span className="brand-mark" aria-hidden="true">s<span>·</span></span><span>StudentSpace</span></SiteLink>
      <button ref={toggle} className="menu-toggle" hidden={!enhanced} aria-expanded={open} aria-controls="primary-navigation" onClick={() => startTransition(() => { addTransitionType('menu'); setOpen(!open); })}>Menu <span aria-hidden="true">☰</span></button>
      <ViewTransition><nav id="primary-navigation" className={open ? 'open' : ''} aria-label="Main navigation">
        {nav.map(([href, label]) => <SiteLink key={href} href={href} onClick={close} aria-current={pathname === href || pathname.startsWith(href + '/') ? 'page' : undefined}>{label}</SiteLink>)}
        <SiteLink className="nav-cta" href="/build" onClick={close}>Explore Opportunities</SiteLink>
      </nav></ViewTransition>
    </div></header></>;
}
