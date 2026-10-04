import { useState, useEffect, useRef } from "react";
import { checkFileSize } from "../../utils/fileUtils.js";
import { fileToBase64 } from "@invendis/github-client";
import { compressImage, COMPRESS_PRESETS } from "../../utils/compressImage.js";
import { github, OWNER, REPO } from "../../config.js";
import { useAdmin } from "../../context/AdminContext.jsx";

function rawUrl(imgPath) {
	return `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/apps/main-site/public${imgPath}`;
}

export default function ApplicationsEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", viewAllLink: "", items: [] };
	const [previews, setPreviews] = useState({});
	const [expanded, setExpanded] = useState(null);
	const [fileChecks, setFileChecks] = useState({});
	const { token, toast } = useAdmin();
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

	function set(field, val) { onChange({ ...d, [field]: val }); }

	function updateItem(i, field, val) {
		const items = [...(d.items ?? [])];
		items[i] = { ...items[i], [field]: val };
		onChange({ ...d, items });
	}

	function removeItemImage(i) {
		const items = [...(d.items ?? [])];
		items[i] = { ...items[i], image: "" };
		onChange({ ...d, items });
	}

	async function handleFileSelect(i, file) {
		if (!checkFileSize(file, toast)) return;
		const compressed = await compressImage(file, COMPRESS_PRESETS.card);
		const base64 = await fileToBase64(compressed);
		const previewUrl = URL.createObjectURL(compressed);
		setPreviews(p => ({ ...p, [i]: previewUrl }));
		const items = [...(d.items ?? [])];
		items[i] = { ...items[i], _pendingUpload: { base64, filename: file.name } };
		onChange({ ...d, items });
		checkFileExists(i, `apps/main-site/public/images/silbo/applications/${file.name}`);
	}

	function clearPendingUpload(i) {
		if (previews[i]) URL.revokeObjectURL(previews[i]);
		setPreviews(p => { const n = { ...p }; delete n[i]; return n; });
		const items = [...(d.items ?? [])];
		const { _pendingUpload: _, ...rest } = items[i];
		items[i] = rest;
		onChange({ ...d, items });
		setFileChecks(f => { const n = { ...f }; delete n[i]; return n; });
	}

	function renamePendingUpload(i, val) {
		const items = [...(d.items ?? [])];
		items[i] = { ...items[i], _pendingUpload: { ...items[i]._pendingUpload, filename: val } };
		onChange({ ...d, items });
		checkFileExists(i, `apps/main-site/public/images/silbo/applications/${val}`);
	}

	function addItem() { onChange({ ...d, items: [...(d.items ?? []), { category: "", title: "", description: "", image: "" }] }); }
	function removeItem(i) {
		if (previews[i]) URL.revokeObjectURL(previews[i]);
		setPreviews(p => { const n = { ...p }; delete n[i]; return n; });
		onChange({ ...d, items: (d.items ?? []).filter((_, j) => j !== i) });
	}
	function moveItem(i, dir) {
		const j = i + dir;
		const items = [...(d.items ?? [])];
		if (j < 0 || j >= items.length) return;
		[items[i], items[j]] = [items[j], items[i]];
		setPreviews(p => { const n = { ...p }; [n[i], n[j]] = [n[j], n[i]]; return n; });
		onChange({ ...d, items });
	}

	return (
		<div>
			<div className="admin-field">
				<label className="admin-label">Eyebrow</label>
				<input className="admin-input" value={d.eyebrow ?? ""} onChange={e => set("eyebrow", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Title</label>
				<input className="admin-input" value={d.title ?? ""} onChange={e => set("title", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">View All Link</label>
				<input className="admin-input" value={d.viewAllLink ?? ""} onChange={e => set("viewAllLink", e.target.value)} />
			</div>

			<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>Application Items</label>
			{(d.items ?? []).map((item, i) => {
				const pending = item._pendingUpload;
				return (
					<div key={i} style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 12, marginBottom: 12 }}>
						<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
							<span style={{ fontWeight: 600, fontSize: 13 }}>Item {i + 1}{item.title ? ` — ${item.title}` : ""}</span>
							<div style={{ display: "flex", gap: 4 }}>
								<button className="admin-btn admin-btn--ghost" onClick={() => moveItem(i, -1)} disabled={i === 0}>↑</button>
								<button className="admin-btn admin-btn--ghost" onClick={() => moveItem(i, 1)} disabled={i === (d.items ?? []).length - 1}>↓</button>
								<button className="admin-btn admin-btn--ghost" onClick={() => removeItem(i)}>✕</button>
							</div>
						</div>
						<div className="admin-field">
							<label className="admin-label">Category</label>
							<input className="admin-input" value={item.category ?? ""} onChange={e => updateItem(i, "category", e.target.value)} />
						</div>
						<div className="admin-field">
							<label className="admin-label">Title</label>
							<input className="admin-input" value={item.title ?? ""} onChange={e => updateItem(i, "title", e.target.value)} />
						</div>
						<div className="admin-field">
							<label className="admin-label">Description</label>
							<textarea className="admin-textarea" value={item.description ?? ""} onChange={e => updateItem(i, "description", e.target.value)} />
						</div>
						<div className="admin-field">
							<label className="admin-label">Image</label>
							{item.image && !pending && (
								<div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
									<div onClick={() => setExpanded(rawUrl(item.image))} style={{ width: 120, height: 80, borderRadius: 6, overflow: "hidden", border: "1px solid var(--admin-border)", cursor: "zoom-in", flexShrink: 0 }}>
										<img src={rawUrl(item.image)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
									</div>
									<button className="admin-btn admin-btn--ghost" onClick={() => removeItemImage(i)}>Remove</button>
								</div>
							)}
							{pending && (
								<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: 8, background: "var(--admin-bg)", border: "1px solid var(--admin-border)", borderRadius: 6 }}>
									{previews[i] && <img src={previews[i]} alt="" style={{ height: 52, width: 80, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />}
									<div style={{ flex: 1, minWidth: 0 }}>
										<label style={{ fontSize: 11, color: "var(--admin-muted)", display: "block", marginBottom: 3 }}>Save as</label>
										<input className="admin-input" style={{ fontSize: 13, marginBottom: 4 }} value={pending.filename} onChange={e => renamePendingUpload(i, e.target.value)} />
										<p style={{ margin: 0, fontSize: 11, color: "var(--admin-muted)" }}>→ /images/silbo/applications/{pending.filename}</p>
										{fileChecks[i] === "checking" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--admin-muted)" }}>Checking…</p>}
										{fileChecks[i] === "exists" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--admin-red)" }}>⚠ File already exists — saving will overwrite it</p>}
										{fileChecks[i] === "free" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#16a34a" }}>✓ Name is available</p>}
									</div>
									<button className="admin-btn admin-btn--ghost" onClick={() => clearPendingUpload(i)}>✕</button>
								</div>
							)}
							<label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", border: "1px solid var(--admin-border)", borderRadius: 8, cursor: "pointer", fontSize: 13, background: "white", fontFamily: "inherit" }}>
								<input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) handleFileSelect(i, e.target.files[0]); e.target.value = ""; }} />
								{pending ? "Replace image" : "Upload image"}
							</label>
						</div>
					</div>
				);
			})}
			<button className="admin-btn admin-btn--ghost" onClick={addItem}>+ Add item</button>

			{expanded && (
				<div onClick={() => setExpanded(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
					<img src={expanded} alt="" onClick={e => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 8 }} />
					<button onClick={() => setExpanded(null)} style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", color: "white", border: "none", cursor: "pointer", fontSize: 18 }}>✕</button>
				</div>
			)}
		</div>
	);
}
