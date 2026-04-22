'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Gem, Search } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { SITE_NAME } from '@/lib/constants'

const navLinks = [
  { href: '/locations', label: 'Browse Locations' },
  { href: '/states', label: 'By State' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ruby-200/40 bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
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
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
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

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/locations"
              className={cn(buttonVariants({ size: 'sm' }), 'bg-primary hover:bg-ruby-700 text-white shadow-sm')}
            >
              <Search className="w-4 h-4 mr-1.5" />
              Find Sites
            </Link>
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="md:hidden inline-flex items-center justify-center rounded-lg border border-transparent p-1.5 text-foreground hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-12">
              <div className="flex items-center gap-2 mb-8">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white">
                  <Gem className="w-4 h-4" />
                </div>
                <span className="font-heading font-bold text-primary">{SITE_NAME}</span>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors',
                        active ? 'text-primary bg-ruby-50' : 'hover:bg-ruby-50 hover:text-primary'
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                })}
                <div className="pt-4 mt-2 border-t border-border">
                  <Link
                    href="/locations"
                    onClick={() => setOpen(false)}
                    className={cn(buttonVariants(), 'w-full bg-primary hover:bg-ruby-700 justify-center')}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Find Sites Near Me
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
