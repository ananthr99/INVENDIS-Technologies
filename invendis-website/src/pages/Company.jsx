import { Target, Eye, Lightbulb, FlaskConical, Users, ShieldCheck, Globe, Building2, Factory, Microscope, MapPin, Mail, Phone } from 'lucide-react'
import CtaBanner from '../components/shared/CtaBanner'

const mission = [
  {
    icon: Target,
    bg: 'bg-brand-blue',
    title: 'Our Mission',
    body: 'To enable quality products, solutions, and services in the IoT space — covering multiple verticals — with a professional team committed to innovation and customer success.',
  },
  {
    icon: Eye,
    bg: 'bg-brand-blue',
    title: 'Our Vision',
    body: 'To be the global leader in industrial IoT solutions — bridging the physical and digital worlds through intelligent hardware, software platforms, and managed services at scale.',
  },
  {
    icon: Lightbulb,
    bg: 'bg-brand-red',
    title: 'Our Tagline',
    tagline: '"Invent. Discover."',
    body: 'Every product and every deployment at Invendis begins with curiosity — and ends with a solution that genuinely transforms how our customers operate.',
  },
]

const values = [
  { icon: FlaskConical, title: 'Innovation',    body: 'Constant R&D investment and design partnerships with MediaTek, Intel, and Qualcomm.' },
  { icon: Users,        title: 'Partnership',   body: '9+ year average client relationships. We grow with our customers, not just for them.' },
  { icon: ShieldCheck,  title: 'Reliability',   body: 'ISO 9001, 14001, 45001, and 27001 certified. 24×7 remote support as standard.' },
  { icon: Globe,        title: 'Global Reach',  body: 'Operations, support, and partnerships spanning 54 countries across 4 continents.' },
]

const timeline = [
  { year: '2007',      title: 'Founded in Bangalore',              body: 'Established by a professional team to deliver quality IoT products across multiple verticals.' },
  { year: '2009',      title: 'First Telecom RMS Order',           body: 'Secured first order for 1,800 telecom sites across India — validating the core technology.' },
  { year: '2011–2014', title: 'International Expansion',           body: 'First overseas order from the Middle East, followed by Africa and Southeast Asia deployments.' },
  { year: '2016',      title: 'Solar Monitoring Launch',           body: 'Launched dedicated solar monitoring solution, expanding into the energy sector.' },
  { year: '2019–2020', title: 'Strategic Ericsson Engagement',     body: 'Deep engagement with Ericsson for bespoke telecom RMS solutions across multiple markets.' },
  { year: '2021',      title: 'Acquisition of ELTRAC Technologies', body: 'Added digital energy meters to the portfolio, strengthening the energy measurement vertical.' },
  { year: '2022',      title: 'Acquisition of RELYSYS',            body: 'Brought in Industrial Communication & Edge Computing capabilities — including SILBO.' },
  { year: '2023–2025', title: 'Expansion & New Products',          body: '5G routers, switches, tariff-grade meters, Intel-based router for US client, and a 3-year MFA signed in Saudi Arabia.' },
]

const facilities = [
  { icon: Building2, color: 'bg-brand-blue', label: 'HQ',            detail: '10,000+ sq. ft. · Bangalore, India' },
  { icon: Factory,   color: 'bg-brand-blue', label: 'Factory',       detail: '7,500 sq. ft. manufacturing floor' },
  { icon: Microscope,color: 'bg-brand-red',  label: 'R&D & Sales',   detail: '10,000 sq. ft. innovation centre' },
  { icon: Globe,     color: 'bg-brand-muted',label: 'Foreign Office', detail: 'Accra, Ghana' },
]

const certifications = ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'ISO 27001:2022']

// Add your team members here.
// Place photos in public/team/ and set photo: '/team/filename.jpg'
// Leave photo: null to show the initials fallback.
const team = [
  { name: 'Name',  role: 'Founder & CEO',          photo: null },
  { name: 'Name',  role: 'Chief Technology Officer', photo: null },
  { name: 'Name',  role: 'VP – Sales & Business Development', photo: null },
  { name: 'Name',  role: 'Head – Hardware Engineering', photo: null },
  { name: 'Name',  role: 'Head – Software & Platform', photo: null },
  { name: 'Name',  role: 'Head – Operations',       photo: null },
]

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const avatarGradients = [
  'linear-gradient(135deg, #05059b, #2929c8)',
  'linear-gradient(135deg, #cc2020, #ff5050)',
  'linear-gradient(135deg, #059669, #34d399)',
  'linear-gradient(135deg, #7c3aed, #a78bfa)',
  'linear-gradient(135deg, #05059b, #2929c8)',
  'linear-gradient(135deg, #cc2020, #ff5050)',
]

