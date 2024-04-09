import { useMutation } from '@tanstack/react-query'
import fetcher from '@/api/fetcher'
import type { MakeOrderParams } from '@/api/mutation'
import type { DefaultError } from '@tanstack/react-query'
import type { UseMutationParameters } from '@/utils/query'

const depositMakeOrderApi = '/pre-otc/deposit-make-order'

export type DepositMakeOrderParams = MakeOrderParams & {
  txHash: string
}

export type DepositMakeOrderData = {
  id: number
  projectId: number
  buyerId: number
  sellerId: number | null
  type: 1 | 2
  amount: number
  price: number
  feePercent: number
  deliverDeadline: number | null
  completeTime: number | null
  updateTime: string
  createTime: string
}

export type UseDepositMakeOrderParams<Context = unknown> = {
  mutation?:
    | UseMutationParameters<
        DepositMakeOrderData,
        DefaultError,
        DepositMakeOrderParams,
        Context
      >
    | undefined
}

export function useDepositMakeOrder<Context = unknown>(
  parameters: UseDepositMakeOrderParams<Context> = {},
) {
  const { mutation } = parameters

  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    mutationKey: [depositMakeOrderApi],
    mutationFn(variables) {
      return fetcher(depositMakeOrderApi, {
        body: JSON.stringify(variables),
        method: 'POST',
      })
    },
  })

  return {
    ...result,
    depositMakeOrder: mutate,
    depositMakeOrderAsync: mutateAsync,
  }
}
