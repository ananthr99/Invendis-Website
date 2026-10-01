import { useState, useEffect, useRef } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import PageSEO from "../components/shared/PageSEO.jsx";
import { useContent } from "../hooks/useContent.js";
import ProductModal from "../sections/product-selector/ProductModal.jsx";
import CompareModal from "../sections/product-selector/CompareModal.jsx";
import ProductCard from "../sections/product-selector/ProductCard.jsx";
import HeroSection from "../sections/product-selector/HeroSection.jsx";
import FilterBar from "../sections/product-selector/FilterBar.jsx";
import CompareBar from "../sections/product-selector/CompareBar.jsx";
import { matchesCat, matchesCellular, matchesWifi, matchesPorts, matchesSerial, matchesSearch, useItemsPerPage, pageNums } from "../sections/product-selector/filterUtils.js";

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

	useEffect(() => { setModalId(urlId || null); }, [urlId]);

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

	function clearFilters() { setSearchParams({}, { replace: true }); }
	function openModal(id) { setModalId(id); navigate(`/products/product-selector/${id}`); }
	function closeModal() { setModalId(null); navigate("/products/product-selector", { replace: true }); }
	function toggleCompare(id) {
		setCompareIds(prev =>
			prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
		);
	}

	const products = index?.products ?? [];
	const cats = index?.cats ?? [];
	const catCounts = products.reduce((acc, p) => { if (!p.hidden) acc[p.cat] = (acc[p.cat] || 0) + 1; return acc; }, {});
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

	useEffect(() => {
		const next = new URLSearchParams(searchParams);
		next.delete("page");
		setSearchParams(next, { replace: true });
	}, [q, catFilter, cellularFilter, wifiFilter, portsFilter, serialFilter, itemsPerPage]);

	return (
		<>
			<PageSEO title="Product Selector" path="/products/product-selector" />
			<HeroSection />

			<section ref={productsRef} className="px-4 py-10 sm:px-8" style={{ background: "#f4f6f9", minHeight: 600, paddingBottom: compareIds.length > 0 ? "6rem" : undefined }}>
				<div style={{ maxWidth: 1536, margin: "0 auto" }}>
					<FilterBar
						q={q} cats={cats} catFilter={catFilter} catCounts={catCounts} allCount={allCount}
						cellularFilter={cellularFilter} wifiFilter={wifiFilter} portsFilter={portsFilter} serialFilter={serialFilter}
						hasFilters={hasFilters} setParam={setParam} clearFilters={clearFilters}
						indexLoading={indexLoading} filtered={filtered} page={page} itemsPerPage={itemsPerPage}
					/>

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
										key={p.id} product={p}
										onView={openModal} onCompare={toggleCompare}
										isCompared={compareIds.includes(p.id)}
										compareDisabled={compareIds.length >= 3}
										catColors={index?.catColors ?? {}}
									/>
								))}
							</div>
							{totalPages > 1 && (
								<div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, marginTop: 32 }}>
									<button onClick={() => goToPage(Math.max(1, page - 1))} disabled={page === 1}
										style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #d1d5db", background: page === 1 ? "#f9fafb" : "white", color: page === 1 ? "#d1d5db" : "#374151", fontSize: 13, fontWeight: 500, cursor: page === 1 ? "default" : "pointer" }}
									>‹ Prev</button>
									{pageNums(totalPages, page).map((n, i) =>
										n === "…" ? (
											<span key={`e${i}`} style={{ padding: "6px 4px", color: "#9ca3af", fontSize: 13 }}>…</span>
										) : (
											<button key={n} onClick={() => goToPage(n)}
												style={{ minWidth: 36, padding: "6px 4px", borderRadius: 6, border: `1px solid ${page === n ? "#0B123C" : "#d1d5db"}`, background: page === n ? "#0B123C" : "white", color: page === n ? "white" : "#374151", fontSize: 13, fontWeight: page === n ? 700 : 400, cursor: "pointer" }}
											>{n}</button>
										)
									)}
									<button onClick={() => goToPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
										style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #d1d5db", background: page === totalPages ? "#f9fafb" : "white", color: page === totalPages ? "#d1d5db" : "#374151", fontSize: 13, fontWeight: 500, cursor: page === totalPages ? "default" : "pointer" }}
									>Next ›</button>
								</div>
							)}
						</>
					)}
				</div>
			</section>

			<CompareBar
				compareIds={compareIds}
				products={products}
				toggleCompare={toggleCompare}
				onOpenCompare={() => setCompareOpen(true)}
				onClearCompare={() => setCompareIds([])}
			/>

			{modalId && (
				<ProductModal id={modalId} catColors={index?.catColors ?? {}} onClose={closeModal}
					onCompare={toggleCompare} isCompared={compareIds.includes(modalId)} compareDisabled={compareIds.length >= 3}
				/>
			)}
			{compareOpen && <CompareModal ids={compareIds} onClose={() => setCompareOpen(false)} />}
		</>
	);
}
