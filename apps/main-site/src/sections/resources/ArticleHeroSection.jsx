import { Link } from "react-router-dom";
import { useContent } from "../../hooks/useContent.js";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function siteImg(path) { return path ? BASE + path : path; }

export default function ArticleHeroSection({ data }) {
	const d = data ?? {};
	const { data: resourcesPage } = useContent("pages/resources.json", { withLoading: true });
	const heroImage = resourcesPage?.hero?.image;

	const bgStyle = heroImage
		? { backgroundImage: `url('${siteImg(heroImage)}')`, backgroundSize: "cover", backgroundPosition: "center right", minHeight: "calc(100vh - 76px)" }
		: {
			backgroundImage: `
				linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
				linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
			`,
			backgroundSize: "48px 48px",
		};

	return (
		<section className="relative bg-brand-blue px-4 py-16 text-white sm:px-8 lg:py-24" style={bgStyle}>
			{heroImage && <div style={{ position: "absolute", inset: 0, background: "rgba(11,18,60,0.72)" }} />}
			<div style={{ position: "relative", zIndex: 1, maxWidth: "1536px", margin: "0 auto", minHeight: 270, display: "flex", flexDirection: "column", justifyContent: "center" }}>
				<div className="lg:max-w-[48%]">
					<Link to="/resources" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 500, textDecoration: "none", marginBottom: "1.25rem" }}>
						← Back to Resources
					</Link>
					{d.category && (
						<p className="mb-4 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{d.category}</p>
					)}
					<h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{d.title}</h1>
					{(d.date || d.readTime) && (
						<div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "1.25rem", color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
							{d.date && <span>{d.date}</span>}
							{d.date && d.readTime && <span>·</span>}
							{d.readTime && <span>{d.readTime}</span>}
						</div>
					)}
				</div>
			</div>

			<div className="text-brand-red" style={{ position: "absolute", bottom: "1.5rem", left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 1 }}>
				<svg className="h-5 w-5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
					<path d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</section>
	);
}
