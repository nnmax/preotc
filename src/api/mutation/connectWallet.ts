import { useMutation } from '@tanstack/react-query'
import fetcher from '@/api/fetcher'
import type { DefaultError } from '@tanstack/react-query'
import type { UseMutationParameters } from '@/utils/query'

const connectWalletApi = '/pre-otc/connect-wallet'

export type ConnectWalletParams = {
  address: string
  message?: string | null
  signature?: string | null
}

export type ConnectWalletData = {
  address: string
  tgStatus: 0 | 1
  createTime: string
}

export interface UseConnectWalletParams<Context = unknown> {
  mutation?:
    | UseMutationParameters<
        ConnectWalletData,
        DefaultError,
        ConnectWalletParams,
        Context
      >
    | undefined
}

export function useConnectWallet<Context = unknown>(
  parameters: UseConnectWalletParams<Context> = {},
) {
  const { mutation } = parameters

  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    mutationKey: [connectWalletApi],
    mutationFn(variables) {
      return fetcher(connectWalletApi, {
        body: JSON.stringify(variables),
        method: 'POST',
      })
    },
  })

  return {
    ...result,
    connectWallet: mutate,
    connectWalletAsync: mutateAsync,
  }
}
