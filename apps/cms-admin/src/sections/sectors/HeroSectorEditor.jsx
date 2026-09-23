import { useState, useEffect } from "react";
import { fileToBase64 } from "@invendis/github-client";
import { OWNER, REPO } from "../../config.js";

function rawUrl(imgPath) {
	return `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/apps/main-site/public${imgPath}`;
}

export default function HeroSectorEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", titleHighlight: "", subtitle: "", sectors: [] };
	const [previews, setPreviews] = useState({});
	const [expanded, setExpanded] = useState(null);

	useEffect(() => {
		if (!expanded) return;
		const handler = (e) => { if (e.key === "Escape") setExpanded(null); };
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [expanded]);

	function set(field, val) {
		onChange({ ...d, [field]: val });
	}

	function updateSector(i, field, val) {
		const sectors = [...d.sectors];
		sectors[i] = { ...sectors[i], [field]: val };
		onChange({ ...d, sectors });
	}

	function removeImage(i, idx) {
		const sectors = [...d.sectors];
		const imgs = Array.isArray(sectors[i].image) ? sectors[i].image : sectors[i].image ? [sectors[i].image] : [];
		sectors[i] = { ...sectors[i], image: imgs.filter((_, j) => j !== idx) };
		onChange({ ...d, sectors });
	}

	async function handleFileSelect(i, file) {
		const base64 = await fileToBase64(file);
		const previewUrl = URL.createObjectURL(file);
		setPreviews(p => ({ ...p, [i]: previewUrl }));
		const existing = (d._pendingUploads ?? []).filter(u => u.sectorIndex !== i);
		onChange({
			...d,
			_pendingUploads: [...existing, { sectorIndex: i, sectorKey: d.sectors[i]?.key ?? "", base64, filename: file.name }],
		});
	}

	function clearPendingUpload(i) {
		if (previews[i]) URL.revokeObjectURL(previews[i]);
		setPreviews(p => { const n = { ...p }; delete n[i]; return n; });
		const uploads = (d._pendingUploads ?? []).filter(u => u.sectorIndex !== i);
		onChange({ ...d, _pendingUploads: uploads.length ? uploads : undefined });
	}

	function addSector() {
		onChange({ ...d, sectors: [...d.sectors, { key: "", name: "", tagline: "", color: "", image: [] }] });
	}

	function removeSector(i) {
		if (previews[i]) URL.revokeObjectURL(previews[i]);
		setPreviews(p => { const n = { ...p }; delete n[i]; return n; });
		const uploads = (d._pendingUploads ?? []).filter(u => u.sectorIndex !== i);
		onChange({
			...d,
			sectors: d.sectors.filter((_, j) => j !== i),
			_pendingUploads: uploads.length ? uploads : undefined,
		});
	}

	function moveSector(i, dir) {
		const j = i + dir;
		const sectors = [...d.sectors];
		if (j < 0 || j >= sectors.length) return;
		[sectors[i], sectors[j]] = [sectors[j], sectors[i]];
		const uploads = (d._pendingUploads ?? []).map(u => {
			if (u.sectorIndex === i) return { ...u, sectorIndex: j };
			if (u.sectorIndex === j) return { ...u, sectorIndex: i };
			return u;
		});
		setPreviews(p => {
			const n = { ...p };
			[n[i], n[j]] = [n[j], n[i]];
			if (n[i] === undefined) delete n[i];
			if (n[j] === undefined) delete n[j];
			return n;
		});
		onChange({ ...d, sectors, _pendingUploads: uploads.length ? uploads : undefined });
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
				<label className="admin-label">Title Highlight (renders in red)</label>
				<input className="admin-input" value={d.titleHighlight} onChange={e => set("titleHighlight", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Subtitle</label>
				<textarea className="admin-textarea" value={d.subtitle} onChange={e => set("subtitle", e.target.value)} />
			</div>

			<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>
				Sectors (hero carousel)
			</label>

			{d.sectors.map((sector, i) => {
				const imgs = Array.isArray(sector.image) ? sector.image : sector.image ? [sector.image] : [];
				const pending = (d._pendingUploads ?? []).find(u => u.sectorIndex === i);
				return (
					<div key={i} style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 12, marginBottom: 12 }}>
						<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
							<span style={{ fontWeight: 600, fontSize: 13 }}>
								Sector {i + 1}{sector.name ? ` — ${sector.name}` : ""}
							</span>
							<div style={{ display: "flex", gap: 4 }}>
								<button className="admin-btn admin-btn--ghost" onClick={() => moveSector(i, -1)} disabled={i === 0}>↑</button>
								<button className="admin-btn admin-btn--ghost" onClick={() => moveSector(i, 1)} disabled={i === d.sectors.length - 1}>↓</button>
								<button className="admin-btn admin-btn--ghost" onClick={() => removeSector(i)}>✕</button>
							</div>
						</div>

						<div style={{ display: "flex", gap: 8 }}>
							<div className="admin-field" style={{ flex: "0 0 100px" }}>
								<label className="admin-label">Key</label>
								<input className="admin-input" value={sector.key} onChange={e => updateSector(i, "key", e.target.value)} />
							</div>
							<div className="admin-field" style={{ flex: 1 }}>
								<label className="admin-label">Name</label>
								<input className="admin-input" value={sector.name} onChange={e => updateSector(i, "name", e.target.value)} />
							</div>
						</div>

						<div className="admin-field">
							<label className="admin-label">Tagline</label>
							<input className="admin-input" value={sector.tagline} onChange={e => updateSector(i, "tagline", e.target.value)} />
						</div>

						{/* Current images as thumbnails */}
						<div className="admin-field">
							<label className="admin-label">Hero Image</label>
							{imgs.length > 0 ? (
								<div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
									{imgs.map((imgPath, idx) => (
										<div key={idx} style={{ position: "relative" }}>
											<div
												onClick={() => setExpanded(rawUrl(imgPath))}
												style={{ width: 120, height: 80, borderRadius: 6, overflow: "hidden", border: "1px solid var(--admin-border)", cursor: "zoom-in" }}
											>
												<img
													src={rawUrl(imgPath)}
													alt=""
													style={{ width: "100%", height: "100%", objectFit: "cover" }}
												/>
											</div>
											<button
												onClick={() => removeImage(i, idx)}
												title="Remove"
												style={{
													position: "absolute", top: -7, right: -7,
													width: 20, height: 20,
													borderRadius: "50%",
													background: "var(--admin-red)",
													color: "white",
													border: "none",
													cursor: "pointer",
													fontSize: 11,
													display: "flex", alignItems: "center", justifyContent: "center",
												}}
											>✕</button>
										</div>
									))}
								</div>
							) : (
								<p style={{ fontSize: 12, color: "var(--admin-muted)", margin: "0 0 10px" }}>
									No image — upload one below
								</p>
							)}
						</div>

						{/* Upload */}
						<div className="admin-field">
							<label className="admin-label">Upload New Image</label>
							{pending && (
								<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: 8, background: "var(--admin-bg)", border: "1px solid var(--admin-border)", borderRadius: 6 }}>
									{previews[i] && (
										<img src={previews[i]} alt="" style={{ height: 52, width: 80, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
									)}
									<div style={{ flex: 1, minWidth: 0 }}>
										<p style={{ margin: 0, fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
											{pending.filename}
										</p>
										<p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--admin-muted)" }}>
											→ /images/sectors/{sector.key || "…"}/hero/{pending.filename}
										</p>
									</div>
									<button className="admin-btn admin-btn--ghost" onClick={() => clearPendingUpload(i)}>✕</button>
								</div>
							)}
							<label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", border: "1px solid var(--admin-border)", borderRadius: 8, cursor: "pointer", fontSize: 13, background: "white", fontFamily: "inherit" }}>
								<input
									type="file"
									accept="image/*"
									style={{ display: "none" }}
									onChange={e => { if (e.target.files[0]) handleFileSelect(i, e.target.files[0]); e.target.value = ""; }}
								/>
								{pending ? "Replace image" : "Upload image"}
							</label>
						</div>
					</div>
				);
			})}

			<button className="admin-btn admin-btn--ghost" onClick={addSector}>+ Add sector</button>

			{/* Lightbox */}
			{expanded && (
				<div
					onClick={() => setExpanded(null)}
					style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
				>
					<img
						src={expanded}
						alt=""
						onClick={e => e.stopPropagation()}
						style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 8, boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}
					/>
					<button
						onClick={() => setExpanded(null)}
						style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", color: "white", border: "none", cursor: "pointer", fontSize: 18 }}
					>✕</button>
				</div>
			)}
		</div>
	);
}
