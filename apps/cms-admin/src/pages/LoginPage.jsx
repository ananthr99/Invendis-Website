import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { Navigate } from "react-router-dom";
import { loginRequest } from "../auth/msalConfig.js";

function MicrosoftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="0" y="0" width="9.5" height="9.5" fill="#F25022" />
      <rect x="10.5" y="0" width="9.5" height="9.5" fill="#7FBA00" />
      <rect x="0" y="10.5" width="9.5" height="9.5" fill="#00A4EF" />
      <rect x="10.5" y="10.5" width="9.5" height="9.5" fill="#FFB900" />
    </svg>
  );
}

export default function LoginPage() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f7f8fc",
      padding: "24px",
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "40px 48px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}>
        <img
			src={`${import.meta.env.BASE_URL}invendis_logo.webp`}
			alt="INVENDIS"
			style={{ height: "48px", width: "auto", marginBottom: "24px" }}
		/>
        <h1 style={{
          fontFamily: "Sora, sans-serif",
          fontSize: "22px",
          fontWeight: 700,
          color: "var(--admin-text)",
          margin: "0 0 10px",
        }}>
          Invendis Technologies Admin
        </h1>
        <p style={{
          color: "var(--admin-muted)",
          fontSize: "14px",
          lineHeight: 1.6,
          margin: "0 0 28px",
        }}>
          Sign in with your Microsoft account to manage Invendis website
        </p>
        <button
          onClick={() => instance.loginPopup(loginRequest).catch(console.error)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            padding: "12px 24px",
            background: "#0078d4",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          <MicrosoftIcon />
          Sign in with Microsoft
        </button>
      </div>
    </div>
  );
}
