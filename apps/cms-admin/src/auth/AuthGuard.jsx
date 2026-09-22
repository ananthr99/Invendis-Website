import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Navigate } from "react-router-dom";

const ALLOWED = (import.meta.env.VITE_ALLOWED_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export default function AuthGuard({ children }) {
  const isAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const email = accounts[0]?.username?.toLowerCase() ?? "";
  if (ALLOWED.length > 0 && !ALLOWED.includes(email)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}
