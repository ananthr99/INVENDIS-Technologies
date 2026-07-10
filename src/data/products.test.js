import { describe, it, expect } from 'vitest'
import products from './products.js'
import { CATS } from '../utils/productHelpers.js'

const VALID_CATS = CATS.filter(c => c !== 'All')
const VALID_CELLULAR = ['5G', '4G', 'none']
const VALID_WIFI = ['WiFi6', 'WiFi5', 'WiFi24', 'none']
const REQUIRED_STRINGS = ['id', 'name', 'cat', 'cpu', 'ram', 'storage', 'desc', 'housing', 'op_temp']

describe('products data integrity', () => {
  it('has at least one product', () => {
    expect(products.length).toBeGreaterThan(0)
  })

  it('all product ids are unique', () => {
    const ids = products.map(p => p.id)
    const unique = new Set(ids)
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i)
    expect(duplicates, `Duplicate ids: ${duplicates.join(', ')}`).toHaveLength(0)
  })

  it('all product ids are non-empty strings with no spaces', () => {
    const bad = products.filter(p => !p.id || typeof p.id !== 'string' || /\s/.test(p.id))
    expect(bad.map(p => p.id), 'ids must be non-empty strings without spaces').toHaveLength(0)
  })

  it('no placeholder product names', () => {
    const bad = products.filter(p => /XXX|TBD|\?{2}/i.test(p.name))
    expect(bad.map(p => p.name), 'placeholder names found').toHaveLength(0)
  })

  for (const field of REQUIRED_STRINGS) {
    it(`all products have a non-empty "${field}"`, () => {
      const bad = products.filter(p => !p[field] || typeof p[field] !== 'string' || p[field].trim() === '')
      expect(bad.map(p => p.id), `missing or empty "${field}"`).toHaveLength(0)
    })
  }

  it('all products have a valid cat', () => {
    const bad = products.filter(p => !VALID_CATS.includes(p.cat))
    expect(bad.map(p => `${p.id} (${p.cat})`), `invalid cat — must be one of: ${VALID_CATS.join(', ')}`).toHaveLength(0)
  })

  it('all products have a valid cellular_gen', () => {
    const bad = products.filter(p => !VALID_CELLULAR.includes(p.cellular_gen))
    expect(bad.map(p => `${p.id} (${p.cellular_gen})`), `invalid cellular_gen — must be one of: ${VALID_CELLULAR.join(', ')}`).toHaveLength(0)
  })

  it('all products have a valid wifi', () => {
    const bad = products.filter(p => !VALID_WIFI.includes(p.wifi))
    expect(bad.map(p => `${p.id} (${p.wifi})`), `invalid wifi — must be one of: ${VALID_WIFI.join(', ')}`).toHaveLength(0)
  })

  it('rs485 and rs232 are booleans', () => {
    const bad = products.filter(p => typeof p.rs485 !== 'boolean' || typeof p.rs232 !== 'boolean')
    expect(bad.map(p => p.id), 'rs485/rs232 must be boolean').toHaveLength(0)
  })

  it('ports is a non-negative integer', () => {
    const bad = products.filter(p => !Number.isInteger(p.ports) || p.ports < 0)
    expect(bad.map(p => `${p.id} (ports=${p.ports})`), 'ports must be a non-negative integer').toHaveLength(0)
  })

  it('variants is null or an object with headers and rows arrays', () => {
    const bad = products.filter(p => {
      if (p.variants === null) return false
      if (typeof p.variants !== 'object') return true
      if (!Array.isArray(p.variants.headers) || !Array.isArray(p.variants.rows)) return true
      return false
    })
    expect(bad.map(p => p.id), 'variants must be null or { headers[], rows[] }').toHaveLength(0)
  })
})
