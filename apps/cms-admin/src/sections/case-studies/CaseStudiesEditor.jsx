function CaseStudyItem({ item, onChange, onDelete }) {
	function set(field, val) { onChange({ ...item, [field]: val }); }

	return (
		<div style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: "14px 16px", marginBottom: 12, background: "white" }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
				<span style={{ fontSize: 11, fontWeight: 700, color: "var(--admin-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Case Study</span>
				<button className="admin-btn admin-btn--ghost" onClick={onDelete} style={{ fontSize: 13, color: "var(--admin-red)" }}>✕</button>
			</div>

			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
				<div className="admin-field">
					<label className="admin-label">Tag (e.g. Telecom · Africa)</label>
					<input className="admin-input" value={item.tag ?? ""} onChange={e => set("tag", e.target.value)} />
				</div>
				<div className="admin-field">
					<label className="admin-label">Client</label>
					<input className="admin-input" value={item.client ?? ""} onChange={e => set("client", e.target.value)} />
				</div>
			</div>
			<div className="admin-field">
				<label className="admin-label">Title</label>
				<input className="admin-input" value={item.title ?? ""} onChange={e => set("title", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Description</label>
				<textarea className="admin-textarea" rows={3} value={item.description ?? ""} onChange={e => set("description", e.target.value)} />
			</div>
			<div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
				<div className="admin-field">
					<label className="admin-label">Metric (e.g. 40%)</label>
					<input className="admin-input" value={item.metric ?? ""} onChange={e => set("metric", e.target.value)} />
				</div>
				<div className="admin-field">
					<label className="admin-label">Metric Label</label>
					<input className="admin-input" value={item.metricLabel ?? ""} onChange={e => set("metricLabel", e.target.value)} />
				</div>
			</div>
		</div>
	);
}

export default function CaseStudiesEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", items: [] };
	const items = d.items ?? [];

	function set(field, val) { onChange({ ...d, [field]: val }); }
	function addItem() {
		onChange({ ...d, items: [...items, { tag: "", title: "", client: "", description: "", metric: "", metricLabel: "" }] });
	}
	function updateItem(i, val) { const next = [...items]; next[i] = val; onChange({ ...d, items: next }); }
	function deleteItem(i) { onChange({ ...d, items: items.filter((_, idx) => idx !== i) }); }

	return (
		<div>
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--admin-border)" }}>
				<div className="admin-field">
					<label className="admin-label">Eyebrow</label>
					<input className="admin-input" value={d.eyebrow ?? ""} onChange={e => set("eyebrow", e.target.value)} />
				</div>
				<div className="admin-field">
					<label className="admin-label">Title</label>
					<input className="admin-input" value={d.title ?? ""} onChange={e => set("title", e.target.value)} />
				</div>
			</div>

			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
				<p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#374151" }}>Case Studies ({items.length})</p>
				<button className="admin-btn admin-btn--primary" onClick={addItem} style={{ fontSize: 13 }}>+ Add case study</button>
			</div>

			{items.map((item, i) => (
				<CaseStudyItem key={i} item={item} onChange={val => updateItem(i, val)} onDelete={() => deleteItem(i)} />
			))}

			{items.length === 0 && (
				<p style={{ color: "var(--admin-muted)", textAlign: "center", padding: "2rem 0", fontSize: 14 }}>No case studies yet.</p>
			)}
		</div>
	);
}
