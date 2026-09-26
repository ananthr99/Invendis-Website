import { useState, useRef } from "react";
import { fileToBase64 } from "@invendis/github-client";
import { github, OWNER, REPO } from "../../config.js";
import { useAdmin } from "../../context/AdminContext.jsx";

function rawUrl(imgPath) {
	return `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/apps/main-site/public${imgPath}`;
}

export default function HeroCaseStudiesEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", titleHighlight: "", subtitle: "", image: "" };
	const [preview, setPreview] = useState(null);
	const [fileCheck, setFileCheck] = useState(null);
	const { token } = useAdmin();
	const checkTimer = useRef(null);

	function set(field, val) { onChange({ ...d, [field]: val }); }

	function checkFileExists(repoPath) {
		if (!token) return;
		setFileCheck("checking");
		clearTimeout(checkTimer.current);
		checkTimer.current = setTimeout(async () => {
			try {
				const sha = await github.getFileSha(repoPath, { branch: "main", token });
				setFileCheck(sha ? "exists" : "free");
			} catch { setFileCheck("free"); }
		}, 500);
	}

	async function handleFileSelect(file) {
		const base64 = await fileToBase64(file);
		const previewUrl = URL.createObjectURL(file);
		setPreview({ previewUrl, filename: file.name });
		onChange({ ...d, _pendingUpload: { base64, filename: file.name } });
		checkFileExists(`apps/main-site/public/images/case-studies/hero/${file.name}`);
	}

	function renamePending(val) {
		onChange({ ...d, _pendingUpload: { ...d._pendingUpload, filename: val } });
		checkFileExists(`apps/main-site/public/images/case-studies/hero/${val}`);
	}

	function clearPending() {
		if (preview?.previewUrl) URL.revokeObjectURL(preview.previewUrl);
		setPreview(null);
		setFileCheck(null);
		onChange({ ...d, _pendingUpload: undefined });
	}

	const pending = d._pendingUpload;

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

			<div className="admin-field" style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--admin-border)" }}>
				<label className="admin-label">Hero Background Image</label>

				{d.image && !pending && (
					<div style={{ marginBottom: 12 }}>
						<div style={{ position: "relative", display: "inline-block" }}>
							<img src={rawUrl(d.image)} alt="" style={{ height: 80, width: 160, objectFit: "cover", borderRadius: 6, border: "1px solid var(--admin-border)", display: "block" }} />
							<button onClick={() => onChange({ ...d, image: "" })} title="Remove" style={{ position: "absolute", top: -7, right: -7, width: 20, height: 20, borderRadius: "50%", background: "var(--admin-red)", color: "white", border: "none", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
						</div>
						<p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--admin-muted)" }}>{d.image}</p>
					</div>
				)}

				{pending && (
					<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: 8, background: "var(--admin-bg)", border: "1px solid var(--admin-border)", borderRadius: 6 }}>
						{preview?.previewUrl && <img src={preview.previewUrl} alt="" style={{ height: 52, width: 80, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />}
						<div style={{ flex: 1, minWidth: 0 }}>
							<label style={{ fontSize: 11, color: "var(--admin-muted)", display: "block", marginBottom: 3 }}>Save as</label>
							<input className="admin-input" style={{ fontSize: 13, marginBottom: 4 }} value={pending.filename} onChange={e => renamePending(e.target.value)} placeholder="filename.jpg" />
							<p style={{ margin: 0, fontSize: 11, color: "var(--admin-muted)" }}>→ /images/case-studies/hero/{pending.filename}</p>
							{fileCheck === "checking" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--admin-muted)" }}>Checking…</p>}
							{fileCheck === "exists" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--admin-red)" }}>⚠ File already exists — saving will overwrite it</p>}
							{fileCheck === "free" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#16a34a" }}>✓ Name is available</p>}
						</div>
						<button className="admin-btn admin-btn--ghost" onClick={clearPending}>✕</button>
					</div>
				)}

				<label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", border: "1px solid var(--admin-border)", borderRadius: 8, cursor: "pointer", fontSize: 13, background: "white", fontFamily: "inherit" }}>
					<input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) handleFileSelect(e.target.files[0]); e.target.value = ""; }} />
					{pending || d.image ? "Replace image" : "Upload image"}
				</label>
			</div>
		</div>
	);
}
