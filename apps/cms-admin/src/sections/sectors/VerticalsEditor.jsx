export default function VerticalsEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", titleHighlight: "", subtitle: "", items: [] };

	function set(field, val) {
		onChange({ ...d, [field]: val });
	}

	function updateItem(i, field, val) {
		const items = [...d.items];
		items[i] = { ...items[i], [field]: val };
		onChange({ ...d, items });
	}

	function updateImage(i, val) {
		const items = [...d.items];
		items[i] = { ...items[i], image: val.split("\n").map(s => s.trim()).filter(Boolean) };
		onChange({ ...d, items });
	}

	function updateTag(i, ti, val) {
		const items = [...d.items];
		const tags = [...(items[i].tags ?? [])];
		tags[ti] = val;
		items[i] = { ...items[i], tags };
		onChange({ ...d, items });
	}
	function addTag(i) {
		const items = [...d.items];
		items[i] = { ...items[i], tags: [...(items[i].tags ?? []), ""] };
		onChange({ ...d, items });
	}
	function removeTag(i, ti) {
		const items = [...d.items];
		items[i] = { ...items[i], tags: (items[i].tags ?? []).filter((_, j) => j !== ti) };
		onChange({ ...d, items });
	}

	function updateClient(i, ci, val) {
		const items = [...d.items];
		const clients = [...(items[i].clients ?? [])];
		clients[ci] = val;
		items[i] = { ...items[i], clients };
		onChange({ ...d, items });
	}
	function addClient(i) {
		const items = [...d.items];
		items[i] = { ...items[i], clients: [...(items[i].clients ?? []), ""] };
		onChange({ ...d, items });
	}
	function removeClient(i, ci) {
		const items = [...d.items];
		items[i] = { ...items[i], clients: (items[i].clients ?? []).filter((_, j) => j !== ci) };
		onChange({ ...d, items });
	}

	function addItem() {
		onChange({ ...d, items: [...d.items, { key: "", name: "", description: "", tags: [], clients: [], image: [] }] });
	}
	function removeItem(i) {
		onChange({ ...d, items: d.items.filter((_, j) => j !== i) });
	}
	function moveItem(i, dir) {
		const items = [...d.items];
		const j = i + dir;
		if (j < 0 || j >= items.length) return;
		[items[i], items[j]] = [items[j], items[i]];
		onChange({ ...d, items });
	}

	return (
		<div>
			<div className="admin-field">
				<label className="admin-label">Eyebrow</label>
				<input className="admin-input" value={d.eyebrow} onChange={e => set("eyebrow", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Title</label>
				<input className="admin-input" value={d.title} onChange={e => set("title", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Title Highlight (renders in blue)</label>
				<input className="admin-input" value={d.titleHighlight} onChange={e => set("titleHighlight", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Subtitle</label>
				<textarea className="admin-textarea" value={d.subtitle} onChange={e => set("subtitle", e.target.value)} />
			</div>

			<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>
				Verticals
			</label>
			{d.items.map((item, i) => (
				<div key={i} style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 12, marginBottom: 16 }}>
					<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
						<span style={{ fontWeight: 600, fontSize: 13 }}>
							Vertical {i + 1}{item.name ? ` — ${item.name}` : ""}
						</span>
						<div style={{ display: "flex", gap: 4 }}>
							<button className="admin-btn admin-btn--ghost" onClick={() => moveItem(i, -1)} disabled={i === 0}>↑</button>
							<button className="admin-btn admin-btn--ghost" onClick={() => moveItem(i, 1)} disabled={i === d.items.length - 1}>↓</button>
							<button className="admin-btn admin-btn--ghost" onClick={() => removeItem(i)}>✕</button>
						</div>
					</div>

					<div style={{ display: "flex", gap: 8 }}>
						<div className="admin-field" style={{ flex: "0 0 100px" }}>
							<label className="admin-label">Key</label>
							<input className="admin-input" value={item.key} onChange={e => updateItem(i, "key", e.target.value)} />
						</div>
						<div className="admin-field" style={{ flex: 1 }}>
							<label className="admin-label">Name</label>
							<input className="admin-input" value={item.name} onChange={e => updateItem(i, "name", e.target.value)} />
						</div>
					</div>

					<div className="admin-field">
						<label className="admin-label">Description</label>
						<textarea className="admin-textarea" value={item.description} onChange={e => updateItem(i, "description", e.target.value)} />
					</div>

					<div className="admin-field">
						<label className="admin-label">Images (one path per line)</label>
						<textarea
							className="admin-textarea"
							style={{ minHeight: 60, fontFamily: "monospace", fontSize: 12 }}
							value={(Array.isArray(item.image) ? item.image : item.image ? [item.image] : []).join("\n")}
							onChange={e => updateImage(i, e.target.value)}
						/>
					</div>

					<label className="admin-label">Tags</label>
					{(item.tags ?? []).map((tag, ti) => (
						<div key={ti} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
							<input className="admin-input" value={tag} onChange={e => updateTag(i, ti, e.target.value)} />
							<button className="admin-btn admin-btn--ghost" onClick={() => removeTag(i, ti)}>✕</button>
						</div>
					))}
					<button className="admin-btn admin-btn--ghost" style={{ marginBottom: 12 }} onClick={() => addTag(i)}>
						+ Add tag
					</button>

					<label className="admin-label" style={{ display: "block", marginTop: 8 }}>Key Clients</label>
					{(item.clients ?? []).map((client, ci) => (
						<div key={ci} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
							<input className="admin-input" value={client} onChange={e => updateClient(i, ci, e.target.value)} />
							<button className="admin-btn admin-btn--ghost" onClick={() => removeClient(i, ci)}>✕</button>
						</div>
					))}
					<button className="admin-btn admin-btn--ghost" onClick={() => addClient(i)}>+ Add client</button>
				</div>
			))}
			<button className="admin-btn admin-btn--ghost" onClick={addItem}>+ Add vertical</button>
		</div>
	);
}
