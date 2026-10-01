# Architecture notes

What's structurally different from the original `INVENDIS-Technologies`
repo, and why. Functionally, both repos do the same thing: a public site
reads JSON content that a separate admin panel writes to GitHub.

## `apps/` + `packages/` instead of a flat root

The original repo has the main site's own source (`src/`, `public/`,
`package.json`, `vite.config.js`) loose at the repo root, with
`cms-admin/` as just one more folder next to it. That makes the two-apps
structure easy to miss at a glance — nothing marks the root as "one app
plus a nested second app" rather than just one app.

Here, both apps live under `apps/`, and anything shared between them
lives under `packages/`, wired together with npm workspaces. Opening the
repo root immediately shows: two apps, one shared package, done.

## One shared GitHub API client, not two

The original repo has two independently-written GitHub Contents API
wrappers — `src/utils/githubApi.js` (main site, read-only) and
`cms-admin/src/github/githubApi.js` (admin, read/write) — that talk to
the same API with the same auth header shape, encode/decode logic, and
error handling, but drifted slightly apart from being edited separately
over time (different base64-decoding approach between the two, for
instance).

`packages/github-client/index.js` is the one implementation both apps
import: `createGithubClient({ owner, repo })` returns read functions
(used by both apps) and write/delete functions (used only by the admin
app, and only when a token is passed in). There's exactly one place that
knows how to talk to the GitHub API.

## The "content path" split, made explicit

Both repos face the same underlying fact: the **source** copy of a
content JSON file and the **live/built** copy of that same file sit at
different paths, because Vite copies `public/` into the root of
`dist/`. The original repo's CMS wrapper (`readFileDirect` /
`writeFileDirect` vs `readFile` / `writeFile`) handles this by having
every editor component pass two full, separately-typed-out paths.

Here, `apps/cms-admin/src/utils/savePageContent.js` takes one
content-relative path (`"pages/home.json"`) and derives both real paths
itself:

```js
sourcePath("pages/home.json") // → apps/main-site/public/content/pages/home.json  (main branch)
livePath("pages/home.json")   // → content/pages/home.json                        (gh-pages branch)

No editor component needs to know the two-branch mechanics exist at
all — it just calls savePageContent({ contentPath, ... }).

Section registry pattern
Every page in both apps uses a registry map to decouple section
components from page layout. Each section folder exports a registry.js:


// apps/main-site/src/sections/home/registry.js
export const HOME_SECTIONS = {
  hero:         HeroSection,
  whatWeDo:     WhatWeDoSection,
  stats:        StatsSection,
};
The page component iterates data.sections (an ordered array of keys
from the JSON) and renders each registered component in sequence. The
CMS controls which sections appear and in what order by editing the
sections array in the JSON — no code change is needed to reorder or
hide a section.

The CMS admin mirrors this exactly: each section has a corresponding
editor component, and the same registry pattern maps section keys to
editor components inside each page editor.

Environment variables instead of hardcoded constants
The original repo hardcodes the GitHub OWNER/REPO constants directly
in both API wrapper files, and instructs the Azure AD client ID to be
"hardcoded in msalConfig.js". Here, both come from .env (see each
app's .env.example) via apps/cms-admin/src/config.js — forking the
repo, or pointing it at a different GitHub account, is a config change,
not a code edit.

Product Selector two-file data model
The product catalog uses a split data model to keep the main page fast
without loading 54 full spec sheets upfront:

productSelector/_index.json — lightweight card entries only (id, name, category, connectivity flags, first image, use-case tags). This single file powers the entire filter and grid view.
productSelector/products/<id>.json — full spec sheet, images array, datasheets, variants. Fetched on demand only when a product modal is opened.
The CMS mirrors this: saving a product writes both files. The index card
entry is derived from the full product data at save time, so the two
files are always in sync.

Every page has a structured editor
All pages — Home, Sectors, Products, Product Selector, Case Studies,
Company, Contact, Resources, Silbo, Gallery, Careers — have dedicated
structured-form editors in the CMS admin. There is no longer any page
that falls back to raw JSON editing. PlaceholderEditor.jsx remains in
the codebase as a safety net for pages added in the future before their
editor is built, but it is not wired to any active route.