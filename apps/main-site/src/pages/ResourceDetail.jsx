import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useContent } from "../hooks/useContent.js";
import { absoluteUrl } from "../utils/siteUrl.js";
import PageSEO from "../components/shared/PageSEO.jsx";
import ArticleHeroSection from "../sections/resources/ArticleHeroSection.jsx";
import ArticleBodySection from "../sections/resources/ArticleBodySection.jsx";

function toISODate(str) {
	if (!str) return "";
	const d = new Date(str.replace("Sept", "Sep"));
	return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
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

export default function ResourceDetail() {
	const { slug } = useParams();
	const { data: article, loading, error } = useContent(`articles/${slug}.json`, { withLoading: true });

	useEffect(() => {
		if (!article) return;
		injectSchema("ld-article", {
			"@context": "https://schema.org",
			"@type": "TechArticle",
			"headline": article.title,
			"description": article.description,
			"datePublished": toISODate(article.date),
			"author": {
				"@type": "Organization",
				"name": "INVENDIS Technologies",
				"url": absoluteUrl("/"),
			},
			"publisher": {
				"@type": "Organization",
				"name": "INVENDIS Technologies",
				"logo": { "@type": "ImageObject", "url": absoluteUrl("/invendis_logo.webp") },
			},
			"url": absoluteUrl(`/resources/${slug}`),
			"mainEntityOfPage": { "@type": "WebPage", "@id": absoluteUrl(`/resources/${slug}`) },
			"image": absoluteUrl("/images/og-default.png"),
		});
		return () => {
			document.querySelector('script[data-schema="ld-article"]')?.remove();
		};
	}, [article, slug]);

	if (loading) return (
		<div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
			<div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
		</div>
	);

	if (error || !article) return (
		<div style={{ textAlign: "center", padding: "6rem 1rem" }}>
			<p style={{ fontSize: 18, color: "#6b7280", marginBottom: "1.5rem" }}>Article not found.</p>
			<Link to="/resources" style={{ color: "#1B2A6B", fontWeight: 600, textDecoration: "none" }}>← Back to Resources</Link>
		</div>
	);

	return (
		<>
			<PageSEO title={article.title} description={article.description} path={`/resources/${slug}`} />
			<ArticleHeroSection data={article} />
			<ArticleBodySection data={article} />
		</>
	);
}
