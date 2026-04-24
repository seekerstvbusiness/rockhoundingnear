'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, Gem } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { SITE_NAME } from '@/lib/constants'
import { SearchBar } from '@/components/home/SearchBar'

const navLinks = [
  { href: '/locations', label: 'Browse Locations' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ruby-200/40 bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground shadow-sm group-hover:bg-ruby-700 transition-colors">
              <Gem className="w-5 h-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-bold text-lg text-primary tracking-tight">
                Rockhounding
              </span>
              <span className="text-xs text-muted-foreground font-medium tracking-widest uppercase">
                Near.com
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center ml-8">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                    active
                      ? 'text-primary bg-ruby-50'
                      : 'text-foreground/70 hover:text-primary hover:bg-ruby-50'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Spacer */}
          <div className="hidden lg:flex flex-1" />

          {/* Desktop search bar */}
          <div className="hidden lg:flex w-64 shrink-0">
            <SearchBar compact />
          </div>

          {/* Mobile menu */}
          <div className="flex lg:hidden items-center ml-auto">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                className="inline-flex items-center justify-center rounded-lg border border-transparent p-1.5 text-foreground hover:bg-muted transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-80 px-6 pt-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white">
                    <Gem className="w-4 h-4" />
                  </div>
                  <span className="font-heading font-bold text-primary">{SITE_NAME}</span>
                </div>

                {/* Mobile search */}
                <div className="mb-4">
                  <SearchBar compact />
                </div>

                <div className="h-px bg-border mb-4" />

                <nav className="flex flex-col gap-0.5">
                  {navLinks.map((link) => {
                    const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center px-4 py-3.5 text-base font-medium rounded-md transition-colors',
                          active ? 'text-primary bg-ruby-50' : 'hover:bg-ruby-50 hover:text-primary'
                        )}
                      >
                        {link.label}
                      </Link>
                    )
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
