# What's built vs. what's a stub

This is the base skeleton — the full main-site + CMS-admin workflow is
real and working end-to-end, but most page content is placeholder. This
file is the honest map of what to trust versus what to build out next.

## Fully working (the actual mechanism, not just UI)

- npm workspaces monorepo (`apps/*`, `packages/*`) — builds cleanly,
  verified with `npm run build:all`.
- Shared GitHub API client (`packages/github-client`).
- Azure AD (MSAL) sign-in gate for the CMS admin, incl. sign-out.
- GitHub PAT setup + connection test (CMS **Setup** page).
- The full read → edit → save → live-in-seconds loop, for real, on two
  pages: **Home** and **Contact** (`HomePageEditor.jsx`,
  `ContactPageEditor.jsx` on the admin side; `Home.jsx`, `Contact.jsx` on
  the main site).
- Every other page is also genuinely writable via the generic
  `PlaceholderEditor.jsx` (raw JSON), not just routed and inert.
- Unsaved-changes guard (sidebar nav + browser close/refresh) in the CMS.
- Activity log data model + diffing (`logChange.js`) — entries are
  written to `cms-admin/changelog.json` on every save. There's no UI to
  *view* the log yet (see below).
- SPA routing on GitHub Pages (`404.html` + `spa-redirect.js`).
- GitHub Actions: `deploy.yml` (combined build + publish, skips CI-only
  commits), `ci.yml` (build check on PRs).

## Stubbed — routed and wired to content, but not built out

Pages: Sectors, Products, SILBO, Case Studies, Company, Resources,
Gallery, Careers. Each renders its hero from real JSON
(`apps/main-site/public/content/pages/*.json`) plus one line telling you
which file to build the rest of the page from — follow the `Home.jsx` /
`Contact.jsx` pattern.

## Not started yet (intentionally out of scope for the base skeleton)

- **Product catalog.** The original site's product catalog is a
  generated-data pipeline (`scripts/generate-products.mjs` merging
  50+ per-product JSON files into `src/data/products.js`), synced from a
  separate upstream repo. Real complexity, deliberately not part of this
  base build — `Products.jsx` and `ProductSelector.jsx` are placeholders
  until this exists.
- **Blog / Resources listing + detail pages.** Needs the markdown
  rendering pipeline (`react-markdown` + `remark-gfm`) and a blog index
  file, same as the original.
- **CMS Activity Log viewer, Countries editor, image upload UI.** The
  data layer for the activity log exists; the other two have no
  equivalent yet at all.
- **Sitemap generation script**, **WebP image conversion script** — both
  existed as standalone Node scripts in the original `scripts/` folder;
  not yet ported.
- **ESLint config** for either app (deliberately left out rather than
  shipped half-configured — add when it's actually going to be used).

## Suggested build order

1. Pick 2–3 more pages and upgrade them from `PlaceholderEditor` to real
   forms (Company and Sectors are probably next — no special data model
   needed, same pattern as Contact).
2. Product catalog pipeline — the biggest single piece of remaining
   work, and several other pages (Products, ProductSelector, SILBO)
   depend on it existing.
3. Blog/Resources pipeline.
4. CMS admin niceties: Activity Log viewer, image upload flow.
