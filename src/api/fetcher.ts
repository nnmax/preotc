import { toast } from 'react-toastify'
import logout from '@/utils/logout'
import type { CommonResponse } from '@/api/types'

const API_ENDPOINT = process.env.API_ENDPOINT

export default function fetcher<ResponseData = unknown>(
  input: string,
  init?: RequestInit,
) {
  let url = input
  if (typeof window === 'undefined') {
    url = API_ENDPOINT + input
  }
  return fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
    .then<CommonResponse<ResponseData>>((response) => {
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
        logout()
      }
      toast.error(data?.prompt)
      throw new Error(data?.prompt)
    })
}
