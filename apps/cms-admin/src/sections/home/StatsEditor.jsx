export default function StatsEditor({ data, onChange }) {
	const stats = data ?? [];

	function updateStat(i, field, val) {
		const next = [...stats];
		next[i] = { ...next[i], [field]: val };
		onChange(next);
	}

	function addStat() {
		onChange([...stats, { value: "", label: "" }]);
	}

	function removeStat(i) {
		onChange(stats.filter((_, j) => j !== i));
	}

	return (
		<div>
			{stats.map((stat, i) => (
				<div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
					<input
						className="admin-input"
						placeholder="Value  e.g. 150K+"
						value={stat.value}
						onChange={(e) => updateStat(i, "value", e.target.value)}
						style={{ maxWidth: 150 }}
					/>
					<input
						className="admin-input"
						placeholder="Label  e.g. Sites Deployed"
						value={stat.label}
						onChange={(e) => updateStat(i, "label", e.target.value)}
					/>
					<button className="admin-btn admin-btn--ghost" onClick={() => removeStat(i)}>
						Remove
					</button>
				</div>
			))}
			<button className="admin-btn admin-btn--ghost" onClick={addStat}>
				+ Add stat
			</button>
		</div>
	);
}
