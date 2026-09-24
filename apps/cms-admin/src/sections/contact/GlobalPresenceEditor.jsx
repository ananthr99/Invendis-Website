import { useState } from "react";

const COUNTRIES = [
	{ name: "Afghanistan", code: "AFG" }, { name: "Albania", code: "ALB" },
	{ name: "Algeria", code: "DZA" }, { name: "Angola", code: "AGO" },
	{ name: "Argentina", code: "ARG" }, { name: "Armenia", code: "ARM" },
	{ name: "Australia", code: "AUS" }, { name: "Austria", code: "AUT" },
	{ name: "Azerbaijan", code: "AZE" }, { name: "Bahrain", code: "BHR" },
	{ name: "Bangladesh", code: "BGD" }, { name: "Belgium", code: "BEL" },
	{ name: "Benin", code: "BEN" }, { name: "Bolivia", code: "BOL" },
	{ name: "Bosnia and Herzegovina", code: "BIH" }, { name: "Botswana", code: "BWA" },
	{ name: "Brazil", code: "BRA" }, { name: "Burkina Faso", code: "BFA" },
	{ name: "Burundi", code: "BDI" }, { name: "Cambodia", code: "KHM" },
	{ name: "Cameroon", code: "CMR" }, { name: "Canada", code: "CAN" },
	{ name: "Central African Republic", code: "CAF" }, { name: "Chad", code: "TCD" },
	{ name: "Chile", code: "CHL" }, { name: "China", code: "CHN" },
	{ name: "Colombia", code: "COL" }, { name: "Congo", code: "COG" },
	{ name: "Democratic Republic of the Congo", code: "COD" }, { name: "Costa Rica", code: "CRI" },
	{ name: "Côte d'Ivoire", code: "CIV" }, { name: "Croatia", code: "HRV" },
	{ name: "Cuba", code: "CUB" }, { name: "Czech Republic", code: "CZE" },
	{ name: "Denmark", code: "DNK" }, { name: "Djibouti", code: "DJI" },
	{ name: "Dominican Republic", code: "DOM" }, { name: "Ecuador", code: "ECU" },
	{ name: "Egypt", code: "EGY" }, { name: "Eritrea", code: "ERI" },
	{ name: "Ethiopia", code: "ETH" }, { name: "Finland", code: "FIN" },
	{ name: "France", code: "FRA" }, { name: "Gabon", code: "GAB" },
	{ name: "Gambia", code: "GMB" }, { name: "Georgia", code: "GEO" },
	{ name: "Germany", code: "DEU" }, { name: "Ghana", code: "GHA" },
	{ name: "Greece", code: "GRC" }, { name: "Guatemala", code: "GTM" },
	{ name: "Guinea", code: "GIN" }, { name: "Guinea-Bissau", code: "GNB" },
	{ name: "Honduras", code: "HND" }, { name: "Hungary", code: "HUN" },
	{ name: "India", code: "IND" }, { name: "Indonesia", code: "IDN" },
	{ name: "Iran", code: "IRN" }, { name: "Iraq", code: "IRQ" },
	{ name: "Ireland", code: "IRL" }, { name: "Israel", code: "ISR" },
	{ name: "Italy", code: "ITA" }, { name: "Jamaica", code: "JAM" },
	{ name: "Japan", code: "JPN" }, { name: "Jordan", code: "JOR" },
	{ name: "Kazakhstan", code: "KAZ" }, { name: "Kenya", code: "KEN" },
	{ name: "Kuwait", code: "KWT" }, { name: "Kyrgyzstan", code: "KGZ" },
	{ name: "Laos", code: "LAO" }, { name: "Lebanon", code: "LBN" },
	{ name: "Liberia", code: "LBR" }, { name: "Libya", code: "LBY" },
	{ name: "Malawi", code: "MWI" }, { name: "Malaysia", code: "MYS" },
	{ name: "Mali", code: "MLI" }, { name: "Mauritania", code: "MRT" },
	{ name: "Mauritius", code: "MUS" }, { name: "Mexico", code: "MEX" },
	{ name: "Mongolia", code: "MNG" }, { name: "Morocco", code: "MAR" },
	{ name: "Mozambique", code: "MOZ" }, { name: "Myanmar", code: "MMR" },
	{ name: "Namibia", code: "NAM" }, { name: "Nepal", code: "NPL" },
	{ name: "Netherlands", code: "NLD" }, { name: "New Zealand", code: "NZL" },
	{ name: "Nicaragua", code: "NIC" }, { name: "Niger", code: "NER" },
	{ name: "Nigeria", code: "NGA" }, { name: "Norway", code: "NOR" },
	{ name: "Oman", code: "OMN" }, { name: "Pakistan", code: "PAK" },
	{ name: "Panama", code: "PAN" }, { name: "Peru", code: "PER" },
	{ name: "Philippines", code: "PHL" }, { name: "Poland", code: "POL" },
	{ name: "Portugal", code: "PRT" }, { name: "Qatar", code: "QAT" },
	{ name: "Romania", code: "ROU" }, { name: "Russia", code: "RUS" },
	{ name: "Rwanda", code: "RWA" }, { name: "Saudi Arabia", code: "SAU" },
	{ name: "Senegal", code: "SEN" }, { name: "Sierra Leone", code: "SLE" },
	{ name: "Singapore", code: "SGP" }, { name: "Somalia", code: "SOM" },
	{ name: "South Africa", code: "ZAF" }, { name: "South Sudan", code: "SSD" },
	{ name: "Spain", code: "ESP" }, { name: "Sri Lanka", code: "LKA" },
	{ name: "Sudan", code: "SDN" }, { name: "Sweden", code: "SWE" },
	{ name: "Switzerland", code: "CHE" }, { name: "Syria", code: "SYR" },
	{ name: "Taiwan", code: "TWN" }, { name: "Tajikistan", code: "TJK" },
	{ name: "Tanzania", code: "TZA" }, { name: "Thailand", code: "THA" },
	{ name: "Togo", code: "TGO" }, { name: "Tunisia", code: "TUN" },
	{ name: "Turkey", code: "TUR" }, { name: "Turkmenistan", code: "TKM" },
	{ name: "Uganda", code: "UGA" }, { name: "Ukraine", code: "UKR" },
	{ name: "United Arab Emirates", code: "ARE" }, { name: "United Kingdom", code: "GBR" },
	{ name: "United States", code: "USA" }, { name: "Uzbekistan", code: "UZB" },
	{ name: "Venezuela", code: "VEN" }, { name: "Vietnam", code: "VNM" },
	{ name: "Yemen", code: "YEM" }, { name: "Zambia", code: "ZMB" },
	{ name: "Zimbabwe", code: "ZWE" },
];

