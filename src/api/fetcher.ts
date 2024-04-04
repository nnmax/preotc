import { toast } from 'react-toastify'
import logout from '@/utils/logout'
import type { CommonResponse } from '@/api/types'

const API_ENDPOINT = process.env.API_ENDPOINT

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
    url = API_ENDPOINT + input
  }
  return fetch(url, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...rest?.headers,
    },
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
      }
      if (
        disabledErrorToast === true ||
        (typeof disabledErrorToast === 'function' && disabledErrorToast(data))
      ) {
        throw new Error(data.prompt)
      }
      if (!disabledErrorToast) {
        toast.error(data.prompt)
        throw new Error(data.prompt)
      }
      return data.data
    })
}
