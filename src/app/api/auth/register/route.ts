import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

const FREE_CREDITS = parseInt(process.env.FREE_CREDITS_ON_SIGNUP || '2')

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password } = registerSchema.parse(body)

    // Check if user already exists in Prisma
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    // Sign up via Supabase Auth
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (data.user) {
      // Create user + wallet in Prisma
      await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            id: data.user!.id,
            name,
            email,
            provider: 'credentials',
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
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message || 'Validation error' }, { status: 400 })
    }
    console.error('[REGISTER ERROR]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
