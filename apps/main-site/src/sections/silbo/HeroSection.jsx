import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function siteImg(path) { return path ? BASE + path : path; }

function CameraIcon({ className }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
			<path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
		</svg>
	);
}

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
		<section
			className="relative bg-brand-blue px-4 text-white sm:px-8"
			style={{
				backgroundImage: `
					linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
					linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
				`,
				backgroundSize: "48px 48px",
				paddingTop: "0.75rem",
				paddingBottom: "0.75rem",
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: "3rem", maxWidth: "1536px", margin: "0 auto" }}>
				{/* Left column */}
				<div style={{ flex: "1 1 0", minWidth: 0 }}>
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
					<h1 className="font-heading text-5xl font-bold leading-tight lg:text-6xl">
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

				{/* Right column — cross-fade carousel */}
				<div style={{ flex: "1.3 1 0", minWidth: 0, borderRadius: 16, border: "1px solid rgba(255,255,255,0.15)", overflow: "hidden", height: 270, position: "relative" }}>
					{imgs.length > 0 ? (
						<>
							{imgs.map((src, i) => (
								<img
									key={i}
									src={siteImg(src)}
									alt="SILBO products"
									style={{
										position: "absolute",
										inset: 0,
										width: "100%",
										height: "100%",
										objectFit: "cover",
										display: "block",
										opacity: i === idx ? 1 : 0,
										transition: "opacity 0.6s ease",
									}}
								/>
							))}
							{imgs.length > 1 && (
								<div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6, zIndex: 10 }}>
									{imgs.map((_, i) => (
										<button
											key={i}
											onClick={() => setIdx(i)}
											style={{
												width: i === idx ? 20 : 6, height: 6,
												borderRadius: 3, border: "none", cursor: "pointer",
												background: i === idx ? "white" : "rgba(255,255,255,0.35)",
												transition: "all 0.3s ease", padding: 0,
											}}
										/>
									))}
								</div>
							)}
						</>
					) : (
						<div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
							<div style={{ textAlign: "center" }}>
								<CameraIcon className="mx-auto mb-2 h-10 w-10 text-white/20" />
								<p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>SILBO router &amp; switch line-up</p>
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="flex justify-center text-brand-red" style={{ maxWidth: "1536px", margin: "2rem auto 0" }}>
				<svg className="h-5 w-5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
					<path d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</section>
	);
}
