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
├── public/                   # Static assets for main site
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
CMS writes JSON to main branch via GitHub Contents API (instant)
        ↓
Main site fetches JSON at runtime (no build needed — visible immediately)
        ↓
deploy.yml triggered separately for structural changes
```

The main site fetches its CMS-managed content (pages, blog posts, products) at runtime from the GitHub repository, so edits made in the CMS panel are live within seconds without triggering a rebuild.

---

## Main Site

**Tech stack:** React 19, React Router v7, Tailwind CSS 3, Framer Motion, Lucide React, Vite 8

### Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home.jsx` | Homepage with hero, stats, clients, what-we-do |
| `/sectors` | `Sectors.jsx` | Interactive world map + sector list |
| `/products` | `Products.jsx` | Full product catalog with filtering & comparison |
| `/products/product-selector` | `ProductSelector.jsx` | Guided product selector tool |
| `/products/product-selector/:id` | `ProductSelector.jsx` | Product selector pre-loaded to a specific product |
| `/case-studies` | `CaseStudies.jsx` | Customer case studies |
| `/company` | `Company.jsx` | About / team / company information |
| `/contact` | `Contact.jsx` | Contact form (opens pre-filled email via `mailto:`) |
| `/resources` | `Resources.jsx` | Blog / article listing |
| `/resources/:slug` | `ResourceDetail.jsx` | Individual blog post |
| `/careers` | `Careers.jsx` | Job openings |
| `/silbo` | `Silbo.jsx` | SILBO product page |
| `/privacy` | `Privacy.jsx` | Privacy policy |
| `/terms` | `Terms.jsx` | Terms of service |
| `*` | `NotFound.jsx` | 404 page |

### Components

```
src/components/
├── home/
│   ├── ClientsBar.jsx        # Scrolling client logo strip
│   ├── Hero.jsx              # Homepage hero section
│   ├── StatsRow.jsx          # Key stats (revenue, countries, etc.)
│   ├── Testimonials.jsx      # Customer testimonials carousel
│   └── WhatWeDo.jsx          # Services overview section
├── layout/
│   ├── Navbar.jsx            # Responsive top navigation bar
│   └── Footer.jsx            # Site-wide footer
├── products/
│   ├── CategoryTabs.jsx      # Filter tabs for product categories
│   ├── CompareBar.jsx        # Floating comparison bar (up to 3 products)
│   ├── CompareModal.jsx      # Side-by-side product comparison modal
│   ├── CompareTray.jsx       # Tray holding products to compare
│   ├── FilterBar.jsx         # Full filter panel (specs, category, brand)
│   ├── Pagination.jsx        # Products list pagination
│   ├── ProductCard.jsx       # Grid-view product card
│   ├── ProductGrid.jsx       # Responsive product grid layout
│   ├── ProductList.jsx       # Products in list-view wrapper
│   ├── ProductListRow.jsx    # Single row in list view
│   └── ProductModal.jsx      # Full product detail modal/drawer
└── shared/
    ├── Breadcrumbs.jsx       # Breadcrumb nav + schema.org markup
    ├── CTABanner.jsx         # Call-to-action section banner
    ├── CookieBanner.jsx      # Cookie consent banner
    ├── PageSEO.jsx           # Per-page <title>, meta, Open Graph tags
    └── WhatsAppButton.jsx    # Floating WhatsApp contact button
```

### Utilities

```
src/utils/
├── analytics.js              # Google Analytics 4 (fires only when VITE_GA_ID is set)
├── blog.js                   # Blog post utilities (parse frontmatter, sort by date)
├── breadcrumbSchema.js       # Generates schema.org BreadcrumbList JSON-LD
├── githubApi.js              # Thin GitHub Contents API wrapper (read + write)
├── iconMap.js                # Maps string names → Lucide icon components
├── productHelpers.js         # Product filtering, sorting, search helpers
├── siteUrl.js                # Canonical URL helpers (absoluteUrl, SITE_URL, BASE_PATH)
└── styleMap.js               # String → CSS class mappings for CMS-driven styling
```

