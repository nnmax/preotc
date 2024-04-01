import fetcher from '@/api/fetcher'

export const settledDepositUrl = '/pre-otc/settled-deposit'

export interface SettledDepositParams {
  id: number
}

export function settledDeposit(params: SettledDepositParams) {
  return fetcher(settledDepositUrl, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}
