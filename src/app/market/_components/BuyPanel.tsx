'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { fetchSearchMarketOrder, SearchMarketOrderUrl } from '@/api'
import Card from './Card'
import type { SearchMarketOrderParams } from '@/api'

export default function BuyPanel() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')

  const queryVariables: SearchMarketOrderParams = {
    type: 'Buying',
    projectId: projectId ? Number(projectId) : undefined,
  }
  const { data } = useSuspenseQuery({
    queryKey: [SearchMarketOrderUrl, queryVariables],
    queryFn: () => {
      return fetchSearchMarketOrder(queryVariables)
    },
  })

  if (!data || !data.length) return <p>{'No data'}</p>

  return data.map((item) => <Card key={item.id} data={item} type={'buy'} />)
}
