# Project Status

Honest map of what is fully working, what is intentionally static, and what
is genuinely not yet built. Update this file whenever a gap is closed.

Last updated: October 2025

---

## Fully working

**Infrastructure**
- npm workspaces monorepo (`apps/*`, `packages/*`) — builds cleanly with `npm run build:all`
- Shared GitHub API client (`packages/github-client`) — read, write, delete, binary upload
- Azure AD (MSAL) sign-in gate for the CMS admin, including sign-out
- GitHub PAT setup + connection test (CMS **Setup** page)
- Dual-branch save: every content write goes to `main` (source, `[skip ci]`) and `gh-pages` (live) simultaneously — edits are visible within seconds, no rebuild needed
- 409 conflict detection — friendly error when two editors save the same file at the same time
- SPA routing on GitHub Pages (`404.html` + `spa-redirect.js`)
- GitHub Actions `deploy.yml` — combined build + publish, skips CI-only commits

**Main site — all pages fully built**
- Home, Sectors, Products, Product Selector, Case Studies, Company, Contact, Resources, Resource Detail, Silbo, Gallery
- All pages use the section-registry pattern — section order and visibility controlled via the `sections` array in each page's JSON, no code change needed
- Product Selector: 54 products, category + connectivity filters, responsive pagination, product detail modal, side-by-side compare modal, URL-persisted page number and filters
- `useContent` hook with in-memory cache and proper loading/error states on every page

**CMS admin — all page editors fully built**
- Home, Sectors, Products, Contact, Gallery, Company, Resources, Article Detail, Case Studies, Silbo, Careers, Product Selector
- Product Selector editor: full product form (6 tabs — Details, Specs, Images, Datasheet, Use Cases, Variants), image and datasheet upload to both branches, category colour manager, pagination, unsaved-changes guard
- Dirty-state guard across all editors — prompts before navigating away with unsaved changes
- Activity Log viewer (`/log`) — reads `content-audit-log.json` and displays a timeline of all edits
- Field-level diff engine (`logChange.js`) — every save records exactly which fields changed and who changed them

---

## Intentionally static (no CMS editor)

| Page | Reason |
|---|---|
| `/careers` | Content is static — no dynamic fields that need CMS management |
| `/privacy` | Legal text — edited directly in code when needed |
| `/terms` | Legal text — edited directly in code when needed |

---

## Not yet built

- **ESLint config** — deliberately left out rather than shipped half-configured; add when it will actually be enforced in CI
- **Sitemap generation script** — `scripts/generate-sitemap.mjs` does not exist; sitemap is not submitted to search engines
- **WebP image conversion script** — images are uploaded as-is (JPG/PNG); no automated conversion or optimisation pipeline
- **CI build check on pull requests** — `deploy.yml` only runs on push to `main`; there is no separate `ci.yml` that runs `npm run build:all` on PRs to catch broken builds before merge
- **Image deletion from repository** — deleting a product in the CMS removes it from the index and deletes its JSON file, but its images and datasheets remain in the repository; manual cleanup is required
