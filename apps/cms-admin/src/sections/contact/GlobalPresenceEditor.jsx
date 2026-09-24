export default function GlobalPresenceEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", titleHighlight: "", subtitle: "", hqCountry: "IND", countriesServed: [] };

	function set(field, val) {
		onChange({ ...d, [field]: val });
	}

	function setCountriesServed(val) {
		onChange({ ...d, countriesServed: val.split(",").map(s => s.trim()).filter(Boolean) });
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
			<div className="admin-field" style={{ maxWidth: 160 }}>
				<label className="admin-label">HQ Country (ISO alpha-3)</label>
				<input className="admin-input" value={d.hqCountry} maxLength={3} placeholder="IND" onChange={e => set("hqCountry", e.target.value.toUpperCase())} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Countries Served (comma-separated ISO alpha-3 codes)</label>
				<p style={{ fontSize: 12, color: "var(--admin-muted)", margin: "0 0 6px" }}>
					e.g. NGA, GHA, KEN, SAU, ARE — use ISO 3166-1 alpha-3 codes.
					Currently {(d.countriesServed ?? []).length} countries.
				</p>
				<textarea
					className="admin-textarea"
					style={{ minHeight: 120, fontFamily: "monospace", fontSize: 13 }}
					value={(d.countriesServed ?? []).join(", ")}
					onChange={e => setCountriesServed(e.target.value)}
				/>
			</div>
		</div>
	);
}
