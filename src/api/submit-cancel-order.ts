import fetcher from '@/api/fetcher'

export const submitCancelOrderUrl = '/pre-otc/submit-cancel-order'

export interface SubmitCancelOrderParams {
  orderId: number
  txHash: string
}

export type SubmitCancelOrderResponse = null

export function submitCancelOrder(params: SubmitCancelOrderParams) {
  return fetcher<SubmitCancelOrderResponse>(submitCancelOrderUrl, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}
