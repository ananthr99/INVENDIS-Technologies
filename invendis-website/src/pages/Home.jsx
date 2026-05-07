import Hero from '../components/home/Hero'
import ClientsBar from '../components/home/ClientsBar'
import WhatWeDo from '../components/home/WhatWeDo'
import StatsRow from '../components/home/StatsRow'
import Testimonials from '../components/home/Testimonials'
import CTABanner from '../components/shared/CTABanner'

export default function Home() {
  return (
    <div>
      <Hero />
      <ClientsBar />
      <WhatWeDo />
      <StatsRow />
      <Testimonials />
      <CTABanner
        heading="Ready to Digitise Your Operations?"
        description="Talk to our IIoT experts and discover how Invendis can transform your infrastructure."
        primaryLabel="Get in Touch"
        primaryTo="/company"
        secondaryLabel="See All Products"
        secondaryTo="/products"
      />
    </div>
  )
}
