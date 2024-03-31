import fetcher from '@/api/fetcher'

export const SearchMarketOrderUrl = '/pre-otc/search-market-order'

export interface SearchMarketOrderParams {
  type: 'Buying' | 'Selling'
  projectId?: number
}

export interface SearchMarketOrderResponse {
  id: number
  projectId: number
  projectName: string
  projectAvatarUrl: string
  projectTwitterUrl: string
  chainOrderId: number
  originOrderId: number | null
  buyerId: number
  sellerId: number | null
  // 1 = buy, 2 = sell
  type: 1 | 2
  amount: number
  price: number
  feePercent: number
  buyerDepositTx: string
  sellerDepositTx: string | null
  sellerDeliverTx: string | null
  buyerConfirmTx: string | null
  status: number
  updateTime: string
  createTime: string
  deliverDeadline: string | null
  completeTime: string | null
}

export const fetchSearchMarketOrder = (params: SearchMarketOrderParams) => {
  return fetcher<SearchMarketOrderResponse[]>(SearchMarketOrderUrl, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}
