import { useState } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function siteImg(path) { return path ? BASE + path : path; }

const PER_PAGE_OPTIONS = [5, 10, 15, 20];

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

function Pagination({ page, totalPages, onPage }) {
	if (totalPages <= 1) return null;

	function getPageNumbers() {
		if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
		const pages = new Set([1, totalPages, page, page - 1, page + 1].filter(p => p >= 1 && p <= totalPages));
		const sorted = [...pages].sort((a, b) => a - b);
		const result = [];
		for (let i = 0; i < sorted.length; i++) {
			if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…");
			result.push(sorted[i]);
		}
		return result;
	}

	const btnBase = {
		minWidth: 36,
		height: 36,
		border: "1px solid #e2e4ec",
		borderRadius: 8,
		background: "white",
		cursor: "pointer",
		fontSize: 13,
		fontFamily: "inherit",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		transition: "all 0.15s",
	};

	return (
		<div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: "2.5rem" }}>
			<button
				onClick={() => onPage(page - 1)}
				disabled={page === 1}
				style={{ ...btnBase, color: page === 1 ? "#d1d5db" : "#374151", cursor: page === 1 ? "default" : "pointer" }}
			>
				‹
			</button>

			{getPageNumbers().map((p, i) =>
				p === "…" ? (
					<span key={`ellipsis-${i}`} style={{ width: 36, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>…</span>
				) : (
					<button
						key={p}
						onClick={() => onPage(p)}
						style={{
							...btnBase,
							background: p === page ? "#1B2A6B" : "white",
							color: p === page ? "white" : "#374151",
							borderColor: p === page ? "#1B2A6B" : "#e2e4ec",
							fontWeight: p === page ? 700 : 400,
						}}
					>
						{p}
					</button>
				)
			)}

			<button
				onClick={() => onPage(page + 1)}
				disabled={page === totalPages}
				style={{ ...btnBase, color: page === totalPages ? "#d1d5db" : "#374151", cursor: page === totalPages ? "default" : "pointer" }}
			>
				›
			</button>
		</div>
	);
}

export default function PhotoGallerySection({ data }) {
	const { eyebrow, title, titleHighlight, categories = [], items = [] } = data ?? {};
	const [activeFilter, setActiveFilter] = useState("All");
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);

	function handleFilterChange(cat) {
		setActiveFilter(cat);
		setPage(1);
	}

	function handlePerPageChange(val) {
		setPerPage(val);
		setPage(1);
	}

	const usedCategories = categories.filter((cat) => items.some((item) => item.category === cat));
	const allTabs = ["All", ...usedCategories];
	const filtered = activeFilter === "All" ? items : items.filter((item) => item.category === activeFilter);
	const totalPages = Math.ceil(filtered.length / perPage);
	const paginated = filtered.slice((page - 1) * perPage, page * perPage);

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

				{/* Filter tabs + per-page selector */}
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: "2rem" }}>
					{allTabs.length > 1 && (
						<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
							{allTabs.map((tab) => (
								<button
									key={tab}
									onClick={() => handleFilterChange(tab)}
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

					<div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
						<span style={{ fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>Show</span>
						{PER_PAGE_OPTIONS.map((n) => (
							<button
								key={n}
								onClick={() => handlePerPageChange(n)}
								style={{
									minWidth: 36,
									height: 32,
									border: perPage === n ? "none" : "1px solid #d1d5db",
									borderRadius: 6,
									background: perPage === n ? "#1B2A6B" : "white",
									color: perPage === n ? "white" : "#374151",
									fontSize: 13,
									fontWeight: perPage === n ? 600 : 400,
									cursor: "pointer",
									fontFamily: "inherit",
									transition: "all 0.15s",
								}}
							>
								{n}
							</button>
						))}
					</div>
				</div>

				{/* Count */}
				<p style={{ fontSize: 12, color: "#9ca3af", marginBottom: "1rem" }}>
					Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length} items
				</p>

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
					{paginated.map((item, i) => (
						<GalleryCard key={item.id ?? i} item={item} />
					))}
				</div>

				{filtered.length === 0 && (
					<p style={{ textAlign: "center", color: "#9ca3af", padding: "3rem 0", fontSize: 14 }}>
						No items in this category yet.
					</p>
				)}

				<Pagination page={page} totalPages={totalPages} onPage={setPage} />
			</div>
		</section>
	);
}
