import { useState, useRef } from "react";
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const ISO3_TO_NUM = {
	AFG:"004",AGO:"024",ALB:"008",ARE:"784",ARG:"032",ARM:"051",AUS:"036",AUT:"040",
	AZE:"031",BDI:"108",BEL:"056",BEN:"204",BFA:"854",BGD:"050",BGR:"100",BHR:"048",
	BIH:"070",BLR:"112",BLZ:"084",BOL:"068",BRA:"076",BTN:"064",BWA:"072",CAF:"140",
	CAN:"124",CHE:"756",CHL:"152",CHN:"156",CIV:"384",CMR:"120",COD:"180",COG:"178",
	COL:"170",COM:"174",CPV:"132",CRI:"188",CUB:"192",CYP:"196",CZE:"203",DEU:"276",
	DJI:"262",DNK:"208",DOM:"214",DZA:"012",ECU:"218",EGY:"818",ERI:"232",ESP:"724",
	ETH:"231",FIN:"246",FJI:"242",FRA:"250",GAB:"266",GBR:"826",GEO:"268",GHA:"288",
	GIN:"324",GMB:"270",GNB:"624",GNQ:"226",GRC:"300",GTM:"320",GUY:"328",HND:"340",
	HRV:"191",HTI:"332",HUN:"348",IDN:"360",IND:"356",IRL:"372",IRN:"364",IRQ:"368",
	ISL:"352",ISR:"376",ITA:"380",JAM:"388",JOR:"400",JPN:"392",KAZ:"398",KEN:"404",
	KGZ:"417",KHM:"116",KWT:"414",LAO:"418",LBN:"422",LBR:"430",LBY:"434",LKA:"144",
	LSO:"426",LTU:"440",LUX:"442",LVA:"428",MAR:"504",MDA:"498",MDG:"450",MEX:"484",
	MKD:"807",MLI:"466",MMR:"104",MNE:"499",MNG:"496",MOZ:"508",MRT:"478",MUS:"480",
	MWI:"454",MYS:"458",NAM:"516",NER:"562",NGA:"566",NIC:"558",NLD:"528",NOR:"578",
	NPL:"524",NZL:"554",OMN:"512",PAK:"586",PAN:"591",PER:"604",PHL:"608",PNG:"598",
	POL:"616",PRT:"620",PRY:"600",QAT:"634",ROU:"642",RUS:"643",RWA:"646",SAU:"682",
	SDN:"729",SEN:"686",SGP:"702",SLE:"694",SLV:"222",SOM:"706",SRB:"688",SSD:"728",
	SUR:"740",SVK:"703",SVN:"705",SWE:"752",SWZ:"748",SYR:"760",TCD:"148",TGO:"768",
	THA:"764",TJK:"762",TKM:"795",TLS:"626",TTO:"780",TUN:"788",TUR:"792",TWN:"158",
	TZA:"834",UGA:"800",UKR:"804",URY:"858",USA:"840",UZB:"860",VEN:"862",VNM:"704",
	YEM:"887",ZAF:"710",ZMB:"894",ZWE:"716",
};

function WorldMap({ countriesServed = [], hqCountry = "IND" }) {
	const [hovered, setHovered] = useState(null);
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
	const containerRef = useRef(null);
	const servedNums = new Set(countriesServed.map((c) => ISO3_TO_NUM[c]).filter(Boolean));
	const hqNum = ISO3_TO_NUM[hqCountry];

	function handleMouseMove(e) {
		if (!containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
	}

	return (
		<div ref={containerRef} style={{ position: "relative" }} onMouseMove={handleMouseMove}>
			{/* Cursor-following tooltip */}
			<div style={{
				position: "absolute",
				left: mousePos.x + 14,
				top: mousePos.y - 32,
				background: "rgba(27,42,107,0.92)",
				color: "white",
				padding: "4px 12px",
				borderRadius: 20,
				fontSize: 12,
				fontWeight: 500,
				pointerEvents: "none",
				whiteSpace: "nowrap",
				zIndex: 10,
				opacity: hovered ? 1 : 0,
				transition: "opacity 0.12s",
			}}>
				{hovered ?? ""}
			</div>

			<ComposableMap
				width={960}
				height={440}
				projectionConfig={{ scale: 153, center: [0, 10] }}
				style={{ width: "100%", height: "auto", display: "block" }}
			>
				<Sphere id="rsm-sphere" fill="#dce9f5" stroke="#b8d0e8" strokeWidth={0.5} />
				<Graticule stroke="rgba(160,195,225,0.45)" strokeWidth={0.4} />
				<Geographies geography={GEO_URL}>
					{({ geographies }) =>
						geographies.map((geo) => {
							const isHQ = geo.id === hqNum;
							const isServed = servedNums.has(geo.id);
							const isHov = hovered === geo.properties.name;
							return (
								<Geography
									key={geo.rsmKey}
									geography={geo}
									onMouseEnter={() => { if (isHQ || isServed) setHovered(geo.properties.name); }}
									onMouseLeave={() => setHovered(null)}
									fill={
										isHQ ? (isHov ? "#2d47b0" : "#1B2A6B")
										: isServed ? (isHov ? "#c8212e" : "#E63946")
										: (isHov ? "#aab4c8" : "#c4cad8")
									}
									stroke="rgba(255,255,255,0.75)"
									strokeWidth={0.45}
									style={{
										default: { outline: "none", cursor: (isHQ || isServed) ? "pointer" : "default" },
										hover: { outline: "none" },
										pressed: { outline: "none" },
									}}
								/>
							);
						})
					}
				</Geographies>
			</ComposableMap>
		</div>
	);
}

export default function GlobalPresenceSection({ data }) {
	const d = data ?? {};
	return (
		<section className="bg-brand-light px-4 py-20 sm:px-8">
			<div style={{ maxWidth: 1100, margin: "0 auto" }}>
				<div className="mb-10 text-center">
					{d.eyebrow && (
						<p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{d.eyebrow}</p>
					)}
					<h2 className="font-heading text-3xl font-bold text-brand-text sm:text-4xl">
						{d.title}
						{d.titleHighlight && <span className="text-brand-blue"> {d.titleHighlight}</span>}
					</h2>
					{d.subtitle && (
						<p className="mx-auto mt-4 max-w-2xl text-brand-muted" style={{ fontSize: 15 }}>{d.subtitle}</p>
					)}
				</div>

				<div style={{ borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
					<WorldMap countriesServed={d.countriesServed ?? []} hqCountry={d.hqCountry ?? "IND"} />
					<div style={{ display: "flex", justifyContent: "center", gap: "2rem", padding: "0.75rem 1.5rem 1rem", background: "white", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
						{[["#1B2A6B", "HQ — India"], ["#E63946", "Countries Served"], ["#c4cad8", "Other Regions"]].map(([color, label]) => (
							<div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
								<span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} />
								{label}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
