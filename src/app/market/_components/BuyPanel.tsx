'use client'
import { useQueryClient } from '@tanstack/react-query'
import useListenSocket from '@/hooks/useListenSocket'
import { useMarketOrder } from '@/api/query'
import Panel from './Panel'
import type { MarketOrderData, MarketOrderParams } from '@/api/query'

export default function BuyPanel({ project }: { project: string | null }) {
  const queryVariables: MarketOrderParams = {
    type: 'Buying',
    projectId: project ? Number(project) : undefined,
  }
  const queryClient = useQueryClient()
  const { data, queryKey } = useMarketOrder(queryVariables)

  useListenSocket({
    onNewMarket(revicedData) {
      if (revicedData.type !== 1) return
      queryClient.setQueryData<MarketOrderData[]>(queryKey, (oldData) => {
        return [revicedData, ...(oldData ?? [])]
      })
    },
  })

  return <Panel data={data} />
}
