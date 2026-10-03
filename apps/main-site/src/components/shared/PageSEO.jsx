import { useEffect } from "react";
import { absoluteUrl } from "../../utils/siteUrl.js";

const SEGMENT_LABELS = {
	sectors: "Sectors",
	products: "Products",
	"product-selector": "Product Selector",
	"case-studies": "Case Studies",
	resources: "Resources",
	contact: "Contact",
	company: "Company",
	careers: "Careers",
	silbo: "SILBO",
	gallery: "Gallery",
	privacy: "Privacy Policy",
	terms: "Terms of Use",
};

export default function PageSEO({ title, description, path = "", image }) {
	useEffect(() => {
		const fullTitle = title ? `${title} | INVENDIS Technologies` : "INVENDIS Technologies";
		const canonicalUrl = absoluteUrl(path);
		const ogImage = image
			? (image.startsWith("http") ? image : absoluteUrl(image))
			: absoluteUrl("/images/og-default.webp");

		document.title = fullTitle;

		setMeta("description", description);
		setMeta("og:title", fullTitle, "property");
		setMeta("og:description", description, "property");
		setMeta("og:url", canonicalUrl, "property");
		setMeta("og:type", "website", "property");
		setMeta("og:site_name", "INVENDIS Technologies", "property");
		setMeta("og:image", ogImage, "property");
		setMeta("twitter:card", "summary_large_image");
		setMeta("twitter:title", fullTitle);
		setMeta("twitter:description", description);
		setMeta("twitter:image", ogImage);
		setCanonical(canonicalUrl);
		setBreadcrumb(path, title);
	}, [title, description, path, image]);

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

function setCanonical(url) {
	let tag = document.querySelector('link[rel="canonical"]');
	if (!tag) {
		tag = document.createElement("link");
		tag.setAttribute("rel", "canonical");
		document.head.appendChild(tag);
	}
	tag.setAttribute("href", url);
}

function setBreadcrumb(path, pageTitle) {
	if (!path || path === "/") {
		document.querySelector('script[data-schema="ld-breadcrumb"]')?.remove();
		return;
	}

	const segments = path.replace(/^\//, "").split("/").filter(Boolean);
	const items = [{ position: 1, name: "Home", item: absoluteUrl("/") }];

	let cumPath = "";
	segments.forEach((seg, i) => {
		cumPath += "/" + seg;
		const isLast = i === segments.length - 1;
		const name = isLast && pageTitle
			? pageTitle
			: (SEGMENT_LABELS[seg] || seg.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()));
		items.push({ position: i + 2, name, item: absoluteUrl(cumPath) });
	});

	const schema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		"itemListElement": items.map(({ position, name, item }) => ({
			"@type": "ListItem",
			position,
			name,
			item,
		})),
	};

	let tag = document.querySelector('script[data-schema="ld-breadcrumb"]');
	if (!tag) {
		tag = document.createElement("script");
		tag.type = "application/ld+json";
		tag.setAttribute("data-schema", "ld-breadcrumb");
		document.head.appendChild(tag);
	}
	tag.textContent = JSON.stringify(schema);
}
