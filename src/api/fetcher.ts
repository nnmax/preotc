import type { CommonResponse } from '@/api/types'

export default function fetcher<ResponseData = unknown>(
  input: string,
  init?: RequestInit,
) {
  return fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
    .then<CommonResponse<ResponseData | null> | null>((response) => {
      if (response.ok) {
        return response.json()
      }
      return null
    })
    .then((data) => data?.data ?? null)
}
