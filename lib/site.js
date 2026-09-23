import data from "./generated-pages.json";
export const { company, intents, pages, catalogs, projectLinks } = data;
export const nav = [
	["/mission", "Mission"],
	["/edplan", "EdPlan.ai"],
	["/build", "Build With Us"],
	["/projects", "Projects"],
	["/ideas", "Ideas"],
	["/story", "Our Story"]
];
export function findPage(path) {
	return pages.find((p) => p.path === path) ?? pages.find((p) => p.path === "/404");
}
export function json(value) {
	return JSON.stringify(value).replace(/</g, "\\u003c");
}
