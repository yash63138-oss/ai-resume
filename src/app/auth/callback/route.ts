import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

const FREE_CREDITS = parseInt(process.env.FREE_CREDITS_ON_SIGNUP ?? '2', 10)

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const supabaseUser = data.user

      // Ensure the user exists in our Prisma DB and has a wallet
      try {
        const existing = await prisma.user.findUnique({
          where: { email: supabaseUser.email! },
          select: { id: true, wallet: true },
        })

        if (!existing) {
          // Create user + wallet + bonus transaction atomically
          await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
              data: {
                id: supabaseUser.id,
                email: supabaseUser.email!,
                name: supabaseUser.user_metadata?.full_name ?? supabaseUser.user_metadata?.name ?? null,
                image: supabaseUser.user_metadata?.avatar_url ?? null,
                provider: supabaseUser.app_metadata?.provider ?? 'google',
              },
            })

            await tx.wallet.create({
              data: { userId: newUser.id, balance: FREE_CREDITS },
            })

            await tx.transaction.create({
              data: {
                userId: newUser.id,
                type: 'SIGNUP_BONUS',
                amount: FREE_CREDITS,
                balanceAfter: FREE_CREDITS,
                description: `Welcome! ${FREE_CREDITS} free credits on signup`,
              },
            })
          })
        } else if (!existing.wallet) {
          // User exists but has no wallet (edge case)
          await prisma.wallet.create({
            data: { userId: existing.id, balance: 0 },
          })
        }
      } catch (dbError) {
        console.error('[auth/callback] DB sync error:', dbError)
        // Don't fail the login — user is still authenticated in Supabase
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Something went wrong
  return NextResponse.redirect(`${origin}/login?error=OAuthCallbackError`)
}
