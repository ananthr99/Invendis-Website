export function publicUrl(path) {
  if (!path) return path;
  return import.meta.env.BASE_URL + path.replace(/^\//, "");
}
