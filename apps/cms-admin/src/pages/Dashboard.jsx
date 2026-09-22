import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useAdmin } from "../context/AdminContext.jsx";

const CONTENT_LINKS = [
  { path: "/content/home",         label: "Home" },
  { path: "/content/contact",      label: "Contact" },
  { path: "/content/company",      label: "Company" },
  { path: "/content/sectors",      label: "Sectors" },
  { path: "/content/products",     label: "Products" },
  { path: "/content/silbo",        label: "SILBO" },
  { path: "/content/case-studies", label: "Case Studies" },
  { path: "/content/resources",    label: "Resources" },
  { path: "/content/gallery",      label: "Gallery" },
  { path: "/content/careers",      label: "Careers" },
];


export default function Dashboard() {
  const { instance, accounts } = useMsal();
  const { isDirty, showConfirm, token } = useAdmin();
  const navigate = useNavigate();

  const displayName = accounts[0]?.name ?? accounts[0]?.username ?? "";

  function guardedNavigate(to) {
    return (e) => {
      if (isDirty()) {
        e.preventDefault();
        showConfirm("You have unsaved changes. Discard them and continue?", () => navigate(to));
      }
    };
  }

  function handleSignOut() {
    instance.logoutRedirect({
      account: instance.getActiveAccount(),
      onRedirectNavigate: () => false,
    });
  }

  return (
    <div className="admin-shell">

      {/* Full-width top nav */}
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
          <span className="admin-user-name">{displayName}</span>
          <button className="admin-btn admin-btn--ghost" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </header>

      {/* Sidebar + content */}
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
          <div className="admin-sidebar-group">Admin</div>
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
