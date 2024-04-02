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
  singularUnit: string
  pluralUnit: string
  // 1 = buy, 2 = sell
  type: 1 | 2
  amount: number
  price: number
  feePercent: number
  status: number
  createTime: string
  deliverDeadline: string | null
  completeTime: string | null
}

export const fetchSearchMarketOrder = (params: SearchMarketOrderParams) => {
  return fetcher<SearchMarketOrderResponse[]>(SearchMarketOrderUrl, {
    method: 'POST',
    body: JSON.stringify(params),
  }).catch<SearchMarketOrderResponse[]>(() => {
    return []
  })
}
