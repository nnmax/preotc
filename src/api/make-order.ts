import fetcher from '@/api/fetcher'
import type { Hex } from 'viem'

export const makeOrderUrl = '/pre-otc/make-order'

export interface MakeOrderParams {
  type: 'Buying' | 'Selling'
  projectId: number
  amount: number
  price: number
}

export interface MakeOrderResponse {
  depositCallData: {
    chainId: number
    destination: Hex
    value: number
    callData: Hex
  }
  orderConfirmData: {
    projectId: number
    projectSymbol: string
    projectTwitterUrl: string
    projectAvatarUrl: string
    type: 'Buying' | 'Selling'
    amount: number
    price: number
    totalPrice: number
    feePercent: number
    depositUsdbAmount: number
  }
}

export const makeOrder = (params: MakeOrderParams) => {
  return fetcher<MakeOrderResponse>(makeOrderUrl, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}
