# INVENDIS Technologies — Website & CMS

This repository is a monorepo containing two independent React applications that are built and deployed together:

| App | Path | Purpose |
|-----|------|---------|
| **Main site** | `/` (root) | Public-facing marketing website |
| **CMS admin** | `cms-admin/` | Internal content-management panel for editors |

Both apps are combined into a single `dist/` folder and deployed to GitHub Pages via a shared workflow. The CMS admin lives at `/cms-admin/` on the same domain as the main site.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Main Site](#main-site)
3. [CMS Admin](#cms-admin)
4. [Content System](#content-system)
5. [GitHub API Layer](#github-api-layer)
6. [Build Scripts](#build-scripts)
7. [GitHub Actions Workflows](#github-actions-workflows)
8. [Environment Variables](#environment-variables)
9. [Local Development](#local-development)
10. [Building & Deploying](#building--deploying)

---

## Architecture Overview

```
INVENDIS-Technologies/
├── src/                      # Main website React source
├── public/                   # Static assets + runtime content for main site
├── cms-admin/                # CMS admin React application
│   ├── src/
│   └── public/
├── scripts/                  # Build-time Node.js utilities
├── .github/workflows/        # GitHub Actions CI/CD pipelines
├── dist/                     # Combined production build output (git-ignored)
├── package.json              # Main site dependencies + scripts
├── vite.config.js            # Main site Vite config
├── tailwind.config.js        # Tailwind CSS config (shared theme)
└── postcss.config.js         # PostCSS (Tailwind + Autoprefixer)
```

### How content changes reach the site

```
Editor makes change in CMS Admin
        ↓
CMS writes JSON directly to gh-pages branch → live in seconds (no build)
CMS also writes to main branch with [skip ci] → keeps source in sync
        ↓
Main site fetches JSON at runtime via useContent hook
```

The main site fetches all CMS-managed content at runtime, so edits in the CMS panel are visible on the live site within seconds — no build or deploy is triggered.

---

## Main Site

**Tech stack:** React 19, React Router v7, Tailwind CSS 3, Framer Motion, Lucide React, Vite 8

### Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home.jsx` | Homepage with hero, stats, clients, what-we-do, testimonials |
| `/sectors` | `Sectors.jsx` | Interactive world map + sector list |
| `/products` | `Products.jsx` | Full product catalog with filtering, search & comparison |
| `/products/product-selector` | `ProductSelector.jsx` | Guided product selector tool |
| `/products/product-selector/:id` | `ProductSelector.jsx` | Product selector pre-loaded to a specific product |
| `/case-studies` | `CaseStudies.jsx` | Customer case studies |
| `/company` | `Company.jsx` | About / team / company information |
| `/contact` | `Contact.jsx` | Contact form (opens pre-filled email via `mailto:`) |
| `/resources` | `Resources.jsx` | Blog / article listing |
| `/resources/:slug` | `ResourceDetail.jsx` | Individual blog post (rendered from JSON + markdown) |
| `/careers` | `Careers.jsx` | Job openings |
| `/silbo` | `Silbo.jsx` | SILBO product page |
| `/gallery` | `Gallery.jsx` | Photo gallery |
| `/privacy` | `Privacy.jsx` | Privacy policy |
| `/terms` | `Terms.jsx` | Terms of service |
| `*` | `NotFound.jsx` | 404 catch-all |

All pages are **lazy-loaded** via `React.lazy` with a `Suspense` fallback spinner. An `ErrorBoundary` wraps the entire route tree — if any page throws an unhandled error, the user sees a recovery screen instead of a blank page.

### Components

```
src/components/
├── home/
│   ├── ClientsBar.jsx        # Scrolling client logo strip
│   ├── Hero.jsx              # Homepage hero section with animated stats
│   ├── StatsRow.jsx          # Key metrics row (revenue, countries, etc.)
│   ├── Testimonials.jsx      # Customer testimonials carousel
│   └── WhatWeDo.jsx          # Services / sector overview cards
├── layout/
│   ├── Navbar.jsx            # Responsive top navigation (links from siteSettings.json)
│   └── Footer.jsx            # Site-wide footer (links from siteSettings.json)
├── products/
│   ├── CategoryTabs.jsx      # Filter tabs for product categories
│   ├── CompareBar.jsx        # Floating comparison bar (up to 3 products)
│   ├── CompareModal.jsx      # Side-by-side product comparison modal
│   ├── CompareTray.jsx       # Tray holding products staged for comparison
│   ├── FilterBar.jsx         # Full filter panel (specs, category, brand)
│   ├── Pagination.jsx        # Products list pagination
│   ├── ProductCard.jsx       # Grid-view product card
│   ├── ProductGrid.jsx       # Responsive product grid layout
│   ├── ProductList.jsx       # Products in list-view wrapper
│   ├── ProductListRow.jsx    # Single row in list view
│   └── ProductModal.jsx      # Full product detail modal/drawer
└── shared/
    ├── Breadcrumbs.jsx       # Breadcrumb nav + schema.org BreadcrumbList markup
    ├── CTABanner.jsx         # Call-to-action banner section
    ├── CookieBanner.jsx      # Cookie consent banner (gates Google Analytics)
    ├── ErrorBoundary.jsx     # Class-based error boundary wrapping the route tree
    ├── PageSEO.jsx           # Per-page <title>, meta, Open Graph, and JSON-LD tags
    ├── StickyProductCTA.jsx  # Scroll-triggered sticky banner linking to Products page
    └── WhatsAppButton.jsx    # Floating WhatsApp contact button
```

### Utilities

```
src/utils/
├── analytics.js              # Google Analytics 4 (fires only when VITE_GA_ID is set)
├── blog.js                   # Blog post utilities (parse frontmatter, sort by date)
├── breadcrumbSchema.js       # Generates schema.org BreadcrumbList JSON-LD
├── iconMap.js                # Maps string names → Lucide icon components
├── productHelpers.js         # Product filtering, sorting, search helpers
├── siteUrl.js                # Canonical URL helpers (absoluteUrl, SITE_URL, BASE_PATH)
└── styleMap.js               # String → CSS class mappings for CMS-driven styling
```

### Hooks

```
src/hooks/
├── useCompareList.js         # Product comparison state (localStorage-persisted, max 3)
└── useContent.js             # Runtime content fetching (reads JSON from GitHub, sessionStorage cache)
```

### Data files

```
src/data/                     # Auto-generated by scripts — never edit by hand
├── products.js               # Full product catalog (merged from src/content/products/*.json)
├── productImages.js          # Product ID → image URL mapping
├── productDatasheets.js      # Product ID → datasheet URL mapping
└── productUseCases.js        # Product ID → use-case description mapping

src/data/ (developer-maintained)
├── partDatasheets.js         # Per-part-number datasheet URLs (not CMS managed)
└── productVariants.js        # Free-form variant specs per product (not CMS managed)
```

### Static content

```
src/content/
└── products/                 # 55+ individual product JSON files (auto-synced from ProductSelector repo)

public/
├── content/
│   ├── pages/                # Per-page CMS content (fetched at runtime by useContent)
│   │   ├── home.json
│   │   ├── contact.json
│   │   ├── company.json
│   │   ├── sectors.json
│   │   ├── products.json
│   │   ├── silbo.json
│   │   ├── careers.json
│   │   ├── caseStudies.json
│   │   ├── gallery.json
│   │   └── resources.json
│   ├── blog/                 # Blog posts (JSON with markdown body field)
│   │   └── _index.json       # Blog index (slugs, titles, dates, tags)
│   ├── siteSettings.json     # Global nav, footer, logos, contact, WhatsApp config
│   └── servedCountries.json  # Country list for world map (Sectors + Contact pages)
├── images/                   # Page images (hero backgrounds, section photos, logos)
├── products/                 # Product images (WebP + originals)
├── favicon.svg
├── invendis_logo.png
├── invendis_logo.webp
├── robots.txt
├── sitemap.xml               # Auto-generated by scripts/generate-sitemap.mjs
├── world-110m.json           # TopoJSON world map data (for Sectors page)
├── .nojekyll                 # Tells GitHub Pages not to run Jekyll
├── 404.html                  # SPA fallback — encodes path as query string and redirects to root
└── spa-redirect.js           # Decodes the query string from 404.html and restores the original URL
```

### SPA routing on GitHub Pages

Because the site uses HTML5 History API routing and is hosted on GitHub Pages (which serves static files), direct URL access and page refreshes need special handling:

1. GitHub Pages serves `404.html` for any path it can't find.
2. `404.html` encodes the requested path as a query string and redirects to the site root.
3. `spa-redirect.js` (loaded in `index.html`) decodes the query string and restores the correct URL via `history.replaceState`.
4. React Router then handles the route as normal.

The `segmentCount = 1` in `404.html` matches the single path segment of the GitHub Pages repo URL (`/INVENDIS-Technologies/`).

### Styling

The main site uses **Tailwind CSS** with a custom brand theme:

| Token | Value |
|-------|-------|
| `brand-blue` | `#05059b` |
| `brand-red` | `#ff5050` |
| `brand-dark` | `#0a0a1a` |
| `brand-light` | `#f7f8fc` |
| `brand-text` | `#1a1a2e` |
| `brand-muted` | `#6b7280` |

Fonts: **Sora** (headings) and **DM Sans** (body). The `@tailwindcss/typography` plugin is used for rendering blog post markdown.

Blog posts are rendered client-side using **react-markdown** with the **remark-gfm** plugin (GitHub-flavoured markdown tables, strikethrough, etc.). Front matter is parsed at build time by **gray-matter** inside the sitemap and blog index scripts.

---

## CMS Admin

**Tech stack:** React 18, React Router v6, Azure AD (MSAL), Vite 6

The CMS admin is a fully self-hosted, browser-only content editor. It has no server-side component. All reads and writes go directly to GitHub via the Contents API using a personal access token entered by the user.

### Authentication

Authentication is two-layered:

1. **Azure Active Directory (MSAL)** — Controls who can access the CMS at all. Users must sign in with a valid organisational Azure AD account. Configuration lives in `cms-admin/src/auth/msalConfig.js`.

2. **GitHub Personal Access Token (PAT)** — Required to read and write content. Entered once per browser via the Setup page and stored in `localStorage` (key: `gh_pat`). The token is never sent to any third party — only to `api.github.com`.

```
cms-admin/src/auth/
├── msalConfig.js             # Azure AD client ID, tenant, redirect URIs
├── AuthProvider.jsx          # MSAL PublicClientApplication + React provider
└── AuthGuard.jsx             # HOC that requires an authenticated user
```

### Pages & Editors

**Dashboard** (`Dashboard.jsx`) is the shell. It renders the sidebar navigation and loads whichever editor is active. The sidebar has three collapsible sections: CONTENT, PAGES, and ADMIN.

#### Page editors (PAGES section)

Each editor loads the current content from GitHub, lets the editor change it in structured form fields, and saves back via the GitHub API. Every save writes to both the `main` branch (source of truth) and the `gh-pages` branch (live site), making changes visible within seconds without a rebuild.

| Sidebar label | Component | What it edits |
|--------------|-----------|---------------|
| Contact | `ContactPage.jsx` | Hero, contact info cards, quick facts, form labels & additional fields, map section |
| Home | `HomePage.jsx` | Hero copy, stats, testimonials, clients list, CTA banner |
| Company | `CompanyPage.jsx` | About text, timeline, team member cards with photos |
| Sectors | `SectorsPage.jsx` | Sector definitions, icons, highlighted countries |
| Products | `ProductsPage.jsx` | Products page hero and section copy |
| SILBO | `SilboPage.jsx` | SILBO product page copy and features |
| Careers | `CareersPage.jsx` | Open roles, department descriptions |
| Case Studies | `CaseStudiesPage.jsx` | Case study cards (client, industry, summary) |
| Gallery | `GalleryPage.jsx` | Photo gallery items and captions |

#### Content editors (CONTENT section)

| Sidebar label | Component | What it edits |
|--------------|-----------|---------------|
| Site Settings | `SiteSettings.jsx` | Global: nav links, footer links, social URLs, logos, WhatsApp config |

#### Admin tools (ADMIN section)

| Sidebar label | Component | Description |
|--------------|-----------|-------------|
| Blog | `BlogPage.jsx` | Create / edit / delete blog posts; list view + full markdown editor |
| Countries | `Countries.jsx` | World map country-level configuration (served countries list) |
| Setup | `Setup.jsx` | Enter and test GitHub PAT; required before any save operation |
| Activity Log | `ActivityLog.jsx` | Changelog viewer with search, time/user filters, and bulk delete |

### Contact form: additional fields

The Contact page editor (`ContactPage.jsx`) supports a dynamic **Additional Fields** section. Editors can add custom text fields (e.g. "Industry", "Country") that appear in the live contact form between the Email and Message fields. Each field has a label, placeholder, and optional required flag. The additional fields are stored as an array in `form.additionalFields` inside `contact.json` and rendered dynamically in the main site's `Contact.jsx`.

### Admin context

`cms-admin/src/context/AdminContext.jsx` provides global state to all editor components:

| Value | Type | Purpose |
|-------|------|---------|
| `token` | `string` | GitHub PAT (read from `localStorage`) |
| `saveToken(t)` | `function` | Persist a new token to `localStorage` |
| `toast(msg, type)` | `function` | Show a 3-second notification (ok / err / default) |
| `userEmail` | `string` | Signed-in Azure AD user's email address |
| `setDirty(val)` | `function` | Mark whether unsaved changes exist |
| `isDirty()` | `function` | Synchronous dirty-state check (via `useRef`) |
| `showConfirm(msg, onOk)` | `function` | Open the unsaved-changes confirmation dialog |

The context also registers a `beforeunload` handler that warns the user if they try to close or refresh the browser with unsaved changes.

### Unsaved changes guard

Every editor calls `setDirty(true/false)` whenever the form state diverges from the last-saved state (compared via `JSON.stringify`). The Dashboard sidebar and sign-out button check `isDirty()` before navigation and prompt via `showConfirm` if needed.

### Special characters bar

`SpecialCharsBar.jsx` appears above every editor and provides one-click insertion of characters that are hard to type on standard keyboards: `· — → ← … ° ×` etc. Clicking a character inserts it at the cursor position of the currently focused `<input>` or `<textarea>`.

### Activity log

`ActivityLog.jsx` reads from and writes to `cms-admin/changelog.json` in the repository (capped at 500 entries). Each entry records:
- Timestamp, user email, affected page, section, and action
- Field-by-field before/after diff for every changed field (computed by `logChange.js`)

For array fields, the diff uses a stable key (preferring `label` over `id` for display) so entries show human-readable names like `added "Industry"` rather than internal IDs.

The log UI supports filtering by user, time period, and action type, plus full-text search and bulk deletion.

### CMS admin components

```
cms-admin/src/components/
├── Pagination.jsx            # Shared pagination control (used by BlogPage)
└── SpecialCharsBar.jsx       # Special character insertion toolbar

cms-admin/src/utils/
└── logChange.js              # Computes a field-by-field diff and appends to the activity log

cms-admin/src/github/
└── githubApi.js              # Full GitHub API wrapper for CMS operations (see below)
```

---

## Content System

### Product catalog

Products are the most complex content type. Data comes from two sources:

| Source | Owner | Format | Purpose |
|--------|-------|--------|---------|
| `src/content/products/*.json` | CMS (auto-synced) | One JSON per product | Display data: name, description, images, specs, categories |
| `src/data/productVariants.js` | Developers | JS object keyed by product ID | Free-form variant specs not tracked in the upstream selector |
| `src/data/partDatasheets.js` | Developers | JS object keyed by part number | Per-part-number datasheet PDF URLs |

The `scripts/generate-products.mjs` script merges these sources at build time into four generated files in `src/data/`. These files are committed so Vite can import them statically at dev/build time.

Products are synced automatically from the upstream **INVENDIS-ProductSelector** repository via the `sync-products.yml` GitHub Actions workflow. The ProductSelector repo dispatches a `repository_dispatch` event on every push, which triggers the sync.

### Blog posts

Blog posts live in `public/content/blog/`. Each post is a JSON file with a `body` field containing markdown. The blog index (`_index.json`) holds the slug, title, date, and tags for every post and is used for the listing page and sitemap generation.

Posts are rendered client-side using **react-markdown** + **remark-gfm** (tables, strikethrough, task lists). The `BlogPage.jsx` CMS editor can create, edit, and delete posts directly via the GitHub API.

### Page content

All CMS-managed page copy lives in `public/content/pages/*.json` on the `main` branch. The `useContent` hook fetches these files at runtime — no auth required, since the repo is public. Fetched content is cached in `sessionStorage` to avoid redundant network requests within the same session.

`siteSettings.json` (`public/content/siteSettings.json`) holds global configuration: navigation links, footer link groups, logo paths, contact details, and WhatsApp settings. Both the Navbar and Footer load this file at runtime, so nav changes in the CMS are live immediately.

---

## GitHub API Layer

There are two separate GitHub API wrappers:

### `src/utils/githubApi.js` (main site)

Used by the main site for unauthenticated content reads. Reads always target the `main` branch.

| Export | Description |
|--------|-------------|
| `getToken() / setToken() / clearToken()` | Session token management |
| `verifyAccess()` | Test token against repo API |
| `listDir(path)` | List files in a directory |
| `getFile(path)` | Fetch and decode a text file + its SHA |
| `getFileBase64(path)` | Fetch a binary file as raw base64 + SHA |
| `putTextFile(path, text, message, sha?)` | Create or update a text file |
| `putBinaryFile(path, base64, message, sha?)` | Create or update a binary file |
| `fileToBase64(file)` | Convert a browser File object to bare base64 |
| `deployWorkflowUrl()` | Returns the URL of the deploy GitHub Action |

### `cms-admin/src/github/githubApi.js` (CMS admin)

Used by the CMS admin for all content operations. All functions require an explicit `token` parameter. Each page save writes to **both** `main` and `gh-pages` branches simultaneously — `main` with `[skip ci]` to keep source in sync without triggering a rebuild, and `gh-pages` directly so the live site updates in seconds.

| Export | Description |
|--------|-------------|
| `testConnection(token)` | Validate a GitHub PAT |
| `readFile(path, token)` | Read text file from `main` branch |
| `writeFile(path, content, msg, sha, token)` | Write text file to `main` branch |
| `readFileDirect(path, token)` | Read text file from `gh-pages` branch |
| `writeFileDirect(path, content, msg, sha, token)` | Write text file to `gh-pages` branch |
| `writeFileRaw(path, base64, msg, sha, token)` | Write binary file to `main` branch |
| `writeFileRawDirect(path, base64, msg, sha, token)` | Write binary file to `gh-pages` branch |
| `deleteFile(path, sha, msg, token)` | Delete file from `main` branch |
| `deleteFileDirect(path, sha, msg, token)` | Delete file from `gh-pages` branch |
| `readChangelog(token)` | Read `cms-admin/changelog.json` |
| `appendToChangelog(entry, token)` | Prepend an entry and save (max 500 entries) |
| `writeChangelog(entries, token)` | Overwrite the entire changelog |

---

## Build Scripts

All scripts are ES modules in `scripts/` and run via npm lifecycle hooks.

### `generate-products.mjs`

Regenerates the four generated data files in `src/data/` by merging CMS product JSON with developer-maintained variant and datasheet data. Runs automatically on `predev`, `prebuild`, and `pretest`.

Output files:
- `src/data/products.js` — full catalog
- `src/data/productImages.js` — image URL map
- `src/data/productDatasheets.js` — datasheet URL map
- `src/data/productUseCases.js` — use-case descriptions

### `generate-sitemap.mjs`

Regenerates `public/sitemap.xml`. Includes all static routes, all product pages (derived from `src/content/products/`), and all blog posts (derived from `public/content/blog/_index.json`). The canonical domain is set via the `SITEMAP_URL` environment variable.

### `convert-to-webp.mjs`

Converts all PNG/JPEG images in `public/` to WebP format using Sharp (800px max width, 85% quality). Saves the WebP alongside the original. Run manually: `npm run convert-images`.

### `sync-from-ps.mjs`

Pulls the product catalog from the upstream [INVENDIS-ProductSelector](https://github.com/ananthr99/INVENDIS-ProductSelector) repository and writes each product to `src/content/products/{id}.json`, normalising fields (port counts, WiFi versions, boolean strings). Triggered exclusively by GitHub Actions — not run locally.

---

## GitHub Actions Workflows

### `ci.yml` — Code quality

**Trigger:** Pull requests to `main`

Runs ESLint and `npm audit --audit-level=high`. Blocks merge if either check fails.

### `deploy.yml` — Build and deploy

**Trigger:** Push to `main` OR manual `workflow_dispatch`

1. Install + build the main site with `VITE_BASE=/INVENDIS-Technologies/`
2. Install + build `cms-admin/`
3. Copy `cms-admin/dist/` into `dist/cms-admin/`
4. Deploy the combined `dist/` to GitHub Pages via `peaceiris/actions-gh-pages`

### `sync-products.yml` — Product sync

**Trigger:** `repository_dispatch` event with type `product-sync` (sent by INVENDIS-ProductSelector on every push) OR manual `workflow_dispatch`

1. Runs `scripts/sync-from-ps.mjs` to fetch updated product data
2. Commits any changed JSON files to `main` with message `chore: sync products from Product Selector`
3. If any files changed, triggers `deploy.yml` to rebuild the site

---

## Environment Variables

### Main site (`/`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_BASE` | `/` | Base path for Vite router and asset URLs. Set to `/INVENDIS-Technologies/` in production. |
| `VITE_SITE_URL` | `https://invendis.com` | Canonical site URL for SEO meta and sitemap generation |
| `VITE_GA_ID` | _(unset)_ | Google Analytics 4 measurement ID (e.g. `G-XXXXXX`). Analytics are disabled if unset. |
| `VITE_SENTRY_DSN` | _(unset)_ | Sentry DSN for error tracking via `@sentry/react`. Sentry is disabled if unset. |

### Build scripts

| Variable | Default | Description |
|----------|---------|-------------|
| `SITEMAP_URL` | _(see script)_ | Override canonical domain for `generate-sitemap.mjs` |

### CMS admin (`cms-admin/`)

The CMS admin has no build-time environment variables. All runtime configuration (GitHub PAT, Azure AD settings) is either hardcoded in `msalConfig.js` or entered by the user at runtime via the Setup page.

---

## Local Development

### Prerequisites

- Node.js 20+
- npm

### Main site

```bash
npm install
npm run dev
```

The `predev` hook runs `generate-products.mjs` automatically before starting. The dev server starts at `http://localhost:5173`.

### CMS admin

```bash
cd cms-admin
npm install
npm run dev
```

The CMS admin dev server starts at `http://localhost:5174`. It requires:
1. A valid Azure AD account configured in `cms-admin/src/auth/msalConfig.js`
2. A GitHub PAT entered via the Setup page after signing in

### Running tests

```bash
npm test
```

Runs Vitest. The main test suite validates the integrity of the generated product catalog data.

---

## Building & Deploying

### Production build (combined)

The `deploy.yml` workflow handles the combined build automatically on every push to `main`. To reproduce locally:

```bash
# Main site
npm install
VITE_BASE=/INVENDIS-Technologies/ npm run build

# CMS admin
cd cms-admin
npm install
npm run build
cd ..

# Combine
cp -r cms-admin/dist dist/cms-admin
```

The resulting `dist/` folder contains both apps:
- `dist/` — main site
- `dist/cms-admin/` — CMS admin panel

### Deployment target

The site is deployed to **GitHub Pages** from the `gh-pages` branch at:

```
https://ananthr99.github.io/INVENDIS-Technologies/
```

The CMS admin is accessible at `/INVENDIS-Technologies/cms-admin/`.

### Content-only changes (no rebuild needed)

Any change made through the CMS admin writes directly to the `gh-pages` branch and is visible on the live site immediately — no build is triggered. A rebuild is only needed for changes to:

- React component source code
- Static assets in `public/`
- npm dependencies
- Tailwind configuration
- Generated data files (`src/data/`)

### Regenerating generated files

If product JSON files are added or changed outside of the automated CMS sync:

```bash
npm run generate-products  # regenerate src/data/products.js etc.
npm run generate-sitemap   # regenerate public/sitemap.xml
```
