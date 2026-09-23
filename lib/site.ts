import data from './generated-pages.json';
export const { company, intents, pages, catalogs } = data;
export type Page = typeof pages[number];
export type SiteConfig = { siteUrl: string; noindex: boolean; year: number; scripts: string[]; styles: string[] };
export const nav = [['/mission', 'Mission'], ['/edplan', 'EdPlan.ai'], ['/build', 'Build With Us'], ['/technology', 'Technology'], ['/ideas', 'Ideas'], ['/story', 'Our Story']];
export function findPage(path: string) { return pages.find(p => p.path === path) ?? pages.find(p => p.path === '/404')!; }
export function json(value: unknown) { return JSON.stringify(value).replace(/</g, '\\u003c'); }
