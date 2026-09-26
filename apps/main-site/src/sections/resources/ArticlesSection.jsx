import { useState } from "react";
import { Link } from "react-router-dom";

function CalendarIcon() {
	return (
		<svg style={{ width: 13, height: 13 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
		</svg>
	);
}

function ClockIcon() {
	return (
		<svg style={{ width: 13, height: 13 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
		</svg>
	);
}

function ArticleCard({ item }) {
	return (
		<div className="flex flex-col overflow-hidden rounded-xl border border-t-4 border-black/5 border-t-transparent bg-white transition-all hover:border-t-brand-red hover:shadow-md" style={{ padding: "20px 22px 18px" }}>
			{item.category && (
				<span style={{
					display: "inline-block",
					alignSelf: "flex-start",
					background: "#eff6ff",
					color: "#1B2A6B",
					fontSize: 11,
					fontWeight: 600,
					padding: "3px 10px",
					borderRadius: 20,
					marginBottom: 12,
					letterSpacing: "0.02em",
				}}>
					{item.category}
				</span>
			)}
			<h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 700, color: "#1B2A6B", lineHeight: 1.4 }}>{item.title}</h3>
			<p style={{ margin: "0 0 16px", fontSize: 13, color: "#4b5563", lineHeight: 1.65, flex: 1 }}>{item.description}</p>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f3f4f6", marginTop: "auto" }}>
				<div style={{ display: "flex", alignItems: "center", gap: 12, color: "#9ca3af", fontSize: 12 }}>
					<span style={{ display: "flex", alignItems: "center", gap: 4 }}>
						<CalendarIcon /> {item.date}
					</span>
					<span style={{ display: "flex", alignItems: "center", gap: 4 }}>
						<ClockIcon /> {item.readTime}
					</span>
				</div>
				{item.slug && (
					<Link
						to={`/resources/${item.slug}`}
						style={{ fontSize: 13, fontWeight: 600, color: "#E63946", textDecoration: "none" }}
					>
						Read →
					</Link>
				)}
			</div>
		</div>
	);
}

export default function ArticlesSection({ data }) {
	const { categories = [], items = [] } = data ?? {};
	const [activeFilter, setActiveFilter] = useState("All");

	const usedCategories = categories.filter(cat => items.some(item => item.category === cat));
	const allTabs = ["All", ...usedCategories];
	const filtered = activeFilter === "All" ? items : items.filter(item => item.category === activeFilter);

	function getCount(cat) {
		return items.filter(item => item.category === cat).length;
	}

	return (
		<section className="bg-white px-4 py-16 sm:px-8">
			<div style={{ maxWidth: "1536px", margin: "0 auto" }}>
				{allTabs.length > 1 && (
					<div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "2rem" }}>
						{allTabs.map(tab => {
							const isActive = tab === activeFilter;
							const count = tab === "All" ? null : getCount(tab);
							return (
								<button
									key={tab}
									onClick={() => setActiveFilter(tab)}
									style={{
										padding: "6px 18px",
										borderRadius: 20,
										border: isActive ? "none" : "1px solid #d1d5db",
										background: isActive ? "#1B2A6B" : "white",
										color: isActive ? "white" : "#374151",
										fontSize: 13,
										fontWeight: isActive ? 600 : 400,
										cursor: "pointer",
										transition: "all 0.15s",
										fontFamily: "inherit",
									}}
								>
									{tab}{count !== null ? ` (${count})` : ""}
								</button>
							);
						})}
					</div>
				)}

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((item, i) => (
						<ArticleCard key={item.id ?? i} item={item} />
					))}
				</div>

				{filtered.length === 0 && (
					<p style={{ textAlign: "center", color: "#9ca3af", padding: "3rem 0", fontSize: 14 }}>
						No articles in this category yet.
					</p>
				)}
			</div>
		</section>
	);
}
