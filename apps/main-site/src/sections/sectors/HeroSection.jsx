import { useState, useEffect } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function siteImg(path) { return path ? BASE + path : path; }

export default function HeroSection({ data }) {
	const [active, setActive] = useState(0);
	const { eyebrow, title, titleHighlight, subtitle, sectors = [] } = data ?? {};

	useEffect(() => {
		if (sectors.length < 2) return;
		const id = setInterval(() => {
			setActive((prev) => (prev + 1) % sectors.length);
		}, 5000);
		return () => clearInterval(id);
	}, [sectors.length]);

	return (
		<section className="relative bg-brand-blue px-4 py-16 text-white sm:px-8 lg:py-24">
			{/* Rotating full-bleed background images */}
			{sectors.map((sector, i) => {
				const imgSrc = Array.isArray(sector.image) ? sector.image[0] : sector.image;
				return imgSrc ? (
					<div
						key={sector.key || i}
						style={{
							position: "absolute",
							inset: 0,
							backgroundImage: `url('${siteImg(imgSrc)}')`,
							backgroundSize: "cover",
							backgroundPosition: "center right",
							opacity: i === active ? 1 : 0,
							transition: "opacity 0.8s ease",
						}}
					/>
				) : null;
			})}

			{/* Blue gradient overlay — dark on left, fades right */}
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
					<p className="mb-4 text-[10px] font-semibold tracking-widest text-brand-red uppercase">
						{eyebrow}
					</p>
					<h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
						{title}
						<span className="text-brand-red">{titleHighlight}</span>
					</h1>
					<p className="mt-6 text-[15px] leading-relaxed text-white/65" style={{ maxWidth: "28rem" }}>
						{subtitle}
					</p>
				</div>
			</div>

			{/* Dot navigation */}
			{sectors.length > 1 && (
				<div style={{
					position: "absolute",
					bottom: "3rem",
					left: "50%",
					transform: "translateX(-50%)",
					display: "flex",
					gap: 6,
					zIndex: 10,
				}}>
					{sectors.map((_, i) => (
						<button
							key={i}
							onClick={() => setActive(i)}
							style={{
								height: i === active ? 10 : 8,
								width: i === active ? 10 : 8,
								borderRadius: "50%",
								background: i === active ? "white" : "rgba(255,255,255,0.35)",
								border: "none",
								cursor: "pointer",
								padding: 0,
								transition: "all 0.2s",
							}}
							aria-label={`Sector ${i + 1}`}
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
