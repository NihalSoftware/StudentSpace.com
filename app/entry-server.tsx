import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from './App';
import { pages, type SiteConfig } from '../lib/site';
export function render(url: string, config: SiteConfig) {
  return '<!doctype html>' + renderToString(<StaticRouter location={url}><App config={config}/></StaticRouter>);
}
export { pages };
