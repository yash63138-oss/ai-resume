'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Brain, Menu, X, Sparkles } from 'lucide-react'

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#testimonials', label: 'Reviews' },
]

export default function LandingNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? 'border-white/[0.08] bg-surface-DEFAULT/95 backdrop-blur-xl'
            : 'border-white/[0.05] bg-surface-DEFAULT/80 backdrop-blur-xl'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-brand group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                Resume<span className="gradient-text">AI</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="btn-ghost">Sign In</Link>
              <Link href="/register" className="btn-primary text-sm px-5 py-2.5">
                Start Free <Sparkles className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile: right side */}
            <div className="flex md:hidden items-center gap-2">
              <Link href="/register" className="btn-primary text-xs px-4 py-2">
                Start Free
              </Link>
              <button
                onClick={() => setOpen(!open)}
                className="btn-ghost p-2"
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 border-b border-white/[0.08] bg-surface-card/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        role="dialog"
        aria-label="Navigation menu"
      >
        <div className="px-4 py-6 space-y-2">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center h-12 px-4 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-4 border-t border-white/[0.06] space-y-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="btn-secondary w-full justify-center"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="btn-primary w-full justify-center"
            >
              Start Free — 2 Credits <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
