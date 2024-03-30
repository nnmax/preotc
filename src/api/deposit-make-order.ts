import fetcher from '@/api/fetcher'

export const depositMakeOrderUrl = '/pre-otc/deposit-make-order'

export interface DepositMakeOrderParams {
  type: 'Buying' | 'Selling'
  projectId: number
  amount: number
  price: number
  txHash: string
}

export interface DepositMakeOrderResponse {
  id: number
  projectId: number
  chainOrderId: number | null
  originOrderId: number | null
  buyerId: number
  sellerId: number | null
  type: 1 | 2
  amount: number
  price: number
  feePercent: number
  buyerDepositTx: string | null
  sellerDepositTx: string | null
  sellerDeliverTx: string | null
  buyerConfirmTx: string | null
  status: number
  deliverDeadline: number | null
  completeTime: number | null
  updateTime: string
  createTime: string
}

export const depositMakeOrder = (params: DepositMakeOrderParams) => {
  return fetcher<DepositMakeOrderResponse>(depositMakeOrderUrl, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}
