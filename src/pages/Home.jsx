import Hero from '../components/home/Hero'
import ClientsBar from '../components/home/ClientsBar'
import WhatWeDo from '../components/home/WhatWeDo'
import StatsRow from '../components/home/StatsRow'
import Testimonials from '../components/home/Testimonials'
import CTABanner from '../components/shared/CTABanner'
import content from '../content/pages/home.json'

export default function Home() {
  const { ctaBanner } = content

  return (
    <div>
      <Hero />
      <ClientsBar />
      <WhatWeDo />
      <StatsRow />
      <Testimonials />
      <CTABanner
        heading={ctaBanner.heading}
        description={ctaBanner.description}
        primaryLabel={ctaBanner.primaryLabel}
        primaryTo={ctaBanner.primaryTo}
        secondaryLabel={ctaBanner.secondaryLabel}
        secondaryTo={ctaBanner.secondaryTo}
      />
    </div>
  )
}
