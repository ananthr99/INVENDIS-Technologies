import { Link } from 'react-router-dom'
import PageSEO from '../components/shared/PageSEO'

const EFFECTIVE_DATE = '8 July 2026'
const COMPANY = 'Invendis Technologies India Private Limited'
const EMAIL = 'sales@invendis.com'

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="font-sora font-bold text-xl text-brand-blue mb-4">{title}</h2>
      <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

export default function Terms() {
  return (
    <>
      <PageSEO
        title="Terms of Use"
        description="Terms of Use for the Invendis Technologies website. Covers permitted use, intellectual property, limitations of liability, and governing law."
        path="/terms"
      />

      {/* Hero */}
      <section
        className="relative text-white py-20 px-8 lg:px-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #05059b 0%, #2929c8 60%, #3a3ad4 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(255,255,255,0.5) 40px,rgba(255,255,255,0.5) 41px),' +
              'repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(255,255,255,0.5) 40px,rgba(255,255,255,0.5) 41px)',
          }}
        />
        <div className="relative max-w-3xl">
          <p className="font-sora text-xs font-bold uppercase tracking-widest text-brand-red mb-4">
            Legal
          </p>
          <h1 className="font-sora font-bold text-4xl lg:text-5xl mb-4">Terms of Use</h1>
          <p className="text-white/70 text-sm">Effective date: {EFFECTIVE_DATE}</p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-8 lg:px-0 py-16">

        <Section title="1. Acceptance of terms">
          <p>
            By accessing or using this website ("Site"), you agree to be bound by these Terms
            of Use. If you do not agree, please do not use the Site. These terms apply to all
            visitors, users, and anyone who accesses the Site.
          </p>
          <p>
            These Terms are governed by the laws of Karnataka, India, and applicable Indian
            central law, including the Information Technology Act, 2000 and its amendments.
          </p>
        </Section>

        <Section title="2. About this website">
          <p>
            This Site is operated by <strong>{COMPANY}</strong> ("Invendis", "we", "our", or "us"),
            a company registered in Bangalore, Karnataka, India. The Site provides information
            about our Industrial IoT products, solutions, and services, and enables prospective
            customers and partners to contact us.
          </p>
        </Section>

        <Section title="3. Intellectual property">
          <p>
            All content on this Site — including but not limited to text, product descriptions,
            technical specifications, datasheets, images, graphics, logos, the SILBO brand, and
            software — is the exclusive property of {COMPANY} or its licensors and is protected
            by Indian and international intellectual property laws.
          </p>
          <p>You may:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>View and print content for your own personal, non-commercial reference</li>
            <li>Share links to pages on this Site</li>
            <li>Download product datasheets for legitimate product evaluation purposes</li>
          </ul>
          <p className="mt-3">You may not:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>
              Reproduce, republish, redistribute, or commercially exploit any content from
              this Site without our prior written consent
            </li>
            <li>
              Repackage, resell, or present our product specifications or datasheets as your
              own or as belonging to another company
            </li>
            <li>
              Remove, obscure, or alter any copyright, trademark, or proprietary notices
            </li>
            <li>
              Use our logos, trade names, or trademarks without prior written permission
            </li>
          </ul>
        </Section>

        <Section title="4. Permitted use">
          <p>You may use this Site only for lawful purposes and in accordance with these Terms. You agree to use it to:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Evaluate our products and services for legitimate business purposes</li>
            <li>Contact us with genuine business enquiries</li>
            <li>Access technical resources for products you are authorised to use</li>
          </ul>
        </Section>

        <Section title="5. Prohibited use">
          <p>You must not:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>
              Use any automated means (bots, scrapers, crawlers) to extract data from this
              Site in bulk, including product specifications, pricing information, or customer
              references
            </li>
            <li>
              Attempt to gain unauthorised access to any part of the Site, its servers, or
              databases
            </li>
            <li>
              Submit false, misleading, or fraudulent information through our contact form
            </li>
            <li>
              Use the Site in any way that could damage, disable, or impair its availability
              or performance
            </li>
            <li>
              Introduce any virus, malware, or malicious code
            </li>
            <li>
              Use the Site to violate any applicable local, national, or international law
            </li>
          </ul>
          <p className="mt-3">
            Violation of these prohibitions may result in legal action under the Information
            Technology Act, 2000 and other applicable laws.
          </p>
        </Section>

        <Section title="6. Accuracy of information">
          <p>
            We make reasonable efforts to keep the information on this Site accurate and
            up to date. However, product specifications, availability, certifications, and
            other technical details may change. <strong>Nothing on this Site constitutes a
            binding offer, warranty, or guarantee of product specifications unless confirmed
            in a signed written agreement.</strong>
          </p>
          <p>
            Always request current, confirmed product specifications from our sales team
            before making procurement decisions. Contact us at{' '}
            <a href={`mailto:${EMAIL}`} className="text-brand-blue hover:underline">{EMAIL}</a>.
          </p>
        </Section>

        <Section title="7. Limitation of liability">
          <p>
            To the maximum extent permitted by applicable law, {COMPANY} and its officers,
            directors, employees, and agents shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages arising from:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Your access to or use of (or inability to use) this Site</li>
            <li>Any reliance placed on the accuracy or completeness of content on this Site</li>
            <li>Any unauthorised access to or alteration of your transmissions or data</li>
            <li>Any interruption or cessation of transmission to or from this Site</li>
          </ul>
          <p className="mt-3">
            Our total aggregate liability for any claims arising from these Terms or your use
            of the Site shall not exceed INR 10,000 (Indian Rupees ten thousand).
          </p>
        </Section>

        <Section title="8. Third-party links">
          <p>
            This Site may contain links to third-party websites (for example, LinkedIn, client
            websites, or technology partner sites). These links are provided for convenience
            only. We have no control over the content, privacy practices, or availability of
            those sites and accept no responsibility for them. Accessing third-party sites is
            at your own risk.
          </p>
        </Section>

        <Section title="9. Governing law and jurisdiction">
          <p>
            These Terms of Use and any dispute or claim arising in connection with them shall
            be governed by and construed in accordance with the laws of India. Any disputes
            shall be subject to the exclusive jurisdiction of the courts located in Bangalore,
            Karnataka, India.
          </p>
          <p>
            If you are based in the European Union, you may also have the right to seek redress
            through your local consumer protection authority or courts.
          </p>
        </Section>

        <Section title="10. Changes to these terms">
          <p>
            We reserve the right to modify these Terms of Use at any time. Changes will be
            effective immediately upon posting to this page, with the effective date updated
            accordingly. Your continued use of the Site after changes are posted constitutes
            your acceptance of the revised terms.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            If you have questions about these Terms, contact us:
          </p>
          <address className="not-italic mt-3 p-4 bg-gray-50 rounded-xl text-sm space-y-1">
            <p className="font-sora font-semibold text-brand-blue">{COMPANY}</p>
            <p>BCOMBCS Layout, BTM 2nd Stage, Bangalore, Karnataka, India</p>
            <p>
              Email:{' '}
              <a href={`mailto:${EMAIL}`} className="text-brand-blue hover:underline">{EMAIL}</a>
            </p>
          </address>
        </Section>

        <div className="border-t border-gray-200 pt-8 mt-4">
          <Link to="/" className="text-sm text-brand-blue hover:underline">← Back to Home</Link>
        </div>
      </div>
    </>
  )
}
