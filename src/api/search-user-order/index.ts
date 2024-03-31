import fetcher from '@/api/fetcher'
import type { SearchMarketOrderResponse } from '@/api/search-market-order'

export const searchUserOrderUrl = '/pre-otc/search-user-order'

export interface SearchUserOrderParams {
  /**
   * My_Offers(1)
   * To_Be_Settled(2)
   * Deals_Completed(3)
   */
  dashboardType: 1 | 2 | 3
}

export interface SearchUserOrderResponse extends SearchMarketOrderResponse {}

export const searchUserOrder = (params: SearchUserOrderParams) => {
  return fetcher<SearchUserOrderResponse[]>(searchUserOrderUrl, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}
