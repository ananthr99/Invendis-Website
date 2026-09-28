import { useRef, useState, useEffect } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function siteImg(path) { return path ? BASE + path : path; }

function ProductCard({ product }) {
	return (
		<div className="overflow-hidden rounded-xl border border-t-4 border-black/5 border-t-transparent bg-white transition-all hover:border-t-brand-red hover:shadow-md">
			{product.image ? (
				<img src={siteImg(product.image)} alt={product.model} width={300} height={150} loading="lazy" style={{ width: "100%", height: 150, objectFit: "contain", background: "#f1f5f9", padding: "0.5rem" }} />
			) : (
				<div style={{ height: 150, background: "#f1f5f9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
					<svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.5} style={{ width: 26, height: 26 }}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
						<path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
					</svg>
					<p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>[Photo: {product.model} unit]</p>
				</div>
			)}
			<div style={{ padding: "14px 16px" }}>
				<div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
					{(product.badges ?? []).map((badge) => (
						<span key={badge} style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "#1B2A6B", color: "white", letterSpacing: "0.05em" }}>
							{badge}
						</span>
					))}
				</div>
				<h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 800, color: "#1B2A6B" }}>{product.model}</h3>
				<p style={{ margin: 0, fontSize: 12.5, color: "#4b5563", lineHeight: 1.65 }}>{product.description}</p>
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
				[dir === "left" ? "left" : "right"]: 4,
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

export default function EdgeComputeSection({ data }) {
	const d = data ?? {};
	const products = d.products ?? [];
	const showArrows = products.length > 3;
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
		if (showArrows) updateArrows();
	}, [products.length]);

	function scroll(dir) {
		scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
	}

	return (
		<section className="bg-slate-50 px-4 py-16 sm:px-8">
			<div style={{ maxWidth: "1536px", margin: "0 auto" }}>
				<div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
					{d.eyebrow && <p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{d.eyebrow}</p>}
					<h2 className="font-heading text-3xl font-bold text-brand-blue sm:text-4xl">{d.title}</h2>
					{d.subtitle && <p style={{ marginTop: 12, fontSize: 15, color: "#4b5563", maxWidth: "42rem", lineHeight: 1.7, margin: "12px auto 0" }}>{d.subtitle}</p>}
				</div>

				{showArrows ? (
					<div style={{ position: "relative" }}>
						{canLeft && <ArrowBtn dir="left" onClick={() => scroll(-1)} />}
						<div
							ref={scrollRef}
							onScroll={updateArrows}
							style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none", msOverflowStyle: "none" }}
							className="[&::-webkit-scrollbar]:hidden"
						>
							{products.map((product, i) => (
								<div key={i} style={{ flex: "0 0 300px" }}>
									<ProductCard product={product} />
								</div>
							))}
						</div>
						{canRight && <ArrowBtn dir="right" onClick={() => scroll(1)} />}
					</div>
				) : (
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
						{products.map((product, i) => (
							<ProductCard key={i} product={product} />
						))}
					</div>
				)}
			</div>
		</section>
	);
}
