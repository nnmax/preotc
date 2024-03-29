import fetcher from '@/api/fetcher'

export const getUsdbBalanceUrl = '/pre-otc/get-usdb-balance'

export interface GetUsdbBalanceParams {
  address: string
}

export interface GetUsdbBalanceResponse {
  usdbBalance: number
}

export const getUsdbBalance = (params: GetUsdbBalanceParams) => {
  return fetcher<GetUsdbBalanceResponse>(getUsdbBalanceUrl, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}
