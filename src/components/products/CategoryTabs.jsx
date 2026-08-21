export default function CategoryTabs({ cats, activeCat, counts, onCat }) {
  return (
    <div className="flex flex-wrap gap-[6px] mb-5">
      {cats.map(cat => (
        <button
          key={cat}
          onClick={() => onCat(cat)}
          className={`px-[14px] py-[6px] rounded-[20px] text-[13px] font-medium transition-all border flex items-center gap-[6px]
            ${activeCat === cat
              ? 'bg-brand-blue border-brand-blue text-white'
              : 'bg-white text-[#5A6E87] border-[#DDE5EF] hover:border-[#1A6FC4] hover:text-[#1A6FC4]'
            }`}
        >
          {cat}
          <span className={`text-[11px] px-[6px] py-px rounded-[10px]
            ${activeCat === cat ? 'bg-white/20 text-white' : 'bg-[#F7F9FC] text-[#8DA0B8]'}`}>
            {counts[cat]}
          </span>
        </button>
      ))}
    </div>
  )
}
