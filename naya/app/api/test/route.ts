import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const checks: any = {}
  
  // Check env vars
  checks.DATABASE_URL = !!process.env.DATABASE_URL ? 'SET' : 'MISSING'
  checks.JWT_SECRET = !!process.env.JWT_SECRET ? 'SET' : 'MISSING'
  checks.TERMII_API_KEY = !!process.env.TERMII_API_KEY ? 'SET' : 'MISSING'
  
  // Check DB connection
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = 'CONNECTED'
  } catch (e: any) {
    checks.database = `ERROR: ${e.message?.slice(0, 100)}`
  }

  // Check user count
  try {
    const count = await prisma.user.count()
    checks.userCount = count
  } catch (e: any) {
    checks.userCount = `ERROR: ${e.message?.slice(0, 100)}`
  }

  return NextResponse.json(checks)
}
