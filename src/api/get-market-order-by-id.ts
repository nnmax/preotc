import fetcher from '@/api/fetcher'
import type { SearchMarketOrderResponse } from '@/api/search-market-order'

export const getMarketOrderByIdUrl = '/pre-otc/get-market-order-by-id'

export interface GetMarketOrderByIdParams {
  id: number
}

export type GetMarketOrderByIdResponse = SearchMarketOrderResponse

export function getMarketOrderById(params: GetMarketOrderByIdParams) {
  return fetcher<GetMarketOrderByIdResponse>(getMarketOrderByIdUrl, {
    body: JSON.stringify(params),
    method: 'POST',
  })
}
