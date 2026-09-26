import { useParams, Link } from "react-router-dom";
import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";
import ArticleHeroSection from "../sections/resources/ArticleHeroSection.jsx";
import ArticleBodySection from "../sections/resources/ArticleBodySection.jsx";

export default function ResourceDetail() {
	const { slug } = useParams();
	const { data: article, loading, error } = useContent(`articles/${slug}.json`, { withLoading: true });

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
