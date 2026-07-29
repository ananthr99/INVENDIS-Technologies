import { absoluteUrl } from './siteUrl'

// Builds a schema.org BreadcrumbList for the given breadcrumb `items`
// (same shape as passed to the <Breadcrumbs> component), for use as one
// entry in PageSEO's `structuredData` array. Absolute URLs are required by
// the spec; the current page (the item with no `path`) is given the page's
// own canonical path via `currentPath`.
export function breadcrumbSchema(items, currentPath) {
  if (!items || items.length < 2) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: absoluteUrl(item.path || currentPath),
    })),
  }
}
