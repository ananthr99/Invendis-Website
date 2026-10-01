import SerialDropdown from "./SerialDropdown.jsx";

export default function FilterBar({
	q, cats, catFilter, catCounts, allCount,
	cellularFilter, wifiFilter, portsFilter, serialFilter,
	hasFilters, setParam, clearFilters,
	indexLoading, filtered, page, itemsPerPage,
}) {
	return (
		<div style={{ marginBottom: 24 }}>
			<input
				type="text"
				value={q}
				onChange={e => setParam("q", e.target.value)}
				placeholder="Search products…"
				style={{
					display: "block", width: "100%",
					padding: "9px 14px", borderRadius: 8,
					border: "1px solid #e5e7eb", fontSize: 14,
					outline: "none", marginBottom: 12, background: "white",
				}}
			/>

			<div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
				{["", ...cats].map(cat => (
					<button
						key={cat || "all"}
						onClick={() => setParam("cat", cat)}
						style={{
							padding: "5px 14px", borderRadius: 999,
							border: `1.5px solid ${catFilter === cat ? "#0B123C" : "#d1d5db"}`,
							background: catFilter === cat ? "#0B123C" : "white",
							color: catFilter === cat ? "white" : "#374151",
							fontSize: 12, fontWeight: 600, cursor: "pointer",
						}}
					>
						{cat ? `${cat} (${catCounts[cat] || 0})` : `All Products (${allCount})`}
					</button>
				))}
			</div>

			<div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "stretch", width: "100%" }}>
				<select
					value={cellularFilter}
					onChange={e => setParam("cellular", e.target.value)}
					style={{ flex: 1, minWidth: 130, padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 12, background: "white", color: "#374151", cursor: "pointer" }}
				>
					<option value="">Cellular: Any</option>
					<option value="5G">5G</option>
					<option value="4G">4G</option>
					<option value="3G">3G</option>
					<option value="-">No Cellular</option>
				</select>

				<select
					value={wifiFilter}
					onChange={e => setParam("wifi", e.target.value)}
					style={{ flex: 1, minWidth: 130, padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 12, background: "white", color: "#374151", cursor: "pointer" }}
				>
					<option value="">Wi-Fi: Any</option>
					<option value="WiFi6">Wi-Fi 6</option>
					<option value="WiFi5">Wi-Fi 5</option>
					<option value="WiFi4">Wi-Fi 4</option>
					<option value="-">No Wi-Fi</option>
				</select>

				<select
					value={portsFilter}
					onChange={e => setParam("ports", e.target.value)}
					style={{ flex: 1, minWidth: 130, padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 12, background: "white", color: "#374151", cursor: "pointer" }}
				>
					<option value="">Ports: Any</option>
					<option value="1-2">1–2 ports</option>
					<option value="3-4">3–4 ports</option>
					<option value="5+">5+ ports</option>
				</select>

				<SerialDropdown
					value={serialFilter}
					onChange={v => setParam("serial", v)}
				/>

				{hasFilters && (
					<button
						onClick={clearFilters}
						style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #E63946", background: "transparent", color: "#E63946", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
					>
						Clear filters
					</button>
				)}
			</div>

			<p style={{ fontSize: 13, color: "#6b7280", marginTop: 16 }}>
				{indexLoading ? "Loading…" : filtered.length === 0 ? "0 products found"
					: `Showing ${(page - 1) * itemsPerPage + 1}–${Math.min(page * itemsPerPage, filtered.length)} of ${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
			</p>
		</div>
	);
}
