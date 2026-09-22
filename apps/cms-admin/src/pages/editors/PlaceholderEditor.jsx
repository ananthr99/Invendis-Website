import { useState, useEffect, useRef } from "react";
import { useAdmin } from "../../context/AdminContext.jsx";
import { loadPageContent, savePageContent } from "../../utils/savePageContent.js";

// Generic fallback editor for any page that doesn't have a structured
// form yet (see HomePageEditor.jsx / ContactPageEditor.jsx for that
// pattern). This one edits the page's JSON directly as text — less
// pleasant than a real form, but every page is genuinely editable from
// day one rather than blocked until someone builds a dedicated editor.
export default function PlaceholderEditor({ label, contentPath }) {
	const { token, toast, setDirty, userEmail } = useAdmin();
	const [original, setOriginal] = useState(null);
	const [text, setText] = useState("");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [parseError, setParseError] = useState(null);
	const loadedRef = useRef(null);

	useEffect(() => {
		const key = `${token}:${contentPath}`;
		if (!token || loadedRef.current === key) return;
		loadedRef.current = key;
		setLoading(true);
		loadPageContent(contentPath, token)
			.then((data) => {
				setOriginal(data);
				setText(JSON.stringify(data, null, 2));
			})
			.catch((err) => toast(err.message, "err"))
			.finally(() => setLoading(false));
	}, [token, contentPath]);

	useEffect(() => {
		if (original === null) return;
		setDirty(JSON.stringify(original, null, 2) !== text);
	}, [text, original]);

	if (!token) return <p style={{ color: "var(--admin-muted)" }}>Enter a GitHub token in Setup first.</p>;
	if (loading) return <p style={{ color: "var(--admin-muted)" }}>Loading…</p>;

	function handleChange(value) {
		setText(value);
		try {
			JSON.parse(value);
			setParseError(null);
		} catch (err) {
			setParseError(err.message);
		}
	}

	async function handleSave() {
		let parsed;
		try {
			parsed = JSON.parse(text);
		} catch (err) {
			toast(`Invalid JSON: ${err.message}`, "err");
			return;
		}
		setSaving(true);
		try {
			await savePageContent({
				token,
				contentPath,
				before: original,
				after: parsed,
				page: label,
				userEmail,
			});
			setOriginal(parsed);
			setDirty(false);
			toast(`${label} saved — live in a few seconds`, "ok");
		} catch (err) {
			toast(err.message, "err");
		} finally {
			setSaving(false);
		}
	}

	return (
		<div>
			<h2>{label}</h2>
			<p style={{ color: "var(--admin-muted)", fontSize: 13.5 }}>
				No structured form for this page yet — edit the raw content below. To build a real form (recommended for
				anything a non-developer will edit often), copy <code>HomePageEditor.jsx</code> as a starting point.
			</p>

			<div className="admin-card">
				<textarea
					className="admin-textarea"
					style={{ minHeight: 400, fontFamily: "monospace", fontSize: 13 }}
					value={text}
					onChange={(e) => handleChange(e.target.value)}
					spellCheck={false}
				/>
				{parseError && (
					<p style={{ color: "var(--admin-red)", fontSize: 12.5, marginTop: 8 }}>Invalid JSON: {parseError}</p>
				)}
			</div>

			<button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving || !!parseError}>
				{saving ? "Saving…" : "Save changes"}
			</button>
		</div>
	);
}
