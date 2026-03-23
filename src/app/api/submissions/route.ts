import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { analyseCsvWithAI } from '@/lib/csv/ai-analyser'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export const dynamic = 'force-dynamic'

// Local upload directory — files stored on the server itself
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? join(process.cwd(), 'uploads', 'submissions')

export async function GET(_req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const submissions = await prisma.csvSubmission.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: { id: true, originalName: true, rowCount: true, status: true, createdAt: true },
  })
  return NextResponse.json({ submissions })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  if (!file.name.endsWith('.csv')) return NextResponse.json({ error: 'Only CSV files are accepted' }, { status: 400 })

  const maxSize = Number(process.env.CSV_MAX_SIZE_BYTES ?? 10485760)
  if (file.size > maxSize) {
    return NextResponse.json({ error: `File too large. Maximum size is ${Math.round(maxSize / 1048576)}MB` }, { status: 400 })
  }

  const text = await file.text()
  const lines = text.split('\n').filter(l => l.trim()).length
  const rowCount = Math.max(0, lines - 1) // subtract header

  // Save file to local disk
  const userDir = join(UPLOAD_DIR, session.user.id)
  await mkdir(userDir, { recursive: true })
  const filename = `${Date.now()}-${file.name.replace(/[^a-z0-9._-]/gi, '_')}`
  const filePath = join(userDir, filename)
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()))

  const submission = await prisma.csvSubmission.create({
    data: {
      userId:       session.user.id,
      originalName: file.name,
      storagePath:  filePath,   // local path instead of blob URL
      rowCount,
      status:       'PENDING_ANALYSIS',
    },
  })

  // Kick off analysis asynchronously (fire-and-forget, runs as background job)
  runAnalysis(submission.id, text).catch(console.error)

  return NextResponse.json({ submission: { id: submission.id, status: submission.status } }, { status: 202 })
}

async function runAnalysis(submissionId: string, csvText: string) {
  await prisma.csvSubmission.update({
    where: { id: submissionId },
    data:  { status: 'ANALYSING' },
  })

  try {
    // Simple CSV parse without external dep for the analysis path
    const lines = csvText.split('\n').filter(l => l.trim())
    if (lines.length < 2) throw new Error('Empty CSV')

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.replace(/^"|"$/g, '').trim())
      return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']))
    })

    const existingSlugs = await prisma.modelVariant.findMany({
      select: { slug: true },
      take: 1000,
    }).then(vs => vs.map(v => v.slug))

    const report = await analyseCsvWithAI(rows, existingSlugs)

    await prisma.csvSubmission.update({
      where: { id: submissionId },
      data:  { status: 'AWAITING_REVIEW', aiReport: report as never },
    })
  } catch (err) {
    console.error('CSV analysis failed:', err)
    await prisma.csvSubmission.update({
      where: { id: submissionId },
      data:  { status: 'FAILED' },
    })
  }
}
