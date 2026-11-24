// Azure AD (MSAL) configuration.
//
// These three values come from an Azure AD "App registration" in your
// org's tenant — this file does NOT need real values checked in; it
// reads them from a .env file (see apps/cms-admin/.env.example).
//
// To create the app registration:
//   1. Azure Portal → Azure Active Directory → App registrations → New registration
//   2. Name: "INVENDIS CMS Admin" (or similar)
//   3. Supported account types: "Accounts in this organizational directory only"
//   4. Redirect URI: type "Single-page application (SPA)", value = where
//      this app is hosted (e.g. https://<you>.github.io/invendis-website/cms-admin/)
//   5. Copy the "Application (client) ID" → VITE_AZURE_CLIENT_ID
//   6. Copy the "Directory (tenant) ID" → VITE_AZURE_TENANT_ID
//
// None of this is a secret — a SPA's client ID is public by design (it
// can't hold a client secret safely). Access is enforced by Azure AD
// checking the signed-in user is a member of your tenant, not by hiding
// this ID.
export const msalConfig = {
	auth: {
		clientId: import.meta.env.VITE_AZURE_CLIENT_ID || "",
		authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || "common"}`,
		redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin + window.location.pathname,
	},
	cache: {
		cacheLocation: "sessionStorage",
		storeAuthStateInCookie: false,
	},
};

export const loginRequest = {
	scopes: ["User.Read"],
};
