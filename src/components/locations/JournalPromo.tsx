export function JournalPromo() {
  return (
    <a
      href="https://agentforeverything.gumroad.com/l/rockhounding-field-journal"
      target="_blank"
      rel="noopener"
      aria-label="Rockhounding Field Journal — $9 instant PDF download"
      className="group block w-full max-w-[320px] mx-auto"
    >
      <div className="p-[3px] border border-[#5C4A2E] bg-[#F5EFE2] transition-all duration-200 group-hover:-translate-y-[2px] group-hover:border-[#3F3220]">
        <div
          className="relative border border-[#5C4A2E] px-7 py-7 transition-colors duration-200 group-hover:border-[#3F3220]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(92,74,46,0.06) 0.5px, transparent 0.5px)',
            backgroundSize: '12px 12px',
          }}
        >
          <div className="flex justify-center mb-4 text-[#5C4A2E]">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="20" cy="20" r="14.5" fill="none" stroke="#5C4A2E" strokeWidth="0.7" />
              <circle cx="20" cy="20" r="10.5" fill="none" stroke="#5C4A2E" strokeWidth="0.5" />
              <line x1="20" y1="2" x2="20" y2="6" stroke="#5C4A2E" strokeWidth="0.7" strokeLinecap="round" />
              <line x1="20" y1="34" x2="20" y2="38" stroke="#5C4A2E" strokeWidth="0.7" strokeLinecap="round" />
              <line x1="2" y1="20" x2="6" y2="20" stroke="#5C4A2E" strokeWidth="0.7" strokeLinecap="round" />
              <line x1="34" y1="20" x2="38" y2="20" stroke="#5C4A2E" strokeWidth="0.7" strokeLinecap="round" />
              <path d="M20 5.5 L22 20 L20 34.5 L18 20 Z" fill="#5C4A2E" />
              <path d="M5.5 20 L20 18 L34.5 20 L20 22 Z" fill="#8B4A2B" />
              <circle cx="20" cy="20" r="1.3" fill="#5C4A2E" />
            </svg>
          </div>

          <p
            className="text-center text-[10px] font-semibold tracking-[0.28em] text-[#8B4A2B] mb-3"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            FOR THE FIELD
          </p>

          <div className="flex items-center justify-center gap-2 mb-4" aria-hidden="true">
            <span className="h-px w-10 bg-[#5C4A2E]/40" />
            <span className="block h-1 w-1 rounded-full bg-[#8B4A2B]" />
            <span className="h-px w-10 bg-[#5C4A2E]/40" />
          </div>

          <h3
            className="text-center text-[1.6rem] font-bold leading-[1.15] text-[#5C4A2E] mb-3"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            Rockhounding Field Journal
          </h3>

          <p
            className="text-center text-[13.5px] leading-relaxed text-[#2B2620]/85 mb-4"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            A 75-page printable logbook with mineral ID reference, GPS log pages, and trip summaries.
          </p>

          <p
            className="text-center text-[13px] italic text-[#5C4A2E] mb-5"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            $4.99 · Instant PDF download
          </p>

          <span
            className="block w-full text-center text-[#F5EFE2] bg-[#8B4A2B] py-3 px-4 text-sm font-semibold tracking-wide transition-colors duration-200 group-hover:bg-[#6B3820]"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Get the Journal →
          </span>

          <p
            className="text-center text-[11px] italic text-[#5C4A2E]/75 mt-3"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            Made by rockhoundingnear.com
          </p>
        </div>
      </div>
    </a>
  )
}
