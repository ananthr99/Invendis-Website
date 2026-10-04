import { Component } from "react";

export default class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, message: "" };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, message: error?.message || "Unknown error" };
	}

	componentDidCatch(error, info) {
		console.error("CMS Admin error:", error, info);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32, textAlign: "center", background: "#f9fafb" }}>
					<div style={{ fontSize: 40 }}>⚠️</div>
					<h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Something went wrong</h1>
					<p style={{ fontSize: 14, color: "#6b7280", maxWidth: 400 }}>{this.state.message}</p>
					<button
						onClick={() => this.setState({ hasError: false, message: "" })}
						style={{ padding: "8px 20px", borderRadius: 8, background: "#1B2A6B", color: "white", border: "none", fontWeight: 600, cursor: "pointer", fontSize: 14 }}
					>
						Try again
					</button>
				</div>
			);
		}
		return this.props.children;
	}
}
