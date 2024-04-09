import { toast } from 'react-toastify'
import logout from '@/utils/logout'
import type { CommonResponse } from '@/api/types'

const NEXT_PUBLIC_API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT

interface FetcherOptions<ResponseData> extends RequestInit {
  disabledErrorToast?:
    | boolean
    | ((response: CommonResponse<ResponseData>) => boolean)
}

export default function fetcher<ResponseData = unknown>(
  input: string,
  options?: FetcherOptions<ResponseData>,
) {
  const { disabledErrorToast, ...rest } = options || {}
  let url = input
  if (typeof window === 'undefined') {
    url = NEXT_PUBLIC_API_ENDPOINT + input
  }
  return fetch(url, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...rest?.headers,
    },
    credentials: 'include',
  })
    .then<CommonResponse<ResponseData>>((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error('Failed to fetch data')
    })
    .then((data) => {
      if (data.code === 200) {
        return data.data
      }
      if (data.code === 401) {
        logout()
        throw data
      }
      if (
        disabledErrorToast === true ||
        (typeof disabledErrorToast === 'function' && disabledErrorToast(data))
      ) {
        throw data
      }
      if (!disabledErrorToast) {
        toast.error(data.prompt)
        throw data
      }
      return data.data
    })
}
