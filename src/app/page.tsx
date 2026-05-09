import Link from 'next/link'
import { Metadata } from 'next'
import LandingNav from '@/components/layout/LandingNav'
import {
  Brain,
  Zap,
  Shield,
  TrendingUp,
  FileText,
  Star,
  CheckCircle2,
  ArrowRight,
  Upload,
  BarChart3,
  Download,
  Coins,
  ChevronRight,
  Sparkles,
  Users,
  Award
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'ResumeAI — AI-Powered Resume Analyzer',
  description: 'Get instant AI-powered resume analysis, ATS compatibility scores, and actionable suggestions to land your dream job. Starting at just ₹99.',
}

const FEATURES = [
  {
    icon: Brain,
    title: 'GPT-4o Analysis',
    description: 'Powered by OpenAI\'s most advanced model for precise, contextual resume feedback.',
    color: '#4f5eff',
  },
  {
    icon: BarChart3,
    title: 'ATS Compatibility Score',
    description: 'Know exactly how well your resume passes Applicant Tracking Systems before applying.',
    color: '#8b5cf6',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get your comprehensive analysis in under 30 seconds. No waiting, no delays.',
    color: '#06b6d4',
  },
  {
    icon: TrendingUp,
    title: 'Section-by-Section Scores',
    description: 'Detailed scoring for Contact, Summary, Experience, Education, Skills & Formatting.',
    color: '#10b981',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your resume data is encrypted and never shared. Delete anytime.',
    color: '#f59e0b',
  },
  {
    icon: Download,
    title: 'PDF Reports',
    description: 'Download beautiful, shareable analysis reports to track your progress.',
    color: '#ec4899',
  },
]

const PRICING = [
  {
    name: 'Starter',
    credits: 5,
    priceInr: '₹99',
    priceUsd: '$1.19',
    perCredit: '₹19.8/analysis',
    features: ['5 resume analyses', 'AI Score & Suggestions', 'Section Scores', 'Keyword Analysis'],
    popular: false,
    gradient: 'from-slate-800 to-slate-900',
  },
  {
    name: 'Pro',
    credits: 25,
    priceInr: '₹399',
    priceUsd: '$4.79',
    perCredit: '₹15.96/analysis',
    features: ['25 resume analyses', 'AI Score & Suggestions', 'Section Scores', 'Keyword Analysis', 'PDF Reports', 'Priority Processing'],
    popular: true,
    gradient: 'from-brand-900 to-purple-900',
  },
  {
    name: 'Enterprise',
    credits: 100,
    priceInr: '₹1,299',
    priceUsd: '$15.59',
    perCredit: '₹12.99/analysis',
    features: ['100 resume analyses', 'AI Score & Suggestions', 'Section Scores', 'Keyword Analysis', 'PDF Reports', 'Priority Processing', 'Admin Dashboard', 'API Access'],
    popular: false,
    gradient: 'from-slate-800 to-slate-900',
  },
]

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer at Google',
    avatar: 'PS',
    rating: 5,
    text: 'ResumeAI helped me identify missing keywords that were causing my rejections. After implementing the suggestions, I landed 3 interviews in a week!',
    color: '#4f5eff',
  },
  {
    name: 'Rahul Mehta',
    role: 'Product Manager at Flipkart',
    avatar: 'RM',
    rating: 5,
    text: 'The ATS compatibility score was eye-opening. I went from 45% to 89% after following the AI recommendations. Got my dream job!',
    color: '#8b5cf6',
  },
  {
    name: 'Ananya Patel',
    role: 'Data Scientist at Amazon',
    avatar: 'AP',
    rating: 5,
    text: 'As a career coach, I use ResumeAI for all my clients. The detailed section analysis saves hours of manual review. Worth every rupee!',
    color: '#10b981',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Upload Your Resume',
    description: 'Drag & drop your PDF or DOCX file. Supports up to 5MB.',
    icon: Upload,
  },
  {
    step: '02',
    title: 'AI Analyzes It',
    description: 'GPT-4o reads every section and benchmarks against 10,000+ successful resumes.',
    icon: Brain,
  },
  {
    step: '03',
    title: 'Get Your Score',
    description: 'Receive an overall score, section scores, and specific actionable suggestions.',
    icon: BarChart3,
  },
  {
    step: '04',
    title: 'Land Your Dream Job',
    description: 'Implement changes, re-analyze, and track your improvement over time.',
    icon: Award,
  },
]

