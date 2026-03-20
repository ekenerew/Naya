// app/api/auth/google-callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createSessionToken, attachSessionCookie } from '@/lib/api/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code  = searchParams.get('code')
  const error = searchParams.get('error')
  const appUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://naya-fawn.vercel.app'

  if (error || !code) {
    return NextResponse.redirect(`${appUrl}/login?error=google_cancelled`)
  }

  try {
    const redirectUri = `${appUrl}/api/auth/google-callback`

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id:     process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri:  redirectUri,
        grant_type:    'authorization_code',
      }),
    })

    const tokens = await tokenRes.json()
    if (!tokenRes.ok || !tokens.access_token) {
      console.error('Token exchange failed:', tokens)
      return NextResponse.redirect(`${appUrl}/login?error=google_token_failed`)
    }

    // Get user info from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const googleUser = await userRes.json()

    if (!googleUser.email) {
      return NextResponse.redirect(`${appUrl}/login?error=google_no_email`)
    }

    // Find or create user in our DB
    let user = await prisma.user.findUnique({ where: { email: googleUser.email } })

    if (!user) {
      // New user — create account
      user = await prisma.user.create({
        data: {
          email:         googleUser.email,
          firstName:     googleUser.given_name  || googleUser.name?.split(' ')[0] || 'User',
          lastName:      googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || '',
          passwordHash:  '', // No password for Google users
          accountType:   'SEEKER',
          emailVerified: true,
          avatarUrl:     googleUser.picture || null,
          isActive:      true,
        }
      })
    } else {
      // Update avatar if missing
      if (!user.avatarUrl && googleUser.picture) {
        await prisma.user.update({
          where: { id: user.id },
          data: { avatarUrl: googleUser.picture, lastLoginAt: new Date() }
        })
      }
    }

    if (!user.isActive) {
      return NextResponse.redirect(`${appUrl}/login?error=account_disabled`)
    }

    // Create session
    const sessionToken = await createSessionToken(user.id)

    // Redirect based on account type
    const dest = ['AGENT','LANDLORD'].includes(user.accountType)
      ? `${appUrl}/portal/dashboard`
      : `${appUrl}/search`

    const response = NextResponse.redirect(dest)
    return attachSessionCookie(response, sessionToken)

  } catch (e) {
    console.error('Google callback error:', e)
    return NextResponse.redirect(`${appUrl}/login?error=google_failed`)
  }
}
