export default function SingleImageUpload({
	existingUrl,
	existingPath,
	pending,
	preview,
	fileCheck,
	storagePath,
	onFileSelect,
	onRename,
	onClearPending,
	onRemoveExisting,
}) {
	return (
		<div>
			{existingUrl && !pending && (
				<div style={{ marginBottom: 12 }}>
					<div style={{ position: "relative", display: "inline-block" }}>
						<img src={existingUrl} alt="" style={{ height: 80, width: 160, objectFit: "cover", borderRadius: 6, border: "1px solid var(--admin-border)", display: "block" }} />
						<button onClick={onRemoveExisting} title="Remove" style={{ position: "absolute", top: -7, right: -7, width: 20, height: 20, borderRadius: "50%", background: "var(--admin-red)", color: "white", border: "none", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
					</div>
					{existingPath && <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--admin-muted)" }}>{existingPath}</p>}
				</div>
			)}
			{pending && (
				<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: 8, background: "var(--admin-bg)", border: "1px solid var(--admin-border)", borderRadius: 6 }}>
					{preview && <img src={preview} alt="" style={{ height: 52, width: 80, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />}
					<div style={{ flex: 1, minWidth: 0 }}>
						<label style={{ fontSize: 11, color: "var(--admin-muted)", display: "block", marginBottom: 3 }}>Save as</label>
						<input className="admin-input" style={{ fontSize: 13, marginBottom: 4 }} value={pending.filename} onChange={e => onRename(e.target.value)} placeholder="filename.jpg" />
						{storagePath && <p style={{ margin: 0, fontSize: 11, color: "var(--admin-muted)" }}>→ {storagePath}{pending.filename}</p>}
						{fileCheck === "checking" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--admin-muted)" }}>Checking…</p>}
						{fileCheck === "exists" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--admin-red)" }}>⚠ File already exists — saving will overwrite it</p>}
						{fileCheck === "free" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#16a34a" }}>✓ Name is available</p>}
					</div>
					<button className="admin-btn admin-btn--ghost" onClick={onClearPending}>✕</button>
				</div>
			)}
			<label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", border: "1px solid var(--admin-border)", borderRadius: 8, cursor: "pointer", fontSize: 13, background: "white", fontFamily: "inherit" }}>
				<input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) onFileSelect(e.target.files[0]); e.target.value = ""; }} />
				{pending || existingUrl ? "Replace image" : "Upload image"}
			</label>
		</div>
	);
}
