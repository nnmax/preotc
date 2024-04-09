import { useMutation } from '@tanstack/react-query'
import fetcher from '@/api/fetcher'
import type { DefaultError } from '@tanstack/react-query'
import type { UseMutationParameters } from '@/utils/query'

export const disconnectWalletApi = '/pre-otc/disconnect-wallet'

export type DisconnectWalletParams = void

export type DisconnectWalletData = null

export type UseDisconnectWalletParams<Context = unknown> = {
  mutation?:
    | UseMutationParameters<
        DisconnectWalletData,
        DefaultError,
        DisconnectWalletParams,
        Context
      >
    | undefined
}

export function useDisconnectWallet<Context = unknown>(
  parameters: UseDisconnectWalletParams<Context> = {},
) {
  const { mutation } = parameters

  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    mutationKey: [disconnectWalletApi],
    mutationFn() {
      return fetcher(disconnectWalletApi, {
        method: 'POST',
      })
    },
  })

  return {
    ...result,
    disconnectWallet: mutate,
    disconnectWalletAsync: mutateAsync,
  }
}
