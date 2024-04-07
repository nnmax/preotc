'use client'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { SearchMarketOrderUrl, fetchSearchMarketOrder } from '@/api'
import useListenSocket from '@/hooks/useListenSocket'
import Panel from './Panel'
import type { SearchMarketOrderParams, SearchMarketOrderResponse } from '@/api'

export default function SellPanel({ project }: { project: string | null }) {
  const queryVariables: SearchMarketOrderParams = {
    type: 'Selling',
    projectId: project ? Number(project) : undefined,
  }
  const queryClient = useQueryClient()
  const { data } = useSuspenseQuery({
    queryKey: [SearchMarketOrderUrl, queryVariables],
    queryFn: () => {
      return fetchSearchMarketOrder(queryVariables)
    },
  })

  useListenSocket({
    onNewMarket(revicedData) {
      if (revicedData.type !== 2) return
      queryClient.setQueryData<SearchMarketOrderResponse[]>(
        [SearchMarketOrderUrl, queryVariables],
        (oldData) => {
          return [revicedData, ...(oldData ?? [])]
        },
      )
    },
  })

  return <Panel data={data} />
}
