import { NextRequest, NextResponse } from 'next/server'
import { clearSessionCookie, getCurrentUser } from '@/lib/api/auth'
import { auditLog } from '@/lib/api/helpers'
import { AuditAction } from '@prisma/client'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (user) await auditLog(AuditAction.LOGOUT, user.id, {}, req)
  const response = NextResponse.json({ success: true, data: { message: 'Logged out successfully' } })
  return clearSessionCookie(response)
}
