import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import AuthProvider from "./auth/AuthProvider.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <HashRouter>
          <AdminProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </AdminProvider>
        </HashRouter>
    </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
