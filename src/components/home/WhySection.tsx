import { Shield, MapPin, BookOpen, Users } from 'lucide-react'

const features = [
  {
    icon: MapPin,
    title: 'Verified Locations',
    desc: 'Every site is hand-researched and verified with GPS coordinates, directions, and access info — no generic AI filler.',
  },
  {
    icon: Shield,
    title: 'Safety First',
    desc: 'We include difficulty ratings, permit requirements, seasonal access, and safety tips for every location.',
  },
  {
    icon: BookOpen,
    title: 'Rich Detail',
    desc: 'Geology notes, what to bring, best times to visit, nearby amenities, and exactly what you can expect to find.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    desc: 'Built by rockhounds for rockhounds. We keep our data fresh with contributions from the collecting community.',
  },
]

export function WhySection() {
  return (
    <section className="py-16 md:py-20 bg-ruby-gradient relative overflow-hidden">
      {/* Light texture */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
            Why RockhoundingNear.com?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto">
            The most detailed, honest, and up-to-date rockhounding directory in the United States.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading font-semibold text-white text-lg mb-2">{title}</h3>
              <p className="text-white/65 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
