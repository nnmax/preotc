import { useMutation } from '@tanstack/react-query'
import fetcher from '@/api/fetcher'
import type { MakeOrderParams } from '@/api/mutation'
import type { DepositMakeOrderData } from '@/api/mutation/depositMakeOrder'
import type { DefaultError } from '@tanstack/react-query'
import type { UseMutationParameters } from '@/utils/query'

export const depositTakeOrderApi = '/pre-otc/deposit-take-order'

export type DepositTakeOrderParams = Omit<MakeOrderParams, 'projectId'> & {
  orderId: number
  txHash: string
}

export type DepositTakeOrderData = DepositMakeOrderData

export type UseDepositTakeOrderParams<Context = unknown> = {
  mutation?:
    | UseMutationParameters<
        DepositTakeOrderData,
        DefaultError,
        DepositTakeOrderParams,
        Context
      >
    | undefined
}

export function useDepositTakeOrder<Context = unknown>(
  parameters: UseDepositTakeOrderParams<Context> = {},
) {
  const { mutation } = parameters

  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    mutationKey: [depositTakeOrderApi],
    mutationFn(variables) {
      return fetcher(depositTakeOrderApi, {
        body: JSON.stringify(variables),
        method: 'POST',
      })
    },
  })

  return {
    ...result,
    depositTakeOrder: mutate,
    depositTakeOrderAsync: mutateAsync,
  }
}
