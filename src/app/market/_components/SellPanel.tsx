'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { SearchMarketOrderUrl, fetchSearchMarketOrder } from '@/api'
import Card from './Card'

export default function SellPanel() {
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
        type: 'Selling',
        projectId: 1,
      })
    },
  })

  return data?.map((item) => <Card key={item.id} data={item} type={'sell'} />)
}
