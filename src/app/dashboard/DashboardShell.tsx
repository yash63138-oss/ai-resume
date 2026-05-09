'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Brain,
  LayoutDashboard,
  Upload,
  History,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  Coins,
  Bell,
  ChevronRight,
} from 'lucide-react'

interface DashboardShellProps {
  children: React.ReactNode
  balance: number
  userName: string
  userEmail: string
  userInitials: string
  isAdmin: boolean
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/upload', label: 'Analyze Resume', icon: Upload },
  { href: '/dashboard/history', label: 'History', icon: History },
  { href: '/dashboard/wallet', label: 'Wallet & Credits', icon: Wallet },
] as const

export default function DashboardShell({
  children,
  balance,
  userName,
  userEmail,
  userInitials,
  isAdmin,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])
  const openSidebar = useCallback(() => setSidebarOpen(true), [])

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  // ── Sidebar Navigation Links ─────────────────────────
  const SidebarLinks = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-white/[0.05] flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-brand">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <span className="font-display font-bold text-lg">
          Resume<span className="gradient-text">AI</span>
        </span>
        {/* Mobile close button inside drawer */}
        <button
          onClick={closeSidebar}
          className="ml-auto lg:hidden btn-ghost p-1.5"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Credit badge */}
      <div className="px-4 py-4 border-b border-white/[0.05] flex-shrink-0">
        <Link
          href="/dashboard/wallet"
          onClick={closeSidebar}
          className="credit-badge w-full justify-between hover:border-brand-400/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4" />
            <span>{balance} Credits</span>
          </div>
          <span className="text-xs text-white/40 flex items-center gap-1">
            Buy more <ChevronRight className="w-3 h-3" />
          </span>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
        <span className="section-title px-3">Navigation</span>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={closeSidebar}
            aria-current={isActive(item.href) ? 'page' : undefined}
            className={`sidebar-item ${isActive(item.href) ? 'active' : ''}`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </Link>
        ))}

        {isAdmin && (
          <>
            <span className="section-title px-3 mt-6">Admin</span>
            <Link
              href="/admin/users"
              onClick={closeSidebar}
              aria-current={pathname.startsWith('/admin/users') ? 'page' : undefined}
              className={`sidebar-item ${pathname.startsWith('/admin/users') ? 'active' : ''}`}
            >
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
              User Management
            </Link>
            <Link
              href="/admin/analytics"
              onClick={closeSidebar}
              aria-current={pathname.startsWith('/admin/analytics') ? 'page' : undefined}
              className={`sidebar-item ${pathname.startsWith('/admin/analytics') ? 'active' : ''}`}
            >
              <History className="w-4 h-4 flex-shrink-0" />
              Analytics
            </Link>
          </>
        )}
      </nav>

      {/* Bottom: settings + logout + user */}
      <div className="px-3 py-4 border-t border-white/[0.05] space-y-1 flex-shrink-0">
        <Link href="/dashboard/settings" onClick={closeSidebar} className="sidebar-item">
          <Settings className="w-4 h-4 flex-shrink-0" />
          Settings
        </Link>

        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="sidebar-item w-full text-left text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Sign Out
          </button>
        </form>

        {/* User info card */}
        <div className="flex items-center gap-3 px-3 py-3 mt-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
          <div
            aria-hidden="true"
            className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center text-xs font-bold text-white flex-shrink-0 select-none"
          >
            {userInitials}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{userName || 'User'}</div>
            <div className="text-xs text-white/30 truncate">{userEmail}</div>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-surface-DEFAULT">
      {/* ── DESKTOP SIDEBAR ─────────────────────── */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 bottom-0 z-40 w-64 flex-col border-r border-white/[0.05] bg-surface-card/80 backdrop-blur-xl"
        aria-label="Sidebar navigation"
      >
        <SidebarLinks />
      </aside>

      {/* ── MOBILE BACKDROP ─────────────────────── */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* ── MOBILE SLIDE-IN DRAWER ──────────────── */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 w-72 max-w-[85vw] flex flex-col border-r border-white/[0.05] bg-surface-card backdrop-blur-xl transition-transform duration-300 ease-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
      >
        <SidebarLinks />
      </aside>

      {/* ── MOBILE TOP HEADER ───────────────────── */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-16 border-b border-white/[0.05] bg-surface-card/90 backdrop-blur-xl">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={closeSidebar}>
          <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold">
            Resume<span className="gradient-text">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/wallet" className="credit-badge text-xs py-1.5 px-3">
            <Coins className="w-3 h-3" />
            {balance}
          </Link>
          <button
            id="mobile-menu-toggle"
            onClick={openSidebar}
            className="btn-ghost p-2"
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
            aria-controls="mobile-sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ── MOBILE BOTTOM NAV ───────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex border-t border-white/[0.05] bg-surface-card/95 backdrop-blur-xl"
        aria-label="Mobile navigation"
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? 'page' : undefined}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors min-h-[56px] ${
              isActive(item.href) ? 'text-brand-400' : 'text-white/40 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">
              {item.label.split(' ')[0]}
            </span>
          </Link>
        ))}
      </nav>

      {/* ── MAIN CONTENT ────────────────────────── */}
      <main className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        {/* Desktop top bar */}
        <div className="hidden lg:flex items-center justify-between px-8 h-16 border-b border-white/[0.05] sticky top-0 z-20 bg-surface-DEFAULT/90 backdrop-blur-xl">
          <div />
          <div className="flex items-center gap-3">
            <button
              id="notifications-btn"
              className="btn-ghost p-2 relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" aria-hidden="true" />
            </button>
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div
                aria-hidden="true"
                className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center text-xs font-bold text-white select-none"
              >
                {userInitials}
              </div>
              <div className="text-sm font-medium">{userName || 'User'}</div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
