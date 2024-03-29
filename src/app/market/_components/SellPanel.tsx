'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { SearchMarketOrderUrl, fetchSearchMarketOrder } from '@/api'
import Card from './Card'
import type { SearchMarketOrderParams } from '@/api'

export default function SellPanel() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('token')

  const queryVariables: SearchMarketOrderParams = {
    type: 'Selling',
    projectId: projectId ? Number(projectId) : undefined,
  }

  const { data } = useSuspenseQuery({
    queryKey: [SearchMarketOrderUrl, queryVariables],
    queryFn: () => {
      return fetchSearchMarketOrder(queryVariables)
    },
  })

  return data?.map((item) => <Card key={item.id} data={item} type={'sell'} />)
}