export default function Company() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section
        className="relative text-white py-24 px-8 lg:px-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #02026b 0%, #05059b 60%, #1a1aff 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-3xl">
          <p className="text-brand-red font-sora text-sm font-semibold uppercase tracking-widest mb-3">About Us</p>
          <h1 className="font-sora text-5xl font-bold mb-5 leading-tight">
            Invendis <span className="text-red-300">Technologies</span>
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed max-w-2xl">
            Founded in 2007, Invendis is an ISO-certified IIoT hardware and software manufacturer headquartered in Bangalore — serving customers in 26 countries with 17+ years of proven expertise.
          </p>
        </div>
      </section>

      {/* Mission / Vision / Tagline */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div className="text-center mb-12">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">Who We Are</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text">
            Built on <span className="text-brand-blue">Purpose & Expertise</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mission.map(({ icon: Icon, bg, title, tagline, body }) => (
            <div key={title} className="bg-brand-light rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${bg}`}>
                <Icon size={22} strokeWidth={1.75} className="text-white" />
              </div>
              <h3 className="font-sora font-bold text-xl text-brand-text mb-3">{title}</h3>
              {tagline && (
                <p className="font-sora font-bold text-xl text-brand-blue mb-3">{tagline}</p>
              )}
              <p className="text-brand-muted text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-8 lg:px-16 bg-brand-light">
        <div className="text-center mb-10">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">Our Values</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text">
            What <span className="text-brand-blue">Drives Us</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
                <Icon size={22} strokeWidth={1.75} className="text-brand-blue" />
              </div>
              <h3 className="font-sora font-bold text-brand-text mb-2">{title}</h3>
              <p className="text-brand-muted text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline + Facilities */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Timeline */}
          <div>
            <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">Our Journey</p>
            <h2 className="font-sora text-3xl font-bold text-brand-text mb-10">
              17+ Years of <span className="text-brand-blue">IIoT Innovation</span>
            </h2>
            <div className="relative">
              <div className="absolute left-[52px] top-0 bottom-0 w-px bg-brand-blue/10" />
              <div className="space-y-6">
                {timeline.map(({ year, title, body }) => (
                  <div key={year} className="flex gap-5">
                    <div className="shrink-0 w-24 text-right">
                      <span className="font-sora font-bold text-xs text-brand-blue bg-brand-blue/10 px-2 py-1 rounded-full whitespace-nowrap">
                        {year}
                      </span>
                    </div>
                    <div className="relative pt-0.5">
                      <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-brand-blue border-2 border-white shadow" />
                      <h4 className="font-sora font-semibold text-brand-text text-sm mb-1">{title}</h4>
                      <p className="text-brand-muted text-xs leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Facilities + Certs */}
          <div>
            <div className="bg-brand-light rounded-2xl p-8 border border-gray-100">
              <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">Facilities</p>
              <h3 className="font-sora font-bold text-xl text-brand-text mb-2">HQ & Operations</h3>
              <p className="text-brand-muted text-sm leading-relaxed mb-7">
                ISO & ISMS certified organisation based in Bangalore, India with operations distributed across 3 facilities.
              </p>
              <div className="space-y-4 mb-8">
                {facilities.map(({ icon: Icon, color, label, detail }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                      <Icon size={18} strokeWidth={1.75} className="text-white" />
                    </div>
                    <div className="text-sm text-brand-text">
                      <strong>{label}</strong> — {detail}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-3">Certifications</p>
              <div className="flex flex-wrap gap-2">
                {certifications.map(cert => (
                  <span key={cert} className="text-xs font-semibold px-3 py-1.5 border-2 border-brand-blue text-brand-blue rounded-lg font-sora">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Management Team */}
      <section className="py-20 px-8 lg:px-16 bg-brand-light">
        <div className="text-center mb-12">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">Leadership</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text mb-3">
            Meet the <span className="text-brand-blue">Team</span>
          </h2>
          <p className="text-brand-muted max-w-xl mx-auto">
            The people behind Invendis's 17+ years of IIoT innovation — engineers, strategists, and operators committed to delivering world-class solutions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {team.map(({ name, role, photo }, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-28 h-28 rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all">
                {photo ? (
                  <img src={photo} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white font-sora font-bold text-2xl"
                    style={{ background: avatarGradients[i % avatarGradients.length] }}
                  >
                    {initials(name)}
                  </div>
                )}
              </div>
              <h4 className="font-sora font-bold text-brand-text text-sm">{name}</h4>
              <p className="text-brand-muted text-xs mt-1 leading-snug">{role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact strip */}
      {/* <section className="py-16 px-8 lg:px-16 bg-white">
        <div className="max-w-3xl">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">Get In Touch</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text mb-8">
            Let's Build Something <span className="text-brand-blue">Together</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center shrink-0">
                <MapPin size={18} strokeWidth={1.75} className="text-white" />
              </div>
              <div>
                <h4 className="font-sora font-semibold text-brand-text text-sm mb-1">Headquarters</h4>
                <p className="text-brand-muted text-sm leading-relaxed">No 230, 1st Cross 36th Main, BCOMBCS Layout, BTM 2nd Stage, Bangalore – 560 068, India</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center shrink-0">
                <Mail size={18} strokeWidth={1.75} className="text-white" />
              </div>
              <div>
                <h4 className="font-sora font-semibold text-brand-text text-sm mb-1">Email</h4>
                <a href="mailto:sales@invendis.com" className="text-brand-blue text-sm hover:underline">sales@invendis.com</a>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center shrink-0">
                <Globe size={18} strokeWidth={1.75} className="text-white" />
              </div>
              <div>
                <h4 className="font-sora font-semibold text-brand-text text-sm mb-1">Foreign Office</h4>
                <p className="text-brand-muted text-sm">Accra, Ghana (West Africa operations)</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center shrink-0">
                <Users size={18} strokeWidth={1.75} className="text-white" />
              </div>
              <div>
                <h4 className="font-sora font-semibold text-brand-text text-sm mb-1">Partnerships</h4>
                <p className="text-brand-muted text-sm">Partners in 54 countries across Africa, Middle East, and Asia Pacific.</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <CtaBanner
        heading="Ready to Work with Invendis?"
        description="Whether you need a monitoring solution, industrial networking hardware, or a custom OEM design — our team is ready."
        primaryLabel="Email Sales"
        primaryTo="/company"
        secondaryLabel="Explore Products"
        secondaryTo="/products"
      />

    </div>
  )
}
