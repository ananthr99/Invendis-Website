import { Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "./auth/AuthGuard.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Setup from "./pages/Setup.jsx";
import AccessDenied from "./pages/AccessDenied.jsx";
import HomePageEditor from "./pages/editors/HomePageEditor.jsx";
import SectorsPageEditor from "./pages/editors/SectorsPageEditor.jsx";
import ProductsPageEditor from "./pages/editors/ProductsPageEditor.jsx";
import ContactPageEditor from "./pages/editors/ContactPageEditor.jsx";
import GalleryPageEditor from "./pages/editors/GalleryPageEditor.jsx";
import PlaceholderEditor from "./pages/editors/PlaceholderEditor.jsx";
import LogPage from "./pages/LogPage.jsx";

const PLACEHOLDER_PAGES = [
	{ path: "silbo", label: "SILBO", contentPath: "pages/silbo.json" },
	{ path: "case-studies", label: "Case Studies", contentPath: "pages/caseStudies.json" },
	{ path: "company", label: "Company", contentPath: "pages/company.json" },
	{ path: "resources", label: "Resources", contentPath: "pages/resources.json" },
	{ path: "careers", label: "Careers", contentPath: "pages/careers.json" },
];

export default function App() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/access-denied" element={<AccessDenied />} />

			<Route
				path="/*"
				element={
					<AuthGuard>
						<Dashboard />
					</AuthGuard>
				}
			>
				<Route index element={<Navigate to="/content/home" replace />} />
				<Route path="setup" element={<Setup />} />
				<Route path="content/home" element={<HomePageEditor />} />
				<Route path="content/sectors" element={<SectorsPageEditor />} />
				<Route path="content/products" element={<ProductsPageEditor />} />
				<Route path="content/contact" element={<ContactPageEditor />} />
				<Route path="content/gallery" element={<GalleryPageEditor />} />
				<Route path="log" element={<LogPage />} />
				{PLACEHOLDER_PAGES.map((p) => (
					<Route
						key={p.path}
						path={`content/${p.path}`}
						element={<PlaceholderEditor label={p.label} contentPath={p.contentPath} />}
					/>
				))}
			</Route>
		</Routes>
	);
}
