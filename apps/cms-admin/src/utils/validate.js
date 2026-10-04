/**
 * Checks that all required fields have non-empty values.
 * Returns true if valid, false + shows toast if not.
 *
 * Usage in any editor's handleSave:
 *   if (!validateRequired([
 *     { label: "Title", value: form.title },
 *     { label: "Slug",  value: form.slug },
 *   ], toast)) return;
 */
export function validateRequired(fields, toast) {
	const empty = fields.filter(f => !f.value?.toString().trim());
	if (empty.length === 0) return true;
	toast(`Required fields missing: ${empty.map(f => f.label).join(", ")}`, "error");
	return false;
}
