import { Suspense, lazy } from "react";
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import TopBarSection from "./sections/home/TopBarSection.jsx";
import FloatingButtons from "./components/layout/FloatingButtons.jsx";

// Every route is lazy-loaded so the initial bundle only pays for the page
// the visitor actually landed on. Same pattern as the original site.
const Home = lazy(() => import("./pages/Home.jsx"));
const Sectors = lazy(() => import("./pages/Sectors.jsx"));
const Products = lazy(() => import("./pages/Products.jsx"));
const ProductSelector = lazy(() => import("./pages/ProductSelector.jsx"));
const CaseStudies = lazy(() => import("./pages/CaseStudies.jsx"));
const Company = lazy(() => import("./pages/Company.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Resources = lazy(() => import("./pages/Resources.jsx"));
const ResourceDetail = lazy(() => import("./pages/ResourceDetail.jsx"));
const Careers = lazy(() => import("./pages/Careers.jsx"));
const Silbo = lazy(() => import("./pages/Silbo.jsx"));
const Gallery = lazy(() => import("./pages/Gallery.jsx"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));
const Terms = lazy(() => import("./pages/Terms.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

function ScrollToTop() {
	const { pathname } = useLocation();
	useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
	return null;
}

function PageLoader() {
	return (
		<div className="flex min-h-[60vh] items-center justify-center">
			<div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
		</div>
	);
}

export default function App() {
	return (
		<div className="flex min-h-screen flex-col">
			<ScrollToTop />
			<div className="sticky top-0 z-50">
				<Navbar />
				<TopBarSection />
			</div>
			<main className="flex-1">
				<Suspense fallback={<PageLoader />}>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/sectors" element={<Sectors />} />
						<Route path="/products" element={<Products />} />
						<Route path="/products/product-selector" element={<ProductSelector />} />
						<Route path="/products/product-selector/:id" element={<ProductSelector />} />
						<Route path="/case-studies" element={<CaseStudies />} />
						<Route path="/company" element={<Company />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="/resources" element={<Resources />} />
						<Route path="/resources/:slug" element={<ResourceDetail />} />
						<Route path="/careers" element={<Careers />} />
						<Route path="/silbo" element={<Silbo />} />
						<Route path="/gallery" element={<Gallery />} />
						<Route path="/privacy" element={<Privacy />} />
						<Route path="/terms" element={<Terms />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
					<FloatingButtons />
				</Suspense>
			</main>
			<Footer />
		</div>
	);
}
