import { useMutation } from '@tanstack/react-query'
import fetcher from '@/api/fetcher'
import type { DefaultError } from '@tanstack/react-query'
import type { UseMutationParameters } from '@/utils/query'

export const submitCancelOrderApi = '/pre-otc/submit-cancel-order'

export type SubmitCancelOrderParams = {
  orderId: number
  txHash: string
}

export type SubmitCancelOrderData = null

export type UseSubmitCancelOrderParams<Context = unknown> = {
  mutation?:
    | UseMutationParameters<
        SubmitCancelOrderData,
        DefaultError,
        SubmitCancelOrderParams,
        Context
      >
    | undefined
}

export function useSubmitCancelOrder<Context = unknown>(
  parameters: UseSubmitCancelOrderParams<Context> = {},
) {
  const { mutation } = parameters

  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    mutationKey: [submitCancelOrderApi],
    mutationFn(variables) {
      return fetcher(submitCancelOrderApi, {
        body: JSON.stringify(variables),
        method: 'POST',
      })
    },
  })

  return {
    ...result,
    submitCancelOrder: mutate,
    submitCancelOrderAsync: mutateAsync,
  }
}
