import fetcher from '@/api/fetcher'
import { useQuery } from '@/utils/query'
import type { ConnectWalletData } from '@/api/mutation'
import type { QueryParameter } from '@/types'
import type { DefaultError } from '@tanstack/react-query'

export const userApi = '/pre-otc/get-current-login-user'

export type UserParams = Record<string, unknown>

export type UserData = ConnectWalletData

export type UserOptions = Partial<UserParams>

export function userKey(options: UserOptions) {
  return [userApi, options] as const
}

export type UseUserParams<SelectData = UserData> = UserOptions &
  QueryParameter<UserData, DefaultError, SelectData, ReturnType<typeof userKey>>

export function useUser<SelectData = UserData>(
  parameters: UseUserParams<SelectData> = {},
) {
  const { query = {}, ...rest } = parameters

  return useQuery({
    ...query,
    queryKey: userKey(rest),
    gcTime: 0,
    staleTime: 0,
    queryFn({ queryKey }) {
      return fetcher(queryKey[0], {
        body: JSON.stringify(queryKey[1]),
        method: 'GET',
      })
    },
  })
}
