import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — cardata.wiki',
  description: 'Privacy Policy for cardata.wiki. How we collect, use, and protect your personal data.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
          &larr; Back to cardata.wiki
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-10">Last updated: March 2026</p>

      <div className="prose-slate space-y-10 text-slate-700 leading-relaxed">

        <section>
          <p>
            This Privacy Policy explains how cardata.wiki collects, uses, and protects your personal
            data. We are committed to handling your information transparently and in accordance with
            the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
          </p>
          <p className="mt-4">
            Please read this policy carefully. By using cardata.wiki, you acknowledge that you have
            read and understood how we handle your personal data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Who We Are</h2>
          <p>
            cardata.wiki is operated by dijitul, based in England. dijitul operates at{' '}
            <a href="https://dijitul.uk" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">dijitul.uk</a>.
          </p>
          <p className="mt-4">
            For the purposes of UK GDPR, dijitul is the data controller for personal data collected
            through cardata.wiki.
          </p>
          <p className="mt-4">
            <strong className="font-semibold text-slate-800">Contact:</strong>{' '}
            <a href="mailto:hello@dijitul.uk" className="text-blue-600 hover:underline">hello@dijitul.uk</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Data We Collect</h2>
          <p>
            We collect personal data in the following circumstances:
          </p>

          <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-2">Account Registration</h3>
          <p>
            When you create an account, we collect your name and email address. If you register using
            Google OAuth, we receive your name, email address, and profile picture URL as provided
            by Google at the time of authentication.
          </p>

          <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-2">API Subscriptions</h3>
          <p>
            When you subscribe to the paid API, billing and payment processing is handled by Stripe.
            We do not store your card details. We retain a record of your subscription status,
            subscription start date, and the email address associated with your Stripe customer record.
          </p>

          <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-2">Data Contributions</h3>
          <p>
            If you submit vehicle specification data via CSV upload or through the web interface,
            we retain those submissions, associated with your account, for review and publication
            purposes. Uploaded files may be stored for up to 12 months or until the submission has
            been reviewed, whichever is sooner.
          </p>

          <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-2">Usage Data and Server Logs</h3>
          <p>
            Our servers automatically log standard request data, including IP addresses, browser user
            agent strings, pages visited, and timestamps. These logs are used solely for security,
            debugging, and operational purposes and are retained for up to 30 days.
          </p>

          <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-2">Analytics</h3>
          <p>
            We use Google Analytics (property ID: G-C5LM030895) to understand how visitors use the
            Site. This is described further in Section 4.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Legal Basis for Processing</h2>
          <p>
            We rely on the following legal bases under UK GDPR to process your personal data:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-3 text-slate-600">
            <li>
              <strong className="text-slate-800">Contract performance:</strong> processing your name
              and email to create and manage your account, and to fulfil your API subscription.
            </li>
            <li>
              <strong className="text-slate-800">Legitimate interests:</strong> server logging and
              security monitoring to protect the Site and its users; analysing usage patterns to
              improve the Service. We have assessed that these interests are not overridden by your
              rights and freedoms.
            </li>
            <li>
              <strong className="text-slate-800">Consent:</strong> where we send you optional
              marketing or service update emails, we will ask for your consent and honour any
              withdrawal of that consent promptly.
            </li>
            <li>
              <strong className="text-slate-800">Legal obligation:</strong> where we are required to
              retain or disclose data to comply with a legal obligation.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Google Analytics</h2>
          <p>
            We use Google Analytics to collect anonymised data about how visitors interact with the
            Site. This includes which pages are visited, how long sessions last, what country visitors
            are located in (derived from IP address), and which browsers and devices are used.
            IP addresses are anonymised by Google before storage.
          </p>
          <p className="mt-4">
            Google Analytics uses cookies to distinguish between sessions. These cookies do not
            identify you personally. Data collected by Google Analytics is processed by Google LLC
            and may be transferred to servers outside the UK. Google&rsquo;s privacy practices are
            described in their{' '}
            <a
              href="https://policies.google.com/privacy"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>.
          </p>
          <p className="mt-4">
            You can opt out of Google Analytics tracking by installing the{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            , or by adjusting your browser&rsquo;s cookie settings. Most browsers also support
            Do Not Track signals, which we respect where technically feasible.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Cookies</h2>
          <p>
            We use the following categories of cookies:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-3 text-slate-600">
            <li>
              <strong className="text-slate-800">Session cookie (strictly necessary):</strong> used
              to keep you logged in while you use the Site. This cookie is deleted when you log out
              or close your browser session. It does not track you across other sites.
            </li>
            <li>
              <strong className="text-slate-800">Analytics cookies (Google Analytics):</strong> used
              to collect anonymised usage statistics as described in Section 4. These persist for up
              to 2 years but can be cleared at any time via your browser settings.
            </li>
          </ul>
          <p className="mt-4">
            We do not use advertising cookies, social media tracking cookies, or fingerprinting
            technologies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Data Retention</h2>
          <p>
            We retain personal data only for as long as necessary for the purposes described in this
            policy. Our specific retention periods are:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-3 text-slate-600">
            <li>
              <strong className="text-slate-800">Account data:</strong> retained for the duration
              of your account, and for 90 days following account deletion to allow for recovery and
              to fulfil any outstanding obligations. After this period, account data is permanently
              deleted.
            </li>
            <li>
              <strong className="text-slate-800">Server logs:</strong> retained for 30 days, then
              automatically deleted.
            </li>
            <li>
              <strong className="text-slate-800">Uploaded CSV submissions:</strong> retained for up
              to 12 months from the date of upload, or until the submission has been reviewed and
              processed, whichever comes first.
            </li>
            <li>
              <strong className="text-slate-800">API subscription records:</strong> retained for 7
              years for accounting and tax compliance purposes.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Third-Party Services</h2>
          <p>
            We use a small number of trusted third-party services to operate cardata.wiki. Each
            acts as a data processor on our behalf and is subject to appropriate data processing
            agreements:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-3 text-slate-600">
            <li>
              <strong className="text-slate-800">Stripe:</strong> payment processing for API
              subscriptions. Stripe handles all payment card data directly; we do not receive or
              store card numbers. See{' '}
              <a href="https://stripe.com/gb/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Stripe&rsquo;s Privacy Policy
              </a>.
            </li>
            <li>
              <strong className="text-slate-800">Google (Analytics and OAuth):</strong> usage
              analytics and optional sign-in via Google account. See{' '}
              <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Google&rsquo;s Privacy Policy
              </a>.
            </li>
            <li>
              <strong className="text-slate-800">Resend:</strong> transactional email delivery
              (account verification, password reset, subscription notifications). Resend processes
              recipient email addresses to deliver these messages. See{' '}
              <a href="https://resend.com/legal/privacy-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Resend&rsquo;s Privacy Policy
              </a>.
            </li>
          </ul>
          <p className="mt-4">
            We do not sell, rent, or share your personal data with any third party for their own
            marketing purposes. We will never sell your data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Your Rights Under UK GDPR</h2>
          <p>
            Under UK data protection law, you have the following rights in relation to your personal
            data:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-3 text-slate-600">
            <li>
              <strong className="text-slate-800">Right of access:</strong> you can request a copy
              of the personal data we hold about you.
            </li>
            <li>
              <strong className="text-slate-800">Right to rectification:</strong> you can ask us
              to correct inaccurate or incomplete personal data.
            </li>
            <li>
              <strong className="text-slate-800">Right to erasure:</strong> you can request
              deletion of your personal data where we no longer have a lawful basis to retain it.
            </li>
            <li>
              <strong className="text-slate-800">Right to data portability:</strong> you can
              request a copy of your data in a structured, machine-readable format.
            </li>
            <li>
              <strong className="text-slate-800">Right to object:</strong> you can object to
              processing based on legitimate interests; we will cease processing unless we can
              demonstrate compelling legitimate grounds.
            </li>
            <li>
              <strong className="text-slate-800">Right to restrict processing:</strong> you can
              ask us to limit how we use your data in certain circumstances.
            </li>
            <li>
              <strong className="text-slate-800">Right to withdraw consent:</strong> where
              processing is based on consent, you may withdraw it at any time without affecting
              the lawfulness of prior processing.
            </li>
          </ul>
          <p className="mt-4">
            To exercise any of these rights, email us at{' '}
            <a href="mailto:hello@dijitul.uk" className="text-blue-600 hover:underline">hello@dijitul.uk</a>.
            We will respond within one month. We may need to verify your identity before processing
            your request.
          </p>
          <p className="mt-4">
            If you are unhappy with how we have handled your data, you have the right to lodge a
            complaint with the UK Information Commissioner&rsquo;s Office (ICO) at{' '}
            <a href="https://ico.org.uk" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ico.org.uk</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Security</h2>
          <p>
            We take reasonable technical and organisational measures to protect your personal data
            against unauthorised access, loss, or disclosure. Passwords are hashed using bcrypt
            before storage and are never stored in plain text. All data is transmitted over HTTPS.
            Access to production systems and databases is restricted to authorised personnel only.
          </p>
          <p className="mt-4">
            No method of transmission over the internet or electronic storage is completely secure.
            While we use commercially reasonable measures to protect your data, we cannot guarantee
            absolute security. In the event of a data breach that is likely to result in a risk to
            your rights and freedoms, we will notify you and the ICO as required by law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Children</h2>
          <p>
            cardata.wiki is not intended for use by children under the age of 16. We do not
            knowingly collect personal data from children under 16. If you believe we have
            inadvertently collected data from a child under 16, please contact us at{' '}
            <a href="mailto:hello@dijitul.uk" className="text-blue-600 hover:underline">hello@dijitul.uk</a>{' '}
            and we will delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">11. International Transfers</h2>
          <p>
            Some of our third-party service providers (including Google and Stripe) may process
            data outside the UK. Where data is transferred internationally, we rely on appropriate
            safeguards, including the UK International Data Transfer Agreement (IDTA) or equivalent
            mechanisms, to ensure your data is protected to UK GDPR standards.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices,
            technology, or legal requirements. When we make changes, we will update the &ldquo;Last
            updated&rdquo; date at the top of this page. For significant changes, we may also notify
            registered users by email. We encourage you to review this page periodically.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or the
            way we handle your personal data, please contact us:
          </p>
          <ul className="list-none mt-3 space-y-1 text-slate-600">
            <li>
              <strong className="text-slate-800">Email:</strong>{' '}
              <a href="mailto:hello@dijitul.uk" className="text-blue-600 hover:underline">hello@dijitul.uk</a>
            </li>
            <li>
              <strong className="text-slate-800">Website:</strong>{' '}
              <a href="https://dijitul.uk" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">dijitul.uk</a>
            </li>
          </ul>
        </section>

      </div>

      <div className="mt-12 pt-8 border-t border-slate-200 flex gap-6 text-sm text-slate-500">
        <Link href="/terms" className="hover:text-slate-700 transition-colors">Terms of Service</Link>
        <Link href="/about" className="hover:text-slate-700 transition-colors">About cardata.wiki</Link>
        <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
      </div>
    </div>
  )
}
