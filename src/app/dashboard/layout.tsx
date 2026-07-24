import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

/**
 * Server-side guard for the whole dashboard. Runs in the Node runtime where
 * auth() is reliable, so it protects client-component pages (api-keys,
 * submissions) that can't check the session themselves.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/dashboard')
  return <>{children}</>
}
