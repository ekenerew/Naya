// lib/api/auth.ts
// Authentication utilities for Naya

import { randomBytes, createHash, timingSafeEqual } from 'crypto'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// ── Constants ──────────────────────────────────────────────────
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'naya-dev-secret-change-in-production'
)
const SESSION_DURATION_DAYS = 30
const RESET_TOKEN_EXPIRY_MINS = 30
const EMAIL_TOKEN_EXPIRY_HRS = 24
const SALT_ROUNDS = 12

// ── Password Hashing ──────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function validatePasswordStrength(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  if (password.length < 8) errors.push('Minimum 8 characters required')
  if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter required')
  if (!/[0-9]/.test(password)) errors.push('At least one number required')
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    errors.push('At least one special character required')
  return { valid: errors.length === 0, errors }
}

// ── Token Generation ──────────────────────────────────────────
export function generateSecureToken(): string {
  return randomBytes(32).toString('hex')
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function tokensMatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

// ── JWT Session Tokens ────────────────────────────────────────
export async function createSessionToken(userId: string): Promise<string> {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS)

  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(JWT_SECRET)
}

export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload.sub as string
  } catch {
    return null
  }
}

// ── Session Cookie ────────────────────────────────────────────
export function setSessionCookie(token: string): void {
  const cookieStore = cookies()
  cookieStore.set('naya_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
  })
}

export function clearSessionCookie(): void {
  const cookieStore = cookies()
  cookieStore.delete('naya_session')
}

export function getSessionToken(req?: NextRequest): string | null {
  if (req) {
    return req.cookies.get('naya_session')?.value ?? null
  }
  const cookieStore = cookies()
  return cookieStore.get('naya_session')?.value ?? null
}

// ── Get Current User ──────────────────────────────────────────
export async function getCurrentUser(req?: NextRequest) {
  const token = getSessionToken(req)
  if (!token) return null

  const userId = await verifySessionToken(token)
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { id: userId, isActive: true, isBanned: false },
    include: {
      agentProfile: {
        select: {
          id: true, plan: true, badge: true,
          rsspcStatus: true, agencyName: true,
          totalListings: true, avgRating: true,
        }
      }
    }
  })

  return user
}

// ── Password Reset ────────────────────────────────────────────
export async function createPasswordResetToken(
  userId: string,
  ipAddress?: string
): Promise<string> {
  // Invalidate old tokens
  await prisma.passwordResetToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() }
  })

  const rawToken = generateSecureToken()
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + RESET_TOKEN_EXPIRY_MINS)

  await prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash: hashToken(rawToken),
      expiresAt,
      ipAddress,
    }
  })

  return rawToken
}

export async function validatePasswordResetToken(rawToken: string) {
  const tokenHash = hashToken(rawToken)
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true }
  })

  if (!record) return { valid: false, error: 'Invalid reset link' }
  if (record.usedAt) return { valid: false, error: 'Reset link already used' }
  if (record.expiresAt < new Date()) return { valid: false, error: 'Reset link has expired' }

  return { valid: true, record }
}

// ── Email Verification ────────────────────────────────────────
export async function createEmailVerificationToken(
  userId: string,
  email: string
): Promise<string> {
  const rawToken = generateSecureToken()
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + EMAIL_TOKEN_EXPIRY_HRS)

  await prisma.emailVerificationToken.create({
    data: {
      userId,
      email,
      tokenHash: hashToken(rawToken),
      expiresAt,
    }
  })

  return rawToken
}

// ── Rate Limiting (simple in-memory — replace with Redis in prod) ──
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= maxAttempts) return false

  entry.count++
  return true
}
