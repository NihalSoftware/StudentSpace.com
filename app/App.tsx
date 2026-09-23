import { useEffect, useRef, ViewTransition } from 'react';
import { useLocation, useNavigationType } from 'react-router';
import { company, findPage, json, type SiteConfig } from '../lib/site';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PageContent } from '../components/PageContent';
import { SiteLink } from '../components/SiteLink';
export function App({ config }: { config: SiteConfig }) {
  const location = useLocation();
  const navigation = useNavigationType();
  const previous = useRef(location.key);
  const page = findPage(location.pathname);
  const canonical = config.siteUrl + page.path;
  const title = page.title + ' | StudentSpace';
  const noindex = config.noindex || ('noindex' in page && page.noindex);
  const schemas: object[] = [
    { '@context':'https://schema.org', '@type':'Organization', name:company.name, url:config.siteUrl, foundingDate:'1998', telephone:company.phone, address:{ '@type':'PostalAddress', streetAddress:'802 Early Street', addressLocality:'Santa Fe', addressRegion:'NM', postalCode:'87505', addressCountry:'US' } },
    { '@context':'https://schema.org', '@type':'WebSite', name:company.name, url:config.siteUrl }
  ];
  if (page.path !== '/' && page.path !== '/404') schemas.push({ '@context':'https://schema.org', '@type':'BreadcrumbList', itemListElement:[{ '@type':'ListItem',position:1,name:'Home',item:config.siteUrl+'/' }, { '@type':'ListItem',position:2,name:page.title,item:canonical }] });
  useEffect(() => {
    if (previous.current === location.key) return;
    previous.current = location.key;
    const hash = location.hash.slice(1);
    const target = hash ? document.getElementById(decodeURIComponent(hash)) : document.getElementById('main');
    target?.focus({ preventScroll: true });
    if (hash) target?.scrollIntoView();
    else if (navigation !== 'POP') window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location, navigation]);
  return <html lang="en"><head>
    <meta charSet="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>{title}</title><meta name="description" content={page.description}/><meta name="theme-color" content="#F3EFE3"/>
    <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'}/><link rel="canonical" href={canonical}/>
    <meta property="og:type" content="website"/><meta property="og:site_name" content="StudentSpace"/><meta property="og:title" content={title}/><meta property="og:description" content={page.description}/><meta property="og:url" content={canonical}/>
    <meta property="og:image" content={config.siteUrl+'/assets/social.png'}/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta property="og:image:alt" content="StudentSpace: Built here. Shared forward."/>
    <meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content={title}/><meta name="twitter:description" content={page.description}/><meta name="twitter:image" content={config.siteUrl+'/assets/social.png'}/>
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg"/>
    <link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
    <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet"/>
    {config.styles.map(href => <link key={href} rel="stylesheet" href={href}/>)}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(schemas) }}/>
    <script id="site-config" type="application/json" dangerouslySetInnerHTML={{ __html: json(config) }}/>
    {config.scripts.map(src => <script key={src} type="module" src={src}/>)}
  </head><body>
    <Header/>
    <ViewTransition key={page.path}><main id="main" tabIndex={-1}>
      {page.path !== '/' && <div className="wrap breadcrumbs" aria-label="Breadcrumb"><SiteLink href="/">Home</SiteLink><span aria-hidden="true">/</span><span>{page.title}</span></div>}
      <PageContent key={page.path} page={page}/>
    </main></ViewTransition>
    <Footer year={config.year}/>
  </body></html>;
}
