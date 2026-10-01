import { useState } from "react";
import { OWNER, REPO } from "../../config.js";
import { SPEC_FIELDS, CAT_COLORS } from "./constants.js";

const DEFAULT_COLOR = { bg: "#EEF0F3", fg: "#374151" };

function rawUrl(path) {
	if (!path) return null;
	if (path.startsWith("http")) return path;
	return `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/apps/main-site/public${path}`;
}

export default function ProductList({ index, onEdit, onDelete, onSaveCats, saving }) {
	const [search, setSearch] = useState("");
	const [catFilter, setCatFilter] = useState("");
	const [cats, setCats] = useState(index.cats ?? []);
	const [catColors, setCatColors] = useState(index.catColors ?? CAT_COLORS);
	const [catsDirty, setCatsDirty] = useState(false);
	const [newCat, setNewCat] = useState("");
	const [newBg, setNewBg] = useState("#EEF0F3");
	const [newFg, setNewFg] = useState("#374151");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const filtered = (index.products ?? [])
		.filter(p => !catFilter || p.cat === catFilter)
		.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()));

	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const products = filtered.slice((page - 1) * pageSize, page * pageSize);

	function setFilter(fn) { fn(); setPage(1); }

	function updateCatColor(cat, key, val) {
		setCatColors(prev => ({ ...prev, [cat]: { ...(prev[cat] ?? DEFAULT_COLOR), [key]: val } }));
		setCatsDirty(true);
	}

	function addCat() {
		const v = newCat.trim();
		if (!v || cats.includes(v)) return;
		setCats(c => [...c, v]);
		setCatColors(prev => ({ ...prev, [v]: { bg: newBg, fg: newFg } }));
		setCatsDirty(true);
		setNewCat("");
		setNewBg("#EEF0F3");
		setNewFg("#374151");
	}

	function removeCat(c) {
		setCats(prev => prev.filter(x => x !== c));
		setCatColors(prev => { const n = { ...prev }; delete n[c]; return n; });
		setCatsDirty(true);
	}

	return (
		<div style={{ padding: "0 40px 40px" }}>
			{/* Category manager */}
			<div className="admin-card" style={{ marginBottom: 20 }}>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
					<h3 style={{ margin: 0, fontSize: 14 }}>Categories</h3>
					{catsDirty && (
						<button className="admin-btn admin-btn--primary" onClick={() => { onSaveCats(cats, catColors); setCatsDirty(false); }} disabled={saving} style={{ fontSize: 12, padding: "5px 12px" }}>
							{saving ? "Saving…" : "Save categories"}
						</button>
					)}
				</div>

				<table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
					<thead>
						<tr style={{ borderBottom: "2px solid var(--admin-border)", background: "var(--admin-bg)" }}>
							<th style={{ padding: "7px 12px", textAlign: "left", fontWeight: 600, color: "var(--admin-muted)", fontSize: 11, width: 40 }}>#</th>
							<th style={{ padding: "7px 12px", textAlign: "left", fontWeight: 600, color: "var(--admin-muted)", fontSize: 11 }}>Category Name</th>
							<th style={{ padding: "7px 12px", textAlign: "left", fontWeight: 600, color: "var(--admin-muted)", fontSize: 11, width: 180 }}>Background</th>
							<th style={{ padding: "7px 12px", textAlign: "left", fontWeight: 600, color: "var(--admin-muted)", fontSize: 11, width: 180 }}>Text Color</th>
							<th style={{ width: 80 }}></th>
						</tr>
					</thead>
					<tbody>
						{cats.map((c, i) => {
							const col = catColors[c] ?? DEFAULT_COLOR;
							return (
								<tr key={c} style={{ borderBottom: "1px solid var(--admin-border)", background: i % 2 === 0 ? "white" : "var(--admin-bg)" }}>
									<td style={{ padding: "8px 12px", color: "var(--admin-muted)", fontVariantNumeric: "tabular-nums" }}>{i + 1}</td>
									<td style={{ padding: "8px 12px" }}>
										<span style={{ padding: "3px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: col.bg, color: col.fg }}>
											{c}
										</span>
									</td>
									<td style={{ padding: "8px 12px" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
											<input
												type="color"
												value={col.bg}
												onChange={e => updateCatColor(c, "bg", e.target.value)}
												style={{ width: 32, height: 26, padding: 2, border: "1px solid var(--admin-border)", borderRadius: 4, cursor: "pointer" }}
											/>
											<span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--admin-muted)" }}>{col.bg}</span>
										</div>
									</td>
									<td style={{ padding: "8px 12px" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
											<input
												type="color"
												value={col.fg}
												onChange={e => updateCatColor(c, "fg", e.target.value)}
												style={{ width: 32, height: 26, padding: 2, border: "1px solid var(--admin-border)", borderRadius: 4, cursor: "pointer" }}
											/>
											<span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--admin-muted)" }}>{col.fg}</span>
										</div>
									</td>
									<td style={{ padding: "8px 12px", textAlign: "right" }}>
										<button onClick={() => removeCat(c)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-red)", fontSize: 12, fontWeight: 500 }}>Remove</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>

				{/* Add new row */}
				<div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--admin-border)", flexWrap: "wrap" }}>
					<input
						className="admin-input"
						value={newCat}
						onChange={e => setNewCat(e.target.value)}
						onKeyDown={e => e.key === "Enter" && addCat()}
						placeholder="New category name…"
						style={{ flex: 1, maxWidth: 220 }}
					/>
					<label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--admin-muted)", cursor: "pointer" }}>
						BG
						<input type="color" value={newBg} onChange={e => setNewBg(e.target.value)} style={{ width: 32, height: 26, padding: 2, border: "1px solid var(--admin-border)", borderRadius: 4, cursor: "pointer" }} />
						<span style={{ fontSize: 11, fontFamily: "monospace" }}>{newBg}</span>
					</label>
					<label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--admin-muted)", cursor: "pointer" }}>
						Text
						<input type="color" value={newFg} onChange={e => setNewFg(e.target.value)} style={{ width: 32, height: 26, padding: 2, border: "1px solid var(--admin-border)", borderRadius: 4, cursor: "pointer" }} />
						<span style={{ fontSize: 11, fontFamily: "monospace" }}>{newFg}</span>
					</label>
					{newCat.trim() && (
						<span style={{ padding: "3px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: newBg, color: newFg }}>
							{newCat}
						</span>
					)}
					<button className="admin-btn admin-btn--ghost" onClick={addCat}>+ Add</button>
				</div>
			</div>

			{/* Filters */}
			<div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
				<input className="admin-input" value={search} onChange={e => setFilter(() => setSearch(e.target.value))} placeholder="Search by name or ID…" style={{ flex: 1, maxWidth: 280 }} />
				<select className="admin-input" value={catFilter} onChange={e => setFilter(() => setCatFilter(e.target.value))} style={{ width: 180 }}>
					<option value="">All categories</option>
					{(index.cats ?? []).map(c => <option key={c} value={c}>{c}</option>)}
				</select>
				<select className="admin-input" value={pageSize} onChange={e => setFilter(() => setPageSize(Number(e.target.value)))} style={{ width: 120 }}>
					{[5, 10, 20, 50].map(n => <option key={n} value={n}>{n} per page</option>)}
				</select>
				<span style={{ fontSize: 12, color: "var(--admin-muted)", marginLeft: "auto" }}>{filtered.length} product{filtered.length !== 1 ? "s" : ""}</span>
			</div>

			{/* Table */}
			<div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
				<table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
					<thead>
						<tr style={{ background: "var(--admin-bg)", borderBottom: "2px solid var(--admin-border)" }}>
							{["Order", "Product", "Category", "Status", "Actions"].map(h => (
								<th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "var(--admin-muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{products.length === 0 && (
							<tr><td colSpan={5} style={{ padding: "32px 16px", textAlign: "center", color: "var(--admin-muted)" }}>No products found</td></tr>
						)}
						{products.map((p, i) => {
							const col = catColors[p.cat] ?? CAT_COLORS[p.cat] ?? DEFAULT_COLOR;
							return (
								<tr key={p.id} style={{ borderBottom: "1px solid var(--admin-border)", background: i % 2 === 0 ? "white" : "var(--admin-bg)" }}>
									<td style={{ padding: "10px 16px", color: "var(--admin-muted)", width: 60, fontVariantNumeric: "tabular-nums" }}>{p.order ?? "—"}</td>
									<td style={{ padding: "10px 16px" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
											{rawUrl(p.image)
												? <img src={rawUrl(p.image)} alt="" style={{ width: 48, height: 36, objectFit: "contain", borderRadius: 4, border: "1px solid var(--admin-border)", background: "white", flexShrink: 0 }} />
												: <div style={{ width: 48, height: 36, borderRadius: 4, border: "1px dashed var(--admin-border)", background: "var(--admin-bg)", flexShrink: 0 }} />
											}
											<div>
												<div style={{ fontWeight: 600 }}>{p.name}</div>
												<div style={{ fontSize: 11, color: "var(--admin-muted)" }}>{p.id}</div>
											</div>
										</div>
									</td>
									<td style={{ padding: "10px 16px" }}>
										<span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: col.bg, color: col.fg }}>{p.cat}</span>
									</td>
									<td style={{ padding: "10px 16px" }}>
										<span style={{ fontSize: 12, fontWeight: 500, color: p.hidden ? "var(--admin-red)" : "#16a34a" }}>{p.hidden ? "Hidden" : "Visible"}</span>
									</td>
									<td style={{ padding: "10px 16px" }}>
										<div style={{ display: "flex", gap: 6 }}>
											<button className="admin-btn admin-btn--ghost" onClick={() => onEdit(p.id)} style={{ fontSize: 12, padding: "4px 10px" }}>Edit</button>
											<button className="admin-btn admin-btn--ghost" onClick={() => onDelete(p.id)} style={{ fontSize: 12, padding: "4px 10px", color: "var(--admin-red)" }}>Delete</button>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, fontSize: 13 }}>
					<span style={{ color: "var(--admin-muted)" }}>
						{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
					</span>
					<div style={{ display: "flex", gap: 4 }}>
						<button className="admin-btn admin-btn--ghost" onClick={() => setPage(p => p - 1)} disabled={page === 1} style={{ fontSize: 12, padding: "4px 10px" }}>← Prev</button>
						{Array.from({ length: totalPages }, (_, i) => i + 1)
							.filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
							.reduce((acc, n, i, arr) => { if (i > 0 && n - arr[i - 1] > 1) acc.push("…"); acc.push(n); return acc; }, [])
							.map((n, i) => n === "…"
								? <span key={`e${i}`} style={{ padding: "4px 6px", color: "var(--admin-muted)" }}>…</span>
								: <button key={n} onClick={() => setPage(n)} style={{ fontSize: 12, padding: "4px 10px", border: page === n ? "2px solid #0B123C" : "1px solid var(--admin-border)", borderRadius: 4, background: page === n ? "#0B123C" : "white", color: page === n ? "white" : "var(--admin-text)", fontWeight: page === n ? 700 : 400, cursor: "pointer" }}>{n}</button>
							)
						}
						<button className="admin-btn admin-btn--ghost" onClick={() => setPage(p => p + 1)} disabled={page === totalPages} style={{ fontSize: 12, padding: "4px 10px" }}>Next →</button>
					</div>
				</div>
			)}
		</div>
	);
}
