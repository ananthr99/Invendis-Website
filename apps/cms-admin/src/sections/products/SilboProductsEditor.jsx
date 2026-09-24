import { useState, useEffect, useRef } from "react";
import { fileToBase64 } from "@invendis/github-client";
import { github, OWNER, REPO } from "../../config.js";
import { useAdmin } from "../../context/AdminContext.jsx";

function rawUrl(imgPath) {
	return `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/apps/main-site/public${imgPath}`;
}

export default function SilboProductsEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", subtitle: "", intro: "", introImage: [], items: [] };
	const [previews, setPreviews] = useState([]);
	const [expanded, setExpanded] = useState(null);
    const [fileChecks, setFileChecks] = useState({});
	const { token } = useAdmin();
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

	function removeIntroImage(idx) {
		const imgs = [...(d.introImage ?? [])];
		imgs.splice(idx, 1);
		onChange({ ...d, introImage: imgs });
	}

	async function handleFileSelect(file) {
		const base64 = await fileToBase64(file);
		const previewUrl = URL.createObjectURL(file);
		setPreviews(p => [...p, { previewUrl, filename: file.name }]);
		onChange({ ...d, _pendingUploads: [...(d._pendingUploads ?? []), { base64, filename: file.name }] });
        checkFileExists((d._pendingUploads ?? []).length, `apps/main-site/public/images/products/silbo/${file.name}`);
	}

	function clearPendingUpload(idx) {
		if (previews[idx]?.previewUrl) URL.revokeObjectURL(previews[idx].previewUrl);
		setPreviews(p => p.filter((_, j) => j !== idx));
		const uploads = [...(d._pendingUploads ?? [])];
		uploads.splice(idx, 1);
		onChange({ ...d, _pendingUploads: uploads.length ? uploads : undefined });
        setFileChecks(f => { const n = { ...f }; delete n[idx]; return n; });
    }

    function renamePendingUpload(idx, val) {
		const uploads = [...(d._pendingUploads ?? [])];
		uploads[idx] = { ...uploads[idx], filename: val };
		onChange({ ...d, _pendingUploads: uploads });
        checkFileExists(idx, `apps/main-site/public/images/products/silbo/${val}`);
	}


	function updateItem(i, field, val) {
		const items = [...d.items];
		items[i] = { ...items[i], [field]: val };
		onChange({ ...d, items });
	}

	function addItem() {
		onChange({ ...d, items: [...d.items, { key: "", name: "", description: "" }] });
	}

	function removeItem(i) {
		onChange({ ...d, items: d.items.filter((_, j) => j !== i) });
	}

	function moveItem(i, dir) {
		const j = i + dir;
		const items = [...d.items];
		if (j < 0 || j >= items.length) return;
		[items[i], items[j]] = [items[j], items[i]];
		onChange({ ...d, items });
	}

	const imgs = d.introImage ?? [];
	const pending = d._pendingUploads ?? [];

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
				<label className="admin-label">Subtitle</label>
				<textarea className="admin-textarea" value={d.subtitle} onChange={e => set("subtitle", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Intro Text</label>
				<textarea className="admin-textarea" value={d.intro} onChange={e => set("intro", e.target.value)} />
			</div>

			<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>Intro Images (auto-rotating)</label>
			{imgs.length > 0 && (
				<div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
					{imgs.map((imgPath, idx) => (
						<div key={idx} style={{ position: "relative" }}>
							<div onClick={() => setExpanded(rawUrl(imgPath))} style={{ width: 120, height: 80, borderRadius: 6, overflow: "hidden", border: "1px solid var(--admin-border)", cursor: "zoom-in" }}>
								<img src={rawUrl(imgPath)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
							</div>
							<button onClick={() => removeIntroImage(idx)} title="Remove" style={{ position: "absolute", top: -7, right: -7, width: 20, height: 20, borderRadius: "50%", background: "var(--admin-red)", color: "white", border: "none", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
						</div>
					))}
				</div>
			)}
			{pending.length > 0 && (
				<div style={{ marginBottom: 10 }}>
					<p style={{ fontSize: 12, color: "var(--admin-muted)", margin: "0 0 6px" }}>Pending uploads:</p>
					{pending.map((upload, idx) => (
						<div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, padding: 8, background: "var(--admin-bg)", border: "1px solid var(--admin-border)", borderRadius: 6 }}>
							{previews[idx]?.previewUrl && <img src={previews[idx].previewUrl} alt="" style={{ height: 44, width: 68, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />}
							<div style={{ flex: 1, minWidth: 0 }}>
                                <label style={{ fontSize: 11, color: "var(--admin-muted)", display: "block", marginBottom: 3 }}>Save as</label>
                                <input
                                    className="admin-input"
                                    style={{ fontSize: 13, marginBottom: 4 }}
                                    value={upload.filename}
                                    onChange={e => renamePendingUpload(idx, e.target.value)}
                                    placeholder="filename.jpg"
                                />
                                <p style={{ margin: 0, fontSize: 11, color: "var(--admin-muted)" }}>
                                    → /images/products/silbo/{upload.filename}
                                </p>
                                {fileChecks[idx] === "checking" && (
                                    <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--admin-muted)" }}>Checking…</p>
                                )}
                                {fileChecks[idx] === "exists" && (
                                    <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--admin-red)" }}>⚠ A file with this name already exists — saving will overwrite it</p>
                                )}
                                {fileChecks[idx] === "free" && (
                                    <p style={{ margin: "4px 0 0", fontSize: 11, color: "#16a34a" }}>✓ Name is available</p>
                                )}
						    </div>
							<button className="admin-btn admin-btn--ghost" onClick={() => clearPendingUpload(idx)}>✕</button>
						</div>
					))}
				</div>
			)}
			<label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", border: "1px solid var(--admin-border)", borderRadius: 8, cursor: "pointer", fontSize: 13, background: "white", fontFamily: "inherit", marginBottom: 24 }}>
				<input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) handleFileSelect(e.target.files[0]); e.target.value = ""; }} />
				+ Add image
			</label>

			<label className="admin-label" style={{ display: "block", marginTop: 8, marginBottom: 8 }}>Product Cards</label>
			{d.items.map((item, i) => (
				<div key={i} style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 12, marginBottom: 10 }}>
					<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
						<span style={{ fontWeight: 600, fontSize: 13 }}>Card {i + 1}{item.name ? ` — ${item.name}` : ""}</span>
						<div style={{ display: "flex", gap: 4 }}>
							<button className="admin-btn admin-btn--ghost" onClick={() => moveItem(i, -1)} disabled={i === 0}>↑</button>
							<button className="admin-btn admin-btn--ghost" onClick={() => moveItem(i, 1)} disabled={i === d.items.length - 1}>↓</button>
							<button className="admin-btn admin-btn--ghost" onClick={() => removeItem(i)}>✕</button>
						</div>
					</div>
					<div style={{ display: "flex", gap: 8 }}>
						<div className="admin-field" style={{ flex: "0 0 120px" }}>
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
				</div>
			))}
			<button className="admin-btn admin-btn--ghost" onClick={addItem}>+ Add card</button>

			{expanded && (
				<div onClick={() => setExpanded(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
					<img src={expanded} alt="" onClick={e => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 8, boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }} />
					<button onClick={() => setExpanded(null)} style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", color: "white", border: "none", cursor: "pointer", fontSize: 18 }}>✕</button>
				</div>
			)}
		</div>
	);
}
