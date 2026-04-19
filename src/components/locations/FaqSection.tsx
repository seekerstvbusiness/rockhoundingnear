'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FaqItem } from '@/lib/types'

interface FaqSectionProps {
  faqs: FaqItem[]
  locationName: string
}

export function FaqSection({ faqs, locationName }: FaqSectionProps) {
  const [open, setOpen] = useState<number | null>(0)

  if (!faqs || faqs.length === 0) return null

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground mb-5">
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-muted/50 transition-colors"
              aria-expanded={open === i}
            >
              <span className="font-medium text-foreground text-sm leading-snug">{faq.question}</span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200',
                  open === i && 'rotate-180'
                )}
              />
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
