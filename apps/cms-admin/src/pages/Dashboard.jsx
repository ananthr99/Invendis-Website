import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useAdmin } from "../context/AdminContext.jsx";

const CONTENT_LINKS = [
	{ path: "/content/home",             label: "Home" },
	{ path: "/content/sectors",          label: "Sectors" },
	{ path: "/content/products",         label: "Products" },
	{ path: "/content/product-selector", label: "Product Selector" },
	{ path: "/content/silbo",            label: "SILBO" },
	{ path: "/content/case-studies",     label: "Case Studies" },
	{ path: "/content/resources",        label: "Resources" },
	{ path: "/content/company",          label: "Company" },
	{ path: "/content/gallery",          label: "Gallery" },
	{ path: "/content/careers",          label: "Careers" },
	{ path: "/content/contact",          label: "Contact" },
];

export default function Dashboard() {
	const { instance, accounts } = useMsal();
	const { isDirty, showConfirm, token, tokenStatus, clearToken } = useAdmin();
	const navigate = useNavigate();

	const displayName = accounts[0]?.name ?? accounts[0]?.username ?? "";

	function guardedNavigate(to) {
		return (e) => {
			if (isDirty()) {
				e.preventDefault();
				showConfirm(
					"You have unsaved changes. Discard them and continue?",
					() => navigate(to)
				);
			}
		};
	}

	function handleSignOut() {
		clearToken();
		instance.logoutRedirect({
			account: instance.getActiveAccount(),
			onRedirectNavigate: () => false,
		});
	}

	return (
		<div className="admin-shell">

			<header className="admin-topnav">
				<div className="admin-topnav-left">
					<img
						src={`${import.meta.env.BASE_URL}invendis_logo.webp`}
						alt="INVENDIS"
						className="admin-topnav-logo"
					/>
					<span className="admin-topnav-title">Invendis Admin</span>
				</div>
				<div className="admin-topnav-right">
					{import.meta.env.VITE_SITE_URL && (
						<a
							href={import.meta.env.VITE_SITE_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="admin-btn admin-btn--ghost"
							style={{ fontSize: 12 }}
						>
							View Live Site ↗
						</a>
					)}
					<span className="admin-user-name">{displayName}</span>
					<span style={{
						display: "inline-flex", alignItems: "center", gap: 5,
						fontSize: 12, fontWeight: 500,
						color: tokenStatus === "valid" ? "#16a34a" : tokenStatus === "invalid" ? "#dc2626" : "#9ca3af"
					}}>
						<span style={{
							width: 8, height: 8, borderRadius: "50%",
							background: tokenStatus === "valid" ? "#16a34a" : tokenStatus === "invalid" ? "#dc2626" : "#d1d5db",
							display: "inline-block"
						}} />
						{tokenStatus === "valid" ? "Connected" : tokenStatus === "invalid" ? "Invalid token" : "Not verified"}
					</span>
					<button className="admin-btn admin-btn--ghost" onClick={handleSignOut}>
						Sign out
					</button>
				</div>
			</header>

			<div className="admin-body">
				<aside className="admin-sidebar">
					<div className="admin-sidebar-group">Pages</div>
					{CONTENT_LINKS.map((link) => (
						<NavLink
							key={link.path}
							to={link.path}
							onClick={guardedNavigate(link.path)}
							className={({ isActive }) => `admin-sidebar-link${isActive ? " active" : ""}`}
						>
							{link.label}
						</NavLink>
					))}
					<hr className="admin-sidebar-divider" />
					<div className="admin-sidebar-group">Admin</div>
					<NavLink
						to="/log"
						onClick={guardedNavigate("/log")}
						className={({ isActive }) => `admin-sidebar-link${isActive ? " active" : ""}`}
					>
						Activity Log
					</NavLink>
					<NavLink
						to="/content/site-settings"
						onClick={guardedNavigate("/content/site-settings")}
						className={({ isActive }) => `admin-sidebar-link${isActive ? " active" : ""}`}
					>
						Site Settings
					</NavLink>
					<NavLink
						to="/setup"
						onClick={guardedNavigate("/setup")}
						className={({ isActive }) => `admin-sidebar-link${isActive ? " active" : ""}`}
					>
						Setup {!token && "⚠️"}
					</NavLink>
				</aside>

				<main className="admin-main">
					{!token && (
						<div className="admin-card" style={{ borderColor: "var(--admin-red)" }}>
							No GitHub token saved yet — go to <strong>Setup</strong> to enter one before making any changes.
						</div>
					)}
					<Outlet />
				</main>
			</div>

		</div>
	);
}
