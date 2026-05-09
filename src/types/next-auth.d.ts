/**
 * next-auth.d.ts
 *
 * The Session type is extended inline in `src/lib/auth.ts` via
 *   declare module 'next-auth' { interface Session { ... } }
 *
 * This file just extends the JWT to carry `role` for convenience.
 */
import 'next-auth/jwt'

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
  }
}
