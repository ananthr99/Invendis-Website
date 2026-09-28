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

				<nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
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
					<Link to={settings.silboBadge.href} className="hidden lg:flex items-center">
						<img
							src={publicUrl(settings.silboBadge.src ?? "/silbo_logo.png")}
							alt={settings.silboBadge.label}
							className="h-8 w-auto"
						/>
					</Link>
				)}

				<button className="lg:hidden p-1" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
					<span className={`block h-0.5 w-6 bg-brand-text transition-all duration-300 ${open ? "translate-y-2 rotate-45" : ""}`} />
					<span className={`mt-1.5 block h-0.5 w-6 bg-brand-text transition-all duration-300 ${open ? "opacity-0" : ""}`} />
					<span className={`mt-1.5 block h-0.5 w-6 bg-brand-text transition-all duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
				</button>
			</div>
			<nav className={`overflow-hidden border-t bg-white px-4 transition-all duration-200 ease-in-out sm:px-8 lg:hidden ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
				<div className="flex flex-col gap-1 py-4">
					{links.map((link) => (
						<NavLink
							key={link.href}
							to={link.href}
							onClick={() => setOpen(false)}
							className={({ isActive }) =>
								`py-2 text-sm font-medium ${isActive ? "text-brand-red font-semibold border-l-2 border-brand-red pl-2" : "text-brand-text"}`
							}
						>
							{link.label}
						</NavLink>
					))}
				</div>
			</nav>
		</header>
	);
}
