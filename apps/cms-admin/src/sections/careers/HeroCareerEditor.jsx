import { useState, useEffect, useRef } from "react";
import { fileToBase64 } from "@invendis/github-client";
import { github, OWNER, REPO } from "../../config.js";
import { useAdmin } from "../../context/AdminContext.jsx";

function rawUrl(imgPath) {
	return `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/apps/main-site/public${imgPath}`;
}

export default function HeroCareerEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", titleHighlight: "", subtitle: "", cta: { label: "", href: "" }, image: "" };
	const [preview, setPreview] = useState(null);
	const [expanded, setExpanded] = useState(null);
	const [fileCheck, setFileCheck] = useState(null);
	const { token } = useAdmin();
	const checkTimer = useRef(null);

	function checkFileExists(repoPath) {
		if (!token) return;
		setFileCheck("checking");
		clearTimeout(checkTimer.current);
		checkTimer.current = setTimeout(async () => {
			try {
				const sha = await github.getFileSha(repoPath, { branch: "main", token });
				setFileCheck(sha ? "exists" : "free");
			} catch {
				setFileCheck("free");
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
	function updateCta(field, val) { onChange({ ...d, cta: { ...d.cta, [field]: val } }); }

	async function handleFileSelect(file) {
		const base64 = await fileToBase64(file);
		const previewUrl = URL.createObjectURL(file);
		if (preview) URL.revokeObjectURL(preview);
		setPreview(previewUrl);
		onChange({ ...d, _pendingUpload: { base64, filename: file.name } });
		checkFileExists(`apps/main-site/public/images/careers/hero/${file.name}`);
	}

	function clearPending() {
		if (preview) URL.revokeObjectURL(preview);
		setPreview(null);
		setFileCheck(null);
		const { _pendingUpload: _, ...rest } = d;
		onChange(rest);
	}

	function renamePending(val) {
		onChange({ ...d, _pendingUpload: { ...d._pendingUpload, filename: val } });
		checkFileExists(`apps/main-site/public/images/careers/hero/${val}`);
	}

	function removeImage() { onChange({ ...d, image: "" }); }

	return (
		<div>
			<div className="admin-field">
				<label className="admin-label">Eyebrow</label>
				<input className="admin-input" value={d.eyebrow ?? ""} onChange={e => set("eyebrow", e.target.value)} />
			</div>
			<div style={{ display: "flex", gap: 8 }}>
				<div className="admin-field" style={{ flex: 1 }}>
					<label className="admin-label">Title</label>
					<input className="admin-input" value={d.title ?? ""} onChange={e => set("title", e.target.value)} />
				</div>
				<div className="admin-field" style={{ flex: 1 }}>
					<label className="admin-label">Title Highlight (renders in red)</label>
					<input className="admin-input" value={d.titleHighlight ?? ""} onChange={e => set("titleHighlight", e.target.value)} />
				</div>
			</div>
			<div className="admin-field">
				<label className="admin-label">Subtitle</label>
				<textarea className="admin-textarea" value={d.subtitle ?? ""} onChange={e => set("subtitle", e.target.value)} />
			</div>
			<div style={{ display: "flex", gap: 8 }}>
				<div className="admin-field" style={{ flex: 1 }}>
					<label className="admin-label">CTA Button Label</label>
					<input className="admin-input" value={d.cta?.label ?? ""} onChange={e => updateCta("label", e.target.value)} />
				</div>
				<div className="admin-field" style={{ flex: 1 }}>
					<label className="admin-label">CTA Button Link</label>
					<input className="admin-input" value={d.cta?.href ?? ""} onChange={e => updateCta("href", e.target.value)} />
				</div>
			</div>

			<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>Background Image</label>
			{d.image && !d._pendingUpload && (
				<div style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
					<div onClick={() => setExpanded(rawUrl(d.image))} style={{ width: 160, height: 90, borderRadius: 6, overflow: "hidden", border: "1px solid var(--admin-border)", cursor: "zoom-in", flexShrink: 0 }}>
						<img src={rawUrl(d.image)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
					</div>
					<button className="admin-btn admin-btn--ghost" onClick={removeImage}>Remove</button>
				</div>
			)}
			{d._pendingUpload && (
				<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, padding: 8, background: "var(--admin-bg)", border: "1px solid var(--admin-border)", borderRadius: 6 }}>
					{preview && <img src={preview} alt="" style={{ height: 52, width: 80, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />}
					<div style={{ flex: 1, minWidth: 0 }}>
						<label style={{ fontSize: 11, color: "var(--admin-muted)", display: "block", marginBottom: 3 }}>Save as</label>
						<input className="admin-input" style={{ fontSize: 13, marginBottom: 4 }} value={d._pendingUpload.filename} onChange={e => renamePending(e.target.value)} />
						<p style={{ margin: 0, fontSize: 11, color: "var(--admin-muted)" }}>→ /images/careers/hero/{d._pendingUpload.filename}</p>
						{fileCheck === "checking" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--admin-muted)" }}>Checking…</p>}
						{fileCheck === "exists" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--admin-red)" }}>⚠ File already exists — saving will overwrite it</p>}
						{fileCheck === "free" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#16a34a" }}>✓ Name is available</p>}
					</div>
					<button className="admin-btn admin-btn--ghost" onClick={clearPending}>✕</button>
				</div>
			)}
			<label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", border: "1px solid var(--admin-border)", borderRadius: 8, cursor: "pointer", fontSize: 13, background: "white", fontFamily: "inherit" }}>
				<input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) handleFileSelect(e.target.files[0]); e.target.value = ""; }} />
				{d._pendingUpload ? "Replace image" : "Upload image"}
			</label>

			{expanded && (
				<div onClick={() => setExpanded(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
					<img src={expanded} alt="" onClick={e => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 8 }} />
					<button onClick={() => setExpanded(null)} style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", color: "white", border: "none", cursor: "pointer", fontSize: 18 }}>✕</button>
				</div>
			)}
		</div>
	);
}
