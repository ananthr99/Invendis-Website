const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function siteImg(path) { return path ? BASE + path : path; }

export default function DesignPartnersSection({ data }) {
	const { eyebrow, title, partners = [] } = data ?? {};

	return (
		<section className="bg-brand-light px-4 py-12 sm:px-8">
			<div className="mx-auto max-w-screen-2xl text-center">
				<p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{eyebrow}</p>
				<h2 className="font-heading text-2xl font-bold text-brand-text sm:text-3xl">{title}</h2>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "0.75rem 2.5rem", marginTop: "2rem" }}>
					{partners.map((partner) => {
						const logo = Array.isArray(partner.logo) ? partner.logo[0] : partner.logo;
						return (
							<div key={partner.name}>
								{logo ? (
									<img src={siteImg(logo)} alt={partner.name} style={{ height: 28, objectFit: "contain", filter: "grayscale(1) opacity(0.55)" }} />
								) : (
									<span className="cursor-default text-xl font-semibold tracking-wider text-brand-muted transition-colors hover:text-brand-blue uppercase">
									    {partner.name}
								    </span>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
