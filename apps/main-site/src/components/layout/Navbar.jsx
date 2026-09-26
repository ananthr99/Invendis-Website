import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useContent } from "../../hooks/useContent.js";
import { publicUrl } from "../../utils/publicUrl.js";

export default function Navbar() {
	const settings = useContent("siteSettings.json");
	const [open, setOpen] = useState(false);
	const links = settings?.nav ?? [];

	return (
		<header className="bg-white/95 backdrop-blur shadow-sm">
			<div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3 sm:px-8">
				<Link to="/" className="flex items-center gap-2">
					<img
						src={publicUrl(settings?.logo?.srcDark ?? settings?.logo?.src ?? "/invendis_logo.webp")}
						alt={settings?.logo?.alt ?? "INVENDIS"}
						className="h-8 w-auto"
					/>
          {settings?.makeInIndiaBadge?.src && (
            <img
              src={publicUrl(settings.makeInIndiaBadge.src)}
              alt={settings.makeInIndiaBadge.alt ?? "Make in India"}
              className="h-8 w-auto"
            />
          )}
				</Link>

				<nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
					{links.map((link) => (
						<NavLink
							key={link.href}
							to={link.href}
							className={({ isActive }) =>
								`text-base font-semibold transition-colors ${
									isActive ? "text-brand-text border-b-2 border-brand-red pb-1" : "text-brand-red hover:text-brand-text"
								}`
							}
						>
							{link.label}
						</NavLink>
					))}
				</nav>

				{settings?.silboBadge && (
					<Link to={settings.silboBadge.href} className="hidden md:flex items-center">
						<img
							src={publicUrl(settings.silboBadge.src ?? "/silbo_logo.png")}
							alt={settings.silboBadge.label}
							className="h-8 w-auto"
						/>
					</Link>
				)}

				<button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
					<span className="block h-0.5 w-6 bg-brand-text" />
					<span className="mt-1.5 block h-0.5 w-6 bg-brand-text" />
					<span className="mt-1.5 block h-0.5 w-6 bg-brand-text" />
				</button>
			</div>
			{open && (
				<nav className="flex flex-col gap-1 border-t bg-white px-4 py-4 sm:px-8 md:hidden">
					{links.map((link) => (
						<NavLink
							key={link.href}
							to={link.href}
							onClick={() => setOpen(false)}
							className="py-2 text-sm font-medium text-brand-text"
						>
							{link.label}
						</NavLink>
					))}
				</nav>
			)}
		</header>
	);
}
