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
```

No editor component needs to know the two-branch mechanics exist at
all — it just calls `savePageContent({ contentPath, ... })`.

## Every page editable from day one

The original repo builds one bespoke editor component per page, all at
once. Here, every page route exists in the CMS from the start, but most
of them render `PlaceholderEditor.jsx` — a generic editor that shows the
page's raw JSON in a textarea and saves it through the exact same
`savePageContent` path as a real form would. It's less pleasant to use
than a proper form, but nothing is blocked waiting for a dedicated editor
to be built: every page is genuinely writable immediately, and pages get
upgraded to structured forms (like `HomePageEditor.jsx` and
`ContactPageEditor.jsx` already are) one at a time as it's worth the
effort for that page.

## Environment variables instead of hardcoded constants

The original repo hardcodes the GitHub `OWNER`/`REPO` constants directly
in both API wrapper files, and instructs the Azure AD client ID to be
"hardcoded in `msalConfig.js`". Here, both come from `.env` (see each
app's `.env.example`) via `apps/cms-admin/src/config.js` — forking the
repo, or pointing it at a different GitHub account, is a config change,
not a code edit.