### Hooks

```
src/hooks/
├── useCompareList.js         # Product comparison state (localStorage-persisted, max 3)
└── useContent.js             # Content fetching hook (reads JSON from GitHub at runtime)
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
└── products/                 # 57+ individual product JSON files (CMS-managed)
    ├── acmeter.json
    ├── bcpm.json
    └── ...

public/
├── content/blog/             # Blog posts (JSON with markdown body field)
│   └── _index.json           # Blog index (slugs, titles, dates, tags)
├── images/                   # Page images (hero backgrounds, section photos, logos)
├── products/                 # Product images (WebP + originals)
├── favicon.svg
├── icons.svg                 # SVG icon sprite sheet
├── invendis_logo.png
├── invendis_logo.webp
├── robots.txt
├── sitemap.xml               # Auto-generated by scripts/generate-sitemap.mjs
├── world-110m.json           # TopoJSON world map data (for Sectors page)
├── .nojekyll                 # Tells GitHub Pages not to run Jekyll
├── 404.html                  # SPA fallback for GitHub Pages 404
└── spa-redirect.js           # Client-side redirect helper for SPA routing
```

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

Fonts: **Sora** (headings) and **DM Sans** (body). Typography plugin (`@tailwindcss/typography`) is used for rendering blog markdown.

---

## CMS Admin

**Tech stack:** React 18, React Router v6, Azure AD (MSAL), Vite 6

The CMS admin is a fully self-hosted, browser-only content editor. It has no server-side component. All reads and writes go directly to GitHub via the Contents API using a personal access token entered by the user.

### Authentication

Authentication is two-layered:

1. **Azure Active Directory (MSAL)** — Controls who can access the CMS admin at all. Users must log in with a valid organizational Azure AD account. Configuration lives in `cms-admin/src/auth/msalConfig.js`.

2. **GitHub Personal Access Token (PAT)** — Required to read and write content to the repository. Set up once per browser session via the Setup page. The token is stored in `localStorage` (key: `gh_pat`) and never sent to any third party — only to `api.github.com`.

```
cms-admin/src/auth/
├── msalConfig.js             # Azure AD client ID, tenant, redirect URIs
├── AuthProvider.jsx          # MSAL PublicClientApplication + React provider
└── AuthGuard.jsx             # HOC that requires authenticated user
```

### Pages & Editors

**Dashboard** (`Dashboard.jsx`) is the shell. It renders the sidebar navigation and loads whichever editor is active. The sidebar has three collapsible sections: CONTENT, PAGES, and ADMIN.

#### Page editors (PAGES section)

Each page editor loads the current content from GitHub, lets the user edit it in structured form fields, and saves it back via the GitHub API. Every save writes to both `main` and `gh-pages` branches, and logs an entry to the activity changelog.

| Sidebar label | Component | What it edits |
|--------------|-----------|---------------|
| Contact | `ContactPage.jsx` | Contact page text, address, phone |
| Home | `HomePage.jsx` | Hero copy, stats, testimonials, clients list |
| Company | `CompanyPage.jsx` | About text, team member cards with photos |
| Sectors | `SectorsPage.jsx` | Sector definitions, icons, highlighted countries |
| Products | `ProductsPage.jsx` | Products page hero and section copy |
| SILBO | `SilboPage.jsx` | SILBO product page copy and features |
| Careers | `CareersPage.jsx` | Open roles, department descriptions |
| Case Studies | `CaseStudiesPage.jsx` | Case study cards (client, industry, summary) |

#### Content editors (CONTENT section)

| Sidebar label | Component | What it edits |
|--------------|-----------|---------------|
| Site Settings | `SiteSettings.jsx` | Global: nav links, footer links, social URLs, logos, site name |

#### Admin tools (ADMIN section)

| Sidebar label | Component | Description |
|--------------|-----------|-------------|
| Blog | `BlogPage.jsx` | Create/edit/delete blog posts; list view + full editor |
| Countries | `Countries.jsx` | World map country-level configuration |
| Setup | `Setup.jsx` | Enter and test GitHub PAT; required before any save |
| Activity Log | `ActivityLog.jsx` | Changelog viewer with search, filter, bulk delete |

