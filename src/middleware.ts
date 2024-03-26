import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = new URL(request.url)
  if (url.pathname.startsWith('/pre-otc/')) {
    const rewriteUrl = new URL(
      url.pathname,
      'https://a85cbf62-cd94-4aa3-8d5d-30e4b3794f8f.flipgod.xyz',
    )
    rewriteUrl.search = url.search
    return NextResponse.rewrite(rewriteUrl)
  }
}

export const config = {
  matcher: '/pre-otc/:path*',
}
