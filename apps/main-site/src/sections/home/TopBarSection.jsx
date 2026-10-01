import { Link } from "react-router-dom";
import { useContent } from "../../hooks/useContent.js";

export default function TopBarSection({ hideCta = false }) {
	const home = useContent("pages/home.json");
	const data = home?.topBar;
	const activeSections = home?.sections ?? [];

	if (!data || !activeSections.includes("topBar")) return null;

	const { tags = [], cta } = data;

	return (
		<div className="border-b border-white/10 bg-brand-blue-light">
			<div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-2 sm:px-8">
				<div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] font-medium tracking-widest text-white/50 uppercase lg:flex lg:flex-wrap lg:items-center lg:gap-3">
					{tags.map((tag, i) => (
						<span key={tag} className="flex items-center gap-3">
							{i % 2 === 1 && <span className="text-brand-red lg:hidden">·</span>}
							{i > 0 && <span className="hidden text-brand-red lg:inline">·</span>}
							{tag}
						</span>
					))}
				</div>
				{cta && !hideCta && (
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
