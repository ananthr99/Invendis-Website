import { useState } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function siteImg(path) { return path ? BASE + path : path; }

function CameraPlaceholder() {
	return (
		<div style={{ width: "100%", height: "100%", background: "#1B2A6B", display: "flex", alignItems: "center", justifyContent: "center" }}>
			<svg style={{ width: 36, height: 36, color: "rgba(255,255,255,0.18)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
				<path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
			</svg>
		</div>
	);
}

function GalleryCard({ item }) {
	return (
		<div className="flex flex-col overflow-hidden rounded-xl border border-t-4 border-black/5 border-t-transparent bg-white transition-all hover:border-t-brand-red hover:shadow-md">
			<div style={{ position: "relative", height: 200, flexShrink: 0 }}>
				{item.image ? (
					<img
						src={siteImg(item.image)}
						alt={item.title}
						style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
					/>
				) : (
					<CameraPlaceholder />
				)}
				{item.category && (
					<span style={{
						position: "absolute",
						top: 10,
						left: 10,
						background: "white",
						color: "#1B2A6B",
						fontSize: 10,
						fontWeight: 700,
						padding: "3px 10px",
						borderRadius: 20,
						letterSpacing: "0.04em",
					}}>
						{item.category}
					</span>
				)}
			</div>
			<div style={{ padding: "16px 18px 20px", flex: 1 }}>
				<h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: "#1B2A6B", lineHeight: 1.3 }}>{item.title}</h3>
				<p style={{ margin: 0, fontSize: 13, color: "#4b5563", lineHeight: 1.6 }}>{item.description}</p>
			</div>
		</div>
	);
}


export default function PhotoGallerySection({ data }) {
	const { eyebrow, title, titleHighlight, categories = [], items = [] } = data ?? {};
	const [activeFilter, setActiveFilter] = useState("All");

	const usedCategories = categories.filter((cat) => items.some((item) => item.category === cat));
    const allTabs = ["All", ...usedCategories];
	const filtered = activeFilter === "All" ? items : items.filter((item) => item.category === activeFilter);

	return (
		<section className="bg-white px-4 py-16 sm:px-8">
			<div style={{ maxWidth: "1536px", margin: "0 auto" }}>
				<div style={{ marginBottom: "2rem" }}>
					{eyebrow && (
						<p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{eyebrow}</p>
					)}
					<h2 className="font-heading text-4xl font-bold text-brand-blue lg:text-5xl">
						{title}
						{titleHighlight && <span className="text-brand-red"> {titleHighlight}</span>}
					</h2>
				</div>

				{allTabs.length > 1 && (
					<div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "2rem" }}>
						{allTabs.map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveFilter(tab)}
								style={{
									padding: "6px 18px",
									borderRadius: 20,
									border: activeFilter === tab ? "none" : "1px solid #d1d5db",
									background: activeFilter === tab ? "#1B2A6B" : "white",
									color: activeFilter === tab ? "white" : "#374151",
									fontSize: 13,
									fontWeight: activeFilter === tab ? 600 : 400,
									cursor: "pointer",
									transition: "all 0.15s",
									fontFamily: "inherit",
								}}
							>
								{tab}
							</button>
						))}
					</div>
				)}

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{filtered.map((item, i) => (
						<GalleryCard key={item.id ?? i} item={item} />
					))}
				</div>

				{filtered.length === 0 && (
					<p style={{ textAlign: "center", color: "#9ca3af", padding: "3rem 0", fontSize: 14 }}>
						No items in this category yet.
					</p>
				)}
			</div>
		</section>
	);
}
