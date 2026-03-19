// app/api/auth/logout/route.ts
import { NextRequest } from 'next/server'
import { clearSessionCookie, getCurrentUser } from '@/lib/api/auth'
import { ok, auditLog } from '@/lib/api/helpers'
import { AuditAction } from '@prisma/client'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (user) {
    await auditLog(AuditAction.LOGOUT, user.id, {}, req)
  }
  clearSessionCookie()
  return ok({ message: 'Logged out successfully' })
}
