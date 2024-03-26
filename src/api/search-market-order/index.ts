import fetcher from '@/api/fetcher'

export const SearchMarketOrderUrl = '/pre-otc/search-market-order'

export interface SearchMarketOrderParams {
  type: 'Buying' | 'Selling'
  projectId: number
}

export interface SearchMarketOrderResponse {
  id: number
  projectId: number
  chainOrderId: number
  originOrderId: number | null
  buyerId: number
  sellerId: number | null
  type: number
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
}

export const fetchSearchMarketOrder = (params: SearchMarketOrderParams) => {
  return fetcher<SearchMarketOrderResponse[]>(SearchMarketOrderUrl, {
    method: 'POST',
    body: JSON.stringify(params),
  }).then((res) => {
    if (res?.length) return res
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
