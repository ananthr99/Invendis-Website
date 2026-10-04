import { useState, useRef } from "react";
import { checkFileSize } from "../../utils/fileUtils.js";
import { fileToBase64 } from "@invendis/github-client";
import { compressImage, COMPRESS_PRESETS } from "../../utils/compressImage.js";
import { github, OWNER, REPO } from "../../config.js";
import { useAdmin } from "../../context/AdminContext.jsx";
import SingleImageUpload from "../../components/SingleImageUpload.jsx";

function rawUrl(imgPath) {
	return `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/apps/main-site/public${imgPath}`;
}

export default function HeroResourcesEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", titleHighlight: "", subtitle: "", image: "" };
	const [preview, setPreview] = useState(null);
	const [fileCheck, setFileCheck] = useState(null);
	const { token, toast } = useAdmin();
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
			} catch {
				setFileCheck("free");
			}
		}, 500);
	}

	async function handleFileSelect(file) {
		if (!checkFileSize(file, toast)) return;
		const compressed = await compressImage(file, COMPRESS_PRESETS.hero);
		const base64 = await fileToBase64(compressed);
		const previewUrl = URL.createObjectURL(compressed);
		setPreview({ previewUrl, filename: file.name });
		onChange({ ...d, _pendingUpload: { base64, filename: file.name } });
		checkFileExists(`apps/main-site/public/images/resources/hero/${file.name}`);
	}

	function renamePending(val) {
		onChange({ ...d, _pendingUpload: { ...d._pendingUpload, filename: val } });
		checkFileExists(`apps/main-site/public/images/resources/hero/${val}`);
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
				<SingleImageUpload
					existingUrl={d.image ? rawUrl(d.image) : null}
					existingPath={d.image}
					pending={d._pendingUpload ?? null}
					preview={preview?.previewUrl ?? null}
					fileCheck={fileCheck}
					storagePath="/images/resources/hero/"
					onFileSelect={handleFileSelect}
					onRename={renamePending}
					onClearPending={clearPending}
					onRemoveExisting={() => onChange({ ...d, image: "" })}
				/>
			</div>
		</div>
	);
}
