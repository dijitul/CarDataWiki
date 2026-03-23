import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const submission = await prisma.csvSubmission.findUnique({ where: { id: params.id } })
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isOwner = submission.userId === session.user.id
  const isAdmin = session.user.role === 'ADMIN'
  if (!isOwner && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  return NextResponse.json({ submission })
}
