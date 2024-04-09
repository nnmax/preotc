import { useMutation } from '@tanstack/react-query'
import fetcher from '@/api/fetcher'
import type { CallData } from '@/api/types'
import type { DefaultError } from '@tanstack/react-query'
import type { UseMutationParameters } from '@/utils/query'

export const makeOrderApi = '/pre-otc/make-order'

export type MakeOrderParams = {
  type: 'Buying' | 'Selling'
  projectId: number
  amount: number
  price: number
}

export type MakeOrderData = {
  depositCallData: CallData
  approveCallData: CallData | null
  orderConfirmData: {
    projectId: number
    projectSymbol: string
    projectTwitterUrl: string
    projectAvatarUrl: string
    type: 'Buying' | 'Selling'
    amount: number
    price: number
    totalPrice: number
    feePercent: number
    depositUsdbAmount: number
  }
}

export type UseMakeOrderParams<Context = unknown> = {
  mutation?:
    | UseMutationParameters<
        MakeOrderData,
        DefaultError,
        MakeOrderParams,
        Context
      >
    | undefined
}

export function useMakeOrder<Context = unknown>(
  parameters: UseMakeOrderParams<Context> = {},
) {
  const { mutation } = parameters

  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    mutationKey: [makeOrderApi],
    mutationFn(variables) {
      return fetcher(makeOrderApi, {
        body: JSON.stringify(variables),
        method: 'POST',
        disabledErrorToast: true,
      })
    },
  })

  return {
    ...result,
    makeOrder: mutate,
    makeOrderAsync: mutateAsync,
  }
}
