import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/api/auth'

const DOC_TYPES: Record<string,string> = {
  rsspc_licence:   'RSSPC Licence',
  govt_id:         'Government ID',
  cac_cert:        'CAC Certificate',
  proof_of_address:'Proof of Address',
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file    = formData.get('file') as File
    const docType = formData.get('docType') as string

    if (!file)    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!docType || !DOC_TYPES[docType]) {
      return NextResponse.json({ error: 'Invalid document type' }, { status: 400 })
    }
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only images and PDFs are accepted' }, { status: 400 })
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 })
    }

    // Get or create agent profile
    let agent = await prisma.agentProfile.findUnique({ where: { userId: user.id } })
    if (!agent) {
      agent = await prisma.agentProfile.create({ data: { userId: user.id } })
    }

    let fileUrl = ''

    // Upload to Supabase Storage if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && supabaseKey) {
      const ext = file.name.split('.').pop() || 'jpg'
      const filename = `verification/${agent.id}/${docType}-${Date.now()}.${ext}`
      const bytes = await file.arrayBuffer()

      const uploadRes = await fetch(
        `${supabaseUrl}/storage/v1/object/agent-documents/${filename}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': file.type,
          },
          body: bytes,
        }
      )
      if (uploadRes.ok) {
        fileUrl = `${supabaseUrl}/storage/v1/object/agent-documents/${filename}`
      }
    }

    // If no Supabase, store as base64 reference (development)
    if (!fileUrl) {
      fileUrl = `placeholder://${docType}/${Date.now()}`
    }

    // Save doc record
    const doc = await prisma.verificationDocument.create({
      data: {
        agentId:  agent.id,
        docType,
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        status:   'PENDING',
      }
    })

    // Update agent status to UNDER_REVIEW if they have key docs
    const docCount = await prisma.verificationDocument.count({
      where: { agentId: agent.id, status: { in: ['PENDING','SUBMITTED'] } }
    })
    if (docCount >= 2) {
      await prisma.agentProfile.update({
        where: { id: agent.id },
        data: { rsspcStatus: 'UNDER_REVIEW' }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        docId:   doc.id,
        docType,
        label:   DOC_TYPES[docType],
        status:  'PENDING',
        message: `${DOC_TYPES[docType]} uploaded successfully`
      }
    })

  } catch (e: any) {
    console.error('[DOC UPLOAD]', e?.message)
    return NextResponse.json({ error: e?.message || 'Upload failed' }, { status: 500 })
  }
}
