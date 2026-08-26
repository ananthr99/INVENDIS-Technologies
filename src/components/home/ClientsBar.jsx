import { useContent } from '../../hooks/useContent'

export default function ClientsBar() {
    const { data: content, loading } = useContent('pages/home.json', { withLoading: true })
  if (loading) return (
    <section className="bg-brand-light border-y border-brand-blue/8 py-10">
      <div className="px-8 lg:px-16">
        <div className="h-3 w-40 bg-brand-blue/10 rounded animate-pulse mx-auto mb-8" />
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 w-20 bg-brand-blue/10 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  )
  const { clientsBar } = content

  return (
    <section className="bg-brand-light border-y border-brand-blue/8 py-10">
      <div className="px-8 lg:px-16">

        <p className="text-center text-xs font-semibold uppercase tracking-[2px] text-brand-muted mb-8">
          {clientsBar.heading}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
          {clientsBar.clients.map((name) => (
            <span
              key={name}
              className="font-sora font-bold text-sm tracking-wide text-brand-muted/60 hover:text-brand-blue transition-colors duration-200 cursor-default"
            >
              {name.toUpperCase()}
            </span>
          ))}
        </div>

      </div>
    </section>
  )
}