### Admin context

`cms-admin/src/context/AdminContext.jsx` provides global state to all editor components:

| Value | Type | Purpose |
|-------|------|---------|
| `token` | `string` | GitHub PAT (read from `localStorage`) |
| `saveToken(t)` | `function` | Persist a new token to `localStorage` |
| `toast(msg, type)` | `function` | Show a 3-second notification (success / error / default) |
| `userEmail` | `string` | Logged-in Azure AD user's email |
| `setDirty(val)` | `function` | Mark whether any unsaved changes exist |
| `isDirty()` | `function` | Synchronous dirty-state check (reads a `useRef`) |
| `showConfirm(msg, onOk)` | `function` | Open the unsaved-changes confirmation dialog |

The context also registers a `beforeunload` handler that warns the user if they try to close or refresh the browser with unsaved changes.

### Unsaved changes guard

Every editor page calls `setDirty(true/false)` whenever the form state diverges from the last-saved state (compared via `JSON.stringify`). The Dashboard sidebar and sign-out button check `isDirty()` before navigation and prompt via `showConfirm` if needed. BlogPage additionally has its own internal "← All Posts" back button that also runs this check.

### Special characters bar

`SpecialCharsBar.jsx` appears above every editor. It provides one-click insertion of characters that are hard to type: `® © ™ – — … ° ½ ¼ ¾ µ €` etc. Clicking a character inserts it at the cursor position of the currently focused input or textarea.

### Activity log

`ActivityLog.jsx` reads from and writes to `cms-admin/changelog.json` in the repository (capped at 500 entries). Each entry records:
- Timestamp, user email, affected page, action type (added / updated / deleted)
- Field-by-field before/after values for every changed field

The log UI supports filtering by user, time period, and action type, plus full-text search and bulk deletion.

### CMS admin components

```
cms-admin/src/components/
└── SpecialCharsBar.jsx       # Special character insertion toolbar

cms-admin/src/utils/
└── logChange.js              # Formats an activity log entry from old + new data

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

The `scripts/generate-products.mjs` script merges these two sources at build time and emits four generated files into `src/data/`. These files are checked in so Vite can import them statically at dev/build time.

Products are synced from the upstream **INVENDIS-ProductSelector** repository automatically via the `sync-products.yml` GitHub Actions workflow (triggered by a `repository_dispatch` event from the ProductSelector repo on every commit).

### Blog posts

Blog posts live in `public/content/blog/`. Each post is a JSON file with a markdown `body` field. The blog index (`_index.json`) contains the slug, title, date, and tags for every post and is used for listing and sitemap generation.

The `BlogPage.jsx` CMS editor can create, edit, and delete posts directly through the GitHub API.

### Page content

Each page's CMS-managed copy lives in a JSON file on the `main` branch, typically at a path like `src/content/<page>.json` or `public/content/<page>.json`. The `useContent` hook fetches these at runtime using the GitHub Contents API (no auth required for reads — the repo is public).

---

## GitHub API Layer

There are two separate GitHub API wrappers:

### `src/utils/githubApi.js` (main site)

Used by the main site for unauthenticated reads. Reads always target the `main` branch. Authenticated writes are available but only used in edge cases (not normal browsing). Token stored in `sessionStorage`.

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

Used by the CMS admin for all content operations. All functions require an explicit `token` parameter. Supports reading and writing to both `main` and `gh-pages` branches simultaneously so the live site and source stay in sync.

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

Regenerates `public/sitemap.xml`. Includes all static routes, all product pages, and all blog posts (read from `public/content/blog/_index.json`). The canonical domain is set via the `SITEMAP_URL` environment variable.

### `convert-to-webp.mjs`

Converts all PNG/JPEG images in `public/` to WebP format using Sharp (800px max width, 85% quality). Saves alongside the original. Run manually: `npm run convert-images`.

### `sync-from-ps.mjs`

Pulls the product catalog from the upstream [INVENDIS-ProductSelector](https://github.com/ananthr99/INVENDIS-ProductSelector) repository and writes each product to `src/content/products/{id}.json`. Normalises fields (port counts, WiFi versions, boolean strings). Triggered by GitHub Actions, not run locally.

---

## GitHub Actions Workflows

### `ci.yml` — Code quality

**Trigger:** Pull requests to `main`

Runs ESLint and `npm audit --audit-level=high`. Blocks merge if either fails.

### `deploy.yml` — Build and deploy

**Trigger:** Push to `main` OR manual `workflow_dispatch`

1. `npm install` + `npm run build` for the main site (with `VITE_BASE=/INVENDIS-Technologies/`)
2. `npm install` + `npm run build` for `cms-admin/`
3. Copies `cms-admin/dist/` into `dist/cms-admin/`
4. Deploys combined `dist/` to GitHub Pages via `peaceiris/actions-gh-pages`

### `sync-products.yml` — Product sync

**Trigger:** `repository_dispatch` event with type `product-sync` (sent by INVENDIS-ProductSelector on every push) OR manual `workflow_dispatch`

1. Runs `scripts/sync-from-ps.mjs` to fetch updated product data
2. Commits any changed JSON files to `main` with message `chore: sync products from Product Selector [skip ci]`
3. If files changed, triggers `deploy.yml` to rebuild the site

---

## Environment Variables

### Main site (`/`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_BASE` | `/` | Base path for Vite router and asset URLs |
| `VITE_SITE_URL` | `https://invendis.com` | Canonical site URL for SEO meta and sitemaps |
| `VITE_GA_ID` | _(unset)_ | Google Analytics 4 measurement ID (e.g. `G-XXXXXX`). Analytics are disabled if unset. |
| `VITE_SENTRY_DSN` | _(unset)_ | Sentry DSN for error tracking. Sentry is disabled if unset. |

