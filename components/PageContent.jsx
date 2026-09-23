import { useState } from "react";
import parse, { attributesToProps, domToReact, Element } from "html-react-parser";
import { catalogs } from "../lib/site";
import { SiteLink } from "./SiteLink";
import { ApplicationForm } from "./ApplicationForm";
// The existing reviewed editorial HTML remains a build-time content source.
// Parse into real React elements; interactive regions are owned by components.
export function PageContent({ page }) {
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("");
	const catalog = catalogs[page.path] ?? [];
	const matches = (search, topic) => (!category || topic === category) && search.includes(query.trim().toLowerCase());
	const count = catalog.filter((p) => matches(p.search, p.category)).length;
	const options = { replace(node) {
		if (!(node instanceof Element)) return;
		const attrs = node.attribs;
		if (node.name === "img" && attrs.fetchpriority) {
			const { fetchpriority, ...rest } = attrs;
			return <img {...attributesToProps(rest)} fetchPriority={fetchpriority} />;
		}
		if ("data-contact-form" in attrs) return <ApplicationForm apply={page.path === "/apply"} />;
		if ("data-filter-form" in attrs) return <form className="filter-bar" role="search" onSubmit={(e) => e.preventDefault()} onReset={() => {
			setQuery("");
			setCategory("");
		}}>
      <div className="field"><label htmlFor="library-search">Search {page.path === "/technology" ? "technology" : "ideas"}</label><input id="library-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or topic" autoComplete="off" /></div>
      <div className="field"><label htmlFor="library-category">Topic</label><select id="library-category" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All topics</option>{[...new Set(catalog.map((p) => p.category))].map((topic) => <option key={topic}>{topic}</option>)}</select></div>
      <button className="button button-outline" type="reset">Clear filters</button>
    </form>;
		if ("data-filter-count" in attrs) return <p className="filter-count" role="status" aria-live="polite">{count} {count === 1 ? "entry" : "entries"}</p>;
		if ("data-filter-empty" in attrs) return <p className="empty-state" hidden={count !== 0}>No matches yet. Try another word or clear the filters.</p>;
		if ("data-library-item" in attrs) return <article {...attributesToProps(attrs)} hidden={!matches(attrs["data-search"], attrs["data-category"])}>{domToReact(node.children, options)}</article>;
		if (node.name === "a") return <SiteLink {...attributesToProps(attrs)}>{domToReact(node.children, options)}</SiteLink>;
	} };
	return <>{parse(page.body, options)}</>;
}
