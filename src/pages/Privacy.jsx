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

export default function Privacy() {
  return (
    <>
      <PageSEO
        title="Privacy Policy"
        description="Privacy Policy for Invendis Technologies. Learn how we collect, use, and protect your personal data when you visit our website or contact us."
        path="/privacy"
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
          <h1 className="font-sora font-bold text-4xl lg:text-5xl mb-4">Privacy Policy</h1>
          <p className="text-white/70 text-sm">Effective date: {EFFECTIVE_DATE}</p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-8 lg:px-0 py-16">

        <Section title="1. Who we are">
          <p>
            This Privacy Policy applies to <strong>{COMPANY}</strong> ("Invendis", "we", "our", or "us"),
            operating the website at{' '}
            <a
              href="https://invendis-technologies-cms.netlify.app"
              className="text-brand-blue hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              invendis-technologies-cms.netlify.app
            </a>{' '}
            and its subpages.
          </p>
          <p>
            We are registered in Bangalore, Karnataka, India. For privacy enquiries, contact us at{' '}
            <a href={`mailto:${EMAIL}`} className="text-brand-blue hover:underline">{EMAIL}</a>.
          </p>
        </Section>

        <Section title="2. What data we collect and why">
          <p>We collect personal data only when you voluntarily provide it:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>
              <strong>Contact form</strong> — when you submit an enquiry we collect your name,
              company name, email address, and message content. We use this solely to respond
              to your enquiry and, with your implicit consent, to follow up on business discussions.
            </li>
            <li>
              <strong>Analytics</strong> — we use Google Analytics 4 to collect anonymised usage
              data (pages visited, time on site, browser type, approximate geographic region).
              No personally identifiable information is collected through analytics. You can
              opt out using the Google Analytics Opt-out Browser Add-on.
            </li>
          </ul>
          <p className="mt-3">
            We do not collect payment information, government IDs, or sensitive personal data
            of any kind.
          </p>
        </Section>

        <Section title="3. Legal basis for processing (GDPR)">
          <p>
            If you are located in the European Economic Area (EEA) or United Kingdom, we process
            your personal data under the following legal bases:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>
              <strong>Legitimate interest</strong> — to respond to business enquiries you have
              initiated.
            </li>
            <li>
              <strong>Consent</strong> — for analytics cookies, which are set only after you
              accept our cookie notice.
            </li>
          </ul>
        </Section>

        <Section title="4. How we store and protect your data">
          <p>
            Contact form submissions are stored by <strong>Netlify</strong> (our hosting
            provider) in their form submission service, hosted in the United States. Netlify is
            GDPR-compliant and provides appropriate data transfer safeguards. We review and
            delete submissions that are older than 12 months and not part of an ongoing business
            relationship.
          </p>
          <p>
            We do not store your personal data in our own databases, CRM systems, or
            spreadsheets beyond what Netlify retains.
          </p>
        </Section>

        <Section title="5. Cookies">
          <p>We use the following cookies:</p>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-2 border border-gray-200 font-sora font-semibold text-brand-blue">Cookie</th>
                  <th className="text-left px-4 py-2 border border-gray-200 font-sora font-semibold text-brand-blue">Provider</th>
                  <th className="text-left px-4 py-2 border border-gray-200 font-sora font-semibold text-brand-blue">Purpose</th>
                  <th className="text-left px-4 py-2 border border-gray-200 font-sora font-semibold text-brand-blue">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border border-gray-200 font-mono text-xs">_ga, _ga_*</td>
                  <td className="px-4 py-2 border border-gray-200">Google Analytics</td>
                  <td className="px-4 py-2 border border-gray-200">Anonymised usage statistics</td>
                  <td className="px-4 py-2 border border-gray-200">2 years</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            Analytics cookies are not set until you accept our cookie notice. You may withdraw
            consent at any time by clearing cookies in your browser settings.
          </p>
        </Section>

        <Section title="6. Third-party services">
          <p>Our website uses the following third-party services that may process your data:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>
              <strong>Netlify</strong> (netlify.com) — website hosting and form submissions.
              Privacy policy: netlify.com/privacy
            </li>
            <li>
              <strong>Google Fonts</strong> — fonts loaded from fonts.googleapis.com. Google
              may log your IP address when the font files are requested. Privacy policy:
              policies.google.com/privacy
            </li>
            <li>
              <strong>Google Analytics</strong> — anonymised usage analytics.
              Privacy policy: policies.google.com/privacy
            </li>
          </ul>
          <p className="mt-3">
            We do not sell, rent, or share your personal data with any other third parties.
          </p>
        </Section>

        <Section title="7. International data transfers">
          <p>
            Our hosting provider (Netlify) stores data in the United States. If you are based
            in the EEA, your data is transferred to the US under appropriate safeguards
            (Netlify's Data Processing Agreement compliant with EU Standard Contractual Clauses).
          </p>
          <p>
            Our website is operated by an Indian company and processed under the Indian
            Digital Personal Data Protection Act, 2023 (DPDP Act).
          </p>
        </Section>

        <Section title="8. Your rights">
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li><strong>Access</strong> — request a copy of the data we hold about you</li>
            <li><strong>Correction</strong> — request correction of inaccurate data</li>
            <li><strong>Erasure</strong> — request deletion of your data</li>
            <li><strong>Objection</strong> — object to processing based on legitimate interest</li>
            <li><strong>Withdrawal of consent</strong> — withdraw consent for analytics at any time</li>
            <li><strong>Complaint</strong> — lodge a complaint with your local data protection authority</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, email us at{' '}
            <a href={`mailto:${EMAIL}`} className="text-brand-blue hover:underline">{EMAIL}</a>{' '}
            with the subject line "Privacy Request". We will respond within 30 days.
          </p>
        </Section>

        <Section title="9. Data retention">
          <p>
            Contact form submissions are retained for 12 months from receipt, or for as long as
            necessary to manage an ongoing business relationship, whichever is longer. Analytics
            data is retained for 14 months (Google Analytics 4 default).
          </p>
        </Section>

        <Section title="10. Changes to this policy">
          <p>
            We may update this Privacy Policy when our practices change (for example, when new
            features are added to the website). Material changes will be reflected in a new
            effective date at the top of this page. We encourage you to review this page
            periodically.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            For any privacy-related questions or to exercise your rights, contact:
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
