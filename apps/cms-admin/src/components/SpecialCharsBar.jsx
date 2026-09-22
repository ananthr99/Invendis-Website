const CHARS = ["·", "—", "→", "←", "…", "°", "×"];

// One-click insertion of characters that are awkward to type. Inserts
// at the cursor position of whichever <input>/<textarea> was last
// focused before this bar was clicked.
export default function SpecialCharsBar({ targetRef, onInsert }) {
	function insert(char) {
		const el = targetRef?.current;
		if (!el) {
			onInsert?.(char);
			return;
		}
		const start = el.selectionStart ?? el.value.length;
		const end = el.selectionEnd ?? el.value.length;
		const newValue = el.value.slice(0, start) + char + el.value.slice(end);
		onInsert?.(newValue);
		requestAnimationFrame(() => {
			el.focus();
			el.setSelectionRange(start + char.length, start + char.length);
		});
	}

	return (
		<div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
			{CHARS.map((c) => (
				<button
					key={c}
					type="button"
					className="admin-btn admin-btn--ghost"
					style={{ padding: "4px 10px" }}
					onClick={() => insert(c)}
				>
					{c}
				</button>
			))}
		</div>
	);
}
