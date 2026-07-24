import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

/**
 * Server-side guard for the admin area — requires an authenticated ADMIN.
 * Runs in the Node runtime where auth() is reliable.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/admin')
  if (session.user.role !== 'ADMIN') redirect('/')
  return <>{children}</>
}
