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

  // Check Anthropic key
  checks.ANTHROPIC_API_KEY = !!process.env.ANTHROPIC_API_KEY ? 'SET' : 'MISSING'
  
  // Test AI call
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hi' }]
        })
      })
      const d = await r.json()
      checks.ai_test = r.ok ? 'WORKING' : ('ERROR: ' + (d.error?.message || JSON.stringify(d)).slice(0, 100))
    } catch(e: any) {
      checks.ai_test = 'FETCH_ERROR: ' + e.message
    }
  } else {
    checks.ai_test = 'SKIPPED - no API key'
  }

  return NextResponse.json(checks)
}
