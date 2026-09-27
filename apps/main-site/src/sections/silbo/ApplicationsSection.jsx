import { useRef, useState, useEffect } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function siteImg(path) { return path ? BASE + path : path; }

function AppCard({ item }) {
	return (
		<div className="border border-t-4 border-black/5 border-t-transparent bg-white transition-all hover:border-t-brand-red hover:shadow-md" style={{ width: 260, flexShrink: 0, borderRadius: 12, overflow: "hidden" }}>
			{item.image ? (
				<img src={siteImg(item.image)} alt={item.title} style={{ width: "100%", height: 140, objectFit: "cover" }} />
			) : (
				<div style={{ height: 140, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
					<svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.5} style={{ width: 28, height: 28 }}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
					</svg>
				</div>
			)}
			<div style={{ padding: "14px 16px" }}>
				{item.category && (
					<span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E63946", display: "block", marginBottom: 6 }}>
						{item.category}
					</span>
				)}
				<h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, color: "#1B2A6B", lineHeight: 1.4 }}>{item.title}</h3>
				<p style={{ margin: 0, fontSize: 12, color: "#4b5563", lineHeight: 1.6 }}>{item.description}</p>
			</div>
		</div>
	);
}

function ArrowBtn({ dir, onClick }) {
	return (
		<button
			onClick={onClick}
			style={{
				position: "absolute", top: "50%", transform: "translateY(-50%)",
				[dir === "left" ? "left" : "right"]: -20,
				zIndex: 10, width: 40, height: 40, borderRadius: "50%",
				background: "white", border: "1px solid #e2e8f0",
				boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
				display: "flex", alignItems: "center", justifyContent: "center",
				cursor: "pointer", color: "#1B2A6B",
			}}
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18 }}>
				<path d={dir === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
			</svg>
		</button>
	);
}

export default function ApplicationsSection({ data }) {
	const d = data ?? {};
	const items = d.items ?? [];
	const scrollRef = useRef(null);
	const [canLeft, setCanLeft] = useState(false);
	const [canRight, setCanRight] = useState(false);

	function updateArrows() {
		const el = scrollRef.current;
		if (!el) return;
		setCanLeft(el.scrollLeft > 1);
		setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
	}

	useEffect(() => {
		updateArrows();
	}, [items.length]);

	function scroll(dir) {
		scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
	}

	return (
		<section className="bg-white px-4 py-16 sm:px-8">
			<div style={{ maxWidth: "1536px", margin: "0 auto" }}>
				<div style={{ marginBottom: "2rem", textAlign: "center" }}>
					{d.eyebrow && <p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{d.eyebrow}</p>}
					<h2 className="font-heading text-3xl font-bold text-brand-blue sm:text-4xl">{d.title}</h2>
				</div>
				<div style={{ position: "relative" }}>
					{canLeft && <ArrowBtn dir="left" onClick={() => scroll(-1)} />}
					<div
						ref={scrollRef}
						onScroll={updateArrows}
						style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none", msOverflowStyle: "none" }}
						className="[&::-webkit-scrollbar]:hidden"
					>
						{items.map((item, i) => (
							<AppCard key={i} item={item} />
						))}
					</div>
					{canRight && <ArrowBtn dir="right" onClick={() => scroll(1)} />}
				</div>
			</div>
		</section>
	);
}
