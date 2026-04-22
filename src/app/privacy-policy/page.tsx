import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for ${SITE_NAME}.`,
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
}

export default function PrivacyPolicyPage() {
  return (
    <div>
      <section className="bg-ruby-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-white/70">Last updated: April 2026</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-foreground/80 leading-relaxed space-y-6 text-sm">
        <section>
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">What We Collect</h2>
          <p>
            {SITE_NAME} collects minimal information. When you submit a location review, we collect your
            name, email address (not displayed publicly), star rating, and any comments or photos you choose to share.
            We do not require account creation to browse the site.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">Cookies &amp; Analytics</h2>
          <p>
            We use standard web analytics (such as Google Analytics or Vercel Analytics) to understand how visitors
            use the site. page views, traffic sources, and general usage patterns. This data is aggregated and
            anonymous. We use essential cookies only. no advertising or tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">How We Use Your Information</h2>
          <p>
            Review data (name, rating, comment) is displayed publicly on the relevant location page.
            Email addresses collected through reviews or the contact form are used only to respond to your message
            or verify your review. never for unsolicited marketing.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">Third-Party Services</h2>
          <p>
            We use Supabase for database hosting, Vercel for hosting, and Google Maps for embedded maps.
            Each of these services has their own privacy policies governing the data they process.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">Your Rights</h2>
          <p>
            You may request deletion of any review you submitted or any personal data we hold by emailing
            us at{' '}
            <a href="mailto:hello@rockhoundingnear.com" className="text-primary hover:underline">
              hello@rockhoundingnear.com
            </a>
            . We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">Contact</h2>
          <p>
            Questions about this policy? Email{' '}
            <a href="mailto:hello@rockhoundingnear.com" className="text-primary hover:underline">
              hello@rockhoundingnear.com
            </a>
            .
          </p>
        </section>
        </div>
      </div>
    </div>
  )
}
