export default function AboutEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", description: "", offersEyebrow: "", offers: [] };

	function set(field, val) { onChange({ ...d, [field]: val }); }

	function updateOffer(i, field, val) {
		const offers = [...(d.offers ?? [])];
		offers[i] = { ...offers[i], [field]: val };
		onChange({ ...d, offers });
	}
	function addOffer() { onChange({ ...d, offers: [...(d.offers ?? []), { icon: "layers", title: "", description: "" }] }); }
	function removeOffer(i) { onChange({ ...d, offers: (d.offers ?? []).filter((_, j) => j !== i) }); }
	function moveOffer(i, dir) {
		const j = i + dir;
		const offers = [...(d.offers ?? [])];
		if (j < 0 || j >= offers.length) return;
		[offers[i], offers[j]] = [offers[j], offers[i]];
		onChange({ ...d, offers });
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
			<div className="admin-field">
				<label className="admin-label">Description</label>
				<textarea className="admin-textarea" rows={5} value={d.description ?? ""} onChange={e => set("description", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Offers Eyebrow</label>
				<input className="admin-input" value={d.offersEyebrow ?? ""} onChange={e => set("offersEyebrow", e.target.value)} />
			</div>

			<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>Offer Cards</label>
			{(d.offers ?? []).map((offer, i) => (
				<div key={i} style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 12, marginBottom: 12 }}>
					<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
						<span style={{ fontWeight: 600, fontSize: 13 }}>Offer {i + 1}{offer.title ? ` — ${offer.title}` : ""}</span>
						<div style={{ display: "flex", gap: 4 }}>
							<button className="admin-btn admin-btn--ghost" onClick={() => moveOffer(i, -1)} disabled={i === 0}>↑</button>
							<button className="admin-btn admin-btn--ghost" onClick={() => moveOffer(i, 1)} disabled={i === (d.offers ?? []).length - 1}>↓</button>
							<button className="admin-btn admin-btn--ghost" onClick={() => removeOffer(i)}>✕</button>
						</div>
					</div>
					<div className="admin-field">
						<label className="admin-label">Icon</label>
						<select className="admin-input" value={offer.icon ?? "layers"} onChange={e => updateOffer(i, "icon", e.target.value)}>
							<option value="layers">Layers (Innovative Products)</option>
							<option value="shield">Shield (Smart & Secure)</option>
							<option value="wifi">Wifi (Empower Field Force)</option>
						</select>
					</div>
					<div className="admin-field">
						<label className="admin-label">Title</label>
						<input className="admin-input" value={offer.title ?? ""} onChange={e => updateOffer(i, "title", e.target.value)} />
					</div>
					<div className="admin-field">
						<label className="admin-label">Description</label>
						<textarea className="admin-textarea" value={offer.description ?? ""} onChange={e => updateOffer(i, "description", e.target.value)} />
					</div>
				</div>
			))}
			<button className="admin-btn admin-btn--ghost" onClick={addOffer}>+ Add offer</button>
		</div>
	);
}
