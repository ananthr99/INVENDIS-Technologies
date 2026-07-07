# Editing Website Content

All page copy now lives in `src/content/` as plain JSON files — one file per page,
plus `siteSettings.json` for things shared across every page (nav menu, footer,
logos, contact details).

| File | Controls |
|---|---|
| `src/content/siteSettings.json` | Nav menu, footer links, logos, phone/email/address |
| `src/content/pages/home.json` | Hero, "What We Do" cards, stats, testimonials, clients bar |
| `src/content/pages/company.json` | About page: mission/vision, values, history timeline, team, facilities |
| `src/content/pages/sectors.json` | Sector cards, regions served |
| `src/content/pages/products.json` | Product page marketing copy + category cards |
| `src/content/pages/caseStudies.json` | Case studies + white papers list |
| `src/content/pages/contact.json` | Contact page copy, contact form labels |
| `src/content/servedCountries.json` | Countries shown on the world map (needs a rough map coordinate) |

**The full technical product catalog** (`src/data/products.js` and friends) is
intentionally kept separate — it's 1,200+ lines of detailed specs per SKU, and
should stay a developer-maintained file for now rather than something edited by
hand, since one misplaced comma there can break the whole site.

## Editing today (before a CMS is added)

1. Open the relevant `.json` file in any text editor.
2. Only change the text between the quote marks (`"..."`) — never delete a
   comma, colon, or curly/square bracket.
3. Icons and colors are picked by name (e.g. `"icon": "signal"`,
   `"accent": "blue"`), not by editing code — see the allowed names in
   `src/utils/iconMap.js` and `src/utils/styleMap.js`.
4. Save, then ask your developer to run `npm run build` and redeploy — or once
   the site is on Vercel/Netlify with Git auto-deploy, just commit the change.

Even with this structure, editing raw JSON still carries some risk of a typo
breaking the build — this setup exists to make that low-risk, not risk-free.

## Why this structure, and what changes when a CMS is added

This is deliberately shaped to match how a Git-based CMS (e.g. Decap CMS or
Tina CMS — the natural fit for a static Vite site with no backend) works:
it reads and writes plain JSON/YAML files in the repo and rebuilds automatically.

When a CMS is added later:
- Each file above becomes one "page" or "collection" in the CMS admin screen.
- Marketing edits through a form UI instead of raw JSON — no text-editor risk.
- Icons/colors become dropdowns pulling from the same locked list in
  `iconMap.js` / `styleMap.js` — nothing here needs to change.
- Images already live under `public/images/...` as plain path strings, so the
  CMS media picker can swap them in directly.

In short: adding a CMS later will mean pointing it at these same files and
building one small config file — not restructuring the codebase.
