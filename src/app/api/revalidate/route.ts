import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'

export function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag')!
  revalidateTag(tag)
  return Response.json({ revalidated: true, now: Date.now() })
}
