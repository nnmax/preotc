import fetcher from '@/api/fetcher'

export const ConnectWalletUrl = '/pre-otc/connect-wallet'

export interface ConnectWalletParams {
  chainId: number
  address: string
  message?: string | null
  signature?: string | null
}

export interface ConnectWalletResponse {
  address: string
  chatId: number | null
  createTime: string
  token: string
  message: string
}

export const fetchConnectWalletUrl = (params: ConnectWalletParams) => {
  return fetcher<ConnectWalletResponse>(ConnectWalletUrl, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}
