import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ 
      error: 'AI not configured', 
      content: 'AI service is not configured yet. Please add ANTHROPIC_API_KEY to Vercel environment variables.' 
    }, { status: 200 }) // Return 200 so frontend shows the message
  }

  let body: any
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { messages, system, max_tokens = 1000 } = body

  if (!messages?.length) {
    return NextResponse.json({ error: 'Messages required' }, { status: 400 })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens,
        ...(system && { system }),
        messages: messages.map((m: any) => ({
          role:    m.role === 'assistant' ? 'assistant' : 'user',
          content: String(m.content),
        })),
      }),
    })

    const data = await response.json()
    console.log('[AI] Status:', response.status, 'Response:', JSON.stringify(data).slice(0, 200))

    if (!response.ok) {
      return NextResponse.json({
        error:   data.error?.message || 'AI error',
        content: `AI error: ${data.error?.message || 'Please try again.'}`,
      }, { status: 200 })
    }

    const content = data.content?.[0]?.text || ''
    return NextResponse.json({ content })

  } catch (e: any) {
    console.error('[AI] Error:', e?.message)
    return NextResponse.json({
      content: 'Connection error. Please try again.'
    }, { status: 200 })
  }
}
