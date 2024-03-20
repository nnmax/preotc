import fetcher from '@/api/fetcher'

export const SearchUserOrderUrl = '/pre-otc/search-user-order'

export interface SearchUserOrderParams {
  /**
   * My_Offers(1)
   * To_Be_Delivered(2)
   * Deals_Completed(3)
   */
  dashboardType: 1 | 2 | 3
}

export interface SearchUserOrderResponse {
  id: number
  projectId: number
  chainOrderId: number
  originOrderId: number | null
  buyerId: number
  sellerId: null
  type: number
  amount: number
  price: number
  feePercent: number
  buyerDepositTx: string
  sellerDepositTx: null
  sellerDeliverTx: null
  buyerConfirmTx: null
  status: number
  updateTime: string
  createTime: string
}

export const fetchSearchUserOrder = (params: SearchUserOrderParams) => {
  return fetcher<SearchUserOrderResponse[]>(SearchUserOrderUrl, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}
