// Companion to 404.html — decodes the query string it built and restores
// the original URL so React Router sees the real path on first paint.
(function () {
	var l = window.location;
	if (l.search[1] === "/") {
		var decoded = l.search
			.slice(1)
			.split("&")
			.map(function (s) {
				return s.replace(/~and~/g, "&");
			});
		window.history.replaceState(
			null,
			null,
			l.pathname.slice(0, -1) + decoded[0] + (decoded[1] ? "?" + decoded[1].slice(2) : "") + l.hash
		);
	}
})();
