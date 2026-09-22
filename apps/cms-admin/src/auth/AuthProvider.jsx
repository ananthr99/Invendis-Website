import { useState, useEffect } from "react";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./msalConfig.js";

const msalInstance = new PublicClientApplication(msalConfig);

export default function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    msalInstance.initialize().then(() => {
      msalInstance.addEventCallback((event) => {
        if (event.eventType === EventType.LOGIN_SUCCESS && event.payload?.account) {
          msalInstance.setActiveAccount(event.payload.account);
        }
      });
      const existing = msalInstance.getAllAccounts();
      if (existing.length > 0) msalInstance.setActiveAccount(existing[0]);
      setReady(true);
    });
  }, []);

  if (!ready) return null;

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
