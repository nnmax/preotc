import fetcher from '@/api/fetcher'

export const disconnectWalletUrl = '/pre-otc/disconnect-wallet'

export function disconnectWallet() {
  return fetcher<null>(disconnectWalletUrl, {
    method: 'POST',
  })
}
