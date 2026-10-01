import { useState, useEffect, useRef, useLayoutEffect  } from "react";
import { OWNER, REPO } from "../../config.js";
import { SPEC_FIELDS, CAT_COLORS } from "./constants.js";

function rawUrl(path) {
	if (!path || path.startsWith("http")) return path;
	return `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/apps/main-site/public${path}`;
}

const TABS = [
	{ key: "core",       label: "Core" },
	{ key: "specs",      label: "Specs" },
	{ key: "images",     label: "Images" },
	{ key: "datasheets", label: "Datasheets" },
	{ key: "variants",   label: "Variants" },
	{ key: "additional", label: "Additional Specs" },
];

export default function ProductForm({ product, isNew, cats, onChange, headerH = 0 }) {
	const [p, setP] = useState({ ...product });
	const [tab, setTab] = useState("core");
	const [lightbox, setLightbox] = useState(null);

	const tabBarRef = useRef(null);
	const [tabBarH, setTabBarH] = useState(44);
	useLayoutEffect(() => {
		if (tabBarRef.current) setTabBarH(tabBarRef.current.offsetHeight);
	});


	const addImgRef    = useRef(null);
	const replImgRef   = useRef(null);
	const topDsRef     = useRef(null);
	const partDsRef    = useRef(null);
	const newPartRef   = useRef(null);
	const replImgIdx   = useRef(null);

	// ── helpers ────────────────────────────────────────────────
	const set = (field, val) => setP(prev => ({ ...prev, [field]: val }));
	const slugify = str => str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

	const setUseCase    = (i, v) => setP(prev => { const a = [...(prev.use_cases ?? [])]; a[i] = v; return { ...prev, use_cases: a }; });
	const addUseCase    = ()     => setP(prev => ({ ...prev, use_cases: [...(prev.use_cases ?? []), ""] }));
	const removeUseCase = i      => setP(prev => { const a = [...(prev.use_cases ?? [])]; a.splice(i, 1); return { ...prev, use_cases: a }; });

	const toggleHidden = key => setP(prev => {
		const h = new Set(prev.hidden_fields ?? []);
		h.has(key) ? h.delete(key) : h.add(key);
		return { ...prev, hidden_fields: [...h] };
	});

	const setSpec    = (i, k, v) => setP(prev => { const a = [...(prev.additional_specs ?? [])]; a[i] = { ...a[i], [k]: v }; return { ...prev, additional_specs: a }; });
	const addSpec    = ()        => setP(prev => ({ ...prev, additional_specs: [...(prev.additional_specs ?? []), { k: "", v: "" }] }));
	const removeSpec = i         => setP(prev => { const a = [...(prev.additional_specs ?? [])]; a.splice(i, 1); return { ...prev, additional_specs: a }; });

	const readFile = (file, cb) => { const r = new FileReader(); r.onload = e => cb(e.target.result); r.readAsDataURL(file); };

	const pickImage = (file, repIdx = null) => readFile(file, dataUrl =>
        setP(prev => ({
            ...prev,
            _pendingImages: [...(prev._pendingImages ?? []), {
                filename: file.name,
                base64: dataUrl.split(",")[1],
                dataUrl,
                replaceIndex: repIdx,
            }],
        }))
    );

	const removePendingImage  = i => setP(prev => { const a = [...(prev._pendingImages ?? [])]; a.splice(i, 1); return { ...prev, _pendingImages: a }; });
	const removeExistingImage = i => setP(prev => { const a = (prev.images ?? []).filter((_, idx) => idx !== i); return { ...prev, images: a }; });

	const pickDs = (file, partName, isTopLevel) => readFile(file, dataUrl =>
        setP(prev => ({
            ...prev,
            _pendingDatasheets: [...(prev._pendingDatasheets ?? []), {
                filename: file.name,
                base64: dataUrl.split(",")[1],
                dataUrl,
                partName,
                isTopLevel,
            }],
        }))
    );

	const removePendingDs  = i   => setP(prev => { const a = [...(prev._pendingDatasheets ?? [])]; a.splice(i, 1); return { ...prev, _pendingDatasheets: a }; });
	const removeTopDs      = ()  => setP(prev => ({ ...prev, datasheet: null }));
	const removePartDs     = key => setP(prev => { const d = { ...(prev.part_datasheets ?? {}) }; delete d[key]; return { ...prev, part_datasheets: d }; });
	const renamePartKey    = (oldKey, newKey) => setP(prev => {
		if (oldKey === newKey) return prev;
		const d = { ...(prev.part_datasheets ?? {}) };
		d[newKey] = d[oldKey];
		delete d[oldKey];
		return { ...prev, part_datasheets: d };
	});

	const initVariants  = () => setP(prev => ({ ...prev, variants: { headers: ["Part Number"], rows: [[""]] } }));
	const clearVariants = () => setP(prev => ({ ...prev, variants: null }));
	const setHeader     = (i, v)     => setP(prev => { const h = [...prev.variants.headers]; h[i] = v; return { ...prev, variants: { ...prev.variants, headers: h } }; });
	const addCol        = ()         => setP(prev => ({ ...prev, variants: { headers: [...prev.variants.headers, ""], rows: prev.variants.rows.map(r => [...r, ""]) } }));
	const removeCol     = i          => setP(prev => ({ ...prev, variants: { headers: prev.variants.headers.filter((_, ci) => ci !== i), rows: prev.variants.rows.map(r => r.filter((_, ci) => ci !== i)) } }));
	const setCell       = (ri, ci, v) => setP(prev => { const rows = prev.variants.rows.map((r, rI) => rI === ri ? r.map((c, cI) => cI === ci ? v : c) : r); return { ...prev, variants: { ...prev.variants, rows } }; });
	const addRow        = ()         => setP(prev => ({ ...prev, variants: { ...prev.variants, rows: [...prev.variants.rows, prev.variants.headers.map(() => "")] } }));
	const removeRow     = i          => setP(prev => ({ ...prev, variants: { ...prev.variants, rows: prev.variants.rows.filter((_, ri) => ri !== i) } }));

	const hidden = new Set(p.hidden_fields ?? []);

    useEffect(() => { onChange?.(p); }, [p]);

	return (
		<div style={{ paddingBottom: 80 }}>

			{/* Spacer to push content below the fixed tab bar */}
			<div style={{ height: tabBarH + 24 }} />

			{/* Fixed tab bar */}
			<div
				ref={tabBarRef}
				style={{
					position: "fixed",
					top: 56 + headerH,
					left: 220,
					right: 0,
					zIndex: 45,
					background: "white",
					borderBottom: "1px solid var(--admin-border)",
					padding: "0 28px",
					display: "flex",
					gap: 0,
					flexWrap: "wrap",
					boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
				}}
			>
				{TABS.map(t => (
					<button
						key={t.key}
						onClick={() => setTab(t.key)}
						style={{
							padding: "9px 16px", border: "none", background: "none",
							fontSize: 13, fontWeight: tab === t.key ? 700 : 400,
							color: tab === t.key ? "var(--admin-primary)" : "var(--admin-muted)",
							borderBottom: `2px solid ${tab === t.key ? "var(--admin-primary)" : "transparent"}`,
							cursor: "pointer", marginBottom: -1,
						}}
					>
						{t.label}
					</button>
				))}
			</div>

			{/* ── CORE ── */}
			{tab === "core" && (
				<div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 620 }}>
					<div>
						<label className="admin-label">Product ID {isNew && <span style={{ color: "var(--admin-muted)", fontWeight: 400 }}>(auto-filled from name)</span>}</label>
						<input className="admin-input" value={p.id ?? ""} disabled={!isNew} onChange={e => set("id", e.target.value)} placeholder="e.g. xa82" />
					</div>
					<div>
						<label className="admin-label">Name</label>
						<input
							className="admin-input"
							value={p.name ?? ""}
							onChange={e => { set("name", e.target.value); if (isNew) set("id", slugify(e.target.value)); }}
							placeholder="e.g. XA82-2"
						/>
					</div>
					<div>
						<label className="admin-label">Category</label>
						<select className="admin-input" value={p.cat ?? ""} onChange={e => set("cat", e.target.value)}>
							{(cats ?? []).map(c => <option key={c} value={c}>{c}</option>)}
						</select>
					</div>
					<div>
						<label className="admin-label">Sort Order</label>
						<input className="admin-input" type="number" value={p.order ?? 0} onChange={e => set("order", Number(e.target.value))} />
					</div>
					<div>
						<label className="admin-label">Description</label>
						<textarea className="admin-input" rows={4} value={p.desc ?? ""} onChange={e => set("desc", e.target.value)} style={{ resize: "vertical" }} />
					</div>
					<div>
						<label className="admin-label">Use Cases</label>
						{(p.use_cases ?? []).map((u, i) => (
							<div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
								<input className="admin-input" value={u} onChange={e => setUseCase(i, e.target.value)} style={{ flex: 1 }} placeholder="Use case description" />
								<button onClick={() => removeUseCase(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-red)", fontSize: 18, lineHeight: 1 }}>✕</button>
							</div>
						))}
						<button onClick={addUseCase} className="admin-btn-secondary" style={{ fontSize: 12 }}>+ Add Use Case</button>
					</div>
					<div>
						<label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
							<input type="checkbox" checked={p.hidden ?? false} onChange={e => set("hidden", e.target.checked)} />
							Hide this product from the selector
						</label>
					</div>
				</div>
			)}

			{/* ── SPECS ── */}
			{tab === "specs" && (
				<div>
					<p style={{ fontSize: 12, color: "var(--admin-muted)", marginBottom: 14 }}>
						Check "Hide" to suppress a field from the product modal. Fields with value "-" are already hidden automatically.
					</p>
					<div style={{ overflowX: "auto" }}>
						<table style={{ width: "100%", maxWidth: 680, borderCollapse: "collapse" }}>
							<thead>
								<tr style={{ borderBottom: "2px solid var(--admin-border)" }}>
									<th style={{ padding: "6px 10px", textAlign: "left", fontSize: 12, color: "var(--admin-muted)", width: "28%" }}>Field</th>
									<th style={{ padding: "6px 10px", textAlign: "left", fontSize: 12, color: "var(--admin-muted)" }}>Value</th>
									<th style={{ padding: "6px 10px", textAlign: "center", fontSize: 12, color: "var(--admin-muted)", width: 52 }}>Hide</th>
								</tr>
							</thead>
							<tbody>
								{SPEC_FIELDS.map((sf, i) => (
									<tr key={sf.key} style={{ borderBottom: "1px solid var(--admin-border)", background: i % 2 === 0 ? "white" : "var(--admin-bg)" }}>
										<td style={{ padding: "5px 10px", fontSize: 13, fontWeight: 500 }}>{sf.label}</td>
										<td style={{ padding: "3px 10px" }}>
											<input className="admin-input" value={p[sf.key] ?? ""} onChange={e => set(sf.key, e.target.value)} style={{ fontSize: 12 }} />
										</td>
										<td style={{ padding: "3px 10px", textAlign: "center" }}>
											<input type="checkbox" checked={hidden.has(sf.key)} onChange={() => toggleHidden(sf.key)} />
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* ── IMAGES ── */}
			{tab === "images" && (
				<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
					{/* Existing */}
					{(p.images ?? []).filter(Boolean).length > 0 && (
						<div>
							<p className="admin-label">Existing Images</p>
							<div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
								{(p.images ?? []).map((src, i) => src && (
									<div key={i} style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 8, background: "var(--admin-bg)" }}>
										<img src={rawUrl(src)} alt="" onClick={() => setLightbox(src)} style={{ width: 110, height: 88, objectFit: "contain", cursor: "zoom-in", display: "block" }} />
										<div style={{ display: "flex", gap: 6, marginTop: 6 }}>
											<button
												onClick={() => { replImgIdx.current = i; replImgRef.current?.click(); }}
												className="admin-btn-secondary"
												style={{ fontSize: 11, flex: 1 }}
											>Replace</button>
											<button
												onClick={() => removeExistingImage(i)}
												style={{ fontSize: 11, background: "none", border: "1px solid var(--admin-red)", color: "var(--admin-red)", borderRadius: 4, padding: "2px 8px", cursor: "pointer" }}
											>Remove</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Pending */}
					{(p._pendingImages ?? []).length > 0 && (
						<div>
							<p className="admin-label">Pending Uploads</p>
							<div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
								{(p._pendingImages ?? []).map((pi, i) => (
									<div key={i} style={{ border: "1px dashed var(--admin-primary)", borderRadius: 8, padding: 8, background: "#f0f4ff" }}>
										<img src={pi.dataUrl} alt="" style={{ width: 110, height: 88, objectFit: "contain", display: "block" }} />
										<div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
											<span style={{ fontSize: 10, color: "var(--admin-muted)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
												{pi.replaceIndex !== null ? `Replacing #${pi.replaceIndex + 1}` : pi.filename}
											</span>
											<button onClick={() => removePendingImage(i)} style={{ fontSize: 11, background: "none", border: "1px solid var(--admin-red)", color: "var(--admin-red)", borderRadius: 4, padding: "2px 6px", cursor: "pointer" }}>✕</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Hidden file inputs */}
					<input ref={addImgRef}  type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) { pickImage(e.target.files[0]); e.target.value = ""; } }} />
					<input ref={replImgRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) { pickImage(e.target.files[0], replImgIdx.current); e.target.value = ""; replImgIdx.current = null; } }} />

					<div>
						<button onClick={() => addImgRef.current?.click()} className="admin-btn-secondary">+ Add Image</button>
					</div>
					<p style={{ fontSize: 11, color: "var(--admin-muted)", margin: 0 }}>Images are uploaded to GitHub when you save the product.</p>
				</div>
			)}

			{/* ── DATASHEETS ── */}
			{tab === "datasheets" && (
				<div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 640 }}>
					{/* Top-level */}
					<div>
						<p className="admin-label">Top-Level Datasheet</p>
						<p style={{ fontSize: 12, color: "var(--admin-muted)", margin: "0 0 10px" }}>Shows a "Download Datasheet" button in the product modal.</p>
						{p.datasheet ? (
							<div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "var(--admin-bg)", borderRadius: 6, border: "1px solid var(--admin-border)" }}>
								<span style={{ flex: 1, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.datasheet}</span>
								<button onClick={removeTopDs} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-red)", fontSize: 12 }}>Remove</button>
							</div>
						) : (
							<>
								<input ref={topDsRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) { pickDs(e.target.files[0], null, true); e.target.value = ""; } }} />
								<button onClick={() => topDsRef.current?.click()} className="admin-btn-secondary" style={{ fontSize: 12 }}>+ Upload PDF</button>
							</>
						)}
					</div>

					{/* Part datasheets */}
					<div>
						<p className="admin-label">Part Datasheets</p>
						<p style={{ fontSize: 12, color: "var(--admin-muted)", margin: "0 0 10px" }}>Linked by part name in the Variants table. The part name must match exactly.</p>
						{Object.entries(p.part_datasheets ?? {}).map(([key, val]) => (
							<PartDsRow key={key} partKey={key} path={val} onRename={renamePartKey} onRemove={removePartDs} />
						))}
						<div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
							<input
								ref={newPartRef}
								className="admin-input"
								placeholder="Part name (e.g. XA82-2 Unmanaged PoE Switch)"
								style={{ flex: 1, fontSize: 12 }}
							/>
							<input
								ref={partDsRef}
								type="file"
								accept=".pdf"
								style={{ display: "none" }}
								onChange={e => {
									const name = newPartRef.current?.value?.trim();
									if (e.target.files[0] && name) {
										pickDs(e.target.files[0], name, false);
										e.target.value = "";
										if (newPartRef.current) newPartRef.current.value = "";
									}
								}}
							/>
							<button
								onClick={() => { if (newPartRef.current?.value?.trim()) partDsRef.current?.click(); }}
								className="admin-btn-secondary"
								style={{ fontSize: 12, flexShrink: 0 }}
							>+ Upload PDF</button>
						</div>
					</div>

					{/* Pending */}
					{(p._pendingDatasheets ?? []).length > 0 && (
						<div>
							<p className="admin-label">Pending Uploads</p>
							{(p._pendingDatasheets ?? []).map((ds, i) => (
								<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "#f0f4ff", borderRadius: 4, marginBottom: 6, border: "1px dashed var(--admin-primary)" }}>
									<span style={{ fontSize: 12, flex: 1 }}>{ds.isTopLevel ? "(Top-level)" : ds.partName} — {ds.file.name}</span>
									<button onClick={() => removePendingDs(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-red)" }}>✕</button>
								</div>
							))}
						</div>
					)}
					<p style={{ fontSize: 11, color: "var(--admin-muted)", margin: 0 }}>PDFs are uploaded to GitHub when you save the product.</p>
				</div>
			)}

			{/* ── VARIANTS ── */}
			{tab === "variants" && (
				<div>
					{!p.variants ? (
						<div style={{ padding: "32px 0" }}>
							<p style={{ fontSize: 13, color: "var(--admin-muted)", marginBottom: 16 }}>No variants table for this product.</p>
							<button onClick={initVariants} className="admin-btn-secondary">+ Enable Variants Table</button>
						</div>
					) : (
						<div>
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
								<p style={{ fontSize: 12, color: "var(--admin-muted)", margin: 0 }}>
									The last column is typically "Part Number" — it links rows to part datasheets.
								</p>
								<button onClick={addCol} className="admin-btn-secondary" style={{ fontSize: 12 }}>+ Add Column</button>
							</div>
							<div style={{ overflowX: "auto" }}>
								<table style={{ borderCollapse: "collapse", fontSize: 13, minWidth: 360 }}>
									<thead>
										<tr style={{ background: "var(--admin-bg)" }}>
											{p.variants.headers.map((h, i) => (
												<th key={i} style={{ padding: "6px 4px", borderBottom: "2px solid var(--admin-border)", minWidth: 120 }}>
													<div style={{ display: "flex", gap: 4 }}>
														<input className="admin-input" value={h} onChange={e => setHeader(i, e.target.value)} style={{ flex: 1, fontSize: 12 }} placeholder="Header" />
														<button onClick={() => removeCol(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-red)", fontSize: 11, padding: "0 4px" }}>✕</button>
													</div>
												</th>
											))}
											<th style={{ width: 32 }}></th>
										</tr>
									</thead>
									<tbody>
										{p.variants.rows.map((row, ri) => (
											<tr key={ri} style={{ borderBottom: "1px solid var(--admin-border)" }}>
												{row.map((cell, ci) => (
													<td key={ci} style={{ padding: "4px" }}>
														<input className="admin-input" value={cell} onChange={e => setCell(ri, ci, e.target.value)} style={{ fontSize: 12 }} />
													</td>
												))}
												<td style={{ padding: "4px", textAlign: "center" }}>
													<button onClick={() => removeRow(ri)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-red)" }}>✕</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<div style={{ display: "flex", gap: 12, marginTop: 12 }}>
								<button onClick={addRow} className="admin-btn-secondary" style={{ fontSize: 12 }}>+ Add Row</button>
								<button
									onClick={clearVariants}
									style={{ fontSize: 12, background: "none", border: "1px solid var(--admin-red)", color: "var(--admin-red)", borderRadius: 4, padding: "5px 12px", cursor: "pointer" }}
								>Remove Variants Table</button>
							</div>
						</div>
					)}
				</div>
			)}

			{/* ── ADDITIONAL SPECS ── */}
			{tab === "additional" && (
				<div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 640 }}>
					<p style={{ fontSize: 12, color: "var(--admin-muted)", margin: "0 0 8px" }}>
						Extra key-value pairs shown after the standard spec fields in the product modal.
					</p>
					{(p.additional_specs ?? []).map((s, i) => (
						<div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
							<input
								className="admin-input"
								value={s.k}
								onChange={e => setSpec(i, "k", e.target.value)}
								placeholder="Label (e.g. Ethernet Ports)"
								style={{ flex: 1 }}
							/>
							<input
								className="admin-input"
								value={s.v}
								onChange={e => setSpec(i, "v", e.target.value)}
								placeholder="Value (e.g. Gigabit Ethernet)"
								style={{ flex: 2 }}
							/>
							<button onClick={() => removeSpec(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-red)", fontSize: 18, lineHeight: 1 }}>✕</button>
						</div>
					))}
					<button onClick={addSpec} className="admin-btn-secondary" style={{ alignSelf: "flex-start", fontSize: 12 }}>+ Add Spec</button>
				</div>
			)}

			{/* Lightbox */}
			{lightbox && (
				<div
					onClick={() => setLightbox(null)}
					style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}
				>
					<img src={lightbox} alt="" onClick={e => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 8 }} />
				</div>
			)}
		</div>
	);
}

// ── Subcomponent: editable part-datasheet row ──
function PartDsRow({ partKey, path, onRename, onRemove }) {
	const [editing, setEditing] = useState(partKey);
	return (
		<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
			<input
				className="admin-input"
				value={editing}
				onChange={e => setEditing(e.target.value)}
				onBlur={() => onRename(partKey, editing)}
				style={{ flex: "0 0 220px", fontSize: 12 }}
				placeholder="Part Name"
			/>
			<span style={{ fontSize: 12, color: "var(--admin-muted)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{path}</span>
			<button onClick={() => onRemove(partKey)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-red)", fontSize: 16, flexShrink: 0 }}>✕</button>
		</div>
	);
}
