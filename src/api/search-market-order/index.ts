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

const mockData = Array.from({ length: 20 }, (_, i) => ({
  id: 39 + i,
  projectId: 1,
  type: 1,
  amount: 32,
  price: 12,
  feePercent: 2.5,
  deliverDeadline: null,
  completeTime: null,
  updateTime: '2024-04-02T13:48:10.000+00:00',
  createTime: '2024-04-02T13:48:03.000+00:00',
  projectName: '这是假的数据',
  projectTwitterUrl: 'https://twitter.com/friendtech',
  projectAvatarUrl:
    'https://icons.llamao.fi/icons/protocols/friend.tech?w=48&h=48',
  singularUnit: 'Point',
  pluralUnit: 'Points',
}))

const mock = false

export const fetchSearchMarketOrder = (params: SearchMarketOrderParams) => {
  return fetcher<SearchMarketOrderResponse[]>(SearchMarketOrderUrl, {
    method: 'POST',
    body: JSON.stringify(params),
  })
    .then((res) => {
      if (mock) {
        return mockData as unknown as SearchMarketOrderResponse[]
      }
      return res
    })
    .catch<SearchMarketOrderResponse[]>(() => {
      return []
    })
}
