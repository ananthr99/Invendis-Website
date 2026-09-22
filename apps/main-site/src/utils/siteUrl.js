export const SITE_URL = import.meta.env.VITE_SITE_URL || "https://invendis.com";
export const BASE_PATH = import.meta.env.BASE_URL;

export function absoluteUrl(path = "") {
	return `${SITE_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
