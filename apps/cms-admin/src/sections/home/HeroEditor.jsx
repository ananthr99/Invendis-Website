export default function HeroEditor({ data, onChange }) {
	const d = data ?? { title: "", titleHighlight: "", subtitle: "", cta: { label: "", href: "" }, productGroups: [] };

	function set(field, val) {
		onChange({ ...d, [field]: val });
	}

	function updateCta(field, val) {
		onChange({ ...d, cta: { ...d.cta, [field]: val } });
	}

	function updateGroup(gi, field, val) {
		const groups = [...d.productGroups];
		groups[gi] = { ...groups[gi], [field]: val };
		onChange({ ...d, productGroups: groups });
	}

	function addGroup() {
		onChange({ ...d, productGroups: [...d.productGroups, { heading: "", items: [] }] });
	}

	function removeGroup(gi) {
		onChange({ ...d, productGroups: d.productGroups.filter((_, i) => i !== gi) });
	}

	function updateItem(gi, ii, val) {
		const groups = [...d.productGroups];
		const items = [...groups[gi].items];
		items[ii] = val;
		groups[gi] = { ...groups[gi], items };
		onChange({ ...d, productGroups: groups });
	}

	function addItem(gi) {
		const groups = [...d.productGroups];
		groups[gi] = { ...groups[gi], items: [...groups[gi].items, ""] };
		onChange({ ...d, productGroups: groups });
	}

	function removeItem(gi, ii) {
		const groups = [...d.productGroups];
		groups[gi] = { ...groups[gi], items: groups[gi].items.filter((_, i) => i !== ii) };
		onChange({ ...d, productGroups: groups });
	}

	return (
		<div>
			<div className="admin-field">
				<label className="admin-label">Title</label>
				<input className="admin-input" value={d.title} onChange={(e) => set("title", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Title Highlight (renders in red)</label>
				<input
					className="admin-input"
					value={d.titleHighlight}
					onChange={(e) => set("titleHighlight", e.target.value)}
				/>
			</div>
			<div className="admin-field">
				<label className="admin-label">Subtitle</label>
				<textarea className="admin-textarea" value={d.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">CTA Label</label>
				<input
					className="admin-input"
					value={d.cta?.label ?? ""}
					onChange={(e) => updateCta("label", e.target.value)}
				/>
			</div>
			<div className="admin-field">
				<label className="admin-label">CTA Link</label>
				<input className="admin-input" value={d.cta?.href ?? ""} onChange={(e) => updateCta("href", e.target.value)} />
			</div>

			<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>
				Product Groups
			</label>
			{d.productGroups.map((group, gi) => (
				<div
					key={gi}
					style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 12, marginBottom: 12 }}
				>
					<div className="admin-field">
						<label className="admin-label">Group Heading</label>
						<input
							className="admin-input"
							value={group.heading}
							onChange={(e) => updateGroup(gi, "heading", e.target.value)}
						/>
					</div>
					<label className="admin-label">Items</label>
					{group.items.map((item, ii) => (
						<div key={ii} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
							<input className="admin-input" value={item} onChange={(e) => updateItem(gi, ii, e.target.value)} />
							<button className="admin-btn admin-btn--ghost" onClick={() => removeItem(gi, ii)}>
								✕
							</button>
						</div>
					))}
					<div style={{ display: "flex", gap: 8, marginTop: 8 }}>
						<button className="admin-btn admin-btn--ghost" onClick={() => addItem(gi)}>
							+ Add item
						</button>
						<button className="admin-btn admin-btn--ghost" onClick={() => removeGroup(gi)}>
							Remove group
						</button>
					</div>
				</div>
			))}
			<button className="admin-btn admin-btn--ghost" onClick={addGroup}>
				+ Add product group
			</button>
		</div>
	);
}
