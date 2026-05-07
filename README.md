# INVENDIS Technologies — Corporate Website

A full-featured, responsive B2B corporate website for **INVENDIS Technologies**, an Industrial IoT (IIoT) company specializing in telecom infrastructure monitoring, smart energy management, edge computing, and networking solutions. Built with React + Vite + Tailwind CSS.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Features](#pages--features)
- [Components](#components)
- [Data Layer](#data-layer)
- [Utilities](#utilities)
- [Public Assets](#public-assets)
- [Brand & Design System](#brand--design-system)
- [Getting Started](#getting-started)
- [Scripts](#scripts)

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | React | 19.2.5 |
| Build Tool | Vite | 8.0.10 |
| Routing | React Router DOM | 7.15.0 |
| Styling | Tailwind CSS | 3.4.19 |
| Icons | Lucide React | 1.14.0 |
| Map Visualization | D3-Geo + TopoJSON Client | 3.1.1 / 3.1.0 |
| CSS Processing | PostCSS + Autoprefixer | 8.5.14 / 10.5.0 |
| Linting | ESLint (React hooks + refresh plugins) | — |

**Fonts (Google Fonts, preloaded):**
- **Sora** — Display headings
- **DM Sans** — Body text

---

## Project Structure

```
INVENDIS-Website/
└── invendis-website/
    ├── public/
    │   ├── favicon.svg
    │   ├── icons.svg
    │   ├── invendis_logo.png
    │   ├── world-110m.json           # TopoJSON world map for Contact page
    │   └── products/
    │       ├── images/               # 50+ product images (.png/.jpg)
    │       └── datasheets/           # 30+ product datasheet PDFs
    ├── src/
    │   ├── assets/                   # Logo and brand images
    │   │   ├── invendis_logo.png
    │   │   ├── silbo_logo.png
    │   │   ├── MakeInIndia.png
    │   │   └── hero.png
    │   ├── components/
    │   │   ├── home/                 # Hero, ClientsBar, WhatWeDo, StatsRow, Testimonials
    │   │   ├── layout/               # Navbar, Footer
    │   │   ├── products/             # ProductCard, ProductGrid, ProductList, CategoryTabs,
    │   │   │                         # FilterBar, Pagination, ProductModal,
    │   │   │                         # CompareBar, CompareModal, CompareTray
    │   │   └── shared/               # CTABanner
    │   ├── data/                     # Static data files (products, images, use cases, etc.)
    │   ├── pages/                    # One file per route
    │   ├── utils/                    # Helper functions
    │   ├── App.jsx                   # Router setup + layout shell
    │   ├── main.jsx                  # React entry point
    │   └── index.css                 # Global styles + Tailwind directives
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## Pages & Features

### `/` — Home

The landing page designed to communicate INVENDIS's value proposition at a glance.

- **Hero Section** — Gradient background (blue→red) with grid overlay and radial glow. Includes headline, description, two CTA buttons, a 3-stat grid (150K+ sites, 54 countries, 180+ team), and right-side info cards (Hardware / Software / Key Clients) visible on desktop.
- **Clients Bar** — Horizontal strip of major client logos.
- **What We Do** — 6 feature cards showcasing core capabilities: Telecom Tower O&M, Solar Monitoring, Energy Meters, SILBO Networking, PizGloria RMS, and OEM/ODM Services.
- **Stats Row** — 4 key metrics: 17+ Years, 26 Countries, 150K+ Telecom Sites, 4 ISO Certifications.
- **Testimonials** — 3 customer quotes from ATC India VP, Ericsson Director, and IGT Myanmar CTO.
- **CTA Banner** — Gradient conversion banner linking to Contact.

---

### `/sectors` — Sectors

Showcases the 5 industry verticals INVENDIS serves.

- **Telecom** (featured) — Highlighted as the primary domain.
- **Solar** — Renewable energy monitoring.
- **Smart Energy** — Energy management and analytics.
- **Edge Compute** — Edge computing infrastructure.
- **ESG & Sustainability** — Environmental and governance reporting.
- **Global Reach Section** — Lists all 54+ countries where INVENDIS has deployments.

---

### `/products` — Products

Overview of the full product portfolio, divided into three sections.

- **Invendis Hardware** — 6 flagship devices (IIoT gateways, controllers, meters).
- **SILBO Networking** — 8 industrial networking products.
- **Software Platforms** — 6 cloud/on-premise software solutions.
- **Design Partners Section** — Highlights OEM/ODM partnerships.
- **Link to Product Selector** — CTA directing users to the advanced interactive browser.

---

### `/products/product-selector` — Product Selector

The most feature-rich page — a fully interactive product browsing and comparison tool.

**Search & Filter:**
- Full-text keyword search across product name, description, category, and CPU.
- **5 independent dropdown filters (AND logic):**
  - Cellular connectivity: 5G / 4G / None
  - Wi-Fi: Wi-Fi 6 / Wi-Fi 5 / Wi-Fi 2.4 GHz / None
  - Ethernet Ports: 1–2 / 3–5 / 6–8 / 9+
  - RS485 Serial: Yes / No
  - RS232 Serial: Yes / No
- **Category tabs:** All / Router / Gateway / Switch / Energy Meter / Other — with live product counts.
- Result count display updates in real time.
- Filters and pagination reset automatically when search or filters change.

**Product Cards:**
- Product image, category badge (color-coded), name, description.
- Specification tags: Cellular generation, Wi-Fi, RS485/232 presence, port count.
- Use case tags (2–5 per product).
- "View Details" button opening the product modal.
- Checkbox to add to comparison (up to 3 products).

**Pagination:**
- 12 products per page with Previous / Next / page number controls.

**Product Detail Modal:**
- Image carousel (multiple images per product).
- Full specifications table.
- Use cases list.
- Datasheet download buttons (per-variant PDFs).
- Add to Compare toggle.

**Product Comparison:**
- Select up to 3 products simultaneously.
- Sticky floating **Compare Bar** shows selected product names with individual remove buttons and a Compare CTA.
- **Comparison Modal** — Full-screen side-by-side table with 15 specification rows:
  - Category, CPU, RAM, Cellular, Wi-Fi, Ethernet Ports, Power, RS485, RS232, IP Rating, Enclosure, Dimensions, Weight, Operating Temperature, OS.
- **Differing values are highlighted in amber/yellow** for quick identification.

---

### `/case-studies` — Case Studies

Demonstrates real-world deployments and technical resources.

- **6 Case Study Cards** — Each has a gradient header (blue, mixed, or red), a KPI highlight (result number + label), customer context, and a description.
- **6 White Papers / Technical Resources** — Downloadable or email-requestable technical documents covering integration guides, protocol specs, and deployment reports.
- Email request links use `mailto:` with pre-filled subject and body.

---

### `/company` — Company

Full company profile and credibility page.

- **Mission / Vision / Tagline** — 3 cards with icons and descriptions.
- **Core Values** — 4 values with icons.
- **Company Timeline** — 8-point vertical timeline spanning 2007–2025, covering founding, product launches, certifications, and milestones.
- **Facilities** — Headquarters (Bengaluru), Factory, and R&D Center details.
- **ISO Certifications** — ISO 9001, 14001, 45001, and 27001.
- **Leadership Team** — 6 team members with name, role, and avatar (initials + gradient fallback when no photo).

---

### `/contact` — Contact

Lead generation and location page.

- **Contact Form** — Fields: Name, Company, Email, Message. On submit, opens a pre-filled `mailto:` link with URL-encoded subject and body.
- **Contact Info Cards** — 4 cards with icons for: Office Address, Phone, Email, Website.
- **Quick Facts Strip** — Key company stats at a glance.
- **Interactive World Map** — Built with D3-Geo (Natural Earth projection) and TopoJSON:
  - India (HQ location) highlighted in blue.
  - 54+ served countries highlighted in red.
  - All other countries in neutral gray.
  - Interactive legend with counts.

---

## Components

### Layout

| Component | Purpose |
|---|---|
| `Navbar` | Fixed top navigation. Invendis logo, Make in India badge, nav links (desktop), hamburger menu (mobile), SILBO sub-brand logo. |
| `Footer` | Brand column with logos, 3 link groups (Products, Sectors, Company). |

### Home

| Component | Purpose |
|---|---|
| `Hero` | Gradient hero with headline, CTAs, stats grid, and desktop info cards. |
| `ClientsBar` | Horizontal client logo strip. |
| `WhatWeDo` | 6 capability feature cards with icons and descriptions. |
| `StatsRow` | 4 company-wide metrics display. |
| `Testimonials` | 3 customer quote cards with name, role, and initials. |

### Products

| Component | Purpose |
|---|---|
| `CategoryTabs` | Filter tabs (All / Router / Gateway / Switch / Energy Meter / Other) with live counts. |
| `FilterBar` | Search bar + 4 dropdown filters (Cellular, Wi-Fi, Ports, Serial). Shows result count. |
| `ProductCard` | Card view: image, category badge, name, description, spec tags, use cases, compare checkbox. |
| `ProductGrid` | Responsive grid wrapper for product cards. |
| `ProductList` | List view wrapper. |
| `ProductListRow` | Single row in list view. |
| `Pagination` | Previous / Next / page number controls. |
| `ProductModal` | Full product detail: image carousel, specs, use cases, datasheets, compare toggle. |
| `CompareBar` | Sticky floating bar showing up to 3 selected products with remove buttons and Compare CTA. |
| `CompareModal` | Full-screen side-by-side spec comparison table; differing values highlighted in amber. |
| `CompareTray` | Tray version of compare selection (mobile-friendly). |

### Shared

| Component | Purpose |
|---|---|
| `CTABanner` | Blue→red gradient conversion banner with heading, description, primary + secondary CTA buttons. Used on multiple pages. |

---

## Data Layer

All product and content data lives in `src/data/` as plain JS files, making content updates straightforward without touching component code.

| File | Contents |
|---|---|
| `products.js` | 50+ product objects. Each has: `id`, `name`, `category`, `CPU`, `RAM`, `storage`, `cellular_gen` (5G/4G/none), `WiFi`, `RS485`/`RS232` booleans, `ports`, `IP_rating`, `power`, `OS`, `description`, `housing`, `dimensions`, `weight`, `operating_temp`, and `variants` with part numbers. |
| `productImages.js` | Maps product IDs to arrays of image paths in `public/products/images/`. Supports multiple images per product for the carousel. |
| `productUseCases.js` | Maps product IDs to arrays of use case tag strings (2–5 per product). |
| `productDatasheets.js` | Maps product IDs and variant part numbers to PDF paths in `public/products/datasheets/`. |
| `stats.js` | 4 stat objects: `value`, `accent` color, `label`. Example: `{ value: "150K+", accent: "blue", label: "Telecom Sites Monitored" }`. |
| `testimonials.js` | 3 testimonial objects: `initials`, `name`, `role`, `quote`. |
| `features.js` | 6 feature objects: `icon` (Lucide component), `accentColor`, `title`, `description`. |
| `clients.js` | Client company data for the Clients Bar. |

---

## Utilities

**`src/utils/productHelpers.js`**

| Export | Purpose |
|---|---|
| `CATS` | Array of category names: `['All', 'Router', 'Gateway', 'Switch', 'Energy Meter', 'Other']` |
| `catColors` | Maps each category to Tailwind badge color classes (blue for Router, violet for Gateway, emerald for Switch, amber for Energy Meter, gray for Other). |
| `wifiLabel(w)` | Converts internal WiFi codes to display labels. `WiFi6` → `'Wi-Fi 6'`, `WiFi5` → `'Wi-Fi 5'`, `WiFi24` → `'Wi-Fi 2.4 GHz'`, `none` → `'—'`. |
| `downloadFile(url)` | Client-side file download with fallback for CORS-restricted environments. |

---

## Public Assets

```
public/
├── favicon.svg
├── icons.svg                       # SVG icon sprite
├── invendis_logo.png
├── world-110m.json                 # TopoJSON world map (~107 KB) used on Contact page
└── products/
    ├── images/                     # ~50 product images
    │   ├── intelx6425.png
    │   ├── isense-violet.png       # iSense RMS Controller
    │   ├── inv-ce-xx.png / inv-cd-xx-*.png
    │   ├── rts-xx-*.png, rt-xx.png, ro-xx.png, rv-xx.png, ru60.png
    │   ├── xa-82-2.png, xb-82-2.png, xc-80-1.png, xd-50-1.png, xf-100-1.png, xg-82-2l.png
    │   ├── "AC Meter-1.png", "DC Meter-1.png", "Multi Function Meter.png", etc.
    │   └── ...
    └── datasheets/                 # 30+ product datasheets
        ├── ET1641 DC Meter.pdf
        ├── ET4602 AC Meter.pdf
        ├── IA40-C.pdf, IA44-A.pdf, IA44-B.pdf, IA44-C.pdf
        ├── IAB04-C.pdf, IAB44-B.pdf, IAB44-C.pdf
        ├── IAC04-A.pdf, IAC04-C.pdf, IAC44-A.pdf, IAC44-C.pdf
        ├── IAF04-C1.pdf, IAF44-C1.pdf
        ├── ID54.pdf, ID54-B.pdf, ID55.pdf, ID55-B.pdf
        ├── IDB54.pdf, IDB55.pdf
        ├── IDF04.pdf, IDF05.pdf, IDF44.pdf, IDF45.pdf, IDF54.pdf, IDF55.pdf
        ├── IE44A.pdf, IE44A-EX1.pdf, IE44C.pdf
        ├── INV 4640 MFM.pdf
        ├── INV-CD-N350_Datasheet.pdf
        ├── Intel X6425 Based Industrial PC.pdf
        ├── Intel X7425E Alder Lake 6 port SDWAN Box.pdf
        ├── Intel X7425E SDWAN Box.pdf
        ├── Isense Blue Plus Pro.pdf, Isense Green Plus Pro.pdf, Isense Violet Plus Pro.pdf
        ├── MC-1.pdf, Mini UPS_Metal Enclosure_Datasheet 1.pdf
        ├── ODU-MT7621.pdf
        ├── PC310.pdf, PC311.pdf, PC312.pdf, PC313.pdf
        ├── RD04-A.pdf, RD04-B.pdf, RD04-C.pdf, RD44-B.pdf, RD44-C.pdf, RD44.pdf
        ├── RDS00.pdf, RE04.pdf, RE44.pdf
        ├── RFN44-A.pdf, RFN44-B.pdf, RFN44-C.pdf
        ├── RI44.pdf, RN50.pdf
        ├── RO64-1.pdf, RO64-2.pdf, RO65-1.pdf, RO65-2.pdf, RO65.pdf
        ├── RT00.pdf, RT04-1.pdf, RT04-2.pdf, RT05-1.pdf, RT05-2.pdf, RT60.pdf
        ├── RT64-1.pdf, RT64-2.pdf, RT65-1.pdf, RT65-2.pdf
        ├── RTS00-6.pdf, RTS04-1.pdf, RTS04-2.pdf, RTS05-1.pdf, RTS05-2.pdf
        ├── RTS60.pdf, RTS64-2.pdf, RTS65-1.pdf, RTS65-2.pdf
        ├── RU60.pdf, RV00.pdf, RV04-1.pdf, RV04-2.pdf, RV50.pdf, RV54-1.pdf, RV54-2.pdf
        ├── XA-82-2.pdf, XB-82-2.pdf, XC-80-1.pdf, XD-50-1.pdf, XF-100-1.pdf
        └── XG-82-2L Updated.pdf
```

---

## Brand & Design System

**Colors (defined in `tailwind.config.js`):**

| Token | Hex | Usage |
|---|---|---|
| `brand-navy` | `#05059b` | Primary brand blue, headings, CTAs |
| `brand-red` | `#ff5050` | Accent red, highlights, badges |
| `brand-dark` | `#0a0a1a` | Dark backgrounds |
| `brand-light` | `#f7f8fc` | Light section backgrounds |
| `brand-text` | `#1a1a2e` | Body text |
| `brand-muted` | `#6b7280` | Secondary/muted text |

**Category Badge Colors:**

| Category | Color |
|---|---|
| Router | Blue |
| Gateway | Violet |
| Switch | Emerald |
| Energy Meter | Amber |
| Other | Gray |

**Design Patterns Used:**
- Gradient backgrounds (navy → red) for hero and CTA sections.
- CSS grid overlay and radial glow effects on hero.
- Hover lift animations (`-translate-y-1`, box shadows).
- Smooth transitions throughout.
- Sticky navbar (`z-50`) with `pt-20` page offset.
- Semantic HTML with accessible labels and alt text.

---

## Getting Started

**Prerequisites:** Node.js 18+ and npm.

```bash
# Clone the repository
git clone https://github.com/ananthr99/INVENDIS-Technologies.git
cd INVENDIS-Technologies/invendis-website

# Install dependencies
npm install

# Start development server
npm run dev
```

The dev server runs at `http://localhost:5173` by default.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint across all source files |

---

## Key Numbers

| Metric | Value |
|---|---|
| Pages / Routes | 7 |
| React Components | 20+ |
| Products in Database | 50+ |
| Product Datasheets | 30+ |
| Countries Served | 54+ |
| Company Founded | 2007 |
| Telecom Sites Monitored | 150,000+ |
| ISO Certifications | 4 (9001, 14001, 45001, 27001) |
| Team Size | 180+ |

---

## About INVENDIS Technologies

INVENDIS Technologies (est. 2007, Bengaluru, India) is an IIoT product company delivering end-to-end solutions for telecom infrastructure O&M, solar energy monitoring, smart energy metering, edge computing, and industrial networking. Products are deployed across 54+ countries and 150,000+ telecom sites. The company holds ISO 9001, 14001, 45001, and 27001 certifications and manufactures in India under the Make in India initiative.
