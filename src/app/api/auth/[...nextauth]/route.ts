import { NextResponse } from 'next/server'

// NextAuth is no longer used — auth is handled by Supabase.
// This route exists only to prevent 404s from any lingering redirects.

export async function GET() {
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
}

export async function POST() {
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
}
