// lib/api/auth.ts
import { randomBytes, createHash, timingSafeEqual } from 'crypto'
import { SignJWT, jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'naya-dev-secret-change-in-production-min-32-chars'
)
const SESSION_DAYS = 30
const COOKIE_NAME = 'naya_session'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  if (password.length < 8)     errors.push('Minimum 8 characters required')
  if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter required')
  if (!/[0-9]/.test(password)) errors.push('At least one number required')
  if (!/[!@#$%^&*()_+\-=\[\]{}|,.<>?]/.test(password)) errors.push('At least one special character required')
  return { valid: errors.length === 0, errors }
}

export function generateSecureToken(): string { return randomBytes(32).toString('hex') }
export function hashToken(token: string): string { return createHash('sha256').update(token).digest('hex') }

export async function createSessionToken(userId: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_DAYS * 24 * 60 * 60
  return new SignJWT({ sub: userId }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime(exp).sign(JWT_SECRET)
}

export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload.sub as string
  } catch { return null }
}

export function attachSessionCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  })
  return res
}

export function clearSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
  return res
}

export function getSessionTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get(COOKIE_NAME)?.value ?? null
}

export async function getCurrentUser(req: NextRequest) {
  const token = getSessionTokenFromRequest(req)
  if (!token) return null
  const userId = await verifySessionToken(token)
  if (!userId) return null
  return prisma.user.findUnique({
    where: { id: userId, isActive: true, isBanned: false },
    include: {
      agentProfile: {
        select: { id: true, plan: true, badge: true, rsspcStatus: true, agencyName: true, totalListings: true, activeListings: true, avgRating: true }
      }
    }
  })
}

export async function createPasswordResetToken(userId: string, ipAddress?: string): Promise<string> {
  await prisma.passwordResetToken.updateMany({ where: { userId, usedAt: null }, data: { usedAt: new Date() } })
  const rawToken = generateSecureToken()
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000)
  await prisma.passwordResetToken.create({ data: { userId, tokenHash: hashToken(rawToken), expiresAt, ipAddress } })
  return rawToken
}

export async function validatePasswordResetToken(rawToken: string) {
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(rawToken) }, include: { user: true } })
  if (!record)        return { valid: false, error: 'Invalid reset link' }
  if (record.usedAt)  return { valid: false, error: 'Reset link already used' }
  if (record.expiresAt < new Date()) return { valid: false, error: 'Reset link has expired' }
  return { valid: true, record }
}

export async function createEmailVerificationToken(userId: string, email: string): Promise<string> {
  const rawToken = generateSecureToken()
  await prisma.emailVerificationToken.create({ data: { userId, email, tokenHash: hashToken(rawToken), expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) } })
  return rawToken
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
export function checkRateLimit(key: string, max = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const e = rateLimitMap.get(key)
  if (!e || now > e.resetAt) { rateLimitMap.set(key, { count: 1, resetAt: now + windowMs }); return true }
  if (e.count >= max) return false
  e.count++; return true
}
