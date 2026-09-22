export default function TrustedByEditor({ data, onChange }) {
	const d = data ?? { heading: "", clients: [] };

	function updateClient(i, val) {
		const clients = [...d.clients];
		clients[i] = val;
		onChange({ ...d, clients });
	}

	function addClient() {
		onChange({ ...d, clients: [...d.clients, ""] });
	}

	function removeClient(i) {
		onChange({ ...d, clients: d.clients.filter((_, j) => j !== i) });
	}

	return (
		<div>
			<div className="admin-field">
				<label className="admin-label">Heading</label>
				<input
					className="admin-input"
					value={d.heading}
					onChange={(e) => onChange({ ...d, heading: e.target.value })}
				/>
			</div>
			<label className="admin-label" style={{ display: "block", marginBottom: 8 }}>
				Client Names
			</label>
			{d.clients.map((name, i) => (
				<div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
					<input className="admin-input" value={name} onChange={(e) => updateClient(i, e.target.value)} />
					<button className="admin-btn admin-btn--ghost" onClick={() => removeClient(i)}>
						✕
					</button>
				</div>
			))}
			<button className="admin-btn admin-btn--ghost" onClick={addClient}>
				+ Add client
			</button>
		</div>
	);
}
