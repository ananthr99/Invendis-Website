import { useState } from "react";
import { OWNER, REPO } from "../../config.js";

const CAT_COLORS = {
	"Intel Based Devices": { bg: "#FEF2F2", fg: "#991B1B" },
	Router: { bg: "#EAF2FB", fg: "#1260A8" },
	Gateway: { bg: "#E4F5EE", fg: "#0F6040" },
	Switch: { bg: "#FFF3E0", fg: "#8B5200" },
	"Energy Meter": { bg: "#F9EAF3", fg: "#7B2563" },
	"Outdoor Unit": { bg: "#EEF2FF", fg: "#3730A3" },
	PCB: { bg: "#ECFDF5", fg: "#065F46" },
	Other: { bg: "#EEF0F3", fg: "#3A4D63" },
};

function rawUrl(path) {
	if (!path) return null;
	if (path.startsWith("http")) return path;
	return `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/apps/main-site/public${path}`;
}

export default function ProductList({ index, onEdit, onDelete, onSaveCats, saving }) {
	const [search, setSearch] = useState("");
	const [catFilter, setCatFilter] = useState("");
	const [cats, setCats] = useState(index.cats ?? []);
	const [catsDirty, setCatsDirty] = useState(false);
	const [newCat, setNewCat] = useState("");

	const products = (index.products ?? [])
		.filter(p => !catFilter || p.cat === catFilter)
		.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()));

	function addCat() {
		const v = newCat.trim();
		if (!v || cats.includes(v)) return;
		setCats(c => [...c, v]);
		setCatsDirty(true);
		setNewCat("");
	}

	function removeCat(c) {
		setCats(prev => prev.filter(x => x !== c));
		setCatsDirty(true);
	}

	return (
		<div style={{ padding: "0 40px 40px" }}>
			{/* Category manager */}
			<div className="admin-card" style={{ marginBottom: 20 }}>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
					<h3 style={{ margin: 0, fontSize: 14 }}>Categories</h3>
					{catsDirty && (
						<button className="admin-btn admin-btn--primary" onClick={() => { onSaveCats(cats); setCatsDirty(false); }} disabled={saving} style={{ fontSize: 12, padding: "5px 12px" }}>
							{saving ? "Saving…" : "Save categories"}
						</button>
					)}
				</div>
				<div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
					{cats.map(c => {
						const col = CAT_COLORS[c] ?? { bg: "#f3f4f6", fg: "#374151" };
						return (
							<span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: col.bg, color: col.fg }}>
								{c}
								<button onClick={() => removeCat(c)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: col.fg, fontSize: 11, lineHeight: 1 }}>✕</button>
							</span>
						);
					})}
				</div>
				<div style={{ display: "flex", gap: 8 }}>
					<input className="admin-input" value={newCat} onChange={e => setNewCat(e.target.value)} onKeyDown={e => e.key === "Enter" && addCat()} placeholder="New category name…" style={{ flex: 1, maxWidth: 260 }} />
					<button className="admin-btn admin-btn--ghost" onClick={addCat}>+ Add</button>
				</div>
			</div>

			{/* Filters */}
			<div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
				<input className="admin-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ID…" style={{ flex: 1, maxWidth: 280 }} />
				<select className="admin-input" value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ width: 180 }}>
					<option value="">All categories</option>
					{(index.cats ?? []).map(c => <option key={c} value={c}>{c}</option>)}
				</select>
				<span style={{ fontSize: 12, color: "var(--admin-muted)", marginLeft: "auto" }}>{products.length} product{products.length !== 1 ? "s" : ""}</span>
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
							const col = CAT_COLORS[p.cat] ?? { bg: "#f3f4f6", fg: "#374151" };
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
		</div>
	);
}
