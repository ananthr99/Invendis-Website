// Computes a field-by-field diff between the last-saved and new state of
// a content JSON object, and appends one entry to cms-admin/changelog.json
// in the repo (capped at 500 entries, newest first).

const CHANGELOG_PATH = "apps/cms-admin/content-audit-log.json";
const MAX_ENTRIES = 500;

/** Shallow field-by-field diff. Array fields diff by a stable key (label > id > index). */
export function diffFields(before = {}, after = {}) {
	const changes = [];
	const keys = new Set([...Object.keys(before), ...Object.keys(after)]);

	for (const key of keys) {
		const a = before[key];
		const b = after[key];
		if (JSON.stringify(a) === JSON.stringify(b)) continue;

		if (Array.isArray(a) || Array.isArray(b)) {
			changes.push(...diffArray(key, a ?? [], b ?? []));
		} else {
			changes.push({ field: key, before: a, after: b });
		}
	}
	return changes;
}

function diffArray(field, before, after) {
	const keyOf = (item, i) => item?.label ?? item?.id ?? `#${i}`;
	const beforeByKey = new Map(before.map((item, i) => [keyOf(item, i), item]));
	const afterByKey = new Map(after.map((item, i) => [keyOf(item, i), item]));
	const changes = [];

	for (const [key, item] of afterByKey) {
		if (!beforeByKey.has(key)) changes.push({ field, action: "added", label: key, after: item });
	}
	for (const [key, item] of beforeByKey) {
		if (!afterByKey.has(key)) changes.push({ field, action: "removed", label: key, before: item });
	}
	for (const [key, item] of afterByKey) {
		if (beforeByKey.has(key) && JSON.stringify(beforeByKey.get(key)) !== JSON.stringify(item)) {
			changes.push({ field, action: "changed", label: key, before: beforeByKey.get(key), after: item });
		}
	}
	return changes;
}

/**
 * @param {import('@invendis/github-client').createGithubClient} client
 * @param {string} token
 * @param {{ page: string, section?: string, before: object, after: object, userEmail: string }} entry
 */
export async function appendChangelogEntry(client, token, { page, section, before, after, userEmail }) {
  let changes = [];

  if (section) {
    diffFields(before ?? {}, after ?? {}).forEach((c) => changes.push({ section, ...c }));
  } else {
    const pageKeys = new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]);
    for (const key of pageKeys) {
      if (key === "sections") continue;
      const a = (before ?? {})[key];
      const b = (after ?? {})[key];
      if (JSON.stringify(a) === JSON.stringify(b)) continue;
      if (a && b && typeof a === "object" && !Array.isArray(a) && typeof b === "object" && !Array.isArray(b)) {
        diffFields(a, b).forEach((c) => changes.push({ section: key, ...c }));
      } else {
        changes.push({ section: key, field: key, before: a, after: b });
      }
    }
    const sA = (before ?? {}).sections ?? [];
    const sB = (after ?? {}).sections ?? [];
    if (JSON.stringify(sA) !== JSON.stringify(sB)) {
      changes.push({ section: "page", field: "visibility", before: sA, after: sB });
    }
  }

  if (changes.length === 0) return;

  let sha = null;
  let entries = [];
  try {
    const file = await client.readFile(CHANGELOG_PATH, { token });
    entries = JSON.parse(file.content);
    sha = file.sha;
  } catch {
    // no changelog yet — start fresh
  }

  entries.unshift({
    timestamp: new Date().toISOString(),
    userEmail,
    page,
    section: section ?? null,
    changes,
  });
  if (entries.length > MAX_ENTRIES) entries = entries.slice(0, MAX_ENTRIES);

  await client.writeFile(CHANGELOG_PATH, JSON.stringify(entries, null, 2), {
    message: "CMS: update changelog [skip ci]",
    sha,
    token,
  });
}