// app/api/ai/route.ts
// Server-side proxy for Anthropic API — keeps API key secure
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })
  }

  let body: any
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { messages, system, max_tokens = 1000, feature } = body

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: 'Messages required' }, { status: 400 })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':         'application/json',
        'x-api-key':            apiKey,
        'anthropic-version':    '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens,
        system,
        messages,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[AI] Anthropic error:', data)
      return NextResponse.json(
        { error: data.error?.message || 'AI service error' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      content: data.content?.[0]?.text || '',
      usage:   data.usage,
    })

  } catch (e: any) {
    console.error('[AI] Fetch error:', e?.message)
    return NextResponse.json({ error: 'Failed to reach AI service' }, { status: 500 })
  }
}
