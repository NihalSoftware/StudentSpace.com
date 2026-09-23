import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { projectLinks } from '../lib/site';
import { SiteLink } from './SiteLink';

export function ProjectNavigation({ onNavigate, menuOpen }) {
  const { pathname } = useLocation();
  const disclosure = useRef(null);
  const trigger = useRef(null);
  const active = pathname === '/projects' || pathname.startsWith('/products/') || pathname.startsWith('/technology');

  useEffect(() => { disclosure.current.open = false; }, [pathname, menuOpen]);
  useEffect(() => {
    const dismiss = event => {
      if (!disclosure.current.contains(event.target)) disclosure.current.open = false;
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, []);

  const follow = () => { disclosure.current.open = false; onNavigate(); };
  return <details ref={disclosure} className={'nav-projects' + (active ? ' is-current' : '')}
    onBlur={event => {
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
    }}
    onKeyDown={event => {
      if (event.key === 'Escape' && disclosure.current.open) {
        event.preventDefault();
        event.stopPropagation();
        disclosure.current.open = false;
        trigger.current.focus();
      }
    }}>
    <summary ref={trigger} aria-controls="projects-navigation">Projects <span className="nav-chevron" aria-hidden="true"/></summary>
    <div id="projects-navigation" className="projects-dropdown">
      <SiteLink href="/projects" className="projects-overview-link" onClick={follow} aria-current={pathname === '/projects' ? 'page' : undefined}>All projects</SiteLink>
      {projectLinks.map(([href, label]) => <SiteLink key={href} href={href} onClick={follow} aria-current={pathname === href ? 'page' : undefined}>{label}</SiteLink>)}
    </div>
  </details>;
}
