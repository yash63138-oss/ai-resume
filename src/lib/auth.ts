import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

/**
 * Get the current authenticated user session.
 * Drop-in replacement for the old NextAuth `auth()` function.
 * Returns a session object compatible with the existing codebase.
 */
export async function auth(): Promise<{
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
    role: string
  }
} | null> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user || !user.email) return null

    // Lookup the user in our Prisma DB
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true, name: true, email: true, image: true, role: true },
    })

    // Auto-create user in Prisma DB if they don't exist yet
    // (handles race condition where proxy lets them through but callback hasn't synced yet)
    if (!dbUser) {
      const FREE_CREDITS = parseInt(process.env.FREE_CREDITS_ON_SIGNUP ?? '2', 10)

      dbUser = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
            image: user.user_metadata?.avatar_url ?? null,
            provider: user.app_metadata?.provider ?? 'google',
          },
          select: { id: true, name: true, email: true, image: true, role: true },
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

        return newUser
      })
    }

    return {
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
        role: dbUser.role,
      },
    }
  } catch (err) {
    console.error('[auth] Session check failed:', err)
    return null
  }
}