function getCountryName(code) {
	return COUNTRIES.find(c => c.code === code)?.name ?? code;
}

export default function GlobalPresenceEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", titleHighlight: "", subtitle: "", hqCountry: "IND", countriesServed: [] };
	const [search, setSearch] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);
	const [hqSearch, setHqSearch] = useState("");
	const [showHqDropdown, setShowHqDropdown] = useState(false);

	const served = d.countriesServed ?? [];

	const filtered = search.length > 0
		? COUNTRIES.filter(c =>
			c.name.toLowerCase().includes(search.toLowerCase()) &&
			!served.includes(c.code)
		).slice(0, 8)
		: [];

	const hqFiltered = hqSearch.length > 0
		? COUNTRIES.filter(c => c.name.toLowerCase().includes(hqSearch.toLowerCase())).slice(0, 6)
		: [];

	function set(field, val) {
		onChange({ ...d, [field]: val });
	}

	function addCountry(code) {
		onChange({ ...d, countriesServed: [...served, code] });
		setSearch("");
		setShowDropdown(false);
	}

	function removeCountry(code) {
		onChange({ ...d, countriesServed: served.filter(c => c !== code) });
	}

	function selectHq(code) {
		onChange({ ...d, hqCountry: code });
		setHqSearch("");
		setShowHqDropdown(false);
	}

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
				<label className="admin-label">Title Highlight (renders in blue)</label>
				<input className="admin-input" value={d.titleHighlight} onChange={e => set("titleHighlight", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Subtitle</label>
				<textarea className="admin-textarea" value={d.subtitle} onChange={e => set("subtitle", e.target.value)} />
			</div>

			{/* HQ Country picker */}
			<div className="admin-field" style={{ maxWidth: 300 }}>
				<label className="admin-label">HQ Country</label>
				<div style={{ position: "relative" }}>
					<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
						{d.hqCountry && (
							<span style={{ fontSize: 13, fontWeight: 600, color: "#1B2A6B" }}>
								{getCountryName(d.hqCountry)}
							</span>
						)}
					</div>
					<input
						className="admin-input"
						placeholder="Search to change HQ country…"
						value={hqSearch}
						onChange={e => { setHqSearch(e.target.value); setShowHqDropdown(true); }}
						onFocus={() => setShowHqDropdown(true)}
						onBlur={() => setTimeout(() => setShowHqDropdown(false), 150)}
					/>
					{showHqDropdown && hqFiltered.length > 0 && (
						<div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: "1px solid var(--admin-border)", borderRadius: 8, zIndex: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", overflow: "hidden" }}>
							{hqFiltered.map(c => (
								<button
									key={c.code}
									onMouseDown={() => selectHq(c.code)}
									style={{ display: "block", width: "100%", padding: "8px 12px", textAlign: "left", border: "none", borderBottom: "1px solid var(--admin-border)", background: "none", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}
								>
									{c.name}
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Countries Served picker */}
			<div className="admin-field">
				<label className="admin-label">Countries Served</label>
				<p style={{ fontSize: 12, color: "var(--admin-muted)", margin: "0 0 10px" }}>
					{served.length} {served.length === 1 ? "country" : "countries"} selected
				</p>

				{/* Selected pills */}
				{served.length > 0 && (
					<div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
						{served.map(code => (
							<span key={code} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 6px 3px 10px", borderRadius: 20, background: "#E63946", color: "white", fontSize: 12, fontWeight: 500 }}>
								{getCountryName(code)}
								<button
									onClick={() => removeCountry(code)}
									style={{ background: "rgba(255,255,255,0.3)", border: "none", borderRadius: "50%", color: "white", cursor: "pointer", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, padding: 0, lineHeight: 1 }}
								>✕</button>
							</span>
						))}
					</div>
				)}

				{/* Search input */}
				<div style={{ position: "relative" }}>
					<input
						className="admin-input"
						placeholder="Type a country name to add…"
						value={search}
						onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
						onFocus={() => setShowDropdown(true)}
						onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
					/>
					{showDropdown && filtered.length > 0 && (
						<div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: "1px solid var(--admin-border)", borderRadius: 8, zIndex: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", overflow: "hidden" }}>
							{filtered.map(c => (
								<button
									key={c.code}
									onMouseDown={() => addCountry(c.code)}
									style={{ display: "block", width: "100%", padding: "8px 12px", textAlign: "left", border: "none", borderBottom: "1px solid var(--admin-border)", background: "none", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}
								>
									{c.name}
								</button>
							))}
						</div>
					)}
					{showDropdown && search.length > 0 && filtered.length === 0 && (
						<div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: "1px solid var(--admin-border)", borderRadius: 8, zIndex: 20, padding: "10px 12px", fontSize: 13, color: "var(--admin-muted)" }}>
							No matches found
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
