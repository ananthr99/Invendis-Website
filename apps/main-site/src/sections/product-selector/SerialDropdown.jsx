import { useState, useEffect, useRef } from "react";

export default function SerialDropdown({ value, onChange }) {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);
	const selected = value ? value.split(",") : [];
	const options = [
		{ key: "rs485", label: "RS-485" },
		{ key: "rs232", label: "RS-232" },
	];

	useEffect(() => {
		function handler(e) {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		}
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	function toggle(key) {
		const next = selected.includes(key)
			? selected.filter(x => x !== key)
			: [...selected, key];
		onChange(next.join(","));
	}

	const label = selected.length === 0
		? "Serial I/O: Any"
		: selected.map(k => k === "rs485" ? "RS-485" : "RS-232").join(" + ");

	return (
		<div ref={ref} style={{ position: "relative", flex: 1, minWidth: 140 }}>
			<button
				onClick={() => setOpen(!open)}
				style={{
					width: "100%", padding: "6px 10px",
					borderRadius: 6, border: "1px solid #d1d5db",
					background: selected.length > 0 ? "#EFF6FF" : "white",
					color: selected.length > 0 ? "#0369A1" : "#374151",
					fontSize: 12, cursor: "pointer",
					display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6,
					fontWeight: selected.length > 0 ? 600 : 400,
				}}
			>
				<span>{label}</span>
				<span style={{ fontSize: 9, opacity: 0.6 }}>{open ? "▲" : "▼"}</span>
			</button>
			{open && (
				<div style={{
					position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
					background: "white", border: "1px solid #e5e7eb", borderRadius: 8,
					boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 50, overflow: "hidden",
				}}>
					{options.map(opt => (
						<label
							key={opt.key}
							style={{
								display: "flex", alignItems: "center", gap: 8,
								padding: "10px 12px", cursor: "pointer",
								background: selected.includes(opt.key) ? "#EFF6FF" : "white",
								fontSize: 13, color: "#374151",
							}}
						>
							<input
								type="checkbox"
								checked={selected.includes(opt.key)}
								onChange={() => toggle(opt.key)}
								style={{ accentColor: "#E63946" }}
							/>
							{opt.label}
						</label>
					))}
				</div>
			)}
		</div>
	);
}
