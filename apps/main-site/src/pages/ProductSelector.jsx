import { useState, useEffect, useRef } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import PageSEO from "../components/shared/PageSEO.jsx";
import { useContent } from "../hooks/useContent.js";
import ProductModal from "../sections/product-selector/ProductModal.jsx";
import CompareModal from "../sections/product-selector/CompareModal.jsx";
import ProductCard from "../sections/product-selector/ProductCard.jsx";
import SerialDropdown from "../sections/product-selector/SerialDropdown.jsx";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function matchesCat(p, v) { 
	return !v || p.cat === v; 
}

function matchesCellular(p, v) {
	return !v || p.cellular_gen === v; 
}

function matchesWifi(p, v) { 
	return !v || p.wifi === v; 
}

function matchesPorts(p, v) {
	if (!v) return true;
	const n = parseInt(p.ports, 10);
	if (isNaN(n)) return false;
	if (v === "1-2") return n >= 1 && n <= 2;
	if (v === "3-4") return n >= 3 && n <= 4;
	if (v === "5+") return n >= 5;
	return true;
}

function matchesSerial(p, selected) {
	if (!selected.length) return true;
	if (selected.includes("rs485") && !(p.rs485 === "Yes" || p.rs485 === "Optional")) return false;
	if (selected.includes("rs232") && !(p.rs232 === "Yes" || p.rs232 === "Optional")) return false;
	return true;
}

function matchesSearch(p, q) {
	if (!q) return true;
	const lq = q.toLowerCase();
	return p.name.toLowerCase().includes(lq) || p.desc.toLowerCase().includes(lq) || p.cat.toLowerCase().includes(lq);
}

function useItemsPerPage() {
	function calc() {
		const w = window.innerWidth;
		if (w < 640) return 10;   // 2 cols × 5 rows
		if (w < 1024) return 9;   // 3 cols × 3 rows
		if (w < 1280) return 12;  // 4 cols × 3 rows
		if (w < 1536) return 15;  // 5 cols × 3 rows
		return 24;                // 6 cols × 4 rows
	}
	const [ipp, setIpp] = useState(calc);
	useEffect(() => {
		const handler = () => setIpp(calc());
		window.addEventListener("resize", handler);
		return () => window.removeEventListener("resize", handler);
	}, []);
	return ipp;
}

function pageNums(total, current) {
	if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
	const pages = [1];
	if (current > 3) pages.push("…");
	for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
	if (current < total - 2) pages.push("…");
	if (total > 1) pages.push(total);
	return pages;
}

