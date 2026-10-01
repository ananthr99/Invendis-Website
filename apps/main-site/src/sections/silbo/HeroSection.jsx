import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function siteImg(path) { return path ? BASE + path : path; }

export default function HeroSection({ data }) {
	const d = data ?? {};
	const imgs = Array.isArray(d.image) ? d.image : d.image ? [d.image] : [];
	const [idx, setIdx] = useState(0);

	useEffect(() => {
		if (imgs.length < 2) return;
		const timer = setInterval(() => {
			setIdx(i => (i + 1) % imgs.length);
		}, 4000);
		return () => clearInterval(timer);
	}, [imgs.length]);

	return (
		<section className="relative bg-brand-blue px-4 py-10 text-white sm:px-8 lg:py-16">
			{/* Rotating full-bleed background images */}
			{imgs.map((src, i) => (
				<div
					key={i}
					style={{
						position: "absolute",
						inset: 0,
						backgroundImage: `url('${siteImg(src)}')`,
						backgroundSize: "cover",
						backgroundPosition: "center right",
						opacity: i === idx ? 1 : 0,
						transition: "opacity 0.8s ease",
					}}
				/>
			))}

			{/* Blue gradient overlay */}
			<div style={{
				position: "absolute",
				inset: 0,
				background: "linear-gradient(to right, rgba(11,18,60,0.88) 0%, rgba(11,18,60,0.88) 35%, rgba(11,18,60,0.55) 65%, rgba(11,18,60,0.18) 100%)",
			}} />

			{/* Grid lines texture */}
			<div style={{
				position: "absolute",
				inset: 0,
				backgroundImage: `url('${BASE}/images/hero-bg-blue.png')`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				opacity: 0.12,
				mixBlendMode: "overlay",
			}} />

			{/* Text content */}
			<div style={{
				position: "relative",
				zIndex: 1,
				maxWidth: "1536px",
				margin: "0 auto",
				minHeight: 335,
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
			}}>
				<div className="lg:max-w-[48%]">
					{d.eyebrow && (
						<p className="mb-2 text-[10px] font-semibold tracking-widest text-brand-red uppercase">
							{d.eyebrow}
						</p>
					)}
					{d.brand && (
						<p style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: 10, marginTop: 4 }}>
							{d.brand}
						</p>
					)}
					<h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
						{d.title}
						{d.titleHighlight && <><br /><span className="text-brand-red">{d.titleHighlight}</span></>}
					</h1>
					{d.description && (
						<p className="mt-4 text-[15px] leading-relaxed text-white/65" style={{ maxWidth: "28rem" }}>
							{d.description}
						</p>
					)}
					<div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: "1.25rem" }}>
						{d.primaryBtn && (
							<Link
								to={d.primaryBtn.href}
								className="inline-block rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
								style={{ textDecoration: "none" }}
							>
								{d.primaryBtn.label}
							</Link>
						)}
						{d.secondaryBtn && (
							<Link
								to={d.secondaryBtn.href}
								className="inline-block rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
								style={{ border: "1.5px solid rgba(255,255,255,0.35)", textDecoration: "none" }}
							>
								{d.secondaryBtn.label}
							</Link>
						)}
					</div>
					{d.stats?.length > 0 && (
						<div style={{ display: "flex", flexWrap: "wrap", gap: "1rem 7rem", marginTop: "1.75rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
							{d.stats.map((stat, i) => (
								<div key={i}>
									<p className="font-heading" style={{ fontSize: 22, fontWeight: 800, color: stat.highlight ? "#E63946" : "white", marginBottom: 2, lineHeight: 1 }}>
										{stat.value}
									</p>
									<p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
										{stat.label}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Dot navigation */}
			{imgs.length > 1 && (
				<div style={{
					position: "absolute",
					bottom: "3rem",
					left: "50%",
					transform: "translateX(-50%)",
					display: "flex",
					gap: 6,
					zIndex: 10,
				}}>
					{imgs.map((_, i) => (
						<button
							key={i}
							onClick={() => setIdx(i)}
							style={{
								width: i === idx ? 20 : 6,
								height: 6,
								borderRadius: 3,
								border: "none",
								cursor: "pointer",
								background: i === idx ? "white" : "rgba(255,255,255,0.35)",
								transition: "all 0.3s ease",
								padding: 0,
							}}
						/>
					))}
				</div>
			)}

			{/* Bounce arrow */}
			<div className="text-brand-red" style={{
				position: "absolute",
				bottom: "1.5rem",
				left: 0,
				right: 0,
				display: "flex",
				justifyContent: "center",
				zIndex: 10,
			}}>
				<svg className="h-5 w-5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
					<path d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</section>
	);
}