const STATS = [
  { value: '50K+', label: 'Resumes Analyzed' },
  { value: '92%', label: 'User Satisfaction' },
  { value: '3x', label: 'More Interviews' },
  { value: '30s', label: 'Average Analysis Time' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen mesh-bg">
      {/* Navigation — client component with mobile hamburger */}
      <LandingNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background glows */}
        <div className="hero-glow w-96 h-96 bg-brand-500 -top-20 -left-20" />
        <div className="hero-glow w-96 h-96 bg-accent-purple top-20 right-0" />
        <div className="hero-glow w-64 h-64 bg-accent-pink bottom-0 left-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-sm font-medium mb-8 animate-in">
            <Sparkles className="w-4 h-4 text-brand-400" />
            Powered by GPT-4o — Get 2 Free Credits on Signup
            <ChevronRight className="w-4 h-4" />
          </div>

          {/* Heading */}
          <h1 className="text-balance animate-in delay-100">
            Your Resume Score in
            <br />
            <span className="gradient-text">30 Seconds, Not 30 Days</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto text-balance animate-in delay-200">
            AI-powered resume analysis that tells you exactly what to fix.
            Beat ATS systems, land more interviews, get your dream job.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-in delay-300">
            <Link href="/register" id="hero-cta-primary" className="btn-primary text-base px-8 py-4">
              Analyze My Resume Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#how-it-works" id="hero-cta-secondary" className="btn-secondary text-base px-8 py-4">
              <FileText className="w-5 h-5" />
              See How It Works
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10 text-sm text-white/40 animate-in delay-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              2 free analyses on signup
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Results in under 30 seconds
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto animate-in delay-500">
            {STATS.map((stat) => (
              <div key={stat.label} className="glass-card p-5 text-center">
                <div className="font-display font-bold text-2xl gradient-text">{stat.value}</div>
                <div className="text-xs text-white/40 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="badge-brand mx-auto mb-4 w-fit">Simple Process</div>
            <h2>How ResumeAI Works</h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto">
              From upload to actionable insights in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative glass-card-hover p-6 text-center group">
                <div className="w-12 h-12 rounded-xl bg-gradient-brand mx-auto mb-4 flex items-center justify-center shadow-brand group-hover:shadow-brand-lg transition-all duration-300 animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <div className="font-display font-bold text-5xl gradient-text opacity-20 mb-2">{step.step}</div>
                <h3 className="font-display font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-white/50">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="hero-glow w-96 h-96 bg-accent-cyan top-10 right-0 opacity-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="badge-brand mx-auto mb-4 w-fit">Features</div>
            <h2>Everything You Need to <span className="gradient-text">Ace Your Job Search</span></h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto">
              Comprehensive analysis tools built for serious job seekers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="glass-card-hover p-6 group">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${feature.color}20`, border: `1px solid ${feature.color}30` }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <h3 className="font-display font-semibold text-base mb-2">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Score Demo Section */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="premium-card p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text */}
              <div>
                <div className="badge-brand mb-4 w-fit">Sample Analysis</div>
                <h2 className="mb-4">See What Your <span className="gradient-text">Analysis Looks Like</span></h2>
                <p className="text-white/50 mb-6">
                  Get a detailed breakdown of every section of your resume with specific, actionable suggestions from our AI.
                </p>
                <div className="space-y-3">
                  {[
                    { label: 'Add quantifiable achievements to experience', done: false },
                    { label: 'Include Docker & CI/CD keywords', done: false },
                    { label: 'Professional summary needs to be stronger', done: false },
                    { label: 'Contact section is complete', done: true },
                    { label: 'Education section is well-structured', done: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${item.done ? 'text-emerald-400' : 'text-white/20'}`} />
                      <span className={item.done ? 'text-white/60' : 'text-white/40 line-through'}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
                <Link href="/register" className="btn-primary mt-8 w-fit">
                  Try It Free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Right: Score Visualization */}
              <div className="space-y-4">
                {/* Overall Score */}
                <div className="glass-card p-6 text-center relative overflow-hidden">
                  <div className="text-6xl font-display font-bold gradient-text">72</div>
                  <div className="text-white/40 text-sm mt-1">Overall Score</div>
                  <div className="badge-warning mx-auto mt-3 w-fit">Average — Room to Improve</div>
                </div>

                {/* Section Scores */}
                <div className="glass-card p-5 space-y-4">
                  {[
                    { label: 'Contact Info', score: 90, color: '#10b981' },
                    { label: 'Experience', score: 80, color: '#06b6d4' },
                    { label: 'Education', score: 85, color: '#4f5eff' },
                    { label: 'Skills', score: 60, color: '#f59e0b' },
                    { label: 'Summary', score: 65, color: '#8b5cf6' },
                    { label: 'Formatting', score: 70, color: '#ec4899' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-white/60">{item.label}</span>
                        <span className="font-semibold" style={{ color: item.color }}>{item.score}</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${item.score}%`, background: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 relative">
        <div className="hero-glow w-96 h-96 bg-accent-purple bottom-0 left-0 opacity-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="badge-brand mx-auto mb-4 w-fit">Pricing</div>
            <h2>Simple, <span className="gradient-text">Pay-as-You-Go</span> Pricing</h2>
            <p className="mt-4 text-white/50">
              No subscriptions. Buy credits when you need them. Start with 2 free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${plan.popular ? 'border-2 border-brand-500/50' : 'border border-white/[0.06]'}`}
                style={{
                  background: plan.popular
                    ? 'linear-gradient(135deg, rgba(79,94,255,0.12) 0%, rgba(139,92,246,0.08) 100%)'
                    : 'rgba(255,255,255,0.02)',
                  boxShadow: plan.popular ? '0 0 40px rgba(79,94,255,0.2)' : undefined,
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="badge-brand px-4 py-1.5 text-xs font-bold">
                      <Star className="w-3 h-3" /> Most Popular
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <div className="font-display font-bold text-lg mb-1">{plan.name}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-bold text-4xl gradient-text">{plan.priceInr}</span>
                    <span className="text-white/30 text-sm">{plan.priceUsd}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-amber-400">{plan.credits} credits</span>
                    <span className="text-white/30 text-xs">({plan.perCredit})</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-white/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  id={`pricing-${plan.name.toLowerCase()}-cta`}
                  className={plan.popular ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-white/30 text-sm mt-8">
            All plans include: PDF/DOCX support, secure storage, analysis history, and email support.
            <br />Credits never expire.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="badge-brand mx-auto mb-4 w-fit">
              <Users className="w-3 h-3" /> Testimonials
            </div>
            <h2>Loved by <span className="gradient-text">10,000+ Job Seekers</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="glass-card-hover p-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-white/60 leading-relaxed mb-6">"{t.text}"</p>

                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white"
                    style={{ background: `${t.color}30`, border: `1px solid ${t.color}50` }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-white/40">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center" style={{ background: 'linear-gradient(135deg, #4f5eff20 0%, #8b5cf620 50%, #ec489920 100%)', border: '1px solid rgba(79,94,255,0.3)' }}>
            <div className="hero-glow w-64 h-64 bg-brand-500 top-0 left-1/2 -translate-x-1/2" />
            <h2 className="relative mb-4">
              Ready to Land Your<br />
              <span className="gradient-text">Dream Job?</span>
            </h2>
            <p className="relative text-white/50 mb-8 max-w-md mx-auto text-sm sm:text-base">
              Join 50,000+ professionals who have improved their resumes with ResumeAI.
              Start with 2 free analyses — no credit card needed.
            </p>
            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" id="cta-banner-primary" className="btn-primary text-sm sm:text-base px-8 sm:px-10 py-3.5 sm:py-4 w-full sm:w-auto">
                Start Analyzing Free
                <Sparkles className="w-5 h-5" />
              </Link>
              <div className="text-sm text-white/40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                2 free credits. No card needed.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-lg">
                  Resume<span className="gradient-text">AI</span>
                </span>
              </Link>
              <p className="text-sm text-white/40 max-w-xs leading-relaxed">
                AI-powered resume analysis to help job seekers land their dream jobs faster and smarter.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-white/40">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-white/40">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.05] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/30">
              © 2026 ResumeAI. All rights reserved. 1 credit = 1 analysis.
            </p>
            <p className="text-sm text-white/20">
              Built with ❤️ for job seekers everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
