import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = new URL(request.url)
  if (url.pathname.startsWith('/pre-otc/')) {
    const rewriteUrl = new URL(url.pathname, process.env.API_ENDPOINT)
    rewriteUrl.search = url.search
    return NextResponse.rewrite(rewriteUrl)
  }
}

export const config = {
  matcher: '/pre-otc/:path*',
}
