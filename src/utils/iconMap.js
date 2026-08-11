// ─────────────────────────────────────────────────────────────────
// Icon registry
// ─────────────────────────────────────────────────────────────────
// Content files (src/content/**/*.json) reference icons by a plain
// string key, e.g. "icon": "signal". This file is the ONLY place
// that maps those strings to actual lucide-react components.
//
// Why: JSON content can't contain a React component or a JS import,
// so this indirection is what lets a future CMS (or marketing,
// editing JSON directly) safely "pick" an icon from a fixed list
// without touching any code.
//
// To add a new icon option: import it below and add one line to
// the map. Do not remove keys that are still referenced by content.
// ─────────────────────────────────────────────────────────────────
import {
  Signal, Sun, Zap, Network, LayoutDashboard, Cpu,
  Target, Eye, Lightbulb, FlaskConical, Users, ShieldCheck, Globe,
  Building2, Factory, Microscope, MapPin, Mail, Phone,
  Monitor, Power, Box, Radio, Wrench,
  ArrowLeftRight, Shield, Tv, Plug, Settings2,
  BarChart3, Smartphone, Receipt, Bell, TrendingUp, Cloud,
  FileText, Lock, Leaf, ArrowRight, Send, Menu, X,
  Battery, Droplets, Handshake, ThumbsUp,
} from 'lucide-react'

const iconMap = {
  signal: Signal,
  sun: Sun,
  zap: Zap,
  network: Network,
  dashboard: LayoutDashboard,
  cpu: Cpu,
  target: Target,
  eye: Eye,
  lightbulb: Lightbulb,
  flask: FlaskConical,
  users: Users,
  shield_check: ShieldCheck,
  globe: Globe,
  building: Building2,
  factory: Factory,
  microscope: Microscope,
  map_pin: MapPin,
  mail: Mail,
  phone: Phone,
  monitor: Monitor,
  power: Power,
  box: Box,
  radio: Radio,
  wrench: Wrench,
  arrow_left_right: ArrowLeftRight,
  shield: Shield,
  tv: Tv,
  plug: Plug,
  settings: Settings2,
  bar_chart: BarChart3,
  smartphone: Smartphone,
  receipt: Receipt,
  bell: Bell,
  trending_up: TrendingUp,
  cloud: Cloud,
  file_text: FileText,
  lock: Lock,
  leaf: Leaf,
  arrow_right: ArrowRight,
  send: Send,
  menu: Menu,
  close: X,
  battery: Battery,
  droplets: Droplets,
  handshake: Handshake,
  thumbs_up: ThumbsUp,
}

/**
 * Resolve an icon string key (from content JSON) to its component.
 * Falls back to a neutral placeholder icon if the key is unknown,
 * rather than crashing the page — so a typo in content never
 * takes down the whole site.
 */
export function getIcon(key) {
  return iconMap[key] || Box
}

export default iconMap
