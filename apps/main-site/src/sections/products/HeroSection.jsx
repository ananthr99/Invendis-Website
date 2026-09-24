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
	const { eyebrow, title, titleHighlight, subtitle, cta, image = [] } = data ?? {};
	const imgs = Array.isArray(image) ? image : image ? [image] : [];
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
				{/* Left */}
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
					{cta && (
						<Link
							to={cta.href}
							className="inline-block rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
							style={{ marginTop: "2rem" }}
						>
							{cta.label}
						</Link>
					)}
				</div>

				{/* Right — cross-fade hero carousel */}
				<div style={{ flex: "1 1 0", minWidth: 0, borderRadius: 16, border: "1px solid rgba(255,255,255,0.15)", overflow: "hidden", height: 270, position: "relative" }}>
					{imgs.length > 0 ? (
						<>
							{imgs.map((src, i) => (
								<img
									key={i}
									src={siteImg(src)}
									alt="Products"
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
								<p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>SILBO & Invendis hardware line-up</p>
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
