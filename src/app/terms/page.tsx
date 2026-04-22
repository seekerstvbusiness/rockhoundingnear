import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: `Terms of use for ${SITE_NAME}.`,
  alternates: { canonical: `${SITE_URL}/terms` },
}

export default function TermsPage() {
  return (
    <div>
      <section className="bg-ruby-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold text-white mb-2">Terms of Use</h1>
          <p className="text-white/70">Last updated: April 2026</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-sm text-foreground/80 leading-relaxed">
        <section>
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">Use of Information</h2>
          <p>
            {SITE_NAME} provides location information for informational and recreational purposes only.
            Land access rules, permit requirements, fees, and road conditions change frequently.
            Always verify current conditions and regulations with the relevant land management agency
            (BLM, USFS, State Parks, etc.) before visiting any site.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">Accuracy Disclaimer</h2>
          <p>
            We make every reasonable effort to ensure the accuracy of information on this site, but we cannot
            guarantee that all listings are current, complete, or error-free. {SITE_NAME} is not liable for
            any loss, injury, or damages resulting from use of information on this site.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">Responsible Collecting</h2>
          <p>
            Users of this site are expected to collect responsibly and legally. This includes respecting posted
            quantity limits, obtaining required permits, practicing Leave No Trace principles, and never collecting
            on posted private land without explicit permission. Listing a site on {SITE_NAME} does not grant
            collecting rights.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">User Submissions</h2>
          <p>
            Reviews, photos, and location suggestions submitted by users become part of the {SITE_NAME} database.
            By submitting content, you confirm it is accurate to the best of your knowledge and that you own or
            have rights to any photos submitted. We reserve the right to edit or remove any submission.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">Prohibited Use</h2>
          <p>
            You may not scrape, reproduce, or redistribute the location database in bulk without written permission.
            Personal use, linking, and sharing individual pages is welcome and encouraged.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">Contact</h2>
          <p>
            Questions?{' '}
            <a href="mailto:hello@rockhoundingnear.com" className="text-primary hover:underline">
              hello@rockhoundingnear.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
