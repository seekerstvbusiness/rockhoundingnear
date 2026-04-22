'use client'

import { useState } from 'react'
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const SUBJECTS = [
  { value: 'suggest-location',  label: 'Suggest a New Location' },
  { value: 'report-incorrect',  label: 'Report Incorrect Information' },
  { value: 'report-closed',     label: 'Report a Closed / Changed Location' },
  { value: 'advertisement',     label: 'Advertisement / Partnership Enquiry' },
  { value: 'blog-contribution', label: 'Blog Contribution / Guest Post' },
  { value: 'general',           label: 'General Question' },
  { value: 'other',             label: 'Other' },
]

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'

export function ContactForm() {
  const [fields, setFields] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function update(field: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFields((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error ?? 'Something went wrong')
      }
      setStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-border bg-card p-7 flex flex-col items-center text-center gap-4 py-14">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground mb-1">Message Sent!</h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Thanks for reaching out. We&apos;ll get back to you as soon as we can.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-7">
      <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Send a Message</h2>

      {status === 'error' && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 mb-5 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
              Your Name
            </label>
            <input
              id="name" name="name" type="text" required
              placeholder="Jane Smith"
              value={fields.name} onChange={update('name')}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
              Email Address
            </label>
            <input
              id="email" name="email" type="email" required
              placeholder="jane@example.com"
              value={fields.email} onChange={update('email')}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">
            Subject
          </label>
          <select
            id="subject" name="subject"
            value={fields.subject} onChange={update('subject')}
            className={inputClass}
          >
            <option value="">Select a topic...</option>
            {SUBJECTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
            Message
          </label>
          <textarea
            id="message" name="message" required rows={5}
            placeholder="Tell us what's on your mind..."
            value={fields.message} onChange={update('message')}
            className={`${inputClass} resize-none`}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center gap-2 bg-primary hover:bg-ruby-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  )
}
