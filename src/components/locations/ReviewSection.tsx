'use client'

import { useState } from 'react'
import { Star, ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { submitReview } from '@/lib/supabase'
import type { Review } from '@/lib/types'

interface ReviewSectionProps {
  locationId: string
  locationName: string
  reviews: Review[]
  ratingAverage: number
  ratingCount: number
}

function StarRating({ value, onChange, size = 'md' }: { value: number; onChange?: (v: number) => void; size?: 'sm' | 'md' }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={onChange ? 'button' : undefined}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={cn(
            onChange && 'cursor-pointer hover:scale-110 transition-transform',
            !onChange && 'cursor-default'
          )}
          aria-label={onChange ? `Rate ${star} stars` : undefined}
        >
          <Star
            className={cn(
              size === 'md' ? 'w-5 h-5' : 'w-4 h-4',
              (hovered || value) >= star ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
            )}
          />
        </button>
      ))}
    </div>
  )
}

export function ReviewSection({ locationId, locationName, reviews, ratingAverage, ratingCount }: ReviewSectionProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ author_name: '', rating: 0, comment: '', visit_date: '', gem_found: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.rating || !form.author_name) return
    setLoading(true)
    const ok = await submitReview({
      location_id: locationId,
      author_name: form.author_name,
      rating: form.rating,
      comment: form.comment || undefined,
      visit_date: form.visit_date || undefined,
      gem_found: form.gem_found || undefined,
    })
    setLoading(false)
    if (ok) setSubmitted(true)
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Rockhound Reviews
        </h2>
        {ratingCount > 0 && (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(ratingAverage)} size="sm" />
            <span className="text-sm text-muted-foreground">
              {ratingAverage.toFixed(1)} ({ratingCount} review{ratingCount !== 1 ? 's' : ''})
            </span>
          </div>
        )}
      </div>

      {/* Existing reviews */}
      {reviews.length > 0 ? (
        <div className="space-y-4 mb-8">
          {reviews.map((review) => (
            <div key={review.id} className="border border-border rounded-xl p-5 bg-card">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-foreground">{review.author_name}</span>
                    {review.verified && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" /> Verified Visit
                      </span>
                    )}
                  </div>
                  <StarRating value={review.rating} size="sm" />
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {review.visit_date && <div>Visited: {new Date(review.visit_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>}
                  {review.gem_found && <div className="text-ruby-600">Found: {review.gem_found}</div>}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-foreground/80 leading-relaxed mt-3">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-border rounded-xl p-8 text-center mb-8">
          <p className="text-muted-foreground text-sm">No reviews yet — be the first to share your experience!</p>
        </div>
      )}

      {/* Submit review */}
      <div className="border border-border rounded-xl p-6 bg-card">
        <h3 className="font-heading font-semibold text-foreground mb-4">
          {submitted ? 'Thank you!' : `Leave a Review for ${locationName}`}
        </h3>

        {submitted ? (
          <p className="text-sm text-muted-foreground">
            Your review has been submitted and will appear after a quick check. We appreciate you helping the rockhounding community!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Your Rating *</label>
              <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Your Name *</label>
                <input
                  type="text"
                  required
                  value={form.author_name}
                  onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                  placeholder="Jane Smith"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Visit Date</label>
                <input
                  type="month"
                  value={form.visit_date}
                  onChange={(e) => setForm({ ...form, visit_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">What did you find?</label>
              <input
                type="text"
                value={form.gem_found}
                onChange={(e) => setForm({ ...form, gem_found: e.target.value })}
                placeholder="e.g. Agate, Jasper, Gold flakes"
                className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Your Experience</label>
              <textarea
                rows={3}
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                placeholder="Tips, conditions, what to expect…"
                className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !form.rating || !form.author_name}
              className="bg-primary hover:bg-ruby-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
            >
              {loading ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
