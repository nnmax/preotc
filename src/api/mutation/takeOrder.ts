import { useMutation } from '@tanstack/react-query'
import fetcher from '@/api/fetcher'
import type { MakeOrderData, MakeOrderParams } from '@/api/mutation/makeOrder'
import type { DefaultError } from '@tanstack/react-query'
import type { UseMutationParameters } from '@/utils/query'

export const takeOrderApi = '/pre-otc/take-order'

export type TakeOrderParams = Pick<MakeOrderParams, 'type' | 'amount'> & {
  orderId: number
}

export type TakeOrderData = MakeOrderData

export type UseTakeOrderParams<Context = unknown> = {
  mutation?:
    | UseMutationParameters<
        TakeOrderData,
        DefaultError,
        TakeOrderParams,
        Context
      >
    | undefined
}

export function useTakeOrder<Context = unknown>(
  parameters: UseTakeOrderParams<Context> = {},
) {
  const { mutation } = parameters

  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    mutationKey: [takeOrderApi],
    mutationFn(variables) {
      return fetcher(takeOrderApi, {
        body: JSON.stringify(variables),
        method: 'POST',
        disabledErrorToast: true,
      })
    },
  })

  return {
    ...result,
    takeOrder: mutate,
    takeOrderAsync: mutateAsync,
  }
}
