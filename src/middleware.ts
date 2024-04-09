import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = new URL(request.url)
  console.log(
    '%c [ process.env.NEXT_PUBLIC_API_ENDPOINT ]-8',
    'font-size:13px; background:pink; color:#bf2c9f;',
    process.env.NEXT_PUBLIC_API_ENDPOINT,
  )
  if (url.pathname.startsWith('/pre-otc/')) {
    const rewriteUrl = new URL(
      url.pathname,
      process.env.NEXT_PUBLIC_API_ENDPOINT,
    )
    rewriteUrl.search = url.search
    return NextResponse.rewrite(rewriteUrl)
  }
}

export const config = {
  matcher: '/pre-otc/:path*',
}
