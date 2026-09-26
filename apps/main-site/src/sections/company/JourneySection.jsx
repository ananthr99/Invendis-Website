import { useState, useEffect } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function siteImg(path) { return path ? BASE + path : path; }

function LocationsCarousel({ items = [] }) {
	const slides = items.flatMap(loc =>
		(loc.images ?? []).length > 0
			? loc.images.map(src => ({ src, caption: loc.caption }))
			: [{ src: null, caption: loc.caption }]
	);

	const [idx, setIdx] = useState(0);

	useEffect(() => {
		if (slides.length <= 1) return;
		const timer = setInterval(() => {
			setIdx(i => (i + 1) % slides.length);
		}, 3500);
		return () => clearInterval(timer);
	}, [slides.length]);

	const current = slides[idx] ?? {};

	return (
		<div style={{ borderRadius: 10, overflow: "hidden", position: "relative", background: "#1B2A6B", height: 200 }}>
			{slides.map((slide, i) => (
				slide.src ? (
					<img
						key={i}
						src={siteImg(slide.src)}
						alt={slide.caption}
						style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: i === idx ? 1 : 0, transition: "opacity 0.6s ease" }}
					/>
				) : (
					<div key={i} style={{ position: "absolute", inset: 0, display: i === idx ? "flex" : "none", alignItems: "center", justifyContent: "center" }}>
						<svg style={{ width: 32, height: 32, color: "rgba(255,255,255,0.2)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
						</svg>
					</div>
				)
			))}

			{/* Dot indicators */}
			{slides.length > 1 && (
				<div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
					{slides.map((_, i) => (
						<button
							key={i}
							onClick={() => setIdx(i)}
							style={{ width: 6, height: 6, borderRadius: "50%", background: i === idx ? "white" : "rgba(255,255,255,0.35)", border: "none", padding: 0, cursor: "pointer", transition: "background 0.3s" }}
						/>
					))}
				</div>
			)}

			{/* Caption */}
			{current.caption && (
				<div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "6px 12px", background: "rgba(0,0,0,0.5)", color: "white", fontSize: 11, textAlign: "center" }}>
					{current.caption}
				</div>
			)}
		</div>
	);
}

export default function JourneySection({ data }) {
	const { eyebrow, title, timeline = [], facilities = {}, locations = {} } = data ?? {};

	return (
		<section className="bg-white px-4 py-16 sm:px-8">
			<div style={{ maxWidth: "1536px", margin: "0 auto" }}>
				<div style={{ marginBottom: "2.5rem" }}>
					{eyebrow && <p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{eyebrow}</p>}
					<h2 className="font-heading text-4xl font-bold text-brand-blue lg:text-5xl">{title}</h2>
				</div>

				<div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "4rem", alignItems: "start" }}>
					{/* Timeline */}
					<div style={{ position: "relative" }}>
						<div style={{ position: "absolute", left: 36, top: 0, bottom: 0, width: 2, background: "#e2e8f0" }} />
						{timeline.map((item, i) => (
							<div key={i} style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem", position: "relative" }}>
								<div style={{ flexShrink: 0, width: 72, textAlign: "right" }}>
									<span style={{ display: "inline-block", background: "#1B2A6B", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>{item.year}</span>
								</div>
								<div style={{ width: 12, height: 12, borderRadius: "50%", background: "#E63946", border: "2px solid white", boxShadow: "0 0 0 2px #E63946", flexShrink: 0, marginTop: 4 }} />
								<div style={{ flex: 1, paddingBottom: "0.5rem" }}>
									<p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#1B2A6B" }}>{item.title}</p>
									<p style={{ margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{item.description}</p>
								</div>
							</div>
						))}
					</div>

					{/* Right column */}
					<div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
						{/* Facilities */}
						<div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.25rem" }}>
							{facilities.eyebrow && <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#E63946" }}>{facilities.eyebrow}</p>}
							<p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "#1B2A6B" }}>{facilities.title}</p>
							{facilities.subtitle && <p style={{ margin: "0 0 12px", fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{facilities.subtitle}</p>}
							<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
								{(facilities.items ?? []).map((item, i) => (
									<div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
										<div style={{ width: 28, height: 28, borderRadius: 6, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
											<svg style={{ width: 14, height: 14, color: "#1B2A6B" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
												<path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
											</svg>
										</div>
										<span style={{ fontSize: 12, color: "#374151" }}>{item.label}</span>
									</div>
								))}
							</div>

							{/* Certifications */}
							{(facilities.certifications ?? []).length > 0 && (
								<div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #e2e8f0", display: "flex", flexWrap: "wrap", gap: 6 }}>
									{facilities.certifications.map((cert) => (
										<span key={cert} style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, border: "1px solid #1B2A6B", color: "#1B2A6B" }}>{cert}</span>
									))}
								</div>
							)}
						</div>

						{/* Locations */}
                        {(locations.items ?? []).length > 0 && (
                            <div>
                                {locations.eyebrow && <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#E63946" }}>{locations.eyebrow}</p>}
                                {locations.title && <p style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 700, color: "#1B2A6B" }}>{locations.title}</p>}
                                <LocationsCarousel items={locations.items} />
                            </div>
                        )}
					</div>
				</div>
			</div>
		</section>
	);
}
