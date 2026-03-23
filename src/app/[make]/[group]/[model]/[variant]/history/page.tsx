import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { DiffView } from '@/components/edit/DiffView'

interface Props { params: { make: string; group: string; model: string; variant: string } }

export const dynamic = 'force-dynamic'

export default async function HistoryPage({ params }: Props) {
  const variant = await prisma.modelVariant.findUnique({
    where: { slug: params.variant },
    include: {
      model: { include: { make: true } },
      revisions: {
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      },
    },
  })
  if (
    !variant ||
    variant.model.slug !== params.model ||
    variant.model.make.slug !== params.make ||
    (variant.model.groupSlug ?? variant.model.slug) !== params.group
  ) notFound()

  const m         = variant.model
  const make      = m.make
  const groupName = m.groupName ?? params.group

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb crumbs={[
        { label: 'Home',         href: '/' },
        { label: make.name,      href: `/${params.make}` },
        { label: groupName,      href: `/${params.make}/${params.group}` },
        { label: m.name,         href: `/${params.make}/${params.group}/${params.model}` },
        { label: variant.name,   href: `/${params.make}/${params.group}/${params.model}/${params.variant}` },
        { label: 'Edit history' },
      ]} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit History</h1>
          <p className="text-slate-500 text-sm mt-1">{make.name} {m.name} {variant.name}</p>
        </div>
        <Link
          href={`/${params.make}/${params.group}/${params.model}/${params.variant}`}
          className="btn-outline text-sm"
        >
          ← Back to specs
        </Link>
      </div>

      {variant.revisions.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          <p className="text-sm">No edits have been made to this variant yet.</p>
          <Link
            href={`/${params.make}/${params.group}/${params.model}/${params.variant}`}
            className="btn-primary mt-4 inline-flex"
          >
            Be the first to contribute
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {variant.revisions.map(rev => (
            <DiffView key={rev.id} revision={{ ...rev, user: rev.user }} />
          ))}
        </div>
      )}
    </div>
  )
}
