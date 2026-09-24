import { useState, useEffect } from "react";
import SectorIcon from "./SectorIcon.jsx";

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
		<section
			className="relative bg-brand-blue px-4 py-16 text-white sm:px-8 lg:py-24"
			style={{
				backgroundImage: `
					linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
					linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
				`,
				backgroundSize: "48px 48px",
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: "3rem", maxWidth: "1536px", margin: "0 auto" }}>
				{/* ── left ── */}
				<div style={{ flex: "1 1 0", minWidth: 0 }}>
					<p className="mb-4 text-[10px] font-semibold tracking-widest text-brand-red uppercase">
						{eyebrow}
					</p>
					<h1 className="font-heading text-5xl font-bold leading-tight lg:text-6xl">
						{title}
						<span className="text-brand-red">{titleHighlight}</span>
					</h1>
					<p className="mt-6 text-[15px] leading-relaxed text-white/65" style={{ maxWidth: "28rem" }}>
						{subtitle}
					</p>
				</div>

				{/* ── right — cross-fade sector carousel ── */}
				<div style={{
					flex: "1 1 0",
					minWidth: 0,
					borderRadius: 16,
					border: "1px solid rgba(255,255,255,0.15)",
					overflow: "hidden",
					position: "relative",
					height: 270,
				}}>
					{sectors.map((sector, i) => {
						const imgSrc = Array.isArray(sector.image) ? sector.image[0] : sector.image;
						return (
							<div
								key={sector.key || i}
								style={{
									position: "absolute",
									inset: 0,
									opacity: i === active ? 1 : 0,
									transition: "opacity 0.6s ease",
								}}
							>
								{imgSrc ? (
									<img
										src={siteImg(imgSrc)}
										alt={sector.name}
										style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
									/>
								) : (
									<div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
										<SectorIcon sectorKey={sector.key} className="h-10 w-10 text-white/20" />
									</div>
								)}
								<div style={{
									position: "absolute",
									bottom: 0, left: 0, right: 0,
									padding: "2.5rem 1.5rem 2.5rem",
									background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
								}}>
									<p className="font-heading text-base font-bold text-white">{sector.name}</p>
									<p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>{sector.tagline}</p>
								</div>
							</div>
						);
					})}

					{/* dot nav */}
					{sectors.length > 1 && (
						<div style={{
							position: "absolute",
							bottom: 14,
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
				</div>
			</div>

			<div className="mt-8 flex justify-center text-brand-red" style={{ maxWidth: "1536px", margin: "2rem auto 0" }}>
				<svg className="h-5 w-5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
					<path d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</section>
	);
}
