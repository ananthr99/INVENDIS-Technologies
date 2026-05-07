import stats from '../../data/stats'

export default function StatsRow() {
  return (
    <section className="bg-brand-light py-4 border-y border-brand-blue/8">
      <div className="px-8 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-brand-blue/10">
          {stats.map(({ value, accent, label }) => (
            <div key={label} className="text-center py-12 px-6">
              <div
                className={
                  'font-sora text-5xl lg:text-6xl font-extrabold leading-none mb-3 ' +
                  (accent === 'red' ? 'text-brand-red' : 'text-brand-blue')
                }
              >
                {value}
              </div>
              <p className="text-sm text-brand-muted leading-snug max-w-[200px] mx-auto">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}