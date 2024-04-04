import fetcher from '@/api/fetcher'
import type { MakeOrderResponse } from '@/api/make-order'

export const takeOrderUrl = '/pre-otc/take-order'

export interface TakeOrderParams {
  type: 'Buying' | 'Selling'
  orderId: number
  amount: number
}

export interface TakeOrderResponse extends MakeOrderResponse {}

export const takeOrder = (params: TakeOrderParams) => {
  return fetcher<TakeOrderResponse>(takeOrderUrl, {
    method: 'POST',
    body: JSON.stringify(params),
    disabledErrorToast: true,
  })
}
