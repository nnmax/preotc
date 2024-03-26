// import { toast } from 'react-toastify'
// import logout from '@/utils/logout'
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
      throw new Error('Failed to fetch data')
    })
    .then((data) => {
      if (data?.code === 200) {
        return data?.data
      }
      if (data?.code === 401) {
        // logout()
      }
      // toast.error(data?.message)
      return null
    })
}
