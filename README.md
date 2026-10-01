# INVENDIS Technologies Website

Monorepo for the INVENDIS Technologies public marketing website and its browser-based CMS admin panel. Built from scratch with React, Vite, and Tailwind CSS; deployed to GitHub Pages with zero backend.

---

## Table of Contents

1. [Repository Structure](#repository-structure)
2. [Tech Stack](#tech-stack)
3. [Quick Start — Local Development](#quick-start--local-development)
4. [Build & Deploy](#build--deploy)
5. [How Content Flows: CMS → Live Site](#how-content-flows-cms--live-site)
6. [main-site — Public Website](#main-site--public-website)
7. [cms-admin — Content Management Panel](#cms-admin--content-management-panel)
8. [packages/github-client — Shared API Library](#packagesgithub-client--shared-api-library)
9. [Content JSON Reference](#content-json-reference)
10. [Product Selector Data Model](#product-selector-data-model)
11. [Activity Log / Changelog](#activity-log--changelog)
12. [Environment Variables](#environment-variables)
13. [How-To Guides](#how-to-guides)

---

## Repository Structure

```
invendis-website/
├── apps/
│   ├── main-site/              # Public marketing website
│   └── cms-admin/              # Browser-based CMS admin panel
├── packages/
│   └── github-client/          # Shared GitHub Contents API wrapper
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI — builds both apps and publishes to GitHub Pages
├── package.json                # npm workspaces root (one install wires everything)
├── .prettierrc                 # Shared code formatter config
└── README.md
```

This is an **npm workspaces monorepo**. Running `npm install` once at the root installs all dependencies for both apps and the shared package. No separate install steps per app.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (main-site), React 18 (cms-admin) |
| Build tool | Vite |
| Styling | Tailwind CSS + PostCSS |
| Routing | React Router v7 |
| Auth (CMS) | Azure AD via MSAL (`@azure/msal-browser`) |
| GitHub API | Custom wrapper (`@invendis/github-client`) |
| Deployment | GitHub Pages (combined dist) |
| Code format | Prettier |

---

## Quick Start — Local Development

```bash
# 1. Install all dependencies (run once from repo root)
npm install

# 2. Start the public website dev server  →  http://localhost:5173
npm run dev

# 3. Start the CMS admin dev server       →  http://localhost:5174
npm run dev:admin
```

### CMS admin prerequisites

Before the CMS can save anything it needs two things:

**A. Azure AD app registration**
Copy `apps/cms-admin/.env.example` to `apps/cms-admin/.env` and fill in:
```
VITE_MSAL_CLIENT_ID=<your Azure app client ID>
VITE_MSAL_TENANT_ID=<your Azure tenant ID>
VITE_GH_OWNER=<your GitHub username or org>
VITE_GH_REPO=invendis-website
```
See `apps/cms-admin/src/auth/msalConfig.js` for the exact Azure AD scopes and redirect URI to configure.

**B. GitHub Personal Access Token (PAT)**
After signing in, go to the **Setup** page in the CMS and paste a PAT with `Contents: Read and write` scope on this repository. The token is stored in `sessionStorage` only — it is never sent anywhere except `api.github.com` and is cleared when the browser tab is closed.

---

## Build & Deploy

```bash
# Build public website only  →  apps/main-site/dist/
npm run build

# Build CMS admin only       →  apps/cms-admin/dist/
npm run build:admin

# Build both
npm run build:all
```

The `deploy.yml` GitHub Actions workflow runs on every push to `main`. It:
1. Builds both apps
2. Merges `apps/cms-admin/dist/` into `apps/main-site/dist/cms-admin/`
3. Publishes the combined `dist/` to the `gh-pages` branch

The live site is served from `gh-pages`. The CMS admin is available at `<site-url>/cms-admin/`.

---

## How Content Flows: CMS → Live Site

```
Editor opens a page in CMS Admin (browser)
        │
        │  Reads current JSON from GitHub API
        │  (main branch, source of truth)
        ▼
Editor makes changes in the form UI
        │
        │  Clicks "Save"
        ▼
savePageContent() runs two parallel writes:
        │
        ├──► main branch
        │    path: apps/main-site/public/content/<page>.json
        │    commit message: "CMS: update <Page> [skip ci]"
        │    [skip ci] prevents triggering a Vite rebuild
        │
        └──► gh-pages branch
             path: content/<page>.json
             commit message: "CMS: update <Page>"
             (Vite copies public/* to dist/ root at build time,
              so "public/" drops out of the path on gh-pages)
        │
        ▼
Live site fetches the JSON at runtime via useContent hook
        │  fetch(`${BASE_URL}content/pages/home.json`)
        │  Browser HTTP cache handles freshness
        ▼
Content is live within seconds — NO REBUILD REQUIRED
```

**Key invariant:** The `main` branch is the source of truth for the code. The `gh-pages` branch is the live built output. Every CMS save keeps both in sync. A code-only change (new component, dependency update) requires a full Vite build; a content-only change (text, images, JSON) does not.

### Conflict handling

If two editors save the same file simultaneously, the second save gets a `409 Conflict` from the GitHub API. The CMS catches this and shows: *"Another editor saved this file while you were editing. Please refresh and try again."*

---

## main-site — Public Website

### Entry point

```
apps/main-site/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── src/
│   ├── main.jsx              # React DOM root
│   ├── App.jsx               # Router + layout shell
│   ├── index.css             # Tailwind directives + global styles
│   ├── pages/                # One file per route
│   ├── sections/             # Section components grouped by page
│   ├── components/           # Shared layout + utility components
│   └── hooks/                # Custom React hooks
└── public/
    ├── content/              # All CMS-managed JSON files (served as static assets)
    └── images/               # Static images and assets
```

### Routes

All routes are lazy-loaded via `React.lazy()` so the initial bundle only pays for the page the visitor actually landed on.

| URL | Page Component | Content File |
|---|---|---|
| `/` | `Home.jsx` | `pages/home.json` |
| `/sectors` | `Sectors.jsx` | `pages/sectors.json` |
| `/products` | `Products.jsx` | `pages/products.json` |
| `/products/product-selector` | `ProductSelector.jsx` | `productSelector/_index.json` |
| `/products/product-selector/:id` | `ProductSelector.jsx` | `productSelector/products/<id>.json` |
| `/case-studies` | `CaseStudies.jsx` | `pages/caseStudies.json` |
| `/company` | `Company.jsx` | `pages/company.json` |
| `/contact` | `Contact.jsx` | `pages/contact.json` |
| `/resources` | `Resources.jsx` | `pages/resources.json` |
| `/resources/:slug` | `ResourceDetail.jsx` | `articles/<slug>.json` |
| `/careers` | `Careers.jsx` | (no content file — static) |
| `/silbo` | `Silbo.jsx` | `pages/silbo.json` |
| `/gallery` | `Gallery.jsx` | `pages/gallery.json` |
| `/privacy` | `Privacy.jsx` | static |
| `/terms` | `Terms.jsx` | static |

### Layout shell (`App.jsx`)

Every page is wrapped in:
- `<Navbar />` — sticky top navigation with responsive mobile menu
- `<TopBarSection />` — thin announcement/promo bar above the nav (CMS-managed via `home.json`)
- `<Footer />` — site-wide footer with links and social icons
- `<FloatingButtons />` — fixed WhatsApp / scroll-to-top buttons
- `<ScrollToTop />` — scrolls to top on route change; scrolls to `#hash` anchors smoothly

### The `useContent` hook

```js
// Basic usage — returns data directly (null while loading)
const data = useContent("pages/home.json");

// With loading/error state
const { data, loading, error } = useContent("pages/home.json", { withLoading: true });
```

- Fetches from `${BASE_URL}content/<path>` — a static file served by GitHub Pages
- An in-memory `memCache` prevents duplicate fetches within the same browser session
- The browser's HTTP cache handles freshness between sessions (no cache-busting)
- Every page handles all three states: `loading` → return null (avoid flash), `error` → show friendly message, `data` → render sections

### Section registry pattern

Each page has a `registry.js` file in its section folder:

```js
// Example: src/sections/home/registry.js
export const HOME_SECTIONS = {
  hero:         HeroSection,
  whatWeDo:     WhatWeDoSection,
  stats:        StatsSection,
  trustedBy:    TrustedBySection,
  testimonials: TestimonialsSection,
  ctaBanner:    CtaBannerSection,
};
```

The page component iterates `data.sections` (an array of keys from the JSON) and renders each registered component:

```jsx
{(data.sections ?? []).map((key) => {
  const Section = HOME_SECTIONS[key];
  return Section ? <Section key={key} data={data[key]} /> : null;
})}
```

This means section **order and visibility are controlled entirely by the CMS** — reordering the `sections` array in the JSON changes what appears and in what order, with no code change.

### Shared components

| Component | Purpose |
|---|---|
| `components/layout/Navbar.jsx` | Sticky responsive navigation |
| `components/layout/Footer.jsx` | Site-wide footer |
| `components/layout/FloatingButtons.jsx` | Fixed WhatsApp + scroll-to-top |
| `components/shared/PageSEO.jsx` | `<title>` + `<meta>` tags via React Helmet |
| `components/shared/ErrorBoundary.jsx` | Catches render errors gracefully |
| `components/shared/Icon.jsx` | SVG icon sprite helper |

### Product Selector sub-components

The Product Selector is the most complex page. Its UI is split across:

| File | Purpose |
|---|---|
| `pages/ProductSelector.jsx` | Main page — filters, pagination, state |
| `sections/product-selector/ProductCard.jsx` | Single product card in the grid |
| `sections/product-selector/SerialDropdown.jsx` | Multi-select serial I/O filter |
| `sections/product-selector/ProductModal.jsx` | Full product detail modal (specs, images, datasheets) |
| `sections/product-selector/CompareModal.jsx` | Side-by-side product comparison table |

---

## cms-admin — Content Management Panel

### Entry point

```
apps/cms-admin/
├── index.html
├── vite.config.js
├── src/
│   ├── main.jsx              # React DOM root (wraps in MsalProvider + HashRouter)
│   ├── App.jsx               # Routes
│   ├── index.css             # Admin panel styles (CSS variables + utility classes)
│   ├── config.js             # GitHub owner/repo/branch config
│   ├── auth/                 # Azure AD authentication
│   ├── context/              # Global admin state (AdminContext)
│   ├── pages/                # Top-level pages + page editors
│   ├── sections/             # Section-level form editors (grouped by page)
│   ├── components/           # Shared UI widgets
│   └── utils/                # GitHub write helpers + changelog
└── public/
    └── invendis_logo.webp
```

### Authentication flow

```
User visits CMS → AuthGuard checks MSAL account
    │
    ├── Not signed in → redirect to /login
    │       │
    │       └── LoginPage renders MSAL popup sign-in
    │
    └── Signed in → Dashboard renders
            │
            └── No GitHub token yet → Setup page prompt
                    │
                    └── User pastes PAT → stored in sessionStorage
                            │
                            └── AdminContext provides token to all editors
```

- **Azure AD (MSAL)** handles identity — who the editor is
- **GitHub PAT** handles authorization — what the editor can write
- The PAT is stored **only in `sessionStorage`**, not `localStorage`. It is never embedded in code or environment variables visible to the browser at runtime

### AdminContext

`src/context/AdminContext.jsx` is a React context consumed by every editor via `useAdmin()`. It provides:

| Value | Type | Purpose |
|---|---|---|
| `token` | string | GitHub PAT for API calls |
| `userEmail` | string | Signed-in editor's email (written to changelog) |
| `toast(msg, type)` | function | Show a success/error notification |
| `setDirty(bool)` | function | Mark that there are unsaved changes |
| `isDirty()` | function | Check if there are unsaved changes |
| `showConfirm(msg, onOk, onCancel)` | function | Show a confirmation dialog |

### Dirty state & unsaved changes guard

When an editor makes changes, they call `setDirty(true)`. The `Dashboard.jsx` sidebar navigation uses a `guardedNavigate` function: if `isDirty()` is true, it intercepts the click and shows a `showConfirm` dialog before allowing navigation. This prevents accidental data loss when switching pages.

### Dashboard & navigation

`pages/Dashboard.jsx` is the shell that wraps all authenticated pages. It renders:
- A fixed left sidebar with navigation links grouped into **Content Pages** and **Other**
- A fixed top header bar
- An `<Outlet />` where the active editor renders

Navigation links are defined in two arrays inside `Dashboard.jsx`:
- `CONTENT_LINKS` — one entry per editable page
- `OTHER_LINKS` — Setup, Activity Log

### Page editors

Each route under `/content/*` maps to a dedicated editor component:

| Route | Editor | Content file written |
|---|---|---|
| `/content/home` | `HomePageEditor.jsx` | `pages/home.json` |
| `/content/sectors` | `SectorsPageEditor.jsx` | `pages/sectors.json` |
| `/content/products` | `ProductsPageEditor.jsx` | `pages/products.json` |
| `/content/contact` | `ContactPageEditor.jsx` | `pages/contact.json` |
| `/content/gallery` | `GalleryPageEditor.jsx` | `pages/gallery.json` |
| `/content/company` | `CompanyPageEditor.jsx` | `pages/company.json` |
| `/content/resources` | `ResourcesPageEditor.jsx` | `pages/resources.json` |
| `/content/resources/:slug` | `ArticleDetailEditor.jsx` | `articles/<slug>.json` |
| `/content/case-studies` | `CaseStudiesPageEditor.jsx` | `pages/caseStudies.json` |
| `/content/silbo` | `SilboPageEditor.jsx` | `pages/silbo.json` |
| `/content/careers` | `CareersPageEditor.jsx` | `pages/careers.json` |
| `/content/product-selector` | `ProductSelectorEditor.jsx` | `productSelector/_index.json` + `productSelector/products/<id>.json` |
| `/log` | `LogPage.jsx` | reads `apps/cms-admin/content-audit-log.json` |
| `/setup` | `Setup.jsx` | `siteSettings.json` |

Each page editor:
1. Loads the current JSON on mount via `loadPageContent()`
2. Renders its section editors (one per collapsible section of the page)
3. On save, calls `savePageContent()` which writes to both branches and appends a changelog entry

### Section editors

Each page's editor is composed of section-level sub-editors, mirroring the main-site section structure exactly. They live in `src/sections/<page-name>/`:

```
sections/
├── careers/        HeroCareerEditor, WhyJoinEditor, OpeningsEditor, PerksEditor, CtaBannerEditor
├── case-studies/   HeroCaseStudiesEditor, CaseStudiesEditor, WhitePapersEditor
├── company/        HeroCompanyEditor, WhoWeAreEditor, JourneyEditor, LeadershipEditor, ValuesEditor
├── contact/        HeroContactEditor, ContactBodyEditor, GlobalPresenceEditor
├── gallery/        HeroGalleryEditor, PhotoGalleryEditor
├── home/           TopBarEditor, HeroEditor, WhatWeDoEditor, TrustedByEditor, StatsEditor, TestimonialsEditor, CtaBannerEditor
├── products/       HeroProductEditor, HardwarePortfolioEditor, SoftwarePlatformsEditor, SilboProductsEditor, DesignPartnersEditor
├── resources/      HeroResourcesEditor, ArticlesEditor
├── sectors/        HeroSectorEditor, VerticalsEditor, GlobalReachEditor
└── silbo/          HeroSilboEditor, AboutEditor, ApplicationsEditor, EdgeComputeEditor, ProductRangeEditor, DeploymentsEditor, TechPartnersEditor, CtaBannerEditor
```

Each folder also has a `registry.js` that exports a map of section key → editor component. This mirrors the main-site registry pattern.

### Product Selector editor

`ProductSelectorEditor.jsx` is the most complex editor. It manages two types of content:

**Index file** (`productSelector/_index.json`):
- `products[]` — lightweight card entries (id, name, cat, order, hidden, image, use_cases, connectivity flags)
- `cats[]` — ordered list of category names
- `catColors{}` — per-category background + text colour for pills

**Per-product files** (`productSelector/products/<id>.json`):
- Full spec sheet: CPU, RAM, storage, cellular, Wi-Fi, RS-485, RS-232, IP rating, power, ports, OS, housing, dimensions, weight, operating temperature
- `images[]` — array of image paths
- `datasheet` — top-level datasheet PDF path
- `part_datasheets{}` — per-part-number datasheet paths
- `use_cases[]` — application tags
- `variants` — optional part number table
- `hidden_fields[]` — fields to hide in the modal view
- `additional_specs[]` — extra spec rows beyond the standard set

The editor is split into two sub-components:

| Component | Purpose |
|---|---|
| `sections/product-selector/ProductList.jsx` | Product list view with search, category filter, pagination (5/10/20/50 per page), category colour manager |
| `sections/product-selector/ProductForm.jsx` | Full product edit form with six tabs: Details, Specs, Images, Datasheet, Use Cases, Variants |

Shared constants for the editor live in `sections/product-selector/constants.js`:
- `CAT_COLORS` — default colour palette for each category (seed/fallback; actual colours come from the JSON)
- `SPEC_FIELDS` — ordered list of standard hardware spec fields and their display labels

**Save flow for a product:**
1. Validate: ID required, name required, no duplicate ID (for new products), category must exist in `index.cats`
2. Upload any pending images to `images/product-selector/<id>/<filename>` on both branches
3. Upload any pending datasheets to `assets/datasheets/products/<id>/<filename>` on both branches
4. Write the full product JSON to `productSelector/products/<id>.json` on both branches
5. Update the lightweight card entry in `_index.json` and write it to both branches
6. Append a changelog entry

### `savePageContent` utility

`src/utils/savePageContent.js` is the single function all editors call to save:

```js
await savePageContent({
  token,
  contentPath: "pages/home.json",  // relative to content root
  before: originalData,             // for changelog diff
  after: formData,
  page: "Home",
  section: "hero",                  // optional
  userEmail,
});
```

Internally it resolves the content path to two real branch paths:
- **main branch:** `apps/main-site/public/content/<contentPath>` — tagged `[skip ci]`
- **gh-pages branch:** `content/<contentPath>`

`uploadImage(imagePath, base64, { token, message })` follows the same dual-branch pattern for binary assets.

---

## packages/github-client — Shared API Library

`packages/github-client/index.js` exports `createGithubClient()` — a plain-fetch wrapper around the GitHub Contents API. Both apps import it via the npm workspace alias `@invendis/github-client`.

### API surface

```js
const github = createGithubClient({ owner, repo, defaultBranch: "main" });

// Read operations (no token required — repo is public)
github.testConnection(token)                   // verify token, returns repo full_name
github.readFile(path, { branch, token })       // returns { content: string, sha }
github.readFileBase64(path, { branch, token }) // returns { base64: string, sha }
github.getFileSha(path, { branch, token })     // returns sha string or null (404 → null)
github.listDir(path, { branch, token })        // returns array of GitHub tree entries

// Write operations (token required)
github.writeFile(path, text, { message, sha, branch, token })          // create or update text file
github.writeFileBase64(path, base64, { message, sha, branch, token })  // create or update binary file
github.deleteFile(path, sha, { message, branch, token })               // delete a file
github.dispatchEvent(eventType, token)                                  // fire repository_dispatch
```

The `sha` parameter on write/delete calls is required by the GitHub API to prevent conflicting updates. The CMS always fetches the current sha immediately before writing. If another editor wrote the file between the sha fetch and the write, GitHub returns `409 Conflict`, which `savePageContent.js` catches and re-throws as a human-readable error.

---

## Content JSON Reference

All content files live under `apps/main-site/public/content/`. The CMS reads and writes these files directly. They are served as static assets by GitHub Pages.

```
public/content/
├── siteSettings.json               # Global site config (nav links, social URLs, etc.)
├── pages/
│   ├── home.json
│   ├── sectors.json
│   ├── products.json
│   ├── contact.json
│   ├── gallery.json
│   ├── company.json
│   ├── resources.json
│   ├── caseStudies.json
│   └── silbo.json
├── articles/
│   ├── energy-metering-solar.json
│   ├── iiot-telecom-monitoring.json
│   ├── industrial-edge-computing.json
│   └── industrial-router-selection.json
└── productSelector/
    ├── _index.json                 # Category list, catColors, lightweight product cards
    └── products/
        ├── <id>.json               # Full spec sheet per product (54 products)
        └── ...
```

### Page JSON shape

Every page JSON file follows this shape:

```json
{
  "sections": ["hero", "whatWeDo", "stats"],
  "hero": { ... },
  "whatWeDo": { ... },
  "stats": { ... }
}
```

The `sections` array controls **which sections are rendered and in what order**. Removing a key from the array hides that section on the live site without deleting its data.

---

## Product Selector Data Model

### `_index.json`

```json
{
  "cats": ["Edge Compute", "IoT Gateways", "Mobile Computing", ...],
  "catColors": {
    "Edge Compute": { "bg": "#E8F0FE", "fg": "#1A56DB" },
    ...
  },
  "products": [
    {
      "id": "rtxx",
      "name": "RT-XX Series",
      "cat": "IoT Gateways",
      "order": 1,
      "hidden": false,
      "desc": "Short description shown on the card",
      "cellular_gen": "4G",
      "wifi": "WiFi4",
      "ports": "4",
      "rs485": "Yes",
      "rs232": "Optional",
      "image": "/images/product-selector/rtxx/front.jpg",
      "use_cases": ["Smart Metering", "Industrial Monitoring"]
    }
  ]
}
```

### `products/<id>.json`

```json
{
  "id": "rtxx",
  "name": "RT-XX Series",
  "cat": "IoT Gateways",
  "order": 1,
  "hidden": false,
  "desc": "Full description shown in the modal",
  "cpu": "Quad-core ARM Cortex-A55",
  "ram": "2 GB",
  "storage": "8 GB eMMC",
  "cell": "Cat-4 LTE",
  "cellular_gen": "4G",
  "wifi": "WiFi4",
  "rs485": "Yes",
  "rs232": "Optional",
  "ip": "IP40",
  "power": "9–36 V DC",
  "ports": "4",
  "os": "OpenWrt",
  "housing": "Aluminium DIN-rail",
  "dims": "130 × 100 × 40 mm",
  "weight": "320 g",
  "op_temp": "-40°C to +75°C",
  "images": ["/images/product-selector/rtxx/front.jpg", "/images/product-selector/rtxx/side.jpg"],
  "datasheet": "/assets/datasheets/products/rtxx/rtxx-datasheet.pdf",
  "part_datasheets": {
    "RT-4G-W": "/assets/datasheets/products/rtxx/rt-4g-w.pdf"
  },
  "use_cases": ["Smart Metering", "Industrial Monitoring", "Fleet Management"],
  "hidden_fields": [],
  "additional_specs": [
    { "label": "Antenna", "value": "2 × SMA (external)" }
  ],
  "variants": {
    "headers": ["Part Number", "Cellular", "Wi-Fi"],
    "rows": [
      ["RT-4G-W", "4G LTE", "Wi-Fi 4"],
      ["RT-4G", "4G LTE", "—"]
    ]
  }
}
```

---

## Activity Log / Changelog

Every save writes a diff entry to `apps/cms-admin/content-audit-log.json` (capped at 500 entries, newest first). The file lives on the `main` branch only.

Each entry records:
```json
{
  "timestamp": "2025-10-01T09:12:34.000Z",
  "userEmail": "editor@invendis.com",
  "page": "Home",
  "section": "hero",
  "changes": [
    { "field": "title", "before": "Old Title", "after": "New Title" },
    { "field": "items", "action": "changed", "label": "Card 1", "before": {...}, "after": {...} }
  ]
}
```

The **Activity Log** page (`/log`) in the CMS admin reads this file and displays a timeline of all recent edits.

---

## Environment Variables

### `apps/cms-admin/.env`

```env
VITE_MSAL_CLIENT_ID=     # Azure AD application (client) ID
VITE_MSAL_TENANT_ID=     # Azure AD tenant ID (or "common" for multi-tenant)
VITE_GH_OWNER=           # GitHub username or organisation that owns the repo
VITE_GH_REPO=            # Repository name (default: invendis-website)
```

### `apps/main-site/.env`

The main site has no required environment variables for local development. Vite's `BASE_URL` is configured in `vite.config.js` for GitHub Pages path prefixing.

---

## How-To Guides

### Add a new section to an existing page

1. **main-site:** Create `src/sections/<page>/NewSection.jsx`. It receives `data` prop matching its JSON shape.
2. **main-site:** Register it in `src/sections/<page>/registry.js` with a key, e.g. `"newSection"`.
3. **JSON:** Add the section's data object to the page's `.json` file and add `"newSection"` to the `sections` array.
4. **cms-admin:** Create `src/sections/<page>/NewSectionEditor.jsx`.
5. **cms-admin:** Register it in `src/sections/<page>/registry.js`.
6. The page editor will automatically pick it up through the registry.

### Add a new page

1. **main-site:**
   - Create `src/pages/NewPage.jsx` following the pattern of `Silbo.jsx` or `Sectors.jsx`.
   - Add a lazy-loaded route in `src/App.jsx`.
   - Create `public/content/pages/newPage.json` with the initial content.
   - Create `src/sections/new-page/` with section components and a `registry.js`.

2. **cms-admin:**
   - Create `src/pages/editors/NewPageEditor.jsx` following the pattern of `SilboPageEditor.jsx`.
   - Add a route in `src/App.jsx` under the `AuthGuard` layout route.
   - Add a link in `Dashboard.jsx`'s `CONTENT_LINKS` array.
   - Create `src/sections/new-page/` with section editor components and a `registry.js`.

### Add a new product

1. In the CMS Admin, go to **Product Selector** and click **+ New product**.
2. Fill in the product ID (used as the filename — lowercase, no spaces, e.g. `rv00`), name, and category.
3. Complete the Specs, Images, Datasheet, Use Cases, and Variants tabs.
4. Click **Save product**. The CMS will:
   - Upload any images to `images/product-selector/<id>/`
   - Upload any datasheets to `assets/datasheets/products/<id>/`
   - Write `productSelector/products/<id>.json`
   - Update the card entry in `productSelector/_index.json`
   - Both branches are updated immediately — no rebuild needed.

### Add a new product category

1. In the CMS Admin, go to **Product Selector**.
2. Scroll to **Category Manager** at the bottom of the product list.
3. Type the new category name, pick a background and text colour for the pill, and click **Add**.
4. Click **Save categories**. The new category appears in all product forms immediately.

### Change section order or hide a section

Edit the `sections` array in the relevant page JSON through the CMS admin. Removing a key hides the section; reordering the array changes the render order. No code change required.
