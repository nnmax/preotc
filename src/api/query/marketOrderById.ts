import fetcher from '@/api/fetcher'
import { useQuery } from '@/utils/query'
import type { MarketOrderData } from '@/api/query/marketOrder'
import type { QueryParameter } from '@/types'
import type { DefaultError } from '@tanstack/react-query'

export const marketOrderByIdApi = '/pre-otc/get-market-order-by-id'

export type MarketOrderByIdParams = {
  id: number
}

export type MarketOrderByIdData = MarketOrderData

export type MarketOrderByIdOptions = Partial<MarketOrderByIdParams>

export function marketOrderByIdKey(options: MarketOrderByIdOptions) {
  return [marketOrderByIdApi, options] as const
}

export type UseMarketOrderByIdParams<SelectData = MarketOrderByIdData> =
  MarketOrderByIdOptions &
    QueryParameter<
      MarketOrderByIdData,
      DefaultError,
      SelectData,
      ReturnType<typeof marketOrderByIdKey>
    >

export function useMarketOrderById<SelectData = MarketOrderByIdData>(
  parameters: UseMarketOrderByIdParams<SelectData> = {},
) {
  const { query = {}, ...rest } = parameters

  return useQuery({
    ...query,
    queryKey: marketOrderByIdKey(rest),
    queryFn({ queryKey }) {
      return fetcher(queryKey[0], {
        body: JSON.stringify(queryKey[1]),
        method: 'POST',
      })
    },
  })
}
