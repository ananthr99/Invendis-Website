export default function PerksEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", items: [] };

	function set(field, val) { onChange({ ...d, [field]: val }); }

	function updateItem(i, field, val) {
		const items = [...(d.items ?? [])];
		items[i] = { ...items[i], [field]: val };
		onChange({ ...d, items });
	}
	function addItem() { onChange({ ...d, items: [...(d.items ?? []), { icon: "heart", title: "", description: "" }] }); }
	function removeItem(i) { onChange({ ...d, items: (d.items ?? []).filter((_, j) => j !== i) }); }
	function moveItem(i, dir) {
		const j = i + dir;
		const items = [...(d.items ?? [])];
		if (j < 0 || j >= items.length) return;
		[items[i], items[j]] = [items[j], items[i]];
		onChange({ ...d, items });
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

			<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>Perk Cards</label>
			{(d.items ?? []).map((item, i) => (
				<div key={i} style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 12, marginBottom: 12 }}>
					<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
						<span style={{ fontWeight: 600, fontSize: 13 }}>Perk {i + 1}{item.title ? ` — ${item.title}` : ""}</span>
						<div style={{ display: "flex", gap: 4 }}>
							<button className="admin-btn admin-btn--ghost" onClick={() => moveItem(i, -1)} disabled={i === 0}>↑</button>
							<button className="admin-btn admin-btn--ghost" onClick={() => moveItem(i, 1)} disabled={i === (d.items ?? []).length - 1}>↓</button>
							<button className="admin-btn admin-btn--ghost" onClick={() => removeItem(i)}>✕</button>
						</div>
					</div>
					<div style={{ display: "flex", gap: 8 }}>
						<div className="admin-field" style={{ flex: "0 0 160px" }}>
							<label className="admin-label">Icon</label>
							<select className="admin-input" value={item.icon ?? "heart"} onChange={e => updateItem(i, "icon", e.target.value)}>
								<option value="heart">Heart (Health)</option>
								<option value="book">Book (Learning)</option>
								<option value="clock">Clock (Flexible Hours)</option>
								<option value="shield">Shield (Stability)</option>
								<option value="award">Award (Performance)</option>
								<option value="coffee">Coffee (Workspace)</option>
							</select>
						</div>
						<div className="admin-field" style={{ flex: 1 }}>
							<label className="admin-label">Title</label>
							<input className="admin-input" value={item.title ?? ""} onChange={e => updateItem(i, "title", e.target.value)} />
						</div>
					</div>
					<div className="admin-field">
						<label className="admin-label">Description</label>
						<textarea className="admin-textarea" value={item.description ?? ""} onChange={e => updateItem(i, "description", e.target.value)} />
					</div>
				</div>
			))}
			<button className="admin-btn admin-btn--ghost" onClick={addItem}>+ Add perk</button>
		</div>
	);
}
