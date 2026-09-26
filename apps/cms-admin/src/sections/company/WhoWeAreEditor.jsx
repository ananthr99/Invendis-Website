const ICON_OPTIONS = ["target", "eye", "layers"];

function CardEditor({ card, onChange, onRemove }) {
	function set(field, val) { onChange({ ...card, [field]: val }); }

	return (
		<div style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 16, marginBottom: 12, background: "var(--admin-bg)" }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
				<span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>{card.title || "Untitled Card"}</span>
				<button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-red)", fontSize: 18, lineHeight: 1, padding: "0 2px" }}>✕</button>
			</div>
			<div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12, marginBottom: 12 }}>
				<div className="admin-field">
					<label className="admin-label">Icon</label>
					<select className="admin-input" value={card.icon ?? ""} onChange={e => set("icon", e.target.value)}>
						<option value="">Select icon…</option>
						{ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
					</select>
				</div>
				<div className="admin-field">
					<label className="admin-label">Title</label>
					<input className="admin-input" value={card.title ?? ""} onChange={e => set("title", e.target.value)} />
				</div>
			</div>
			<div className="admin-field">
				<label className="admin-label">Body</label>
				<textarea className="admin-textarea" rows={3} value={card.body ?? ""} onChange={e => set("body", e.target.value)} />
			</div>
		</div>
	);
}

export default function WhoWeAreEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", cards: [] };
	function set(field, val) { onChange({ ...d, [field]: val }); }

	function addCard() { onChange({ ...d, cards: [...(d.cards ?? []), { icon: "", title: "", body: "" }] }); }
	function updateCard(i, val) { const cards = [...(d.cards ?? [])]; cards[i] = val; onChange({ ...d, cards }); }
	function removeCard(i) { onChange({ ...d, cards: (d.cards ?? []).filter((_, idx) => idx !== i) }); }

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
				<h4 style={{ margin: 0, fontSize: 14 }}>Cards ({(d.cards ?? []).length})</h4>
				<button className="admin-btn admin-btn--ghost" onClick={addCard}>+ Add Card</button>
			</div>
			{(d.cards ?? []).map((card, i) => (
				<CardEditor key={i} card={card} onChange={val => updateCard(i, val)} onRemove={() => removeCard(i)} />
			))}
		</div>
	);
}
