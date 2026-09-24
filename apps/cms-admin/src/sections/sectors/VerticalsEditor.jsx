import { useState, useEffect, useRef } from "react";
import { fileToBase64 } from "@invendis/github-client";
import { github, OWNER, REPO } from "../../config.js";
import { useAdmin } from "../../context/AdminContext.jsx";

function rawUrl(imgPath) {
	return `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/apps/main-site/public${imgPath}`;
}

export default function VerticalsEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", titleHighlight: "", subtitle: "", items: [] };
	const [previews, setPreviews] = useState({});
	const [expanded, setExpanded] = useState(null);
	const { token } = useAdmin();
	const [fileChecks, setFileChecks] = useState({});
	const checkTimers = useRef({});

	function checkFileExists(key, repoPath) {
		if (!token) return;
		setFileChecks(f => ({ ...f, [key]: "checking" }));
		clearTimeout(checkTimers.current[key]);
		checkTimers.current[key] = setTimeout(async () => {
			try {
				const sha = await github.getFileSha(repoPath, { branch: "main", token });
				setFileChecks(f => ({ ...f, [key]: sha ? "exists" : "free" }));
			} catch {
				setFileChecks(f => ({ ...f, [key]: "free" }));
			}
		}, 500);
	}

	useEffect(() => {
		if (!expanded) return;
		const handler = (e) => { if (e.key === "Escape") setExpanded(null); };
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [expanded]);

	function set(field, val) {
		onChange({ ...d, [field]: val });
	}

	function updateItem(i, field, val) {
		const items = [...d.items];
		items[i] = { ...items[i], [field]: val };
		onChange({ ...d, items });
	}

	function removeImage(i, idx) {
		const items = [...d.items];
		const imgs = Array.isArray(items[i].image) ? items[i].image : items[i].image ? [items[i].image] : [];
		items[i] = { ...items[i], image: imgs.filter((_, j) => j !== idx) };
		onChange({ ...d, items });
	}

	async function handleFileSelect(i, file) {
		const base64 = await fileToBase64(file);
		const previewUrl = URL.createObjectURL(file);
		setPreviews(p => ({ ...p, [i]: previewUrl }));
		const existing = (d._pendingUploads ?? []).filter(u => u.itemIndex !== i);
		onChange({
			...d,
			_pendingUploads: [...existing, { itemIndex: i, itemKey: d.items[i]?.key ?? "", base64, filename: file.name }],
		});
		checkFileExists(i, `apps/main-site/public/images/sectors/${d.items[i]?.key || "_"}/card/${file.name}`);
	}

	function clearPendingUpload(i) {
		if (previews[i]) URL.revokeObjectURL(previews[i]);
		setPreviews(p => { const n = { ...p }; delete n[i]; return n; });
		const uploads = (d._pendingUploads ?? []).filter(u => u.itemIndex !== i);
		onChange({ ...d, _pendingUploads: uploads.length ? uploads : undefined });
		setFileChecks(f => { const n = { ...f }; delete n[i]; return n; });
	}

	function renamePendingUpload(i, val) {
		const uploads = (d._pendingUploads ?? []).map(u =>
			u.itemIndex === i ? { ...u, filename: val } : u
		);
		onChange({ ...d, _pendingUploads: uploads });
		checkFileExists(i, `apps/main-site/public/images/sectors/${d.items[i]?.key || "_"}/card/${val}`);
	}

	function addItem() {
		onChange({ ...d, items: [...d.items, { key: "", name: "", description: "", tags: [], clients: [], image: [] }] });
	}

	function removeItem(i) {
		if (previews[i]) URL.revokeObjectURL(previews[i]);
		setPreviews(p => { const n = { ...p }; delete n[i]; return n; });
		const uploads = (d._pendingUploads ?? []).filter(u => u.itemIndex !== i);
		onChange({
			...d,
			items: d.items.filter((_, j) => j !== i),
			_pendingUploads: uploads.length ? uploads : undefined,
		});
	}

	function moveItem(i, dir) {
		const j = i + dir;
		const items = [...d.items];
		if (j < 0 || j >= items.length) return;
		[items[i], items[j]] = [items[j], items[i]];
		const uploads = (d._pendingUploads ?? []).map(u => {
			if (u.itemIndex === i) return { ...u, itemIndex: j };
			if (u.itemIndex === j) return { ...u, itemIndex: i };
			return u;
		});
		setPreviews(p => {
			const n = { ...p };
			[n[i], n[j]] = [n[j], n[i]];
			if (n[i] === undefined) delete n[i];
			if (n[j] === undefined) delete n[j];
			return n;
		});
		onChange({ ...d, items, _pendingUploads: uploads.length ? uploads : undefined });
	}

	function updateTag(i, ti, val) {
		const items = [...d.items];
		const tags = [...(items[i].tags ?? [])];
		tags[ti] = val;
		items[i] = { ...items[i], tags };
		onChange({ ...d, items });
	}
	function addTag(i) {
		const items = [...d.items];
		items[i] = { ...items[i], tags: [...(items[i].tags ?? []), ""] };
		onChange({ ...d, items });
	}
	function removeTag(i, ti) {
		const items = [...d.items];
		items[i] = { ...items[i], tags: (items[i].tags ?? []).filter((_, j) => j !== ti) };
		onChange({ ...d, items });
	}

	function updateClient(i, ci, val) {
		const items = [...d.items];
		const clients = [...(items[i].clients ?? [])];
		clients[ci] = val;
		items[i] = { ...items[i], clients };
		onChange({ ...d, items });
	}
	function addClient(i) {
		const items = [...d.items];
		items[i] = { ...items[i], clients: [...(items[i].clients ?? []), ""] };
		onChange({ ...d, items });
	}
	function removeClient(i, ci) {
		const items = [...d.items];
		items[i] = { ...items[i], clients: (items[i].clients ?? []).filter((_, j) => j !== ci) };
		onChange({ ...d, items });
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
				<label className="admin-label">Title Highlight (renders in blue)</label>
				<input className="admin-input" value={d.titleHighlight} onChange={e => set("titleHighlight", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Subtitle</label>
				<textarea className="admin-textarea" value={d.subtitle} onChange={e => set("subtitle", e.target.value)} />
			</div>

			<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>Verticals</label>

			{d.items.map((item, i) => {
				const imgs = Array.isArray(item.image) ? item.image : item.image ? [item.image] : [];
				const pending = (d._pendingUploads ?? []).find(u => u.itemIndex === i);
				return (
					<div key={i} style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 12, marginBottom: 16 }}>
						<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
							<span style={{ fontWeight: 600, fontSize: 13 }}>
								Vertical {i + 1}{item.name ? ` — ${item.name}` : ""}
							</span>
							<div style={{ display: "flex", gap: 4 }}>
								<button className="admin-btn admin-btn--ghost" onClick={() => moveItem(i, -1)} disabled={i === 0}>↑</button>
								<button className="admin-btn admin-btn--ghost" onClick={() => moveItem(i, 1)} disabled={i === d.items.length - 1}>↓</button>
								<button className="admin-btn admin-btn--ghost" onClick={() => removeItem(i)}>✕</button>
							</div>
						</div>

						<div style={{ display: "flex", gap: 8 }}>
							<div className="admin-field" style={{ flex: "0 0 100px" }}>
								<label className="admin-label">Key</label>
								<input className="admin-input" value={item.key} onChange={e => updateItem(i, "key", e.target.value)} />
							</div>
							<div className="admin-field" style={{ flex: 1 }}>
								<label className="admin-label">Name</label>
								<input className="admin-input" value={item.name} onChange={e => updateItem(i, "name", e.target.value)} />
							</div>
						</div>

						<div className="admin-field">
							<label className="admin-label">Description</label>
							<textarea className="admin-textarea" value={item.description} onChange={e => updateItem(i, "description", e.target.value)} />
						</div>

						{/* Card images */}
						<div className="admin-field">
							<label className="admin-label">Card Images</label>
							{imgs.length > 0 ? (
								<div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
									{imgs.map((imgPath, idx) => (
										<div key={idx} style={{ position: "relative" }}>
											<div
												onClick={() => setExpanded(rawUrl(imgPath))}
												style={{ width: 120, height: 80, borderRadius: 6, overflow: "hidden", border: "1px solid var(--admin-border)", cursor: "zoom-in" }}
											>
												<img src={rawUrl(imgPath)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
											</div>
											<button
												onClick={() => removeImage(i, idx)}
												title="Remove"
												style={{
													position: "absolute", top: -7, right: -7,
													width: 20, height: 20, borderRadius: "50%",
													background: "var(--admin-red)", color: "white",
													border: "none", cursor: "pointer", fontSize: 11,
													display: "flex", alignItems: "center", justifyContent: "center",
												}}
											>✕</button>
										</div>
									))}
								</div>
							) : (
								<p style={{ fontSize: 12, color: "var(--admin-muted)", margin: "0 0 10px" }}>No images — upload one below</p>
							)}
						</div>

						{/* Upload */}
						<div className="admin-field">
							<label className="admin-label">Upload Card Image</label>
							{pending && (
								<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: 8, background: "var(--admin-bg)", border: "1px solid var(--admin-border)", borderRadius: 6 }}>
									{previews[i] && (
										<img src={previews[i]} alt="" style={{ height: 52, width: 80, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
									)}
									<div style={{ flex: 1, minWidth: 0 }}>
										<label style={{ fontSize: 11, color: "var(--admin-muted)", display: "block", marginBottom: 3 }}>Save as</label>
										<input
											className="admin-input"
											style={{ fontSize: 13, marginBottom: 4 }}
											value={pending.filename}
											onChange={e => renamePendingUpload(i, e.target.value)}
											placeholder="filename.jpg"
										/>
										<p style={{ margin: 0, fontSize: 11, color: "var(--admin-muted)" }}>
											→ /images/sectors/{item.key || "…"}/card/{pending.filename}
										</p>
										{fileChecks[key] === "checking" && (
											<p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--admin-muted)" }}>Checking…</p>
										)}
										{fileChecks[key] === "exists" && (
											<p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--admin-red)" }}>⚠ A file with this name already exists — saving will overwrite it</p>
										)}
										{fileChecks[key] === "free" && (
											<p style={{ margin: "4px 0 0", fontSize: 11, color: "#16a34a" }}>✓ Name is available</p>
										)}
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
								{pending ? "Replace pending" : "Upload image"}
							</label>
							{imgs.length > 0 && !pending && (
								<span style={{ marginLeft: 8, fontSize: 12, color: "var(--admin-muted)" }}>Uploads append to existing images</span>
							)}
						</div>

						{/* Tags */}
						<label className="admin-label">Tags</label>
						{(item.tags ?? []).map((tag, ti) => (
							<div key={ti} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
								<input className="admin-input" value={tag} onChange={e => updateTag(i, ti, e.target.value)} />
								<button className="admin-btn admin-btn--ghost" onClick={() => removeTag(i, ti)}>✕</button>
							</div>
						))}
						<button className="admin-btn admin-btn--ghost" style={{ marginBottom: 12 }} onClick={() => addTag(i)}>+ Add tag</button>

						{/* Clients */}
						<label className="admin-label" style={{ display: "block", marginTop: 8 }}>Key Clients</label>
						{(item.clients ?? []).map((client, ci) => (
							<div key={ci} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
								<input className="admin-input" value={client} onChange={e => updateClient(i, ci, e.target.value)} />
								<button className="admin-btn admin-btn--ghost" onClick={() => removeClient(i, ci)}>✕</button>
							</div>
						))}
						<button className="admin-btn admin-btn--ghost" onClick={() => addClient(i)}>+ Add client</button>
					</div>
				);
			})}

			<button className="admin-btn admin-btn--ghost" onClick={addItem}>+ Add vertical</button>

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
