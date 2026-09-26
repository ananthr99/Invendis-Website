import { useState } from "react";
import { fileToBase64 } from "@invendis/github-client";
import { github, OWNER, REPO } from "../../config.js";


function rawUrl(imgPath) {
	return `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/apps/main-site/public${imgPath}`;
}

function MemberEditor({ member, onChange, onRemove }) {
	const [blobUrl, setBlobUrl] = useState(null);
	function set(field, val) { onChange({ ...member, [field]: val }); }

	async function handleFileSelect(file) {
		const base64 = await fileToBase64(file);
		if (blobUrl) URL.revokeObjectURL(blobUrl);
		const url = URL.createObjectURL(file);
		setBlobUrl(url);
		onChange({ ...member, _pendingUpload: { base64, filename: file.name } });
	}

	function renamePending(val) {
		onChange({ ...member, _pendingUpload: { ...member._pendingUpload, filename: val } });
	}

	function clearPending() {
		if (blobUrl) URL.revokeObjectURL(blobUrl);
		setBlobUrl(null);
		onChange({ ...member, _pendingUpload: undefined });
	}

	const pending = member._pendingUpload;
	const previewSrc = pending ? blobUrl : member.image ? rawUrl(member.image) : null;

	return (
		<div style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 16, marginBottom: 12, background: "var(--admin-bg)" }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
				<span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>{member.name || "Untitled Member"}</span>
				<button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-red)", fontSize: 18, lineHeight: 1, padding: "0 2px" }}>✕</button>
			</div>
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
				<div className="admin-field">
					<label className="admin-label">Name</label>
					<input className="admin-input" value={member.name ?? ""} onChange={e => set("name", e.target.value)} />
				</div>
				<div className="admin-field">
					<label className="admin-label">Role</label>
					<input className="admin-input" value={member.role ?? ""} onChange={e => set("role", e.target.value)} />
				</div>
			</div>
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 12, marginBottom: 12 }}>
				<div className="admin-field">
					<label className="admin-label">Initials</label>
					<input className="admin-input" value={member.initials ?? ""} maxLength={3} onChange={e => set("initials", e.target.value)} />
				</div>
				<div className="admin-field">
					<label className="admin-label">Avatar Color</label>
					<div style={{ display: "flex", gap: 6, alignItems: "center" }}>
						<input type="color" value={member.color ?? "#1B2A6B"} onChange={e => set("color", e.target.value)} style={{ width: 36, height: 32, padding: 2, border: "1px solid var(--admin-border)", borderRadius: 6, cursor: "pointer", flexShrink: 0 }} />
						<input className="admin-input" value={member.color ?? ""} onChange={e => set("color", e.target.value)} placeholder="#1B2A6B" />
					</div>
				</div>
				<div className="admin-field">
					<label className="admin-label">LinkedIn URL</label>
					<input className="admin-input" value={member.linkedin ?? ""} placeholder="https://linkedin.com/in/…" onChange={e => set("linkedin", e.target.value)} />
				</div>
			</div>
			<div className="admin-field">
				<label className="admin-label">Photo</label>
				<div style={{ display: "inline-flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
					{previewSrc && (
						<div style={{ position: "relative", display: "inline-block" }}>
							<img src={previewSrc} alt="" style={{ height: 72, width: 72, objectFit: "cover", borderRadius: "50%", border: "2px solid var(--admin-border)", display: "block" }} />
							<button onClick={pending ? clearPending : () => set("image", "")} title="Remove" style={{ position: "absolute", top: -4, right: -4, width: 20, height: 20, borderRadius: "50%", background: "var(--admin-red)", color: "white", border: "none", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
						</div>
					)}
					{pending && (
						<div>
							<input className="admin-input" style={{ fontSize: 12 }} value={pending.filename} onChange={e => renamePending(e.target.value)} placeholder="filename.jpg" />
							<p style={{ margin: "3px 0 0", fontSize: 11, color: "var(--admin-muted)" }}>→ /images/company/leadership/{pending.filename}</p>
						</div>
					)}
					<label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1px solid var(--admin-border)", borderRadius: 6, cursor: "pointer", fontSize: 12, background: "white", fontFamily: "inherit" }}>
						<input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) handleFileSelect(e.target.files[0]); e.target.value = ""; }} />
						{previewSrc ? "Replace photo" : "Upload photo"}
					</label>
				</div>
			</div>
		</div>
	);
}

export default function LeadershipEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", subtitle: "", members: [] };
	function set(field, val) { onChange({ ...d, [field]: val }); }

	function addMember() { onChange({ ...d, members: [...(d.members ?? []), { name: "", role: "", initials: "", color: "#1B2A6B", linkedin: "", image: "" }] }); }
	function updateMember(i, val) { const members = [...(d.members ?? [])]; members[i] = val; onChange({ ...d, members }); }
	function removeMember(i) { onChange({ ...d, members: (d.members ?? []).filter((_, idx) => idx !== i) }); }

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
			<div className="admin-field" style={{ marginBottom: 24 }}>
				<label className="admin-label">Subtitle</label>
				<textarea className="admin-textarea" rows={2} value={d.subtitle ?? ""} onChange={e => set("subtitle", e.target.value)} />
			</div>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
				<h4 style={{ margin: 0, fontSize: 14 }}>Members ({(d.members ?? []).length})</h4>
				<button className="admin-btn admin-btn--ghost" onClick={addMember}>+ Add Member</button>
			</div>
			{(d.members ?? []).map((member, i) => (
				<MemberEditor key={i} member={member} onChange={val => updateMember(i, val)} onRemove={() => removeMember(i)} />
			))}
		</div>
	);
}
