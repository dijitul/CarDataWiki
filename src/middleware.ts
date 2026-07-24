import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Edge middleware — kept intentionally lightweight. It only does the cheap
 * API-key presence check for the public API; it does NOT call auth().
 *
 * Session-protected pages (dashboard, admin) enforce auth() themselves in the
 * Node runtime, where Prisma/bcrypt work reliably. Calling auth() here on the
 * Edge runtime was unreliable (the auth config pulls in Prisma + bcrypt) and
 * caused authenticated users to be bounced to /login intermittently.
 */
export function middleware(request: NextRequest) {
  // Let CORS preflight through untouched.
  if (request.method === 'OPTIONS') return NextResponse.next()

  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer cdw_')) {
    return NextResponse.json(
      { error: 'Missing or invalid API key. Include Authorization: Bearer <key>', code: 'UNAUTHORIZED' },
      { status: 401 },
    )
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/v1/:path*'],
}
