import { Link } from "react-router-dom";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function siteImg(path) { return path ? BASE + path : path; }

export default function HeroSection({ data }) {
	const d = data ?? {};

	const bgStyle = d.image
		? { backgroundImage: `url('${siteImg(d.image)}')`, backgroundSize: "cover", backgroundPosition: "center right" }
		: {
			backgroundImage: `
				linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
				linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
			`,
			backgroundSize: "48px 48px",
		};

	return (
		<section className="relative bg-brand-blue px-4 py-16 text-white sm:px-8 lg:py-24" style={bgStyle}>
			{d.image && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(11,18,60,0.80) 0%, rgba(11,18,60,0.80) 35%, rgba(11,18,60,0.35) 65%, rgba(11,18,60,0.05) 100%)" }} />}
			<div style={{ position: "relative", zIndex: 1, maxWidth: "1536px", margin: "0 auto", minHeight: 335, display: "flex", flexDirection: "column", justifyContent: "center" }}>
				<div className="lg:max-w-[48%]">
					{d.eyebrow && (
						<p className="mb-4 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{d.eyebrow}</p>
					)}
					<h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
						{d.title}
						{d.titleHighlight && <><br /><span className="text-brand-red">{d.titleHighlight}</span></>}
					</h1>
					{d.subtitle && (
						<p className="mt-6 text-[15px] leading-relaxed text-white/65" style={{ maxWidth: "30rem" }}>{d.subtitle}</p>
					)}
					{d.cta && (
						d.cta.href?.startsWith("#") ? (
							<a
								href={d.cta.href}
								className="inline-block rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
								style={{ marginTop: "2rem", textDecoration: "none" }}
							>
								{d.cta.label}
							</a>
						) : (
							<Link
								to={d.cta.href}
								className="inline-block rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
								style={{ marginTop: "2rem", textDecoration: "none" }}
							>
								{d.cta.label}
							</Link>
						)
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
