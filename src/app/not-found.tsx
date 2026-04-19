import Link from 'next/link'
import { Gem, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ruby-100 mb-6">
          <Gem className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-heading text-4xl font-bold text-foreground mb-3">
          Location Not Found
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          This rockhounding spot seems to have gone underground. The page you&apos;re looking for doesn&apos;t exist
          or may have moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
      </div>
    </div>
  )
}
