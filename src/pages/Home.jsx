import Hero from '../components/home/Hero'
import ClientsBar from '../components/home/ClientsBar'
import WhatWeDo from '../components/home/WhatWeDo'
import StatsRow from '../components/home/StatsRow'
import Testimonials from '../components/home/Testimonials'
import CTABanner from '../components/shared/CTABanner'
import PageSEO from '../components/shared/PageSEO'
import { useContent } from '../hooks/useContent'

export default function Home() {
  const { data: content } = useContent('pages/home.json', { withLoading: true })
  const ctaBanner = content?.ctaBanner

  return (
    <div>
      <PageSEO
        description="Invendis Technologies delivers end-to-end IIoT hardware, software, and managed services across 26 countries. Specialising in telecom tower monitoring, smart energy, and industrial IoT since 2007."
        path="/"
      />
      <Hero />
      <ClientsBar />
      <WhatWeDo />
      <StatsRow />
      <Testimonials />
      {ctaBanner && (
        <CTABanner
          heading={ctaBanner.heading}
          description={ctaBanner.description}
          primaryLabel={ctaBanner.primaryLabel}
          primaryTo={ctaBanner.primaryTo}
          secondaryLabel={ctaBanner.secondaryLabel}
          secondaryTo={ctaBanner.secondaryTo}
        />
      )}
    </div>
  )
}
