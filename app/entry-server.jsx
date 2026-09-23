import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { App } from "./App";
import { pages } from "../lib/site";
export function render(url, config) {
	return "<!doctype html>" + renderToString(<StaticRouter location={url}><App config={config} /></StaticRouter>);
}
export { pages };
