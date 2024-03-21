import fetcher from '@/api/fetcher'

export const getCurrentLoginUser = '/pre-otc/get-current-login-user'

export interface GetCurrentLoginUserResponse {
  address: string
  chatId: null | string
  createTime: string
}

export const fetchGetCurrentLoginUser = () => {
  return fetcher<GetCurrentLoginUserResponse>(getCurrentLoginUser, {
    method: 'GET',
  })
}
