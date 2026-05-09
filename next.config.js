/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdf-parse', 'mammoth', 'sharp'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  // Disable X-Powered-By header
  poweredByHeader: false,
  // Compress responses
  compress: true,

  async headers() {
    const isDev = process.env.NODE_ENV === 'development'

    // CSP — tighter in production
    const csp = [
      "default-src 'self'",
      // Scripts: allow Razorpay checkout, Google fonts
      isDev
        ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com"
        : "script-src 'self' https://checkout.razorpay.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.supabase.co https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
      "connect-src 'self' https://api.openai.com https://api.razorpay.com https://*.supabase.co",
      "frame-src https://api.razorpay.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; ')

    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Referrer policy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissions policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(self)',
          },
          // CSP
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
          // HSTS (only in production)
          ...(!isDev
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=63072000; includeSubDomains; preload',
                },
              ]
            : []),
          // DNS prefetch control
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/(_next/static|favicon.ico|assets)(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
