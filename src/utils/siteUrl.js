// Single source of truth for the canonical site URL and deployment base path,
// shared by PageSEO and Breadcrumbs so canonical/absolute URLs never drift
// out of sync between the two.
export const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://ananthr99.github.io/INVENDIS-Technologies'

const rawBase = import.meta.env.BASE_URL
export const BASE_PATH = rawBase === '/' ? '' : rawBase.replace(/\/$/, '')

export function absoluteUrl(path = '') {
  return `${SITE_URL}${BASE_PATH}${path}`
}
