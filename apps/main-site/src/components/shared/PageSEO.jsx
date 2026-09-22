import { useEffect } from "react";
import { absoluteUrl } from "../../utils/siteUrl.js";

// Sets <title>, meta description, and Open Graph tags for the current
// page. No react-helmet dependency needed for a site this size — plain
// DOM writes in a useEffect do the job and keep the bundle smaller.
export default function PageSEO({ title, description, path = "" }) {
	useEffect(() => {
		const fullTitle = title ? `${title} | INVENDIS Technologies` : "INVENDIS Technologies";
		document.title = fullTitle;

		setMeta("description", description);
		setMeta("og:title", fullTitle, "property");
		setMeta("og:description", description, "property");
		setMeta("og:url", absoluteUrl(path), "property");
	}, [title, description, path]);

	return null;
}

function setMeta(name, content, attr = "name") {
	if (!content) return;
	let tag = document.querySelector(`meta[${attr}="${name}"]`);
	if (!tag) {
		tag = document.createElement("meta");
		tag.setAttribute(attr, name);
		document.head.appendChild(tag);
	}
	tag.setAttribute("content", content);
}
