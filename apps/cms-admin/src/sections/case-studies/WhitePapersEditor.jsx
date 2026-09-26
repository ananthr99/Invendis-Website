const ICON_OPTIONS = ["file", "cpu", "globe", "sun", "chart", "shield"];

function WhitePaperItem({ item, onChange, onDelete }) {
	function set(field, val) { onChange({ ...item, [field]: val }); }

	return (
		<div style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: "14px 16px", marginBottom: 12, background: "white" }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
				<span style={{ fontSize: 11, fontWeight: 700, color: "var(--admin-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>White Paper</span>
				<button className="admin-btn admin-btn--ghost" onClick={onDelete} style={{ fontSize: 13, color: "var(--admin-red)" }}>✕</button>
			</div>

			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
				<div className="admin-field">
					<label className="admin-label">Icon</label>
					<select className="admin-input" value={item.icon ?? "file"} onChange={e => set("icon", e.target.value)}>
						{ICON_OPTIONS.map(opt => (
							<option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
						))}
					</select>
				</div>
				<div className="admin-field">
					<label className="admin-label">Icon Color</label>
					<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
						<input type="color" value={item.iconColor ?? "#3b82f6"} onChange={e => set("iconColor", e.target.value)} style={{ width: 36, height: 36, padding: 2, border: "1px solid var(--admin-border)", borderRadius: 6, cursor: "pointer", background: "white" }} />
						<input className="admin-input" value={item.iconColor ?? "#3b82f6"} onChange={e => set("iconColor", e.target.value)} style={{ flex: 1, fontFamily: "monospace", fontSize: 13 }} />
					</div>
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
			<div className="admin-field">
				<label className="admin-label">Request Link (href)</label>
				<input className="admin-input" value={item.requestLink ?? ""} onChange={e => set("requestLink", e.target.value)} placeholder="/contact" />
			</div>
		</div>
	);
}

export default function WhitePapersEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", titleHighlight: "", subtitle: "", items: [] };
	const items = d.items ?? [];

	function set(field, val) { onChange({ ...d, [field]: val }); }
	function addItem() {
		onChange({ ...d, items: [...items, { icon: "file", iconColor: "#3b82f6", title: "", description: "", requestLink: "/contact" }] });
	}
	function updateItem(i, val) { const next = [...items]; next[i] = val; onChange({ ...d, items: next }); }
	function deleteItem(i) { onChange({ ...d, items: items.filter((_, idx) => idx !== i) }); }

	return (
		<div>
			<div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--admin-border)" }}>
				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
					<div className="admin-field">
						<label className="admin-label">Eyebrow</label>
						<input className="admin-input" value={d.eyebrow ?? ""} onChange={e => set("eyebrow", e.target.value)} />
					</div>
					<div className="admin-field">
						<label className="admin-label">Title</label>
						<input className="admin-input" value={d.title ?? ""} onChange={e => set("title", e.target.value)} />
					</div>
				</div>
				<div className="admin-field">
					<label className="admin-label">Title Highlight (renders in red)</label>
					<input className="admin-input" value={d.titleHighlight ?? ""} onChange={e => set("titleHighlight", e.target.value)} />
				</div>
				<div className="admin-field">
					<label className="admin-label">Subtitle</label>
					<textarea className="admin-textarea" value={d.subtitle ?? ""} onChange={e => set("subtitle", e.target.value)} />
				</div>
			</div>

			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
				<p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#374151" }}>White Papers ({items.length})</p>
				<button className="admin-btn admin-btn--primary" onClick={addItem} style={{ fontSize: 13 }}>+ Add white paper</button>
			</div>

			{items.map((item, i) => (
				<WhitePaperItem key={i} item={item} onChange={val => updateItem(i, val)} onDelete={() => deleteItem(i)} />
			))}

			{items.length === 0 && (
				<p style={{ color: "var(--admin-muted)", textAlign: "center", padding: "2rem 0", fontSize: 14 }}>No white papers yet.</p>
			)}
		</div>
	);
}
