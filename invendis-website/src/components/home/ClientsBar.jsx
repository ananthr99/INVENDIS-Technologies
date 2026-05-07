import clients from '../../data/clients'

export default function ClientsBar() {
  return (
    <section className="bg-brand-light border-y border-brand-blue/8 py-10">
      <div className="px-8 lg:px-16">

        <p className="text-center text-xs font-semibold uppercase tracking-[2px] text-brand-muted mb-8">
          Trusted by Global Industry Leaders
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
          {clients.map((name) => (
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