'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PhotoGalleryProps {
  images: string[]
  locationName: string
}

export function PhotoGallery({ images, locationName }: PhotoGalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  if (!images || images.length === 0) return null

  const prev = () => setLightbox((i) => (i === null ? null : (i - 1 + images.length) % images.length))
  const next = () => setLightbox((i) => (i === null ? null : (i + 1) % images.length))

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Camera className="w-5 h-5 text-primary" />
        Photo Gallery
      </h2>

      <div className={cn(
        'grid gap-2',
        images.length === 1 && 'grid-cols-1',
        images.length === 2 && 'grid-cols-2',
        images.length >= 3 && 'grid-cols-2 md:grid-cols-3',
      )}>
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className={cn(
              'relative overflow-hidden rounded-lg bg-muted aspect-video hover:opacity-90 transition-opacity',
              i === 0 && images.length >= 3 && 'col-span-2 md:col-span-2 aspect-[16/7]',
            )}
          >
            <Image
              fill
              src={src}
              alt={`${locationName} photo ${i + 1}`}
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-4 p-2 text-white hover:text-ruby-300 transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <img
            src={images[lightbox]}
            alt={`${locationName} photo ${lightbox + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-4 p-2 text-white hover:text-ruby-300 transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 p-2 text-white hover:text-ruby-300 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 text-white/60 text-sm">
            {lightbox + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  )
}
