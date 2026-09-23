import { startTransition, useActionState, useEffect, useOptimistic, useRef, useState } from "react";
import { useLocation } from "react-router";
import { intents } from "../lib/site";
import { SiteLink } from "./SiteLink";
const initial = {
	success: false,
	message: "",
	errors: {}
};
const empty = {
	name: "",
	email: "",
	intent: "",
	city: "",
	organization: "",
	project: "",
	message: "",
	website: ""
};
const builders = [
	"build",
	"startup",
	"developer"
];
export function ApplicationForm({ apply }) {
	const [values, setValues] = useState({
		...empty,
		intent: apply ? "build" : ""
	});
	const [hydrated, setHydrated] = useState(false);
	const { search } = useLocation();
	const retry = useRef(null);
	const status = useRef(null);
	const form = useRef(null);
	const [optimistic, setOptimistic] = useOptimistic("");
	useEffect(() => {
		setHydrated(true);
		const params = new URLSearchParams(search);
		const intent = params.get("intent");
		if (intent && intents.some(([value]) => value === intent)) setValues((v) => ({
			...v,
			intent
		}));
	}, [search]);
	const [state, action, pending] = useActionState(async (_previous, data) => {
		setOptimistic("Sending your message…");
		const payload = Object.fromEntries(data);
		const errors = {};
		if (!payload.name?.trim()) errors.name = "Enter your full name.";
		if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(payload.email?.trim() || "")) errors.email = "Enter a valid email address.";
		if (!payload.intent) errors.intent = "Choose a reason for contacting us.";
		if (!payload.message?.trim()) errors.message = "Enter a short message.";
		if (Object.keys(errors).length) return {
			success: false,
			message: "Please check the highlighted fields.",
			errors
		};
		const fingerprint = JSON.stringify(payload);
		if (retry.current?.fingerprint === fingerprint && Date.now() - retry.current.created >= 23 * 60 * 60 * 1e3) return {
			success: false,
			errors: {},
			message: "This retry window has expired. Please contact advisor@studentspace.com to check whether your message was received before submitting again."
		};
		if (!retry.current || retry.current.fingerprint !== fingerprint) retry.current = {
			fingerprint,
			key: crypto.randomUUID(),
			created: Date.now()
		};
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 15e3);
		try {
			const response = await fetch("/api/apply", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Idempotency-Key": retry.current.key
				},
				body: fingerprint,
				signal: controller.signal
			});
			const result = await response.json();
			if (response.ok && result.success === true) return {
				success: true,
				errors: {},
				message: "Your message has been submitted to StudentSpace. Thank you for getting in touch."
			};
			return {
				success: false,
				message: typeof result.message === "string" ? result.message : "Unable to confirm submission. Your entries have been kept; please retry.",
				errors: result.errors && typeof result.errors === "object" ? result.errors : {}
			};
		} catch {
			return {
				success: false,
				errors: {},
				message: "We could not confirm submission. Your entries have been kept. Retry the same message or email advisor@studentspace.com."
			};
		} finally {
			clearTimeout(timeout);
		}
	}, initial);
	useEffect(() => {
		if (!state.message) return;
		const first = Object.keys(state.errors)[0];
		const field = first ? form.current?.elements.namedItem(first) : null;
		if (field instanceof HTMLElement) field.focus();
		else status.current?.focus();
	}, [state]);
	const change = (name, value) => setValues((v) => ({
		...v,
		[name]: value
	}));
	const input = (name, label, maxLength, autoComplete, required = false, type = "text") => <div className="field"><label htmlFor={name}>{label}{required && <span aria-hidden="true"> *</span>}</label><input id={name} name={name} type={type} value={values[name]} onChange={(e) => change(name, e.target.value)} maxLength={maxLength} autoComplete={autoComplete} required={required} aria-invalid={!!state.errors[name]} aria-describedby={name + "-error"} /><p className="field-error" id={name + "-error"}>{state.errors[name]}</p></div>;
	const building = builders.includes(values.intent);
	const organization = [
		"startup",
		"educator",
		"college",
		"partner",
		"edplan"
	].includes(values.intent);
	return <form ref={form} className="contact-form" action="/api/apply" method="post" onSubmit={(event) => {
		event.preventDefault();
		if (pending || state.success) return;
		const data = new FormData(event.currentTarget);
		startTransition(() => action(data));
	}} noValidate aria-busy={pending}>
    <div className="form-intro"><h2>{apply ? "Tell us what you want to build" : "Let’s find the right conversation"}</h2><p>Fields marked <span aria-hidden="true">*</span> are required. Please do not include student records or other sensitive information.</p></div>
    <fieldset disabled={pending || state.success} className="form-fields">
      <div className="form-grid">{input("name", "Full name", 120, "name", true)}{input("email", "Email", 254, "email", true, "email")}</div>
      <div className="field"><label htmlFor="intent">What brings you here? <span aria-hidden="true">*</span></label><select id="intent" name="intent" value={values.intent} onChange={(e) => change("intent", e.target.value)} required aria-invalid={!!state.errors.intent} aria-describedby="intent-error"><option value="">Choose a reason</option>{intents.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select><p className="field-error" id="intent-error">{state.errors.intent}</p></div>
      <div className="form-grid">{building && input("city", "City / connection to New Mexico (optional)", 120, "address-level2")}{organization && input("organization", "School or organization (optional)", 160, "organization")}</div>
      {building && <div className="field"><label htmlFor="project">Product interest (optional)</label><select id="project" name="project" value={values.project} onChange={(e) => change("project", e.target.value)} aria-describedby="project-error"><option value="">Still exploring</option><option value="full-circle-tracking">Full Circle Tracking</option><option value="school-view">SchoolView</option><option value="assessment-of-student-learning">Assessment of Student Learning</option></select><p className="field-error" id="project-error">{state.errors.project}</p></div>}
      <div className="field"><label htmlFor="message">Your message <span aria-hidden="true">*</span></label><textarea id="message" name="message" rows={6} maxLength={5e3} value={values.message} onChange={(e) => change("message", e.target.value)} required aria-invalid={!!state.errors.message} aria-describedby="message-hint message-error" /><p className="field-hint" id="message-hint">A little about your goals and the problem you want to work on is enough.</p><p className="field-error" id="message-error">{state.errors.message}</p></div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" value={values.website} onChange={(e) => change("website", e.target.value)} tabIndex={-1} autoComplete="off" /></div>
    </fieldset>
    <p className="form-note">Your message is sent by email to StudentSpace. <SiteLink href="/privacy">How we handle your information</SiteLink>.</p>
    <button className="button" type="submit" disabled={!hydrated || pending || state.success}>{pending ? "Sending…" : state.success ? "Message submitted" : apply ? "Send expression of interest" : "Send message"}</button>
    <div ref={status} className="form-status" role="status" aria-live="polite" tabIndex={-1} hidden={!state.message && !pending}>{pending ? optimistic || "Sending your message…" : state.message}</div>
    <noscript><p>To contact us without JavaScript, email <a href="mailto:advisor@studentspace.com">advisor@studentspace.com</a> or call <a href="tel:+15054387192">+1 (505) 438-7192</a>.</p></noscript>
  </form>;
}