export default function ProductSelector() {
	const [searchParams, setSearchParams] = useSearchParams();
	const { id: urlId } = useParams();
	const navigate = useNavigate();

	const { data: index, loading: indexLoading, error: indexError } = useContent("productSelector/_index.json", { withLoading: true });

	const q = searchParams.get("q") || "";
	const catFilter = searchParams.get("cat") || "";
	const cellularFilter = searchParams.get("cellular") || "";
	const wifiFilter = searchParams.get("wifi") || "";
	const portsFilter = searchParams.get("ports") || "";
	const serialFilter = searchParams.get("serial") || "";

	const [compareIds, setCompareIds] = useState([]);
	const [compareOpen, setCompareOpen] = useState(false);
	const page = parseInt(searchParams.get("page") || "1", 10);
	const itemsPerPage = useItemsPerPage();
	const [modalId, setModalId] = useState(urlId || null);

	const productsRef = useRef(null);

	useEffect(() => {
		setModalId(urlId || null);
	}, [urlId]);

	function goToPage(n) {
		const next = new URLSearchParams(searchParams);
		next.set("page", String(n));
		setSearchParams(next, { replace: true });
		productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	}


	function setParam(key, val) {
		const next = new URLSearchParams(searchParams);
		if (val) next.set(key, val); else next.delete(key);
		setSearchParams(next, { replace: true });
	}

	function clearFilters() {
		setSearchParams({}, { replace: true });
	}

	function openModal(id) {
		setModalId(id);
		navigate(`/products/product-selector/${id}`);
	}

	function closeModal() {
		setModalId(null);
		navigate("/products/product-selector", { replace: true });
	}

	function toggleCompare(id) {
		setCompareIds(prev =>
			prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
		);
	}

	const products = index?.products ?? [];
	const cats = index?.cats ?? [];

	const catCounts = products.reduce((acc, p) => {
		if (!p.hidden) acc[p.cat] = (acc[p.cat] || 0) + 1;
		return acc;
	}, {});
	
	const allCount = products.filter(p => !p.hidden).length;
	const hasFilters = q || catFilter || cellularFilter || wifiFilter || portsFilter || serialFilter;

	const serialSelected = serialFilter ? serialFilter.split(",") : [];
	const filtered = products.filter(p =>
		!p.hidden &&
		matchesCat(p, catFilter) &&
		matchesCellular(p, cellularFilter) &&
		matchesWifi(p, wifiFilter) &&
		matchesPorts(p, portsFilter) &&
		matchesSerial(p, serialSelected) &&
		matchesSearch(p, q)
	);

	const totalPages = Math.ceil(filtered.length / itemsPerPage);
	const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

	// Reset to page 1 when filters or screen size changes
	useEffect(() => {
		const next = new URLSearchParams(searchParams);
		next.delete("page");
		setSearchParams(next, { replace: true });
	}, [q, catFilter, cellularFilter, wifiFilter, portsFilter, serialFilter, itemsPerPage]);

	return (
		<>
			<PageSEO title="Product Selector" path="/products/product-selector" />

			<section
				className="bg-brand-blue px-4 py-10 text-white sm:px-8 lg:py-14"
				style={{
					backgroundImage: `url('${BASE}/images/product-selector/hero/hero-productselector.png')`,
					backgroundSize: "cover",
					backgroundPosition: "center"
				}}
			>
				<div style={{ maxWidth: 1536, margin: "0 auto" }}>
					<p className="mb-2 text-[10px] font-semibold tracking-widest text-brand-red uppercase">Find Your Device</p>
					<h1 className="font-heading text-4xl font-bold sm:text-5xl">Product Selector</h1>
					<p className="mt-3 text-[15px] text-white/65" style={{ maxWidth: "36rem" }}>
						Filter by connectivity, performance, and form factor to find the right INVENDIS device for your deployment.
					</p>
				</div>
			</section>

			<section ref={productsRef} className="px-4 py-10 sm:px-8" style={{ background: "#f4f6f9", minHeight: 600, paddingBottom: compareIds.length > 0 ? "6rem" : undefined }}>
				<div style={{ maxWidth: 1536, margin: "0 auto" }}>

					{/* Filters */}
					<div style={{ marginBottom: 24 }}>
						<input
							type="text"
							value={q}
							onChange={e => setParam("q", e.target.value)}
							placeholder="Search products…"
							style={{
								display: "block", width: "100%",
								padding: "9px 14px", borderRadius: 8,
								border: "1px solid #e5e7eb", fontSize: 14,
								outline: "none", marginBottom: 12, background: "white",
							}}
						/>

						<div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
							{["", ...cats].map(cat => (
								<button
									key={cat || "all"}
									onClick={() => setParam("cat", cat)}
									style={{
										padding: "5px 14px", borderRadius: 999,
										border: `1.5px solid ${catFilter === cat ? "#0B123C" : "#d1d5db"}`,
										background: catFilter === cat ? "#0B123C" : "white",
										color: catFilter === cat ? "white" : "#374151",
										fontSize: 12, fontWeight: 600, cursor: "pointer",
									}}
								>
									{cat ? `${cat} (${catCounts[cat] || 0})` : `All Products (${allCount})`}
								</button>
							))}
						</div>

						<div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "stretch", width: "100%" }}>
							<select
								value={cellularFilter}
								onChange={e => setParam("cellular", e.target.value)}
								style={{ flex: 1, minWidth: 130, padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 12, background: "white", color: "#374151", cursor: "pointer" }}
							>
								<option value="">Cellular: Any</option>
								<option value="5G">5G</option>
								<option value="4G">4G</option>
								<option value="3G">3G</option>
								<option value="-">No Cellular</option>
							</select>

							<select
								value={wifiFilter}
								onChange={e => setParam("wifi", e.target.value)}
								style={{ flex: 1, minWidth: 130, padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 12, background: "white", color: "#374151", cursor: "pointer" }}
							>
								<option value="">Wi-Fi: Any</option>
								<option value="WiFi6">Wi-Fi 6</option>
								<option value="WiFi5">Wi-Fi 5</option>
								<option value="WiFi4">Wi-Fi 4</option>
								<option value="-">No Wi-Fi</option>
							</select>

							<select
								value={portsFilter}
								onChange={e => setParam("ports", e.target.value)}
								style={{ flex: 1, minWidth: 130, padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 12, background: "white", color: "#374151", cursor: "pointer" }}
							>
								<option value="">Ports: Any</option>
								<option value="1-2">1–2 ports</option>
								<option value="3-4">3–4 ports</option>
								<option value="5+">5+ ports</option>
							</select>

							<SerialDropdown
								value={serialFilter}
								onChange={v => setParam("serial", v)}
							/>

							{hasFilters && (
								<button
									onClick={clearFilters}
									style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #E63946", background: "transparent", color: "#E63946", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
								>
									Clear filters
								</button>
							)}
						</div>
					</div>

					<p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
						{indexLoading ? "Loading…" : filtered.length === 0 ? "0 products found"
							: `Showing ${(page - 1) * itemsPerPage + 1}–${Math.min(page * itemsPerPage, filtered.length)} of ${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
					</p>

					{indexLoading ? (
						<div style={{ textAlign: "center", padding: "4rem 0", color: "#9ca3af" }}>Loading products…</div>
					) : indexError ? (
						<div style={{ textAlign: "center", padding: "4rem 0" }}>
							<p style={{ fontSize: 15, color: "#6b7280" }}>Content temporarily unavailable. Please try again later.</p>
						</div>
					) : filtered.length === 0 ? (
						<div style={{ textAlign: "center", padding: "4rem 0" }}>
							<p style={{ fontSize: 15, color: "#6b7280", marginBottom: 8 }}>No products match your filters.</p>
							<button onClick={clearFilters} style={{ color: "#E63946", fontSize: 13, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
								Clear filters
							</button>
						</div>
									) : (
						<>
							<div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
								{paginated.map(p => (
									<ProductCard
										key={p.id}
										product={p}
										onView={openModal}
										onCompare={toggleCompare}
										isCompared={compareIds.includes(p.id)}
										compareDisabled={compareIds.length >= 3}
										catColors={index?.catColors ?? {}}
									/>
								))}
							</div>
							{totalPages > 1 && (
								<div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, marginTop: 32 }}>
									<button
										onClick={() => goToPage(Math.max(1, page - 1))}
										disabled={page === 1}
										style={{
											padding: "6px 14px", borderRadius: 6, border: "1px solid #d1d5db",
											background: page === 1 ? "#f9fafb" : "white",
											color: page === 1 ? "#d1d5db" : "#374151",
											fontSize: 13, fontWeight: 500, cursor: page === 1 ? "default" : "pointer",
										}}
									>‹ Prev</button>
									{pageNums(totalPages, page).map((n, i) =>
										n === "…" ? (
											<span key={`e${i}`} style={{ padding: "6px 4px", color: "#9ca3af", fontSize: 13 }}>…</span>
										) : (
											<button
												key={n}
												onClick={() => goToPage(n)}
												style={{
													minWidth: 36, padding: "6px 4px", borderRadius: 6,
													border: `1px solid ${page === n ? "#0B123C" : "#d1d5db"}`,
													background: page === n ? "#0B123C" : "white",
													color: page === n ? "white" : "#374151",
													fontSize: 13, fontWeight: page === n ? 700 : 400, cursor: "pointer",
												}}
											>{n}</button>
										)
									)}
									<button
										onClick={() => goToPage(Math.min(totalPages, page + 1))}
										disabled={page === totalPages}
										style={{
											padding: "6px 14px", borderRadius: 6, border: "1px solid #d1d5db",
											background: page === totalPages ? "#f9fafb" : "white",
											color: page === totalPages ? "#d1d5db" : "#374151",
											fontSize: 13, fontWeight: 500, cursor: page === totalPages ? "default" : "pointer",
										}}
									>Next ›</button>
								</div>
							)}
						</>
					)}	
				</div>
			</section>

			{compareIds.length > 0 && (
				<div style={{
					position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
					background: "#0B123C", color: "white",
					padding: "12px 110px 12px 24px",
					display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10,
					boxShadow: "0 -4px 20px rgba(0,0,0,0.25)",
				}}>
					<span style={{ fontSize: 13, fontWeight: 600 }}>
						{compareIds.length} selected
					</span>
					{compareIds.map(id => {
						const p = products.find(x => x.id === id);
						return p ? (
							<span key={id} style={{ fontSize: 12, background: "rgba(255,255,255,0.15)", padding: "4px 10px", borderRadius: 999, display: "flex", alignItems: "center", gap: 6 }}>
								{p.name}
								<button onClick={() => toggleCompare(id)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 15, lineHeight: 1, padding: 0 }}>×</button>
							</span>
						) : null;
					})}
					<div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
						{compareIds.length >= 2 && (
							<button
								onClick={() => setCompareOpen(true)}
								style={{ background: "#E63946", border: "none", color: "white", padding: "8px 18px", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
							>
								Compare
							</button>
						)}
						<button
							onClick={() => setCompareIds([])}
							style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "8px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
						>
							Clear
						</button>
					</div>
				</div>
			)}

			{modalId && (
				<ProductModal
					id={modalId}
					catColors={index?.catColors ?? {}}
					onClose={closeModal}
					onCompare={toggleCompare}
					isCompared={compareIds.includes(modalId)}
					compareDisabled={compareIds.length >= 3}
				/>
			)}
			{compareOpen && (
				<CompareModal
					ids={compareIds}
					onClose={() => setCompareOpen(false)}
				/>
			)}
		</>
	);
}
