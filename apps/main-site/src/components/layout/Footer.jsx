import { Link } from "react-router-dom";
import { useContent } from "../../hooks/useContent.js";
import { publicUrl } from "../../utils/publicUrl.js";

function LinkedInIcon() {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
			<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
		</svg>
	);
}

export default function Footer() {
	const settings = useContent("siteSettings.json");
	const groups   = settings?.footerLinks ?? [];
	const contact  = settings?.contact ?? {};
	const linkedin = settings?.social?.linkedin;
	const year     = new Date().getFullYear();

	return (
		<footer className="bg-brand-blue px-4 py-12 text-white sm:px-8">
			<div className="mx-auto grid max-w-screen-2xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr]">

				{/* Col 1: brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="mb-4 flex items-center gap-4">
            <img
              src={publicUrl(settings?.logo?.srcDark ?? settings?.logo?.src ?? "/invendis_logo.webp")}
              alt={settings?.logo?.alt ?? "INVENDIS"}
              className="h-9 w-auto brightness-0 invert"
            />
            {settings?.silboBadge?.src && (
              <img
                src={publicUrl(settings.silboBadge.src)}
                alt={settings.silboBadge.label ?? "SILBO"}
                className="h-9 w-auto brightness-0 invert"
              />
            )}
          </div>
          <p className="text-xs leading-relaxed text-white/50">{settings?.footerTagline}</p>
          {settings?.makeInIndiaBadge?.src && (
            <img
              src={publicUrl(settings.makeInIndiaBadge.src)}
              alt={settings.makeInIndiaBadge.alt ?? "Make in India"}
              className="mt-2 h-10 w-auto brightness-0 invert"
            />
          )}
          <p className="text-xs text-white/50">{settings?.footerMadeInIndia}</p>
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded bg-[#0A66C2] text-white transition-opacity hover:opacity-90"
            >
              <LinkedInIcon />
            </a>
          )}
        </div>

				{/* Cols 2–4: link groups as direct grid children */}
				{groups.map((group) => (
					<div key={group.title}>
						<h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-red">
							{group.title}
						</h4>
						<ul className="space-y-2">
							{(group.links ?? []).map((link) => (
								<li key={link.label}>
									<Link to={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				))}

				{/* Col 5: contact */}
				<div>
					<h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-red">
						Contact Us
					</h4>
					<ul className="space-y-2 text-sm">
						{contact.email && (
							<li>
								<a href={`mailto:${contact.email}`} className="font-semibold text-white transition-colors hover:text-white/80">
									{contact.email}
								</a>
							</li>
						)}
						{contact.phone && (
							<li>
								<a href={`tel:${contact.phone}`} className="font-semibold text-white transition-colors hover:text-white/80">
									{contact.phone}
								</a>
							</li>
						)}
						{contact.address && (
							<li className="leading-relaxed text-white/60">{contact.address}</li>
						)}
						{contact.website && (
							<li>
								<a href={`https://${contact.website}`} target="_blank" rel="noreferrer" className="text-white/60 transition-colors hover:text-white">
									{contact.website}
								</a>
							</li>
						)}
						{contact.websiteAlt && (
							<li>
								<a href={`https://${contact.websiteAlt}`} target="_blank" rel="noreferrer" className="text-white/60 transition-colors hover:text-white">
									{contact.websiteAlt}
								</a>
							</li>
						)}
					</ul>
				</div>

			</div>

			<div className="mx-auto mt-10 flex max-w-screen-2xl items-center justify-between border-t border-white/10 pt-6 text-xs text-white/40">
				<span>&copy; {year} Invendis Technologies India Private Limited. All rights reserved.</span>
				<div className="flex gap-4">
					<Link to="/privacy" className="transition-colors hover:text-white/70">Privacy Policy</Link>
					<Link to="/terms" className="transition-colors hover:text-white/70">Terms of Use</Link>
				</div>
			</div>
		</footer>
	);
}
