const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function wifiLabel(v) {
	if (!v || v === "-") return null;
	if (v === "WiFi6") return "Wi-Fi 6";
	if (v === "WiFi5") return "Wi-Fi 5";
	if (v === "WiFi4") return "Wi-Fi 4";
	return v;
}

export default function ProductCard({ product, onView, onCompare, isCompared, compareDisabled, catColors }) {
	const colors = catColors?.[product.cat] ?? { bg: "#EEF0F3", fg: "#3A4D63" };

	return (
		<div
			className="border border-t-4 border-black/5 border-t-transparent transition-all hover:border-t-brand-red hover:shadow-md"
			style={{
				background: "white", borderRadius: 12,
				overflow: "hidden",
				display: "flex", flexDirection: "column",
				boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
		}}>
			<div style={{ height: 160, background: "white", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", position: "relative" }}>
				{product.image
					? <img src={product.image.startsWith("http") ? product.image : `${BASE}${product.image}`} alt={product.name} loading="lazy" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
					: <span style={{ color: "#d1d5db", fontSize: 12 }}>No image</span>
				}
				<span style={{
					position: "absolute", top: 8, right: 8,
					background: colors.bg, color: colors.fg,
					fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, letterSpacing: "0.05em",
				}}>
					{product.cat}
				</span>
			</div>
			<div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", borderTop: "1px solid #e5e7eb" }}>
				<h3 className="font-heading" style={{ fontSize: 15, fontWeight: 700, color: "#0B123C", marginBottom: 5, lineHeight: 1.3 }}>
					{product.name}
				</h3>
				<p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
					{product.desc}
				</p>
				<div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: "auto", paddingTop: 10 }}>
					{product.cellular_gen && product.cellular_gen !== "-" && (
						<span style={{ fontSize: 9, fontWeight: 600, padding: "1px 5px", borderRadius: 999, background: "#E0F2FE", color: "#0369A1" }}>
							{product.cellular_gen}
						</span>
					)}
					{wifiLabel(product.wifi) && (
						<span style={{ fontSize: 9, fontWeight: 600, padding: "1px 5px", borderRadius: 999, background: "#F0FDF4", color: "#15803D" }}>
							{wifiLabel(product.wifi)}
						</span>
					)}
					{product.ports && product.ports !== "-" && (
						<span style={{ fontSize: 9, fontWeight: 600, padding: "1px 5px", borderRadius: 999, background: "#FEF3C7", color: "#92400E" }}>
							{product.ports} ports
						</span>
					)}
				</div>
				{product.use_cases?.length > 0 && (
					<div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
						{product.use_cases.slice(0, 3).map((u, i) => (
							<span key={i} style={{
								fontSize: 9,
								padding: "1px 6px", borderRadius: 999,
								background: "rgba(11,18,60,0.06)", color: "#374151",
								border: "1px solid rgba(11,18,60,0.08)",
							}}>
								{u}
							</span>
						))}
						{product.use_cases.length > 3 && (
							<span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 999, background: "#f3f4f6", color: "#9ca3af" }}>
								+{product.use_cases.length - 3} more
							</span>
						)}
					</div>
				)}
				<div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "center" }}>
					<button
						onClick={() => onView(product.id)}
						style={{
							flex: 1, background: "#0B123C", color: "white",
							border: "none", borderRadius: 6, padding: "8px 0",
							fontSize: 12, fontWeight: 600, cursor: "pointer",
						}}
					>
						View Details
					</button>
					<label style={{
						display: "flex", alignItems: "center", gap: 5,
						cursor: compareDisabled && !isCompared ? "not-allowed" : "pointer",
						fontSize: 11, color: "#6b7280", whiteSpace: "nowrap",
					}}>
						<input
							type="checkbox"
							checked={isCompared}
							disabled={compareDisabled && !isCompared}
							onChange={() => onCompare(product.id)}
							style={{ accentColor: "#E63946" }}
						/>
						Compare
					</label>
				</div>
			</div>
		</div>
	);
}
