const WARN_MB = 2;
const MAX_MB = 10;

/**
 * Call this before fileToBase64 in any image upload handler.
 * Returns false and shows a toast if the file is too large.
 *
 * Usage:
 *   if (!checkFileSize(file, toast)) return;
 *   const base64 = await fileToBase64(file);
 */
export function checkFileSize(file, toast) {
	const sizeMB = file.size / (1024 * 1024);
	if (sizeMB > MAX_MB) {
		toast(`File too large (${sizeMB.toFixed(1)} MB). Maximum is ${MAX_MB} MB.`, "error");
		return false;
	}
	if (sizeMB > WARN_MB) {
		toast(`Large file (${sizeMB.toFixed(1)} MB) — upload may take a moment.`, "default");
	}
	return true;
}
