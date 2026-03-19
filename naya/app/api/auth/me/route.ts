// app/api/auth/me/route.ts
import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/api/auth'
import { ok, unauthorized } from '@/lib/api/helpers'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return unauthorized()

  return ok({
    id:            user.id,
    email:         user.email,
    firstName:     user.firstName,
    lastName:      user.lastName,
    phone:         user.phone,
    avatarUrl:     user.avatarUrl,
    accountType:   user.accountType,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    marketingConsent: user.marketingConsent,
    agentProfile:  user.agentProfile,
    createdAt:     user.createdAt,
    lastLoginAt:   user.lastLoginAt,
  })
}
