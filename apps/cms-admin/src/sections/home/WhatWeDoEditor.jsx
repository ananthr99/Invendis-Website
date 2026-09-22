const ICON_OPTIONS = ["tower", "solar", "meter", "network", "platform", "design"];

export default function WhatWeDoEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", titleHighlight: "", subtitle: "", cards: [] };

	function set(field, val) {
		onChange({ ...d, [field]: val });
	}

	function updateCard(i, field, val) {
		const cards = [...d.cards];
		cards[i] = { ...cards[i], [field]: val };
		onChange({ ...d, cards });
	}

	function addCard() {
		onChange({ ...d, cards: [...d.cards, { icon: "tower", title: "", description: "" }] });
	}

	function removeCard(i) {
		onChange({ ...d, cards: d.cards.filter((_, j) => j !== i) });
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
                <label className="admin-label">Title Highlight (brand-red)</label>
                <input className="admin-input" value={d.titleHighlight ?? ""} onChange={(e) => set("titleHighlight", e.target.value)} />
            </div>
			<div className="admin-field">
				<label className="admin-label">Subtitle</label>
				<textarea className="admin-textarea" value={d.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
			</div>

			<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>
				Cards
			</label>
			{d.cards.map((card, i) => (
				<div
					key={i}
					style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 12, marginBottom: 12 }}
				>
					<div className="admin-field">
						<label className="admin-label">Icon</label>
						<select className="admin-input" value={card.icon} onChange={(e) => updateCard(i, "icon", e.target.value)}>
							{ICON_OPTIONS.map((opt) => (
								<option key={opt} value={opt}>
									{opt}
								</option>
							))}
						</select>
					</div>
					<div className="admin-field">
						<label className="admin-label">Title</label>
						<input
							className="admin-input"
							value={card.title}
							onChange={(e) => updateCard(i, "title", e.target.value)}
						/>
					</div>
					<div className="admin-field">
						<label className="admin-label">Description</label>
						<textarea
							className="admin-textarea"
							value={card.description}
							onChange={(e) => updateCard(i, "description", e.target.value)}
						/>
					</div>
					<button className="admin-btn admin-btn--ghost" onClick={() => removeCard(i)}>
						Remove card
					</button>
				</div>
			))}
			<button className="admin-btn admin-btn--ghost" onClick={addCard}>
				+ Add card
			</button>
		</div>
	);
}
