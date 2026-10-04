import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { useMsal } from "@azure/msal-react";
import { github } from "../config.js";

// Global state every editor page needs: the GitHub PAT, a toast helper,
// the signed-in user's email (for the activity log), and an "unsaved
// changes" guard that editors opt into via setDirty/isDirty.
const AdminContext = createContext(null);

const TOKEN_KEY = "invendis_cms_gh_pat";

export function AdminProvider({ children }) {
	const { accounts } = useMsal();
	const userEmail = accounts[0]?.username ?? "";

	const [token, setTokenState] = useState(() => sessionStorage.getItem(TOKEN_KEY) || "");
	const [tokenStatus, setTokenStatus] = useState("unchecked"); // "unchecked" | "valid" | "invalid"

	useEffect(() => {
		if (!token) { setTokenStatus("unchecked"); return; }
		setTokenStatus("unchecked");
		github.testConnection(token)
			.then(() => setTokenStatus("valid"))
			.catch(() => setTokenStatus("invalid"));
	}, [token]);

	const [toastMsg, setToastMsg] = useState(null);
	const [confirmState, setConfirmState] = useState(null);
	const dirtyRef = useRef(false);

	function saveToken(t) {
		localStorage.removeItem(TOKEN_KEY);
		sessionStorage.setItem(TOKEN_KEY, t);
		setTokenState(t);
	}

	const toast = useCallback((message, type = "default") => {
		setToastMsg({ message, type, id: Date.now() });
	}, []);

	useEffect(() => {
		if (!toastMsg) return;
		const timer = setTimeout(() => setToastMsg(null), 3000);
		return () => clearTimeout(timer);
	}, [toastMsg]);

	function setDirty(val) {
		dirtyRef.current = val;
	}
	function isDirty() {
		return dirtyRef.current;
	}

	function showConfirm(message, onOk, onCancel) {
		setConfirmState({ message, onOk, onCancel });
	}
	function showConflictModal() {
		setConfirmState({
			message: "Another editor saved this file while you were editing. Refresh the page to get the latest version, then re-apply your changes.",
			onOk: () => window.location.reload(),
			onCancel: null,
			okLabel: "Reload page",
			cancelLabel: "Dismiss",
		});
	}

	// Warn on browser close/refresh with unsaved changes.
	useEffect(() => {
		function handler(e) {
			if (dirtyRef.current) {
				e.preventDefault();
				e.returnValue = "";
			}
		}
		window.addEventListener("beforeunload", handler);
		return () => window.removeEventListener("beforeunload", handler);
	}, []);

	return (
		<AdminContext.Provider value={{ token, saveToken, toast, userEmail, setDirty, isDirty, showConfirm, showConflictModal, tokenStatus }}>

			{children}

			{toastMsg && <div className={`admin-toast admin-toast--${toastMsg.type}`}>{toastMsg.message}</div>}

			{confirmState && (
				<div className="admin-modal-overlay">
					<div className="admin-modal">
						<p>{confirmState.message}</p>
						<div className="admin-modal-actions">
							<button className="admin-btn admin-btn--ghost" onClick={() => { confirmState.onCancel?.(); setConfirmState(null); }}>
								{confirmState.cancelLabel ?? "Cancel"}
							</button>
							<button className="admin-btn admin-btn--danger" onClick={() => { confirmState.onOk(); setConfirmState(null); }}>
								{confirmState.okLabel ?? "Discard changes"}
							</button>
						</div>
					</div>
				</div>
			)}
		</AdminContext.Provider>
	);
}

export function useAdmin() {
	const ctx = useContext(AdminContext);
	if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
	return ctx;
}
