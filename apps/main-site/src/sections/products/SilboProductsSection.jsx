import { useState, useEffect } from "react";

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

const ICONS = {
	"multi-wan": ({ className }) => (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
		</svg>
	),
	"industrial-gw": ({ className }) => (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-13.5 0V11.25m13.5 3V11.25m0 0a3 3 0 00-3-3H8.25a3 3 0 00-3 3m13.5 0a3 3 0 013 3M3 11.25a3 3 0 013-3m0 0V5.625c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125V8.25m0 0a3 3 0 013 3" />
		</svg>
	),
	"protocol-converter": ({ className }) => (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
		</svg>
	),
	"network-switch": ({ className }) => (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m-6 3.75l3 3m0 0l3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
		</svg>
	),
	"sdwan": ({ className }) => (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3.284 14.253A8.959 8.959 0 013 12c0-1.016.135-2 .386-2.918" />
		</svg>
	),
	"cloud-nms": ({ className }) => (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
		</svg>
	),
	"4g-dongle": ({ className }) => (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
		</svg>
	),
	"controllers": ({ className }) => (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
		</svg>
	),
};

function DefaultIcon({ className }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
		</svg>
	);
}

function RotatingImage({ imgs }) {
	const [idx, setIdx] = useState(0);
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		if (imgs.length < 2) return;
		const timer = setInterval(() => {
			setVisible(false);
			setTimeout(() => {
				setIdx(i => (i + 1) % imgs.length);
				setVisible(true);
			}, 400);
		}, 4000);
		return () => clearInterval(timer);
	}, [imgs.length]);

	if (imgs.length === 0) {
		return (
			<div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
				<CameraIcon className="h-6 w-6 text-white/20" />
			</div>
		);
	}

	return (
		<div style={{ position: "relative", width: "100%", height: "100%" }}>
			<img
				src={siteImg(imgs[idx])}
				alt="SILBO lineup"
				style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}
			/>
			{imgs.length > 1 && (
				<div style={{ position: "absolute", bottom: 6, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 4 }}>
					{imgs.map((_, i) => (
						<button
							key={i}
							onClick={() => { setVisible(false); setTimeout(() => { setIdx(i); setVisible(true); }, 400); }}
							style={{
								width: i === idx ? 16 : 5, height: 5,
								borderRadius: 3, border: "none", cursor: "pointer",
								background: i === idx ? "white" : "rgba(255,255,255,0.35)",
								transition: "all 0.3s ease", padding: 0,
							}}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default function SilboProductsSection({ data }) {
	const { eyebrow, title, subtitle, intro, introImage = [], items = [] } = data ?? {};
	const imgs = Array.isArray(introImage) ? introImage : introImage ? [introImage] : [];

	return (
		<section className="bg-brand-blue px-4 py-20 sm:px-8">
			<div style={{ maxWidth: 1536, margin: "0 auto" }}>
				<div className="mb-10 text-center">
					<p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{eyebrow}</p>
					<h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">{title}</h2>
					<p className="mx-auto mt-4 max-w-2xl text-white/70" style={{ fontSize: 15 }}>{subtitle}</p>
				</div>

				{/* Intro banner */}
				<div style={{
					borderRadius: 16,
					border: "1px solid rgba(255,255,255,0.15)",
					background: "rgba(255,255,255,0.06)",
					padding: "2rem 2.5rem",
					display: "flex",
					alignItems: "center",
					gap: "3rem",
					marginBottom: "1.5rem",
				}}>
					<p className="text-[15px] leading-relaxed text-white/80" style={{ flex: "1 1 0" }}>{intro}</p>
					<div style={{ flex: "0 0 220px", height: 140, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }}>
						<RotatingImage imgs={imgs} />
					</div>
				</div>

				{/* 4-column product grid */}
				<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
					{items.map((item) => {
						const Icon = ICONS[item.key] ?? DefaultIcon;
						return (
							<div key={item.key} className="group relative transition-all hover:shadow-md" style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", padding: "1.25rem", overflow: "hidden" }}>
								<div className="absolute inset-x-0 top-0 h-1 bg-brand-red opacity-0 transition-opacity group-hover:opacity-100" />
								<div style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
									<Icon className="h-4 w-4 text-white/60" />
								</div>
								<h3 className="font-heading text-sm font-bold text-white" style={{ marginBottom: "0.4rem" }}>{item.name}</h3>
								<p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>{item.description}</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
