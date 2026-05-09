import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

const RATE_LIMIT = 60
const WINDOW_MS = 60_000
const rateMap = new Map<string, { count: number; reset: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + WINDOW_MS })
    if (rateMap.size > 10_000) {
      for (const [k, v] of rateMap) if (now > v.reset) rateMap.delete(k)
    }
    return true
  }
  entry.count++
  return entry.count <= RATE_LIMIT
}

const PROTECTED_PAGES = ['/dashboard', '/analysis', '/admin']
const AUTH_PAGES = ['/login', '/register']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Rate limit API routes ────────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
    if (!checkRateLimit(ip)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Slow down.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
      )
    }
  }

  // ── Create Supabase client with cookie handling ──────────────────
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          supabaseResponse = NextResponse.next({ request })
          supabaseResponse.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          supabaseResponse = NextResponse.next({ request })
          supabaseResponse.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  const isProtectedPage = PROTECTED_PAGES.some((p) => pathname.startsWith(p))
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p))

  // ── Redirect unauthenticated from protected pages ────────────────
  if (isProtectedPage && !user) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // ── Redirect authenticated users away from auth pages ───────────
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // ── Protect API routes ───────────────────────────────────────────
  const isProtectedApi = ['/api/resume', '/api/analysis', '/api/payment', '/api/wallet', '/api/admin']
    .some((p) => pathname.startsWith(p))
  if (isProtectedApi && !user) {
    return new NextResponse(
      JSON.stringify({ error: 'Authentication required.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|public/).*)'],
}
