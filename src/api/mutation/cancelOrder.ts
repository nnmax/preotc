import { useMutation } from '@tanstack/react-query'
import fetcher from '@/api/fetcher'
import type { CallData } from '@/api/types'
import type { DefaultError } from '@tanstack/react-query'
import type { UseMutationParameters } from '@/utils/query'

const cancelOrderApi = '/pre-otc/cancel-order'

export type CancelOrderParams = {
  orderId: number
}

type CancelOrderData = {
  cancelOrderCallData: CallData
}

export type UseCancelOrderParams<Context = unknown> = {
  mutation?:
    | UseMutationParameters<
        CancelOrderData,
        DefaultError,
        CancelOrderParams,
        Context
      >
    | undefined
}

export function useCancelOrder<Context = unknown>(
  parameters: UseCancelOrderParams<Context> = {},
) {
  const { mutation } = parameters

  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    mutationKey: [cancelOrderApi],
    mutationFn(variables) {
      return fetcher(cancelOrderApi, {
        body: JSON.stringify(variables),
        method: 'POST',
      })
    },
  })

  return {
    ...result,
    cancelOrder: mutate,
    cancelOrderAsync: mutateAsync,
  }
}
