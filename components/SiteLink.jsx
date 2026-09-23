import { addTransitionType, startTransition } from "react";
import { useNavigate } from "react-router";
export function SiteLink({ href = "/", onClick, ...props }) {
	const navigate = useNavigate();
	return <a {...props} href={href} onClick={(event) => {
		onClick?.(event);
		if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target || props.download !== undefined || !href.startsWith("/") || href.startsWith("//")) return;
		event.preventDefault();
		startTransition(() => {
			addTransitionType("page");
			navigate(href);
		});
	}} />;
}
