'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { fetchSearchMarketOrder, SearchMarketOrderUrl } from '@/api'
import Card from '../_components/Card'

export default function BuyPage() {
  const { data } = useSuspenseQuery({
    queryKey: [
      SearchMarketOrderUrl,
      {
        type: 'Selling',
        projectId: 1,
      },
    ],
    queryFn: () => {
      return fetchSearchMarketOrder({
        type: 'Buying',
        projectId: 1,
      })
    },
  })

  return data?.map((item) => <Card key={item.id} data={item} type={'buy'} />)
}
