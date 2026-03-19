// auth.ts — NextAuth v5 configuration
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
import { verifyPassword, createSessionToken } from '@/lib/api/auth'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })
        if (!user || !user.isActive) return null
        const valid = await verifyPassword(credentials.password as string, user.passwordHash)
        if (!valid) return null
        return {
          id:          user.id,
          email:       user.email,
          name:        `${user.firstName} ${user.lastName}`,
          accountType: user.accountType,
        }
      }
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Handle Google OAuth — create user if new
      if (account?.provider === 'google' && user.email) {
        const existing = await prisma.user.findUnique({ where: { email: user.email } })
        if (!existing) {
          const nameParts = (user.name || '').split(' ')
          await prisma.user.create({
            data: {
              email:         user.email,
              firstName:     nameParts[0] || 'User',
              lastName:      nameParts.slice(1).join(' ') || '',
              passwordHash:  '', // no password for OAuth users
              accountType:   'SEEKER',
              emailVerified: true,
              avatarUrl:     user.image || undefined,
            }
          })
        }
      }
      return true
    },

    async jwt({ token, user, account }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { agentProfile: { select: { id: true, plan: true, badge: true } } }
        })
        if (dbUser) {
          token.id          = dbUser.id
          token.accountType = dbUser.accountType
          token.agentProfile = dbUser.agentProfile
        }
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id          = token.id as string
        session.user.accountType = token.accountType as string
        session.user.agentProfile = token.agentProfile as any
      }
      return session
    },
  },

  pages: {
    signIn:  '/login',
    signOut: '/login',
    error:   '/login',
  },

  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
})
