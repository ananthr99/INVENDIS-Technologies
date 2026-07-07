// ─────────────────────────────────────────────────────────────────
// Style / accent registry
// ─────────────────────────────────────────────────────────────────
// Content files reference a named accent, e.g. "accent": "blue" or
// "iconBg": "green". This file is the ONLY place that turns those
// names into actual brand gradients / hex values.
//
// This exists so marketing can only ever pick from a locked set of
// on-brand colours — never paste in arbitrary CSS that could break
// the Invendis / SILBO visual identity.
//
// To add a new named accent: add one line to gradientMap (and
// solidMap if it needs a flat background too).
// ─────────────────────────────────────────────────────────────────

export const gradientMap = {
  blue:   'linear-gradient(135deg, #05059b, #2929c8)',
  red:    'linear-gradient(135deg, #cc2020, #ff5050)',
  green:  'linear-gradient(135deg, #059669, #34d399)',
  purple: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
  amber:  'linear-gradient(135deg, #f59e0b, #fbbf24)',
  navy:   'linear-gradient(135deg, #02026b 0%, #05059b 60%, #1a1aff 100%)',
  crimson:'linear-gradient(135deg, #8a0000 0%, #cc2020 50%, #ff5050 100%)',
  hero:   'linear-gradient(150deg, #05059b 0%, #1a1a8a 30%, #2a0a7a 55%, #ff5050 100%)',
  cta:    'linear-gradient(135deg, #05059b 0%, #2929c8 60%, #ff5050 100%)',
  ctaRed: 'linear-gradient(135deg, #8a0000 0%, #cc2020 60%, #ff5050 100%)',
}

export const cardHeaderMap = {
  blue: 'linear-gradient(135deg, #05059b 0%, #2929c8 100%)',
  mix:  'linear-gradient(135deg, #05059b 0%, #cc2020 100%)',
  red:  'linear-gradient(135deg, #8a0000 0%, #ff5050 100%)',
}

export function getGradient(key) {
  return gradientMap[key] || gradientMap.blue
}

export function getCardHeader(key) {
  return cardHeaderMap[key] || cardHeaderMap.blue
}
