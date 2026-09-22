export default function TestimonialsEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", titleHighlight: "", items: [] };

	function set(field, val) {
		onChange({ ...d, [field]: val });
	}

	function updateItem(i, field, val) {
		const items = [...d.items];
		items[i] = { ...items[i], [field]: val };
		onChange({ ...d, items });
	}

	function addItem() {
		onChange({ ...d, items: [...d.items, { initials: "", name: "", role: "", quote: "" }] });
	}

	function removeItem(i) {
		onChange({ ...d, items: d.items.filter((_, j) => j !== i) });
	}

	return (
		<div>
			<div className="admin-field">
				<label className="admin-label">Eyebrow</label>
				<input className="admin-input" value={d.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Title</label>
				<input className="admin-input" value={d.title} onChange={(e) => set("title", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Title Highlight (renders in blue)</label>
				<input
					className="admin-input"
					value={d.titleHighlight}
					onChange={(e) => set("titleHighlight", e.target.value)}
				/>
			</div>

			<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>
				Testimonials
			</label>
			{d.items.map((item, i) => (
				<div
					key={i}
					style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 12, marginBottom: 12 }}
				>
					<div style={{ display: "flex", gap: 8 }}>
						<div className="admin-field" style={{ flex: "0 0 90px" }}>
							<label className="admin-label">Initials</label>
							<input
								className="admin-input"
								value={item.initials}
								maxLength={3}
								onChange={(e) => updateItem(i, "initials", e.target.value)}
							/>
						</div>
						<div className="admin-field" style={{ flex: 1 }}>
							<label className="admin-label">Name</label>
							<input
								className="admin-input"
								value={item.name}
								onChange={(e) => updateItem(i, "name", e.target.value)}
							/>
						</div>
					</div>
					<div className="admin-field">
						<label className="admin-label">Role</label>
						<input className="admin-input" value={item.role} onChange={(e) => updateItem(i, "role", e.target.value)} />
					</div>
					<div className="admin-field">
						<label className="admin-label">Quote</label>
						<textarea
							className="admin-textarea"
							value={item.quote}
							onChange={(e) => updateItem(i, "quote", e.target.value)}
						/>
					</div>
					<button className="admin-btn admin-btn--ghost" onClick={() => removeItem(i)}>
						Remove
					</button>
				</div>
			))}
			<button className="admin-btn admin-btn--ghost" onClick={addItem}>
				+ Add testimonial
			</button>
		</div>
	);
}
