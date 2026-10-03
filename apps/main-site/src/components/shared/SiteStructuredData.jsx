import { useEffect } from "react";
import { absoluteUrl } from "../../utils/siteUrl.js";

export default function SiteStructuredData() {
	useEffect(() => {
		injectSchema("ld-org", {
			"@context": "https://schema.org",
			"@type": "Organization",
			"name": "INVENDIS Technologies",
			"legalName": "Invendis Technologies India Private Limited",
			"url": absoluteUrl("/"),
			"logo": {
				"@type": "ImageObject",
				"url": absoluteUrl("/invendis_logo.webp"),
			},
			"contactPoint": {
				"@type": "ContactPoint",
				"telephone": "+91-6361509463",
				"contactType": "sales",
				"email": "sales@invendis.com",
				"areaServed": "IN",
				"availableLanguage": "English",
			},
			"address": {
				"@type": "PostalAddress",
				"streetAddress": "No. 230, 1st Cross, 38th Main, BOOHBCS Layout, BTM 2nd Stage",
				"addressLocality": "Bangalore",
				"addressRegion": "Karnataka",
				"postalCode": "560068",
				"addressCountry": "IN",
			},
			"sameAs": [
				"https://www.linkedin.com/company/invendis",
				"https://www.instagram.com/invendistechnologies2007",
				"https://www.facebook.com/Invendistechnology",
				"https://x.com/Invendis_tech",
			],
		});

		injectSchema("ld-website", {
			"@context": "https://schema.org",
			"@type": "WebSite",
			"name": "INVENDIS Technologies",
			"url": absoluteUrl("/"),
		});
	}, []);

	return null;
}

function injectSchema(id, schema) {
	let tag = document.querySelector(`script[data-schema="${id}"]`);
	if (!tag) {
		tag = document.createElement("script");
		tag.type = "application/ld+json";
		tag.setAttribute("data-schema", id);
		document.head.appendChild(tag);
	}
	tag.textContent = JSON.stringify(schema);
}
