import Link from 'next/link'
import { Brain, ArrowLeft, Search } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found | ResumeAI',
}

export default function NotFound() {
  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4">
      <div className="hero-glow w-96 h-96 bg-brand-500 top-0 left-0 opacity-15" />
      <div className="hero-glow w-64 h-64 bg-accent-purple bottom-0 right-0 opacity-10" />

      <div className="relative text-center max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl">
              Resume<span className="gradient-text">AI</span>
            </span>
          </Link>
        </div>

        {/* 404 */}
        <div className="font-display font-bold text-8xl gradient-text mb-4">404</div>
        <h1 className="text-2xl font-display font-bold mb-3">Page Not Found</h1>
        <p className="text-white/50 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
