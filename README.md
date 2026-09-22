# invendis-website

A from-scratch rebuild of the INVENDIS public site + CMS admin, with the
same functionality and content workflow as the original
`INVENDIS-Technologies` repo, but restructured so the codebase is easier
to navigate. See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for what changed
structurally and why, and [`STATUS.md`](./STATUS.md) for exactly what's
built versus what's still a stub.

## Layout

```
invendis-website/
├── apps/
│   ├── main-site/      # public marketing site (React 19, Vite, Tailwind)
│   └── cms-admin/       # content admin panel (React 18, Vite, Azure AD)
├── packages/
│   └── github-client/    # shared GitHub Contents API wrapper — both apps import this
├── .github/workflows/    # CI + deploy
└── package.json          # npm workspaces root
```

This is an npm workspaces monorepo: `apps/*` are the two deployable
applications, `packages/*` is code shared between them. Nothing needs a
separate install step per app — one `npm install` at the repo root wires
everything up.

## How content changes reach the site

```
Editor makes a change in CMS Admin
        ↓
CMS writes JSON directly to the gh-pages branch → live in seconds (no build)
CMS also writes to main with [skip ci] → keeps the source tree in sync
        ↓
Main site fetches that JSON at runtime via the useContent hook
```

Exactly the same model as the original site: editing content through the
CMS never triggers a rebuild. A rebuild is only needed for actual code
changes (new components, new routes, dependency updates).

## Local development

```bash
npm install

npm run dev          # main site      → http://localhost:5173
npm run dev:admin    # CMS admin      → http://localhost:5174
```

The CMS admin needs two things before it can save anything:

1. An Azure AD app registration (see the comments in
   `apps/cms-admin/src/auth/msalConfig.js` for the exact steps), configured
   via `apps/cms-admin/.env` (copy `.env.example`).
2. A GitHub Personal Access Token, entered once in the CMS's **Setup**
   page after signing in — scoped to just this repo, `Contents: Read and
   write` only.

## Building

```bash
npm run build         # main site  → apps/main-site/dist
npm run build:admin   # CMS admin  → apps/cms-admin/dist
npm run build:all     # both
```

The `deploy.yml` workflow combines both into one `dist/` (CMS admin
nested at `dist/cms-admin/`) and publishes it to GitHub Pages — same
combined-output approach as the original repo.

## Adding a real editor for a stub page

Every page currently either has a full structured-form editor
(`HomePageEditor.jsx`, `ContactPageEditor.jsx` — copy one of these as
your template) or falls back to `PlaceholderEditor.jsx`, a generic raw-JSON
editor that works for any page today, just without a nice form. To
upgrade a page from the generic editor to a real one:

1. Copy `apps/cms-admin/src/pages/editors/HomePageEditor.jsx` to a new
   file named after the page.
2. Change `CONTENT_PATH` and the field names to match that page's JSON
   shape (see `apps/main-site/public/content/pages/*.json`).
3. Swap its route in `apps/cms-admin/src/App.jsx` from the
   `PLACEHOLDER_PAGES` list to its own `<Route>`, pointing at the new
   component.
4. Build out the matching main-site page (`apps/main-site/src/pages/*.jsx`)
   the same way `Home.jsx` and `Contact.jsx` are built out, instead of the
   current stub-with-hero-only version.
