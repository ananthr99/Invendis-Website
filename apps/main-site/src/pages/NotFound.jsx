import { Link } from "react-router-dom";
import PageSEO from "../components/shared/PageSEO.jsx";

export default function NotFound() {
	return (
		<>
			<PageSEO title="Page Not Found" path="/404" />
			<section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
				<h1 className="font-heading text-5xl font-bold text-brand-blue">404</h1>
				<p className="text-brand-muted">This page doesn't exist.</p>
				<Link to="/" className="rounded-full bg-brand-blue px-6 py-2 font-medium text-white hover:bg-brand-blue/90">
					Back to home
				</Link>
			</section>
		</>
	);
}
