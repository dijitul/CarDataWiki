import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // API v1 — check Bearer token presence at edge (full validation in handler)
  if (pathname.startsWith('/api/v1/')) {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer cdw_')) {
      return NextResponse.json(
        { error: 'Missing or invalid API key. Include Authorization: Bearer <key>', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }
    return NextResponse.next()
  }

  // Dashboard & admin — require session
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    const session = await auth()
    if (!session) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    // Admin routes require ADMIN role
    if (pathname.startsWith('/admin') && session.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/api/v1/:path*'],
}
