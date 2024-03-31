import fetcher from '@/api/fetcher'
import type { CallData } from './types'

export const cancelOrderUrl = '/pre-otc/cancel-order'

export interface CancelOrderParams {
  orderId: number
}

export interface CancelOrderResponse {
  cancelOrderCallData: CallData
}

export function cancelOrder(params: CancelOrderParams) {
  return fetcher<CancelOrderResponse>(cancelOrderUrl, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}
