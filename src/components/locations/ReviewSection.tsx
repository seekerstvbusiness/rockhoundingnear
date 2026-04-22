'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Star, ThumbsUp, Camera, X, Upload, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { submitReview, uploadReviewPhoto } from '@/lib/supabase'
import type { Review } from '@/lib/types'

const MAX_PHOTOS = 3
const MAX_SIZE_MB = 5
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']

interface ReviewSectionProps {
  locationId: string
  locationName: string
  reviews: Review[]
  ratingAverage: number
  ratingCount: number
}

function StarRating({ value, onChange, size = 'md' }: {
  value: number
  onChange?: (v: number) => void
  size?: 'sm' | 'md'
}) {
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
          <Star className={cn(
            size === 'md' ? 'w-5 h-5' : 'w-4 h-4',
            (hovered || value) >= star ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
          )} />
        </button>
      ))}
    </div>
  )
}

interface PhotoPreview {
  file: File
  preview: string
  error?: string
}

export function ReviewSection({
  locationId, locationName, reviews, ratingAverage, ratingCount,
}: ReviewSectionProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [photos, setPhotos] = useState<PhotoPreview[]>([])
  const [lightbox, setLightbox] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    author_name: '', rating: 0, comment: '', visit_date: '', gem_found: '',
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const remaining = MAX_PHOTOS - photos.length
    const toAdd = files.slice(0, remaining).map((file) => {
      const tooLarge = file.size > MAX_SIZE_MB * 1024 * 1024
      const badType = !ACCEPTED.includes(file.type)
      return {
        file,
        preview: URL.createObjectURL(file),
        error: tooLarge ? `Too large (max ${MAX_SIZE_MB}MB)` : badType ? 'Unsupported format' : undefined,
      }
    })
    setPhotos((prev) => [...prev, ...toAdd])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.rating || !form.author_name) return

    setLoading(true)
    const validPhotos = photos.filter((p) => !p.error)
    const photoUrls: string[] = []

    for (let i = 0; i < validPhotos.length; i++) {
      setUploadProgress(`Uploading photo ${i + 1} of ${validPhotos.length}...`)
      const url = await uploadReviewPhoto(locationId, validPhotos[i].file)
      if (url) photoUrls.push(url)
    }

    setUploadProgress('Saving review...')
    const ok = await submitReview({
      location_id: locationId,
      author_name: form.author_name,
      rating: form.rating,
      comment: form.comment || undefined,
      visit_date: form.visit_date || undefined,
      gem_found: form.gem_found || undefined,
      photo_urls: photoUrls.length > 0 ? photoUrls : undefined,
    })

    setLoading(false)
    setUploadProgress('')
    if (ok) setSubmitted(true)
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="font-heading text-2xl font-bold text-foreground">Rockhound Reviews</h2>
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
                  {review.visit_date && (
                    <div>Visited: {new Date(review.visit_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                  )}
                  {review.gem_found && <div className="text-ruby-600 mt-0.5">Found: {review.gem_found}</div>}
                </div>
              </div>

              {review.comment && (
                <p className="text-sm text-foreground/80 leading-relaxed mt-3">{review.comment}</p>
              )}

              {/* Review photos */}
              {review.photo_urls?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {review.photo_urls.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setLightbox(url)}
                      className="relative w-20 h-20 rounded-lg overflow-hidden border border-border hover:opacity-90 transition-opacity"
                    >
                      <Image fill src={url} alt={`Review photo ${i + 1}`} className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-border rounded-xl p-8 text-center mb-8">
          <Camera className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">No reviews yet  -  be the first to share your experience!</p>
        </div>
      )}

      {/* Submit form */}
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
                placeholder="Tips, conditions, what to expect..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              />
            </div>

            {/* Photo upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Add Photos
                <span className="text-muted-foreground font-normal ml-1.5">
                  (up to {MAX_PHOTOS}, max {MAX_SIZE_MB}MB each · JPG, PNG, WebP)
                </span>
              </label>

              {/* Previews */}
              {photos.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {photos.map((photo, i) => (
                    <div key={i} className="relative group">
                      <div className={cn(
                        'w-20 h-20 rounded-lg overflow-hidden border-2',
                        photo.error ? 'border-red-300 opacity-60' : 'border-border'
                      )}>
                        <img src={photo.preview} alt="" className="w-full h-full object-cover" />
                      </div>
                      {photo.error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                          <span className="text-white text-[9px] text-center px-1 leading-tight">{photo.error}</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Add more slot */}
                  {photos.length < MAX_PHOTOS && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-[10px]">Add</span>
                    </button>
                  )}
                </div>
              )}

              {/* Drop zone (shown when no photos yet) */}
              {photos.length === 0 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-border hover:border-primary/40 rounded-xl py-6 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Upload className="w-6 h-6" />
                  <span className="text-sm">Click to upload photos</span>
                  <span className="text-xs">JPG, PNG, WebP  -  up to {MAX_PHOTOS} photos, {MAX_SIZE_MB}MB each</span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading || !form.rating || !form.author_name}
                className="bg-primary hover:bg-ruby-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
              >
                {loading ? (uploadProgress || 'Submitting...') : 'Submit Review'}
              </button>
              {photos.filter((p) => !p.error).length > 0 && !loading && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5" />
                  {photos.filter((p) => !p.error).length} photo{photos.filter((p) => !p.error).length !== 1 ? 's' : ''} attached
                </span>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Photo lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Review photo"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 p-2 text-white hover:text-ruby-300 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  )
}
