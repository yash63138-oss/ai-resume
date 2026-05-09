import { Metadata } from 'next'
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'ResumeAI — AI-Powered Resume Analyzer',
    template: '%s | ResumeAI',
  },
  description: 'Get instant AI-powered resume analysis, ATS compatibility scores, and actionable suggestions. Used by 10,000+ job seekers to land their dream jobs.',
  keywords: ['resume analyzer', 'AI resume', 'ATS score', 'resume review', 'job search', 'career tools'],
  authors: [{ name: 'ResumeAI Team' }],
  openGraph: {
    type: 'website',
    title: 'ResumeAI — AI-Powered Resume Analyzer',
    description: 'Get instant AI-powered resume analysis & actionable suggestions to land your dream job.',
    siteName: 'ResumeAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResumeAI — AI-Powered Resume Analyzer',
    description: 'Get instant AI-powered resume analysis & actionable suggestions.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${jetbrains.variable} dark`} suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e1e4a',
              color: '#f0f0ff',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#1e1e4a',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#1e1e4a',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
