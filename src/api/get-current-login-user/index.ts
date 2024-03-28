import fetcher from '@/api/fetcher'
import type { ConnectWalletResponse } from '@/api'

export const getCurrentLoginUser = '/pre-otc/get-current-login-user'

export type GetCurrentLoginUserResponse = ConnectWalletResponse

export const fetchGetCurrentLoginUser = () => {
  return fetcher<GetCurrentLoginUserResponse>(getCurrentLoginUser, {
    method: 'GET',
  }).catch(() => null)
}
