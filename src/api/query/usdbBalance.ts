import fetcher from '@/api/fetcher'
import { useQuery } from '@/utils/query'
import type { QueryParameter } from '@/types'
import type { DefaultError } from '@tanstack/react-query'

export const usdbBalanceApi = '/pre-otc/get-usdb-balance'

export type UsdbBalanceParams = { address: string }

export type UsdbBalanceData = {
  usdbBalance: number
}

export type UsdbBalanceOptions = Partial<UsdbBalanceParams>

export function usdbBalanceKey(options: UsdbBalanceOptions) {
  return [usdbBalanceApi, options] as const
}

export type UseUsdbBalanceParams<SelectData = UsdbBalanceData> =
  UsdbBalanceOptions &
    QueryParameter<
      UsdbBalanceData,
      DefaultError,
      SelectData,
      ReturnType<typeof usdbBalanceKey>
    >

export function useUsdbBalance<SelectData = UsdbBalanceData>(
  parameters: UseUsdbBalanceParams<SelectData> = {},
) {
  const { query = {}, ...rest } = parameters

  return useQuery({
    ...query,
    select(data) {
      return data?.usdbBalance
    },
    queryKey: usdbBalanceKey(rest),
    queryFn({ queryKey }) {
      return fetcher(queryKey[0], {
        body: JSON.stringify(queryKey[1]),
        method: 'POST',
      })
    },
  })
}
