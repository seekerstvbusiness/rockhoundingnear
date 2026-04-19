import type { Metadata } from 'next'
import { Mail, MessageSquare, MapPin } from 'lucide-react'
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
                Know a great rockhounding spot we&apos;re missing? Send us the details — we&apos;ll research and add it.
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
            <div className="rounded-xl border border-border bg-card p-7">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Send a Message</h2>
              <form className="space-y-5" action="mailto:hello@rockhoundingnear.com" method="get" encType="text/plain">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                      Your Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Jane Smith"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="jane@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  >
                    <option value="">Select a topic…</option>
                    <option value="suggest">Suggest a Location</option>
                    <option value="error">Report an Error</option>
                    <option value="general">General Question</option>
                    <option value="partnership">Partnership / Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="body"
                    required
                    rows={5}
                    placeholder="Tell us what's on your mind…"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-ruby-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
