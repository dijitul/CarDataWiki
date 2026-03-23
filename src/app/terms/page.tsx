import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — cardata.wiki',
  description: 'Terms of Service for cardata.wiki, a free community-edited vehicle specifications database.',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
          &larr; Back to cardata.wiki
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-slate-900 mb-2">Terms of Service</h1>
      <p className="text-sm text-slate-500 mb-10">Last updated: March 2026</p>

      <div className="prose-slate space-y-10 text-slate-700 leading-relaxed">

        <section>
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of cardata.wiki (the &ldquo;Site&rdquo;) and any
            associated API services (collectively, the &ldquo;Services&rdquo;), operated by dijitul, a trading name
            registered in England and Wales. By accessing or using the Services, you agree to be bound
            by these Terms. If you do not agree, you must not use the Services.
          </p>
          <p className="mt-4">
            References to &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo; mean dijitul and its operators.
            References to &ldquo;you&rdquo; mean the individual or organisation accessing the Services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Nature of the Service</h2>
          <p>
            cardata.wiki is a free, community-edited database of vehicle specifications including engine
            data, dimensions, performance figures, and fuel economy information. Data published on this
            Site is contributed by registered users and is made available under the Creative Commons
            Attribution 4.0 International licence (CC BY 4.0), as described in Section 5 below.
          </p>
          <p className="mt-4">
            The Site is provided as a public resource. Our aim is to make vehicle specification data
            freely and openly accessible. We are not affiliated with, endorsed by, or acting as an
            agent of any vehicle manufacturer, automotive brand, or industry body.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Data Accuracy and Disclaimer</h2>
          <p>
            All data on cardata.wiki is user-contributed. We do not independently verify, validate, or
            warrant the accuracy, completeness, or fitness for purpose of any specification data
            published on the Site. Data may contain errors, omissions, or out-of-date information.
          </p>
          <p className="mt-4">
            The Services are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranty of any kind,
            express or implied, including but not limited to warranties of merchantability, fitness for
            a particular purpose, accuracy, or non-infringement. We make no guarantee that the data
            will be error-free, current, or suitable for any specific use.
          </p>
          <p className="mt-4">
            You are solely responsible for independently verifying any data before relying on it for
            any purpose, including but not limited to: ordering vehicle parts, making engineering or
            mechanical decisions, carrying out repairs or modifications, or any commercial or
            professional application.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, we exclude all liability for any loss or
            damage arising out of or in connection with your use of, or reliance on, data or content
            published on the Site or delivered via the API. This includes, without limitation:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-slate-600">
            <li>Loss arising from ordering incorrect parts or components based on inaccurate specifications;</li>
            <li>Loss arising from engineering, mechanical, or technical decisions made using data from the Site;</li>
            <li>Loss arising from incorrect performance, emissions, or fuel economy figures;</li>
            <li>Any indirect, consequential, special, or incidental loss, whether foreseeable or not;</li>
            <li>Loss of profit, revenue, contracts, business, data, or goodwill.</li>
          </ul>
          <p className="mt-4">
            Nothing in these Terms excludes or limits our liability for death or personal injury caused
            by our negligence, fraud or fraudulent misrepresentation, or any other liability that
            cannot be excluded or limited under English law.
          </p>
          <p className="mt-4">
            Where liability cannot be fully excluded, our total aggregate liability to you in respect
            of any claim arising from the Services shall not exceed the total amount paid by you to us
            in the twelve months preceding the claim, or £10 (whichever is greater).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Trademarks and Manufacturer References</h2>
          <p>
            Vehicle manufacturer names, model names, trim designations, and related identifiers
            (including but not limited to Ford, Volkswagen, Toyota, BMW, and all other automotive
            brands) are used on this Site solely as factual descriptors to identify and categorise
            vehicle specification data. Their use does not imply any affiliation with, endorsement by,
            sponsorship by, or approval from any vehicle manufacturer or brand owner.
          </p>
          <p className="mt-4">
            All trademarks, registered trademarks, and trade names remain the property of their
            respective owners. cardata.wiki does not claim any proprietary rights over manufacturer
            or model names. Use of these names on this Site falls within the scope of nominative
            fair use for the purpose of factual identification and reference.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Licence</h2>
          <p>
            All vehicle specification data published on cardata.wiki is made available under the
            Creative Commons Attribution 4.0 International Licence (CC BY 4.0). You are free to share,
            copy, redistribute, adapt, and build upon the data for any purpose, including commercially,
            provided you give appropriate attribution to cardata.wiki and indicate if changes were made.
          </p>
          <p className="mt-4">
            Attribution should take the form: &ldquo;Data sourced from <a href="https://cardata.wiki" className="text-blue-600 hover:underline">cardata.wiki</a>,
            available under CC BY 4.0.&rdquo; or a substantially similar statement that clearly
            identifies cardata.wiki as the source.
          </p>
          <p className="mt-4">
            The full text of the CC BY 4.0 licence is available at{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              creativecommons.org/licenses/by/4.0
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">6. User Contributions</h2>
          <p>
            By submitting vehicle specification data to cardata.wiki, whether through the web interface,
            CSV upload, or any other mechanism, you confirm that:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-slate-600">
            <li>The data you submit is, to the best of your knowledge, accurate and not misleading;</li>
            <li>You own or have the right to contribute the data, and your submission does not infringe any third-party intellectual property rights;</li>
            <li>The data does not include content that is defamatory, unlawful, or in breach of any applicable regulation;</li>
            <li>You are not submitting data that has been extracted from a proprietary or restricted database in a manner that would constitute a breach of that database&rsquo;s terms.</li>
          </ul>
          <p className="mt-4">
            By submitting data, you grant us and all users of the Site a perpetual, worldwide,
            royalty-free licence to use, reproduce, modify, and distribute that data under the terms
            of CC BY 4.0. This licence cannot be revoked once data has been published, as doing so
            would undermine the integrity of the open dataset.
          </p>
          <p className="mt-4">
            We reserve the right to edit, reject, or remove any contributed data at our discretion,
            including data that appears to be inaccurate, commercially motivated, or sourced from
            proprietary materials.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">7. API Terms</h2>
          <p>
            We offer a paid API subscription at £20 per month. This fee exists solely to cover
            hosting, infrastructure, and operational costs; it is not a commercial profit-seeking
            venture. API access grants you programmatic access to the same data available on the Site,
            subject to the following conditions:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-slate-600">
            <li>API credentials are issued to you personally or to a single organisation and may not be shared, sublicensed, or resold to third parties;</li>
            <li>You must not use the API to scrape or bulk-export the entire dataset for the purpose of creating a competing service;</li>
            <li>You must not use the API in any application or system where inaccurate data could result in risk to life, safety-critical decisions, or regulated engineering activity without independent verification;</li>
            <li>We apply fair use limits. Excessive automated requests that degrade service for other users may result in temporary throttling or suspension of access;</li>
            <li>API subscriptions are billed monthly. Cancellation takes effect at the end of the current billing period; we do not offer pro-rata refunds unless required by law.</li>
          </ul>
          <p className="mt-4">
            All data returned via the API is subject to the same CC BY 4.0 licence and the same
            accuracy disclaimers described in these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Account Terms</h2>
          <p>
            To contribute data or access certain features, you must register for an account. When
            registering, you must provide accurate and complete information. You are responsible for
            maintaining the confidentiality of your account credentials and for all activity that
            occurs under your account.
          </p>
          <p className="mt-4">
            You may hold one account per person. Creating multiple accounts, sharing accounts between
            individuals, or using automated systems to register accounts is prohibited. We reserve
            the right to suspend or terminate accounts that violate these Terms, without notice where
            circumstances require it.
          </p>
          <p className="mt-4">
            You must be at least 16 years of age to register for an account. By registering, you
            confirm that you meet this requirement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Acceptable Use</h2>
          <p>
            You must not use the Services in any way that is unlawful, harmful, or disruptive. In
            particular, you must not: attempt to gain unauthorised access to any part of the Site or
            its infrastructure; interfere with the normal operation of the Site; use the Services to
            distribute malware or malicious content; or use the Services in a manner that violates
            any applicable law or regulation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Intellectual Property</h2>
          <p>
            The software, design, layout, and non-data content of cardata.wiki (including but not
            limited to the codebase, UI elements, and original written content) are the property of
            dijitul and are protected by copyright. You may not copy, reproduce, or redistribute
            these elements without our prior written consent. This does not affect the open licence
            that applies to the vehicle specification data itself.
          </p>
          <p className="mt-4">
            The Site was built with assistance from Claude, an AI assistant developed by Anthropic.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Changes to the Service and Terms</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue the Services at any time, with
            or without notice. We may update these Terms from time to time. Where changes are
            material, we will update the &ldquo;Last updated&rdquo; date at the top of this page. Continued use
            of the Services following any update constitutes your acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Governing Law</h2>
          <p>
            These Terms and any dispute or claim arising out of or in connection with them (including
            non-contractual disputes) shall be governed by and construed in accordance with the law
            of England and Wales. The courts of England and Wales shall have exclusive jurisdiction
            to settle any such dispute or claim, subject to your rights as a consumer if you are
            located in another jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Contact</h2>
          <p>
            If you have any questions about these Terms, you can contact us at{' '}
            <a href="mailto:hello@dijitul.uk" className="text-blue-600 hover:underline">hello@dijitul.uk</a>{' '}
            or via{' '}
            <a href="https://dijitul.uk" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">dijitul.uk</a>.
          </p>
        </section>

      </div>

      <div className="mt-12 pt-8 border-t border-slate-200 flex gap-6 text-sm text-slate-500">
        <Link href="/privacy" className="hover:text-slate-700 transition-colors">Privacy Policy</Link>
        <Link href="/about" className="hover:text-slate-700 transition-colors">About cardata.wiki</Link>
        <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
      </div>
    </div>
  )
}
