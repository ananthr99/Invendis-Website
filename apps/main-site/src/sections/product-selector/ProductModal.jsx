import { useState, useEffect } from "react";
import { useContent } from "../../hooks/useContent.js";
import { absoluteUrl } from "../../utils/siteUrl.js";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const CAT_COLORS = {
	"Intel Based Devices": { bg: "#FEF2F2", fg: "#991B1B" },
	Router: { bg: "#EAF2FB", fg: "#1260A8" },
	Gateway: { bg: "#E4F5EE", fg: "#0F6040" },
	Switch: { bg: "#FFF3E0", fg: "#8B5200" },
	"Energy Meter": { bg: "#F9EAF3", fg: "#7B2563" },
	Other: { bg: "#EEF0F3", fg: "#3A4D63" },
	PCB: { bg: "#ECFDF5", fg: "#065F46" },
	"Outdoor Unit": { bg: "#EEF2FF", fg: "#3730A3" },
};

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

function ImageCarousel({ images, name }) {
	const [idx, setIdx] = useState(0);
	if (!images?.length) return (
		<div style={{ height: 260, background: "#f3f4f6", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
			<span style={{ color: "#9ca3af", fontSize: 13 }}>No image available</span>
		</div>
	);
	return (
		<div>
			<div style={{ height: 260, background: "#f8f9fa", borderRadius: 12, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", position: "relative" }}>
				<img src={images[idx].startsWith("http") ? images[idx] : `${BASE}${images[idx]}`} alt={name || "Product Image"} loading="lazy" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
				{images.length > 1 && (
					<>
						<button
							onClick={() => setIdx(i => (i - 1 + images.length) % images.length)}
							style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}
						>‹</button>
						<button
							onClick={() => setIdx(i => (i + 1) % images.length)}
							style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}
						>›</button>
					</>
				)}
			</div>
			{images.length > 1 && (
				<div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 8 }}>
					{images.map((_, i) => (
						<button
							key={i}
							onClick={() => setIdx(i)}
							style={{ width: i === idx ? 18 : 6, height: 6, borderRadius: 3, border: "none", background: i === idx ? "#0B123C" : "#d1d5db", padding: 0, cursor: "pointer", transition: "all 0.2s" }}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function VariantsTable({ variants, part_datasheets }) {
	const { headers, rows } = variants;
	return (
		<div style={{ overflowX: "auto" }}>
			<table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 480 }}>
				<thead>
					<tr style={{ background: "#f3f4f6" }}>
						{headers.map(h => (
							<th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" }}>{h}</th>
						))}
						<th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>Datasheet</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row, i) => {
						const partNo = row[row.length - 1];
						const ds = part_datasheets?.[partNo];
						return (
							<tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
								{row.map((cell, j) => (
									<td key={j} style={{ padding: "8px 12px", color: cell === "✓" ? "#15803D" : cell === "—" ? "#9ca3af" : "#1f2937", fontWeight: cell === "✓" ? 700 : 400 }}>
										{cell}
									</td>
								))}
								<td style={{ padding: "8px 12px" }}>
									{ds === "contact_us"
										? <span style={{ fontSize: 12, color: "#E63946" }}>Contact Us</span>
										: ds
											? <a href={ds.startsWith("http") ? ds : `${BASE}${ds}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#1260A8", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
												<svg style={{ width: 13, height: 13 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
													<path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v11m0 0l-4-4m4 4l4-4" />
												</svg>
												PDF
											</a>
											: <span style={{ color: "#9ca3af", fontSize: 12 }}>—</span>
									}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

function injectSchema(id, schema) {
	let tag = document.querySelector(`script[data-schema="${id}"]`);
	if (!tag) {
		tag = document.createElement("script");
		tag.type = "application/ld+json";
		tag.setAttribute("data-schema", id);
		document.head.appendChild(tag);
	}
	tag.textContent = JSON.stringify(schema);
}

export default function ProductModal({ id, onClose, onCompare, isCompared, compareDisabled, catColors }) {
	const { data: product, loading } = useContent(`productSelector/products/${id}.json`, { withLoading: true });
	const [tab, setTab] = useState("specs");
	const d = product ?? {};
	const colors = catColors?.[d.cat] ?? CAT_COLORS[d.cat] ?? CAT_COLORS.Other;

	useEffect(() => { setTab("specs"); }, [id]);

	useEffect(() => {
		function onKey(e) { if (e.key === "Escape") onClose(); }
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);

	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => { document.body.style.overflow = ""; };
	}, []);

	useEffect(() => {
		if (!product) return;
		injectSchema("ld-product", {
			"@context": "https://schema.org",
			"@type": "Product",
			"name": product.name,
			"description": product.desc,
			"image": (product.images ?? []).map(img => absoluteUrl(img)),
			"brand": { "@type": "Brand", "name": "INVENDIS" },
			"url": absoluteUrl(`/products/product-selector/${product.id}`),
			"sku": product.id,
			"category": product.cat,
		});
		return () => {
			document.querySelector('script[data-schema="ld-product"]')?.remove();
		};
	}, [product]);

	const hidden = new Set(d.hidden_fields ?? []);
	const visibleSpecs = SPEC_FIELDS.filter(f => !hidden.has(f.key));
	const additionalSpecs = (d.additional_specs ?? []).map(s => ({ key: `_${s.k}`, label: s.k, val: s.v }));
	const allSpecs = [...visibleSpecs, ...additionalSpecs];

	const tabs = [
		{ key: "specs", label: "Specifications" },
		...(d.variants ? [{ key: "variants", label: "Variants" }] : []),
		...(d.datasheet ? [{ key: "datasheet", label: "Datasheet" }] : []),
	];

	return (
		<div
			onClick={e => { if (e.target === e.currentTarget) onClose(); }}
			style={{
				position: "fixed", inset: 0, zIndex: 200,
				background: "rgba(0,0,0,0.55)", overflowY: "auto",
				display: "flex", alignItems: "flex-start", justifyContent: "center",
				padding: "40px 16px 32px",
			}}
		>
			<div style={{ background: "white", borderRadius: 16, width: "100%", maxWidth: 920, position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
				<button
					onClick={onClose}
					style={{ position: "absolute", top: 14, right: 14, zIndex: 1, background: "#f3f4f6", border: "none", borderRadius: "50%", width: 32, height: 32, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}
				>×</button>

				{loading ? (
					<div style={{ padding: 80, textAlign: "center", color: "#9ca3af" }}>Loading…</div>
				) : (
					<div style={{ padding: "28px 28px 32px" }}>
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<ImageCarousel images={d.images} name={d.name} />
							<div>
								{d.cat && (
									<span style={{ display: "inline-block", background: colors.bg, color: colors.fg, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999, letterSpacing: "0.05em", marginBottom: 10 }}>
										{d.cat}
									</span>
								)}
								<h2 className="font-heading" style={{ fontSize: 22, fontWeight: 800, color: "#0B123C", lineHeight: 1.2, marginBottom: 10 }}>
									{d.name}
								</h2>
								<p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.65, marginBottom: 14 }}>{d.desc}</p>
								<label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: compareDisabled && !isCompared ? "not-allowed" : "pointer", color: "#374151", marginTop: 16 }}>
									<input
										type="checkbox"
										checked={isCompared}
										disabled={compareDisabled && !isCompared}
										onChange={() => onCompare(id)}
										style={{ accentColor: "#E63946" }}
									/>
									Add to compare
								</label>
							</div>
						</div>
                        {d.use_cases?.length > 0 && (
							<div style={{ marginTop: 20 }}>
								<p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
									Use Cases
								</p>
								<div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
									{d.use_cases.map((u, i) => (
										<span key={i} style={{
											fontSize: 12, fontWeight: 500,
											padding: "5px 14px", borderRadius: 999,
											background: "rgba(11,18,60,0.06)", color: "#0B123C",
											border: "1px solid rgba(11,18,60,0.1)",
										}}>
											{u}
										</span>
									))}
								</div>
							</div>
						)}
						<div style={{ marginTop: 24, borderBottom: "1px solid #e5e7eb", display: "flex" }}>
							{tabs.map(t => (
								<button
									key={t.key}
									onClick={() => setTab(t.key)}
									style={{
										padding: "10px 18px", border: "none", background: "none",
										fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
										color: tab === t.key ? "#E63946" : "#6b7280",
										borderBottom: `2px solid ${tab === t.key ? "#E63946" : "transparent"}`,
										cursor: "pointer", marginBottom: -1,
									}}
								>
									{t.label}
								</button>
							))}
						</div>

						<div style={{ marginTop: 20 }}>
							{tab === "specs" && (
								<table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
									<tbody>
										{allSpecs.map((spec, i) => {
											const val = spec.val ?? d[spec.key];
											if (!val || val === "-") return null;
											return (
												<tr key={spec.key} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "white" : "#fafafa" }}>
													<td style={{ padding: "9px 14px", fontWeight: 600, color: "#374151", width: "36%", verticalAlign: "top" }}>{spec.label}</td>
													<td style={{ padding: "9px 14px", color: "#1f2937" }}>{val}</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							)}
							{tab === "variants" && d.variants && (
								<VariantsTable variants={d.variants} part_datasheets={d.part_datasheets} />
							)}
							{tab === "datasheet" && d.datasheet && (
								<div style={{ padding: "1.5rem 0" }}>
									<a
										href={d.datasheet.startsWith("http") ? d.datasheet : `${BASE}${d.datasheet}`}
										target="_blank"
										rel="noopener noreferrer"
										style={{
											display: "inline-flex", alignItems: "center", gap: 8,
											background: "#0B123C", color: "white",
											padding: "12px 24px", borderRadius: 8,
											fontSize: 14, fontWeight: 600, textDecoration: "none",
										}}
									>
										<svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v11m0 0l-4-4m4 4l4-4" />
										</svg>
										Download Datasheet (PDF)
									</a>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
