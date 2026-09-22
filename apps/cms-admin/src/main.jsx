import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import AuthProvider from "./auth/AuthProvider.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <HashRouter>
        <AdminProvider>
          <App />
        </AdminProvider>
      </HashRouter>
    </AuthProvider>
  </React.StrictMode>
);
