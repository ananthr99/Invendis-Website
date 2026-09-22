import { Component } from "react";

// Wraps the entire route tree in main.jsx. If any page throws an
// unhandled error, the visitor sees this recovery screen instead of a
// blank white page.
export default class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error, info) {
		console.error("Unhandled error in page tree:", error, info);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-light p-8 text-center">
					<h1 className="font-heading text-2xl font-bold text-brand-text">Something went wrong</h1>
					<p className="max-w-md text-brand-muted">
						This page hit an unexpected error. Try reloading — if it keeps happening, please let us know.
					</p>
					<button
						onClick={() => window.location.reload()}
						className="rounded-full bg-brand-blue px-6 py-2 font-medium text-white hover:bg-brand-blue/90"
					>
						Reload page
					</button>
				</div>
			);
		}
		return this.props.children;
	}
}
