import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';
import type { SiteConfig } from '../lib/site';
import './globals.css';
const config = JSON.parse(document.getElementById('site-config')!.textContent!) as SiteConfig;
hydrateRoot(document, <BrowserRouter><App config={config}/></BrowserRouter>);
