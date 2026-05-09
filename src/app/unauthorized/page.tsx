import Link from 'next/link'
import { Brain, ShieldAlert } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Access Denied | ResumeAI',
}

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4">
      <div className="hero-glow w-64 h-64 bg-red-500 top-0 left-1/2 -translate-x-1/2 opacity-10" />

      <div className="relative text-center max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl">
              Resume<span className="gradient-text">AI</span>
            </span>
          </Link>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-red-400" />
        </div>

        <h1 className="text-2xl font-display font-bold mb-3">Access Denied</h1>
        <p className="text-white/50 mb-8">
          You don&apos;t have permission to view this page. Please sign in with the correct account.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="btn-primary">Sign In</Link>
          <Link href="/" className="btn-secondary">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
