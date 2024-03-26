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
  }).then((res) => {
    if (res) return res
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      projectId: 1,
      chainOrderId: 1,
      originOrderId: null,
      buyerId: 2,
      sellerId: null,
      type: 1,
      amount: 1000,
      price: 0.1,
      feePercent: 2.5,
      buyerDepositTx:
        '0xd4eb7d393bd0d79dba8d5f372a2fb5bb7c2ffa1ef2a9c0b6deee463d006dc897',
      sellerDepositTx: null,
      sellerDeliverTx: null,
      buyerConfirmTx: null,
      status: 3,
      updateTime: new Date().toISOString(),
      createTime: new Date().toISOString(),
    }))
  })
}
