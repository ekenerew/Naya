import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/api/auth'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Validate file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only images allowed' }, { status: 400 })
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Max file size is 5MB' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      // Return placeholder if Supabase storage not configured
      return NextResponse.json({ 
        url: `https://picsum.photos/seed/${Date.now()}/800/600`,
        placeholder: true 
      })
    }

    // Upload to Supabase Storage
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `listings/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const bytes = await file.arrayBuffer()

    const uploadRes = await fetch(
      `${supabaseUrl}/storage/v1/object/listing-images/${filename}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': file.type,
          'x-upsert': 'true',
        },
        body: bytes,
      }
    )

    if (!uploadRes.ok) {
      const err = await uploadRes.json()
      console.error('[UPLOAD]', err)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const url = `${supabaseUrl}/storage/v1/object/public/listing-images/${filename}`
    return NextResponse.json({ url })

  } catch (e: any) {
    console.error('[UPLOAD ERROR]', e?.message)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
