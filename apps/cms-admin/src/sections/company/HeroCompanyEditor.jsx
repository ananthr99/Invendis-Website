import { useState } from "react";
import { fileToBase64 } from "@invendis/github-client";
import { github, OWNER, REPO } from "../../config.js";

function rawUrl(imgPath) {
	return `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/apps/main-site/public${imgPath}`;
}

export default function HeroCompanyEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", titleHighlight: "", subtitle: "", stats: [], image: "" };
	const [blobUrl, setBlobUrl] = useState(null);

	function set(field, val) {
		onChange({ ...d, [field]: val });
	}

	async function handleFileSelect(file) {
		const base64 = await fileToBase64(file);
		if (blobUrl) URL.revokeObjectURL(blobUrl);
		const url = URL.createObjectURL(file);
		setBlobUrl(url);
		onChange({ ...d, _pendingUpload: { base64, filename: file.name } });
	}

	function renamePending(val) {
		onChange({ ...d, _pendingUpload: { ...d._pendingUpload, filename: val } });
	}

	function clearPending() {
		if (blobUrl) URL.revokeObjectURL(blobUrl);
		setBlobUrl(null);
		onChange({ ...d, _pendingUpload: undefined });
	}

	function addStat() {
		onChange({ ...d, stats: [...(d.stats ?? []), { value: "", label: "" }] });
	}

	function updateStat(i, field, val) {
		const stats = [...(d.stats ?? [])];
		stats[i] = { ...stats[i], [field]: val };
		onChange({ ...d, stats });
	}

	function removeStat(i) {
		onChange({ ...d, stats: (d.stats ?? []).filter((_, idx) => idx !== i) });
	}

	const pending = d._pendingUpload;
	const previewSrc = pending ? blobUrl : d.image ? rawUrl(d.image) : null;

	return (
		<div>
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
				<div className="admin-field">
					<label className="admin-label">Eyebrow</label>
					<input className="admin-input" value={d.eyebrow ?? ""} onChange={e => set("eyebrow", e.target.value)} />
				</div>
				<div className="admin-field">
					<label className="admin-label">Title</label>
					<input className="admin-input" value={d.title ?? ""} onChange={e => set("title", e.target.value)} />
				</div>
			</div>
			<div className="admin-field">
				<label className="admin-label">Title Highlight (renders in red)</label>
				<input className="admin-input" value={d.titleHighlight ?? ""} onChange={e => set("titleHighlight", e.target.value)} />
			</div>
			<div className="admin-field" style={{ marginBottom: 24 }}>
				<label className="admin-label">Subtitle</label>
				<textarea className="admin-textarea" rows={3} value={d.subtitle ?? ""} onChange={e => set("subtitle", e.target.value)} />
			</div>

			{/* Stats */}
			<div style={{ paddingBottom: 24, marginBottom: 24, borderBottom: "1px solid var(--admin-border)" }}>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
					<label className="admin-label" style={{ marginBottom: 0 }}>Stats</label>
					<button className="admin-btn admin-btn--ghost" onClick={addStat} style={{ fontSize: 12 }}>+ Add Stat</button>
				</div>
				{(d.stats ?? []).map((stat, i) => (
					<div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: 8, marginBottom: 8, alignItems: "center" }}>
						<input className="admin-input" placeholder="Value (e.g. 18+)" value={stat.value ?? ""} onChange={e => updateStat(i, "value", e.target.value)} />
						<input className="admin-input" placeholder="Label (e.g. Years in IIoT)" value={stat.label ?? ""} onChange={e => updateStat(i, "label", e.target.value)} />
						<button onClick={() => removeStat(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-red)", fontSize: 18, padding: "0 4px" }}>✕</button>
					</div>
				))}
				{(d.stats ?? []).length === 0 && (
					<p style={{ margin: 0, fontSize: 12, color: "var(--admin-muted)" }}>No stats yet.</p>
				)}
			</div>

			{/* Background Image */}
			<div className="admin-field">
				<label className="admin-label">Background Image</label>
				<div style={{ display: "inline-flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
					{previewSrc && (
						<div style={{ position: "relative", display: "inline-block" }}>
							<img src={previewSrc} alt="" style={{ height: 80, width: 160, objectFit: "cover", borderRadius: 6, border: "1px solid var(--admin-border)", display: "block" }} />
							<button
								onClick={pending ? clearPending : () => set("image", "")}
								title="Remove"
								style={{ position: "absolute", top: -7, right: -7, width: 20, height: 20, borderRadius: "50%", background: "var(--admin-red)", color: "white", border: "none", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}
							>✕</button>
						</div>
					)}
					{pending && (
						<div>
							<input className="admin-input" style={{ fontSize: 12 }} value={pending.filename} onChange={e => renamePending(e.target.value)} placeholder="filename.jpg" />
							<p style={{ margin: "3px 0 0", fontSize: 11, color: "var(--admin-muted)" }}>→ /images/company/hero/{pending.filename}</p>
						</div>
					)}
					<label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1px solid var(--admin-border)", borderRadius: 6, cursor: "pointer", fontSize: 12, background: "white", fontFamily: "inherit" }}>
						<input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) handleFileSelect(e.target.files[0]); e.target.value = ""; }} />
						{previewSrc ? "Replace image" : "Upload image"}
					</label>
				</div>
			</div>
		</div>
	);
}
