const ICON_OPTIONS = ["lightbulb", "shield", "handshake", "users"];

function ValueItemEditor({ item, onChange, onRemove }) {
	function set(field, val) { onChange({ ...item, [field]: val }); }

	return (
		<div style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 16, marginBottom: 12, background: "var(--admin-bg)" }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
				<span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>{item.title || "Untitled Value"}</span>
				<button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-red)", fontSize: 18, lineHeight: 1, padding: "0 2px" }}>✕</button>
			</div>
			<div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12, marginBottom: 12 }}>
				<div className="admin-field">
					<label className="admin-label">Icon</label>
					<select className="admin-input" value={item.icon ?? ""} onChange={e => set("icon", e.target.value)}>
						<option value="">Select icon…</option>
						{ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
					</select>
				</div>
				<div className="admin-field">
					<label className="admin-label">Title</label>
					<input className="admin-input" value={item.title ?? ""} onChange={e => set("title", e.target.value)} />
				</div>
			</div>
			<div className="admin-field">
				<label className="admin-label">Description</label>
				<textarea className="admin-textarea" rows={2} value={item.description ?? ""} onChange={e => set("description", e.target.value)} />
			</div>
		</div>
	);
}

export default function ValuesEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", items: [] };
	function set(field, val) { onChange({ ...d, [field]: val }); }

	function addItem() { onChange({ ...d, items: [...(d.items ?? []), { icon: "", title: "", description: "" }] }); }
	function updateItem(i, val) { const items = [...(d.items ?? [])]; items[i] = val; onChange({ ...d, items }); }
	function removeItem(i) { onChange({ ...d, items: (d.items ?? []).filter((_, idx) => idx !== i) }); }

	return (
		<div>
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
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
				<h4 style={{ margin: 0, fontSize: 14 }}>Values ({(d.items ?? []).length})</h4>
				<button className="admin-btn admin-btn--ghost" onClick={addItem}>+ Add Value</button>
			</div>
			{(d.items ?? []).map((item, i) => (
				<ValueItemEditor key={i} item={item} onChange={val => updateItem(i, val)} onRemove={() => removeItem(i)} />
			))}
		</div>
	);
}
