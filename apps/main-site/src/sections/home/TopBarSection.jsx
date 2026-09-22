import { Link } from "react-router-dom";
import { useContent } from "../../hooks/useContent.js";

export default function TopBarSection() {
	const home = useContent("pages/home.json");
	const data = home?.topBar;
	const activeSections = home?.sections ?? [];

	if (!data || !activeSections.includes("topBar")) return null;

	const { tags = [], cta } = data;

	return (
		<div className="border-b border-white/10 bg-brand-blue-light">
			<div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-2 sm:px-8">
				<div className="flex flex-wrap items-center gap-3 text-[11px] font-medium tracking-widest text-white/50 uppercase">
					{tags.map((tag, i) => (
						<span key={tag} className="flex items-center gap-3">
							{i > 0 && <span className="text-brand-red">·</span>}
							{tag}
						</span>
					))}
				</div>
				{cta && (
					<Link
						to={cta.href}
						className="rounded-full bg-brand-red px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
					>
						{cta.label}
					</Link>
				)}
			</div>
		</div>
	);
}
