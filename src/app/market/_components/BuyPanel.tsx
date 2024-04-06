'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { fetchSearchMarketOrder, SearchMarketOrderUrl } from '@/api'
import Card from './Card'
import type { SearchMarketOrderParams } from '@/api'

export default function BuyPanel({ project }: { project: string | null }) {
  const queryVariables: SearchMarketOrderParams = {
    type: 'Buying',
    projectId: project ? Number(project) : undefined,
  }
  const { data } = useSuspenseQuery({
    queryKey: [SearchMarketOrderUrl, queryVariables],
    queryFn: () => {
      return fetchSearchMarketOrder(queryVariables)
    },
  })

  if (!data || !data.length) return <p>{'No Data'}</p>

  return data.map((item) => <Card key={item.id} data={item} />)
}
