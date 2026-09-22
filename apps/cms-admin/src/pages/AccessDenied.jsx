export default function AccessDenied() {
	return (
		<div className="admin-centered">
			<h1 style={{ margin: 0 }}>Access denied</h1>
			<p style={{ color: "var(--admin-muted)", maxWidth: 360 }}>
				Your account signed in successfully, but isn't authorised to use this CMS. Contact an administrator if you
				believe this is a mistake.
			</p>
		</div>
	);
}
