export default function GlobalReachEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", titleHighlight: "", subtitle: "", regions: [] };

	function set(field, val) {
		onChange({ ...d, [field]: val });
	}

	function updateRegion(i, field, val) {
		const regions = [...d.regions];
		regions[i] = { ...regions[i], [field]: val };
		onChange({ ...d, regions });
	}

	function updateCountries(i, val) {
		const regions = [...d.regions];
		regions[i] = { ...regions[i], countries: val.split(",").map(s => s.trim()).filter(Boolean) };
		onChange({ ...d, regions });
	}

	function addRegion() {
		onChange({ ...d, regions: [...d.regions, { name: "", countries: [] }] });
	}

	function removeRegion(i) {
		onChange({ ...d, regions: d.regions.filter((_, j) => j !== i) });
	}

	function moveRegion(i, dir) {
		const regions = [...d.regions];
		const j = i + dir;
		if (j < 0 || j >= regions.length) return;
		[regions[i], regions[j]] = [regions[j], regions[i]];
		onChange({ ...d, regions });
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
				<label className="admin-label">Title Highlight (renders in red)</label>
				<input className="admin-input" value={d.titleHighlight} onChange={e => set("titleHighlight", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Subtitle</label>
				<textarea className="admin-textarea" value={d.subtitle} onChange={e => set("subtitle", e.target.value)} />
			</div>

			<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>
				Regions
			</label>
			{d.regions.map((region, i) => (
				<div key={i} style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 12, marginBottom: 12 }}>
					<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
						<span style={{ fontWeight: 600, fontSize: 13 }}>Region {i + 1}{region.name ? ` — ${region.name}` : ""}</span>
						<div style={{ display: "flex", gap: 4 }}>
							<button className="admin-btn admin-btn--ghost" onClick={() => moveRegion(i, -1)} disabled={i === 0}>↑</button>
							<button className="admin-btn admin-btn--ghost" onClick={() => moveRegion(i, 1)} disabled={i === d.regions.length - 1}>↓</button>
							<button className="admin-btn admin-btn--ghost" onClick={() => removeRegion(i)}>✕</button>
						</div>
					</div>
					<div className="admin-field">
						<label className="admin-label">Region Name</label>
						<input className="admin-input" value={region.name} onChange={e => updateRegion(i, "name", e.target.value)} />
					</div>
					<div className="admin-field">
						<label className="admin-label">Countries (comma-separated)</label>
						<textarea
							className="admin-textarea"
							style={{ minHeight: 60 }}
							value={(region.countries ?? []).join(", ")}
							onChange={e => updateCountries(i, e.target.value)}
						/>
					</div>
				</div>
			))}
			<button className="admin-btn admin-btn--ghost" onClick={addRegion}>+ Add region</button>
		</div>
	);
}
