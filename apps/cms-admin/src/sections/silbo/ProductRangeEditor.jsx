export default function ProductRangeEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", categories: [] };

	function set(field, val) { onChange({ ...d, [field]: val }); }

	function updateCategory(i, field, val) {
		const categories = [...(d.categories ?? [])];
		categories[i] = { ...categories[i], [field]: val };
		onChange({ ...d, categories });
	}
	function addCategory() { onChange({ ...d, categories: [...(d.categories ?? []), { icon: "router", count: "", label: "", description: "", link: "", linkLabel: "" }] }); }
	function removeCategory(i) { onChange({ ...d, categories: (d.categories ?? []).filter((_, j) => j !== i) }); }
	function moveCategory(i, dir) {
		const j = i + dir;
		const categories = [...(d.categories ?? [])];
		if (j < 0 || j >= categories.length) return;
		[categories[i], categories[j]] = [categories[j], categories[i]];
		onChange({ ...d, categories });
	}

	return (
		<div>
			<div className="admin-field">
				<label className="admin-label">Eyebrow</label>
				<input className="admin-input" value={d.eyebrow ?? ""} onChange={e => set("eyebrow", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Title</label>
				<input className="admin-input" value={d.title ?? ""} onChange={e => set("title", e.target.value)} />
			</div>

			<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>Categories</label>
			{(d.categories ?? []).map((cat, i) => (
				<div key={i} style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 12, marginBottom: 12 }}>
					<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
						<span style={{ fontWeight: 600, fontSize: 13 }}>Category {i + 1}{cat.label ? ` — ${cat.label}` : ""}</span>
						<div style={{ display: "flex", gap: 4 }}>
							<button className="admin-btn admin-btn--ghost" onClick={() => moveCategory(i, -1)} disabled={i === 0}>↑</button>
							<button className="admin-btn admin-btn--ghost" onClick={() => moveCategory(i, 1)} disabled={i === (d.categories ?? []).length - 1}>↓</button>
							<button className="admin-btn admin-btn--ghost" onClick={() => removeCategory(i)}>✕</button>
						</div>
					</div>
					<div style={{ display: "flex", gap: 8 }}>
						<div className="admin-field" style={{ flex: "0 0 140px" }}>
							<label className="admin-label">Icon</label>
							<select className="admin-input" value={cat.icon ?? "router"} onChange={e => updateCategory(i, "icon", e.target.value)}>
								<option value="router">Router</option>
								<option value="gateway">Gateway</option>
								<option value="switch">Switch</option>
							</select>
						</div>
						<div className="admin-field" style={{ flex: "0 0 100px" }}>
							<label className="admin-label">Count</label>
							<input className="admin-input" value={cat.count ?? ""} onChange={e => updateCategory(i, "count", e.target.value)} />
						</div>
						<div className="admin-field" style={{ flex: 1 }}>
							<label className="admin-label">Label</label>
							<input className="admin-input" value={cat.label ?? ""} onChange={e => updateCategory(i, "label", e.target.value)} />
						</div>
					</div>
					<div className="admin-field">
						<label className="admin-label">Description</label>
						<textarea className="admin-textarea" value={cat.description ?? ""} onChange={e => updateCategory(i, "description", e.target.value)} />
					</div>
					<div style={{ display: "flex", gap: 8 }}>
						<div className="admin-field" style={{ flex: 1 }}>
							<label className="admin-label">Link</label>
							<input className="admin-input" value={cat.link ?? ""} onChange={e => updateCategory(i, "link", e.target.value)} />
						</div>
						<div className="admin-field" style={{ flex: 1 }}>
							<label className="admin-label">Link Label</label>
							<input className="admin-input" value={cat.linkLabel ?? ""} onChange={e => updateCategory(i, "linkLabel", e.target.value)} />
						</div>
					</div>
				</div>
			))}
			<button className="admin-btn admin-btn--ghost" onClick={addCategory}>+ Add category</button>
		</div>
	);
}
