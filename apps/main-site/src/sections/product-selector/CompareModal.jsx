import { useState, useEffect } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const SPEC_FIELDS = [
	{ key: "cpu", label: "Processor" },
	{ key: "ram", label: "RAM" },
	{ key: "storage", label: "Storage" },
	{ key: "os", label: "Operating System" },
	{ key: "cell", label: "Cellular Module" },
	{ key: "cellular_gen", label: "Cellular Generation" },
	{ key: "wifi", label: "Wi-Fi" },
	{ key: "rs485", label: "RS-485" },
	{ key: "rs232", label: "RS-232" },
	{ key: "ports", label: "Port Count" },
	{ key: "ip", label: "IP Rating" },
	{ key: "power", label: "Power Supply" },
	{ key: "housing", label: "Housing" },
	{ key: "dims", label: "Dimensions" },
	{ key: "weight", label: "Weight" },
	{ key: "op_temp", label: "Operating Temp." },
];

export default function CompareModal({ ids, onClose }) {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		Promise.all(
			ids.map(id =>
				fetch(`${BASE}/content/productSelector/products/${id}.json?t=${Date.now()}`)
					.then(r => r.json())
					.catch(() => null)
			)
		).then(results => {
			setProducts(results.filter(Boolean));
			setLoading(false);
		});
	}, [ids.join(",")]);

	useEffect(() => {
		function onKey(e) { if (e.key === "Escape") onClose(); }
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);

	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => { document.body.style.overflow = ""; };
	}, []);

	const hiddenSets = products.map(p => new Set(p.hidden_fields ?? []));

	const rowDefs = [];
	SPEC_FIELDS.forEach(f => {
		const anyVisible = products.some((_, i) => !hiddenSets[i].has(f.key));
		if (anyVisible) {
			const vals = products.map((p, i) => hiddenSets[i].has(f.key) ? null : (p[f.key] || "—"));
			rowDefs.push({ label: f.label, vals });
		}
	});

	const seen = new Set();
	const addKeys = [];
	products.forEach(p => (p.additional_specs ?? []).forEach(s => {
		if (!seen.has(s.k)) { seen.add(s.k); addKeys.push(s.k); }
	}));
	addKeys.forEach(k => {
		const vals = products.map(p => {
			const s = (p.additional_specs ?? []).find(x => x.k === k);
			return s ? s.v : "—";
		});
		rowDefs.push({ label: k, vals });
	});

	return (
		<div
			onClick={e => { if (e.target === e.currentTarget) onClose(); }}
			style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", overflowY: "auto", padding: "40px 16px 32px" }}
		>
			<div style={{ background: "white", borderRadius: 16, maxWidth: 960, margin: "0 auto", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
				<div style={{ padding: "22px 28px 16px", display: "flex", alignItems: "center", borderBottom: "1px solid #f3f4f6" }}>
					<h2 className="font-heading" style={{ fontSize: 20, fontWeight: 800, color: "#0B123C", flex: 1 }}>Compare Products</h2>
					<button
						onClick={onClose}
						style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: 32, height: 32, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}
					>×</button>
				</div>

				<div style={{ display: "flex", gap: 24, padding: "8px 28px 10px", background: "#fafafa", borderBottom: "1px solid #f3f4f6", fontSize: 12, color: "#6b7280" }}>
					<span style={{ display: "flex", alignItems: "center", gap: 6 }}>
						<span style={{ width: 14, height: 14, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 2, display: "inline-block", flexShrink: 0 }} />
						Values differ
					</span>
					<span style={{ display: "flex", alignItems: "center", gap: 6 }}>
						<span style={{ width: 14, height: 14, background: "white", border: "1px solid #e5e7eb", borderRadius: 2, display: "inline-block", flexShrink: 0 }} />
						Values match
					</span>
				</div>

				{loading ? (
					<div style={{ padding: 80, textAlign: "center", color: "#9ca3af" }}>Loading…</div>
				) : (
					<div style={{ overflowX: "auto", paddingBottom: 24 }}>
						<table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
							<thead>
								<tr>
									<th style={{ width: "26%", padding: "14px 20px", textAlign: "left", borderBottom: "2px solid #e5e7eb", color: "#9ca3af", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
										Specification
									</th>
									{products.map(p => (
										<th key={p.id} style={{ padding: "14px 20px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
											<div style={{ fontWeight: 800, color: "#0B123C", fontSize: 15 }}>{p.name}</div>
											<div style={{ fontWeight: 400, color: "#6b7280", fontSize: 11, marginTop: 2 }}>{p.cat}</div>
										</th>
									))}
								</tr>
								<tr>
									<td style={{ padding: "12px 20px", borderBottom: "1px solid #f3f4f6" }} />
									{products.map(p => (
										<td key={p.id} style={{ padding: "12px 20px", borderBottom: "1px solid #f3f4f6", textAlign: "center" }}>
											{p.images?.[0] && (
												<img src={p.images[0].startsWith("http") ? p.images[0] : `${BASE}${p.images[0]}`} alt={p.name} loading="lazy" style={{ height: 72, maxWidth: "100%", objectFit: "contain" }} />
											)}
										</td>
									))}
								</tr>
							</thead>
							<tbody>
								{rowDefs.map((row, i) => {
									const nonNull = row.vals.filter(v => v !== null);
									const isDiff = nonNull.length > 1 && !nonNull.every(v => v === nonNull[0]);
									return (
										<tr key={i} style={{ background: isDiff ? "#FFFBEB" : i % 2 === 0 ? "white" : "#fafafa", borderBottom: "1px solid #f3f4f6" }}>
											<td style={{ padding: "9px 20px", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>{row.label}</td>
											{row.vals.map((val, j) => (
												<td key={j} style={{ padding: "9px 20px", color: !val || val === "—" ? "#9ca3af" : "#1f2937", fontWeight: isDiff && val && val !== "—" ? 600 : 400 }}>
													{val ?? "—"}
												</td>
											))}
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
