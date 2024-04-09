import { useMutation } from '@tanstack/react-query'
import fetcher from '@/api/fetcher'
import type { DefaultError } from '@tanstack/react-query'
import type { UseMutationParameters } from '@/utils/query'

export const settledDepositApi = '/pre-otc/settled-deposit'

export type SettledDepositParams = {
  id: number
}

export type SettledDepositData = null

export type UseSettledDepositParams<Context = unknown> = {
  mutation?:
    | UseMutationParameters<
        SettledDepositData,
        DefaultError,
        SettledDepositParams,
        Context
      >
    | undefined
}

export function useSettledDeposit<Context = unknown>(
  parameters: UseSettledDepositParams<Context> = {},
) {
  const { mutation } = parameters

  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    mutationKey: [settledDepositApi],
    mutationFn(variables) {
      return fetcher(settledDepositApi, {
        body: JSON.stringify(variables),
        method: 'POST',
      })
    },
  })

  return {
    ...result,
    settledDeposit: mutate,
    settledDepositAsync: mutateAsync,
  }
}
