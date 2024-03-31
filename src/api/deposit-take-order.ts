import fetcher from '@/api/fetcher'
import type { DepositMakeOrderResponse } from '@/api/deposit-make-order'

export const depositTakeOrderUrl = '/pre-otc/deposit-take-order'

export interface DepositTakeOrderParams {
  type: 'Buying' | 'Selling'
  orderId: number
  amount: number
  price: number
  txHash: string
}

export interface DepositTakeOrderResponse extends DepositMakeOrderResponse {}

export const depositTakeOrder = (params: DepositTakeOrderParams) => {
  return fetcher<DepositTakeOrderResponse>(depositTakeOrderUrl, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}
