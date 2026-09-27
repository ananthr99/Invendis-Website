import { useState, useEffect, useRef } from "react";
import { fileToBase64 } from "@invendis/github-client";
import { github, OWNER, REPO } from "../../config.js";
import { useAdmin } from "../../context/AdminContext.jsx";

function rawUrl(imgPath) {
	return `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/apps/main-site/public${imgPath}`;
}

export default function HeroSilboEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", brand: "", title: "", titleHighlight: "", description: "", primaryBtn: { label: "", href: "" }, secondaryBtn: { label: "", href: "" }, stats: [], image: [] };
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

	function set(field, val) { onChange({ ...d, [field]: val }); }
	function updateBtn(btnKey, field, val) { onChange({ ...d, [btnKey]: { ...d[btnKey], [field]: val } }); }

	function updateStat(i, field, val) {
		const stats = [...(d.stats ?? [])];
		stats[i] = { ...stats[i], [field]: val };
		onChange({ ...d, stats });
	}
	function addStat() { onChange({ ...d, stats: [...(d.stats ?? []), { value: "", label: "", highlight: false }] }); }
	function removeStat(i) { onChange({ ...d, stats: (d.stats ?? []).filter((_, j) => j !== i) }); }

	function removeImage(idx) {
		const imgs = [...(d.image ?? [])];
		imgs.splice(idx, 1);
		onChange({ ...d, image: imgs });
	}

	async function handleFileSelect(file) {
		const base64 = await fileToBase64(file);
		const previewUrl = URL.createObjectURL(file);
		setPreviews(p => [...p, { previewUrl, filename: file.name }]);
		onChange({ ...d, _pendingUploads: [...(d._pendingUploads ?? []), { base64, filename: file.name }] });
		checkFileExists((d._pendingUploads ?? []).length, `apps/main-site/public/images/silbo/hero/${file.name}`);
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
		checkFileExists(idx, `apps/main-site/public/images/silbo/hero/${val}`);
	}

	const imgs = d.image ?? [];
	const pending = d._pendingUploads ?? [];

	return (
		<div>
			<div className="admin-field">
				<label className="admin-label">Eyebrow</label>
				<input className="admin-input" value={d.eyebrow ?? ""} onChange={e => set("eyebrow", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Brand Text (e.g. SILBO ®)</label>
				<input className="admin-input" value={d.brand ?? ""} onChange={e => set("brand", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Title</label>
				<input className="admin-input" value={d.title ?? ""} onChange={e => set("title", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Title Highlight (renders in red)</label>
				<input className="admin-input" value={d.titleHighlight ?? ""} onChange={e => set("titleHighlight", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Description</label>
				<textarea className="admin-textarea" value={d.description ?? ""} onChange={e => set("description", e.target.value)} />
			</div>
			<div style={{ display: "flex", gap: 8 }}>
				<div className="admin-field" style={{ flex: 1 }}>
					<label className="admin-label">Primary Button Label</label>
					<input className="admin-input" value={d.primaryBtn?.label ?? ""} onChange={e => updateBtn("primaryBtn", "label", e.target.value)} />
				</div>
				<div className="admin-field" style={{ flex: 1 }}>
					<label className="admin-label">Primary Button Link</label>
					<input className="admin-input" value={d.primaryBtn?.href ?? ""} onChange={e => updateBtn("primaryBtn", "href", e.target.value)} />
				</div>
			</div>
			<div style={{ display: "flex", gap: 8 }}>
				<div className="admin-field" style={{ flex: 1 }}>
					<label className="admin-label">Secondary Button Label</label>
					<input className="admin-input" value={d.secondaryBtn?.label ?? ""} onChange={e => updateBtn("secondaryBtn", "label", e.target.value)} />
				</div>
				<div className="admin-field" style={{ flex: 1 }}>
					<label className="admin-label">Secondary Button Link</label>
					<input className="admin-input" value={d.secondaryBtn?.href ?? ""} onChange={e => updateBtn("secondaryBtn", "href", e.target.value)} />
				</div>
			</div>

			<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>Stats</label>
			{(d.stats ?? []).map((stat, i) => (
				<div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, padding: 10, border: "1px solid var(--admin-border)", borderRadius: 8 }}>
					<div className="admin-field" style={{ flex: 1, marginBottom: 0 }}>
						<label className="admin-label">Value</label>
						<input className="admin-input" value={stat.value ?? ""} onChange={e => updateStat(i, "value", e.target.value)} />
					</div>
					<div className="admin-field" style={{ flex: 1, marginBottom: 0 }}>
						<label className="admin-label">Label</label>
						<input className="admin-input" value={stat.label ?? ""} onChange={e => updateStat(i, "label", e.target.value)} />
					</div>
					<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
						<label className="admin-label" style={{ marginBottom: 0 }}>Red</label>
						<input type="checkbox" checked={!!stat.highlight} onChange={e => updateStat(i, "highlight", e.target.checked)} />
					</div>
					<button className="admin-btn admin-btn--ghost" onClick={() => removeStat(i)}>✕</button>
				</div>
			))}
			<button className="admin-btn admin-btn--ghost" onClick={addStat} style={{ marginBottom: 20 }}>+ Add stat</button>

			<label className="admin-label" style={{ display: "block", marginTop: 4, marginBottom: 8 }}>Hero Images (auto-rotating carousel)</label>
			{imgs.length > 0 && (
				<div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
					{imgs.map((imgPath, idx) => (
						<div key={idx} style={{ position: "relative" }}>
							<div onClick={() => setExpanded(rawUrl(imgPath))} style={{ width: 120, height: 80, borderRadius: 6, overflow: "hidden", border: "1px solid var(--admin-border)", cursor: "zoom-in" }}>
								<img src={rawUrl(imgPath)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
							</div>
							<button onClick={() => removeImage(idx)} style={{ position: "absolute", top: -7, right: -7, width: 20, height: 20, borderRadius: "50%", background: "var(--admin-red)", color: "white", border: "none", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
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
								<input className="admin-input" style={{ fontSize: 13, marginBottom: 4 }} value={upload.filename} onChange={e => renamePendingUpload(idx, e.target.value)} />
								<p style={{ margin: 0, fontSize: 11, color: "var(--admin-muted)" }}>→ /images/silbo/hero/{upload.filename}</p>
								{fileChecks[idx] === "checking" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--admin-muted)" }}>Checking…</p>}
								{fileChecks[idx] === "exists" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--admin-red)" }}>⚠ File already exists — saving will overwrite it</p>}
								{fileChecks[idx] === "free" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#16a34a" }}>✓ Name is available</p>}
							</div>
							<button className="admin-btn admin-btn--ghost" onClick={() => clearPendingUpload(idx)}>✕</button>
						</div>
					))}
				</div>
			)}
			<label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", border: "1px solid var(--admin-border)", borderRadius: 8, cursor: "pointer", fontSize: 13, background: "white", fontFamily: "inherit" }}>
				<input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) handleFileSelect(e.target.files[0]); e.target.value = ""; }} />
				+ Add image
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
