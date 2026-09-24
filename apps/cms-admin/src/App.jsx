import { Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "./auth/AuthGuard.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Setup from "./pages/Setup.jsx";
import AccessDenied from "./pages/AccessDenied.jsx";
import HomePageEditor from "./pages/editors/HomePageEditor.jsx";
import SectorsPageEditor from "./pages/editors/SectorsPageEditor.jsx";
import ContactPageEditor from "./pages/editors/ContactPageEditor.jsx";
import PlaceholderEditor from "./pages/editors/PlaceholderEditor.jsx";
import LogPage from "./pages/LogPage.jsx";

// Pages not yet wired to a real editor render the generic
// PlaceholderEditor — same "coming soon, follow the pattern" idea as the
// main site's stub pages. Add a real <XPageEditor /> here (copied from
// HomePageEditor.jsx or ContactPageEditor.jsx) when you build one out.
const PLACEHOLDER_PAGES = [
	{ path: "products", label: "Products", contentPath: "pages/products.json" },
	{ path: "silbo", label: "SILBO", contentPath: "pages/silbo.json" },
	{ path: "case-studies", label: "Case Studies", contentPath: "pages/caseStudies.json" },
	{ path: "company", label: "Company", contentPath: "pages/company.json" },
	{ path: "resources", label: "Resources", contentPath: "pages/resources.json" },
	{ path: "gallery", label: "Gallery", contentPath: "pages/gallery.json" },
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
				<Route path="content/contact" element={<ContactPageEditor />} />
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
