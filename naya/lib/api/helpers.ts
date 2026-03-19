// lib/api/helpers.ts
import { NextResponse } from 'next/server'
import { z, ZodSchema } from 'zod'
import { getCurrentUser } from './auth'
import prisma from '@/lib/prisma'
import { AuditAction } from '@prisma/client'

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}
export function created<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 })
}
export function noContent() {
  return new NextResponse(null, { status: 204 })
}
export function badRequest(message: string, errors?: Record<string, string[]>) {
  return NextResponse.json({ success: false, error: message, errors }, { status: 400 })
}
export function unauthorized(message = 'Authentication required') {
  return NextResponse.json({ success: false, error: message }, { status: 401 })
}
export function forbidden(message = 'You do not have permission to do this') {
  return NextResponse.json({ success: false, error: message }, { status: 403 })
}
export function notFound(resource = 'Resource') {
  return NextResponse.json({ success: false, error: `${resource} not found` }, { status: 404 })
}
export function conflict(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 409 })
}
export function tooManyRequests(message = 'Too many requests. Please try again later.') {
  return NextResponse.json({ success: false, error: message }, { status: 429 })
}
export function serverError(message = 'An unexpected error occurred') {
  return NextResponse.json({ success: false, error: message }, { status: 500 })
}

export async function validate<T>(schema: ZodSchema<T>, body: unknown): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  const result = schema.safeParse(body)
  if (!result.success) {
    const errors: Record<string, string[]> = {}
    result.error.errors.forEach(err => {
      const path = err.path.join('.')
      if (!errors[path]) errors[path] = []
      errors[path].push(err.message)
    })
    return { data: null, error: badRequest('Validation failed', errors) }
  }
  return { data: result.data, error: null }
}

export async function requireAuth(req: any) {
  const user = await getCurrentUser(req)
  if (!user) return { user: null, error: unauthorized() }
  return { user, error: null }
}

export async function requireAgent(req: any) {
  const { user, error } = await requireAuth(req)
  if (error) return { user: null, agent: null, error }
  if (!['AGENT', 'LANDLORD', 'ADMIN'].includes(user!.accountType)) {
    return { user: null, agent: null, error: forbidden('Agent account required') }
  }
  if (!user!.agentProfile) {
    return { user: null, agent: null, error: forbidden('Agent profile not found') }
  }
  return { user, agent: user!.agentProfile, error: null }
}

export async function requireAdmin(req: any) {
  const { user, error } = await requireAuth(req)
  if (error) return { user: null, error }
  if (user!.accountType !== 'ADMIN') return { user: null, error: forbidden() }
  return { user, error: null }
}

export async function auditLog(action: AuditAction, userId: string | null, metadata?: Record<string, unknown>, req?: Request, success = true) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        ipAddress: req ? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() : undefined,
        userAgent: req?.headers.get('user-agent') || undefined,
        metadata: metadata || undefined,
        success,
      }
    })
  } catch (e) {
    console.error('Audit log failed:', e)
  }
}

export function getPagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')))
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

export function paginatedResponse<T>(data: T[], total: number, page: number, limit: number) {
  return {
    data,
    pagination: {
      total, page, limit,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    }
  }
}

export function generateSlug(title: string, id: string): string {
  const base = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim().substring(0, 60)
  return `${base}-${id.substring(0, 8)}`
}

export function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
}
