'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Brain, Eye, EyeOff, Github, Chrome, Loader2, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)

  const passwordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const strength = passwordStrength(formData.password)
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['', '#ef4444', '#f59e0b', '#06b6d4', '#10b981']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.name },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      })

      if (error) {
        toast.error(error.message || 'Registration failed')
      } else {
        toast.success('Account created! Check your email to confirm your address.')
        router.push('/login')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    setOauthLoading(provider)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      })
      if (error) {
        toast.error(error.message || 'OAuth sign in failed')
        setOauthLoading(null)
      }
    } catch {
      toast.error('OAuth sign in failed')
      setOauthLoading(null)
    }
  }

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4">
      <div className="hero-glow w-96 h-96 bg-accent-purple top-0 right-0" />
      <div className="hero-glow w-64 h-64 bg-brand-500 bottom-0 left-0" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="premium-card p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-brand mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold">Create your account</h1>
            <p className="text-white/40 text-sm mt-1">Start with 2 free resume analyses</p>
          </div>

          {/* Free Credits Banner */}
          <div className="mb-6 p-4 rounded-xl border border-brand-500/20 bg-brand-500/5 flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-brand-400 flex-shrink-0" />
            <p className="text-xs text-brand-300/80">
              🎉 Get <span className="font-bold text-brand-400">2 free credits</span> instantly — no credit card required!
            </p>
          </div>

          {/* OAuth */}
          <div className="space-y-3 mb-6">
            <button
              id="register-google-btn"
              onClick={() => handleOAuth('google')}
              disabled={!!oauthLoading}
              className="btn-secondary w-full justify-center"
            >
              {oauthLoading === 'google' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Chrome className="w-4 h-4" />}
              Continue with Google
            </button>
            <button
              id="register-github-btn"
              onClick={() => handleOAuth('github')}
              disabled={!!oauthLoading}
              className="btn-secondary w-full justify-center"
            >
              {oauthLoading === 'github' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
              Continue with GitHub
            </button>
          </div>

          <div className="divider">
            <span className="text-xs text-white/30 px-2">or register with email</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div>
              <label htmlFor="register-name" className="block text-sm font-medium text-white/60 mb-2">Full Name</label>
              <input
                id="register-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-white/60 mb-2">Email address</label>
              <input
                id="register-email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-white/60 mb-2">Password</label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.08)' }}
                      />
                    ))}
                  </div>
                  <p className="text-xs mt-1" style={{ color: strengthColors[strength] }}>
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="register-confirm-password" className="block text-sm font-medium text-white/60 mb-2">
                Confirm Password
              </label>
              <input
                id="register-confirm-password"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Re-enter your password"
                className="input-field"
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>

            <p className="text-xs text-white/30">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-brand-400 hover:underline">Terms of Service</Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-brand-400 hover:underline">Privacy Policy</Link>.
            </p>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Create Free Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-2">
            {['2 free resume analyses', 'No credit card required', 'Full AI-powered analysis'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-white/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {item}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
