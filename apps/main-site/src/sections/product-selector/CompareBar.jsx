export default function CompareBar({ compareIds, products, toggleCompare, onOpenCompare, onClearCompare }) {
	if (compareIds.length === 0) return null;

	return (
		<div style={{
			position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
			background: "#0B123C", color: "white",
			padding: "12px 110px 12px 24px",
			display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10,
			boxShadow: "0 -4px 20px rgba(0,0,0,0.25)",
		}}>
			<span style={{ fontSize: 13, fontWeight: 600 }}>{compareIds.length} selected</span>
			{compareIds.map(id => {
				const p = products.find(x => x.id === id);
				return p ? (
					<span key={id} style={{ fontSize: 12, background: "rgba(255,255,255,0.15)", padding: "4px 10px", borderRadius: 999, display: "flex", alignItems: "center", gap: 6 }}>
						{p.name}
						<button onClick={() => toggleCompare(id)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 15, lineHeight: 1, padding: 0 }}>×</button>
					</span>
				) : null;
			})}
			<div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
				{compareIds.length >= 2 && (
					<button
						onClick={onOpenCompare}
						style={{ background: "#E63946", border: "none", color: "white", padding: "8px 18px", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
					>
						Compare
					</button>
				)}
				<button
					onClick={onClearCompare}
					style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "8px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
				>
					Clear
				</button>
			</div>
		</div>
	);
}
