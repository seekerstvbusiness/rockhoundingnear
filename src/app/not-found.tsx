import Link from 'next/link'
import { MapPin, ArrowLeft, Gem, Mountain } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ruby-100 mb-5">
          <MapPin className="w-8 h-8 text-primary" />
        </div>

        <div className="font-heading text-8xl font-bold text-ruby-100 leading-none mb-2 select-none">
          404
        </div>

        <h1 className="font-heading text-3xl font-bold text-foreground mb-3">
          This Trail Goes Nowhere
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed max-w-sm mx-auto">
          That page doesn&apos;t exist or may have moved. Try heading back to the map and finding a new trail.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-ruby-700 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/locations"
            className="inline-flex items-center justify-center gap-2 border border-border text-foreground font-medium px-5 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm"
          >
            Browse All Locations
          </Link>
        </div>

        <div className="border-t border-border pt-8">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Or explore by</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/states" className="inline-flex items-center gap-1.5 text-sm text-foreground border border-border rounded-full px-3.5 py-1.5 hover:border-ruby-300 hover:bg-ruby-50 hover:text-primary transition-all">
              <Mountain className="w-3.5 h-3.5 text-ruby-300" />
              Browse by State
            </Link>
            <Link href="/gem-types" className="inline-flex items-center gap-1.5 text-sm text-foreground border border-border rounded-full px-3.5 py-1.5 hover:border-ruby-300 hover:bg-ruby-50 hover:text-primary transition-all">
              <Gem className="w-3.5 h-3.5 text-ruby-300" />
              Browse by Gem Type
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
