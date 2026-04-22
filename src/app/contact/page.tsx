import type { Metadata } from 'next'
import { Mail, MessageSquare, MapPin } from 'lucide-react'
import { ContactForm } from '@/components/contact/ContactForm'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Get in touch with the ${SITE_NAME} team. Report a location error, suggest a new site, or just say hello.`,
  alternates: { canonical: `${SITE_URL}/contact` },
}

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-ruby-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-white/75 text-xl max-w-xl mx-auto">
            Have a question, a correction, or a great rockhounding site to suggest? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Contact options */}
          <div className="space-y-5">
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="w-10 h-10 rounded-lg bg-ruby-100 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-1">Email Us</h3>
              <p className="text-sm text-muted-foreground mb-2">For general inquiries</p>
              <a href="mailto:hello@rockhoundingnear.com" className="text-sm text-primary hover:underline font-medium">
                hello@rockhoundingnear.com
              </a>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="w-10 h-10 rounded-lg bg-ruby-100 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-1">Suggest a Location</h3>
              <p className="text-sm text-muted-foreground">
                Know a great rockhounding spot we&apos;re missing? Send us the details. We&apos;ll research and add it.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="w-10 h-10 rounded-lg bg-ruby-100 flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-1">Report an Error</h3>
              <p className="text-sm text-muted-foreground">
                Outdated info, wrong coordinates, or access that&apos;s changed? Let us know and we&apos;ll fix it.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="md:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
