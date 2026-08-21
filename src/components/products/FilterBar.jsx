import { Search } from 'lucide-react'

export default function FilterBar({ search, filters, onSearch, onFilter, view, onView }) {
  const selectCls = active =>
    `h-[38px] px-3 pr-8 text-[13px] border rounded-[6px] focus:outline-none cursor-pointer transition-colors bg-[#F7F9FC] appearance-none
     ${active
       ? 'border-[#1A6FC4] bg-[#EAF2FB] text-[#05059b] font-medium'
       : 'border-[#DDE5EF] text-[#0B1F3A]'}`

  return (
    <div className="bg-white border border-[#DDE5EF] rounded-[14px] px-5 py-[18px] mb-[22px] shadow-sm flex flex-wrap gap-[10px] items-center">
      <div className="relative flex-1 min-w-[220px]">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8DA0B8] pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search by name, model, keyword..."
          className="w-full h-[38px] pl-10 pr-3 text-[14px] border border-[#DDE5EF] rounded-[6px] focus:outline-none focus:border-[#1A6FC4] focus:shadow-[0_0_0_3px_rgba(26,111,196,0.12)] bg-[#F7F9FC] focus:bg-white placeholder:text-[#8DA0B8] text-[#0B1F3A]"
        />
      </div>

      <select value={filters.cell} onChange={e => onFilter('cell', e.target.value)} className={selectCls(filters.cell)}>
        <option value="">Any cellular</option>
        <option value="5G">5G capable</option>
        <option value="4G">4G only</option>
        <option value="none">No cellular</option>
      </select>

      <select value={filters.wifi} onChange={e => onFilter('wifi', e.target.value)} className={selectCls(filters.wifi)}>
        <option value="">Any Wi-Fi</option>
        <option value="WiFi6">Wi-Fi 6 (ax)</option>
        <option value="WiFi5">Wi-Fi 5 (ac)</option>
        <option value="WiFi24">Wi-Fi 4/2.4 GHz</option>
        <option value="none">No Wi-Fi</option>
      </select>

      <select value={filters.ports} onChange={e => onFilter('ports', e.target.value)} className={selectCls(filters.ports)}>
        <option value="">Any port count</option>
        <option value="2">1–2 ports</option>
        <option value="5">3–5 ports</option>
        <option value="8">6–8 ports</option>
        <option value="10">9+ ports</option>
      </select>

      <select value={filters.serial} onChange={e => onFilter('serial', e.target.value)} className={selectCls(filters.serial)}>
        <option value="">Any serial I/O</option>
        <option value="rs485">Has RS485</option>
        <option value="rs232">Has RS232</option>
        <option value="both">RS485 + RS232</option>
      </select>

      <div className="w-px h-6 bg-[#DDE5EF] shrink-0" />

      <div className="flex border border-[#DDE5EF] rounded-[6px] overflow-hidden shrink-0">
        <button
          onClick={() => onView('grid')}
          title="Grid view"
          className={`w-9 h-[38px] border-r border-[#DDE5EF] flex items-center justify-center transition-colors
            ${view === 'grid' ? 'bg-brand-blue text-white' : 'bg-white text-[#8DA0B8] hover:bg-gray-50'}`}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
            <rect x="1" y="1" width="5" height="5" rx="1"/>
            <rect x="9" y="1" width="5" height="5" rx="1"/>
            <rect x="1" y="9" width="5" height="5" rx="1"/>
            <rect x="9" y="9" width="5" height="5" rx="1"/>
          </svg>
        </button>
        <button
          onClick={() => onView('list')}
          title="List view"
          className={`w-9 h-[38px] flex items-center justify-center transition-colors
            ${view === 'list' ? 'bg-brand-blue text-white' : 'bg-white text-[#8DA0B8] hover:bg-gray-50'}`}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
            <rect x="1" y="2" width="13" height="2" rx="1"/>
            <rect x="1" y="6.5" width="13" height="2" rx="1"/>
            <rect x="1" y="11" width="13" height="2" rx="1"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
