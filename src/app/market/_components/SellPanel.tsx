'use client'
import { useQueryClient } from '@tanstack/react-query'
import useListenSocket from '@/hooks/useListenSocket'
import { useMarketOrder } from '@/api/query'
import Panel from './Panel'
import type { MarketOrderParams, MarketOrderData } from '@/api/query'

export default function SellPanel({ project }: { project: string | null }) {
  const queryVariables: MarketOrderParams = {
    type: 'Selling',
    projectId: project ? Number(project) : undefined,
  }
  const queryClient = useQueryClient()
  const { data, queryKey } = useMarketOrder(queryVariables)

  useListenSocket({
    onNewMarket(revicedData) {
      if (revicedData.type !== 2) return
      queryClient.setQueryData<MarketOrderData[]>(queryKey, (oldData) => {
        return [revicedData, ...(oldData ?? [])]
      })
    },
  })

  return <Panel data={data} />
}
