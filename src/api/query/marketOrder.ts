import fetcher from '@/api/fetcher'
import { useSuspenseQuery } from '@/utils/query'
import type { SuspenseQueryParameter } from '@/types'
import type { DefaultError } from '@tanstack/react-query'

export const marketOrderApi = '/pre-otc/search-market-order'

export type MarketOrderParams = {
  type: 'Buying' | 'Selling'
  projectId?: number
}

export type MarketOrderData = {
  id: number
  projectId: number
  projectName: string
  projectAvatarUrl: string
  projectTwitterUrl: string
  singularUnit: string
  pluralUnit: string
  // 1 = buy, 2 = sell
  type: 1 | 2
  amount: number
  price: number
  feePercent: number
  createTime: string
  deliverDeadline: string | null
  completeTime: string | null
  buyerEthAddress: string | null
  sellerEthAddress: string | null
}

export type MarketOrderOptions = Partial<MarketOrderParams>

export function marketOrderKey(options: MarketOrderOptions) {
  return [marketOrderApi, options] as const
}

export type UseMarketOrderParams<SelectData = MarketOrderData[]> =
  MarketOrderOptions &
    SuspenseQueryParameter<
      MarketOrderData[],
      DefaultError,
      SelectData,
      ReturnType<typeof marketOrderKey>
    >

export function useMarketOrder<SelectData = MarketOrderData[]>(
  parameters: UseMarketOrderParams<SelectData> = {},
) {
  const { query = {}, ...rest } = parameters

  return useSuspenseQuery({
    ...query,
    queryKey: marketOrderKey(rest),
    queryFn({ queryKey }) {
      return fetcher(queryKey[0], {
        body: JSON.stringify(queryKey[1]),
        method: 'POST',
      })
    },
  })
}