### Build scripts

| Variable | Default | Description |
|----------|---------|-------------|
| `SITEMAP_URL` | _(see script)_ | Override canonical domain for `generate-sitemap.mjs` |

### CMS admin (`cms-admin/`)

The CMS admin has no build-time environment variables. All runtime configuration (GitHub PAT, Azure AD settings) is either hardcoded in `msalConfig.js` or entered by the user at runtime.

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

The CMS admin dev server starts at `http://localhost:5174`. It expects:
1. A valid Azure AD account configured in `cms-admin/src/auth/msalConfig.js`
2. A GitHub PAT entered via the Setup page after logging in

### Running tests

```bash
npm test
```

Runs Vitest. The main test suite is `src/data/products.test.js`, which validates the integrity of the product catalog data.

---

## Building & Deploying

### Production build (combined)

The `deploy.yml` workflow handles the combined build automatically on every push to `main`. To build locally:

```bash
# Main site
npm install
VITE_BASE=/INVENDIS-Technologies/ npm run build

# CMS admin
cd cms-admin
npm install
npm run build

# Copy CMS admin into main site dist
cp -r cms-admin/dist ../dist/cms-admin
```

The resulting `dist/` folder contains both apps:
- `dist/` — main site
- `dist/cms-admin/` — CMS admin panel

### Deployment target

The site is deployed to **GitHub Pages** from the `gh-pages` branch. When the hosting platform is finalised, the `deploy.yml` workflow's deployment step and the `VITE_SITE_URL` / `VITE_BASE` environment variables will need to be updated accordingly.

### Content-only changes (no rebuild needed)

Any change made through the CMS admin goes directly to the GitHub repository and is visible on the live site immediately — no build is triggered. A rebuild is only needed for changes to:
- React component source code
- Static assets in `public/`
- Dependencies
- Tailwind configuration
- Generated data files (`src/data/`)

### Regenerating generated files

If product JSON files are added or changed outside of the CMS sync:

```bash
npm run generate-products  # regenerate src/data/products.js etc.
npm run generate-sitemap   # regenerate public/sitemap.xml
```
