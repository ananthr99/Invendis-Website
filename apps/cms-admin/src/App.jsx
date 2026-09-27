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
import CompanyPageEditor from "./pages/editors/CompanyPageEditor.jsx";
import ResourcesPageEditor from "./pages/editors/ResourcesPageEditor.jsx";
import ArticleDetailEditor from "./pages/editors/ArticleDetailEditor.jsx";
import CaseStudiesPageEditor from "./pages/editors/CaseStudiesPageEditor.jsx";
import SilboPageEditor from "./pages/editors/SilboPageEditor.jsx";
import CareersPageEditor from "./pages/editors/CareersPageEditor.jsx";
import LogPage from "./pages/LogPage.jsx";

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
				<Route path="content/company" element={<CompanyPageEditor />} />
				<Route path="content/resources" element={<ResourcesPageEditor />} />
				<Route path="content/resources/:slug" element={<ArticleDetailEditor />} />
				<Route path="content/case-studies" element={<CaseStudiesPageEditor />} />
				<Route path="content/silbo" element={<SilboPageEditor />} />
				<Route path="content/careers" element={<CareersPageEditor />} />
				<Route path="log" element={<LogPage />} />
			</Route>
		</Routes>
	);
}
