export const createOrderUrl = '/pre-otc/create-order'

export interface CreateOrderParams {
  type: 'Buying' | 'Selling'
  projectId: number
  amount: number
  price: number
}

export interface CreateOrderResponse {
  id: number
  projectId: number
  chainOrderId: number
  originOrderId: number
  buyerId: number
  sellerId: number
  type: number
  amount: number
  price: number
  feePercent: number
  buyerDepositTx: null
  sellerDepositTx: null
  sellerDeliverTx: null
  buyerConfirmTx: null
  status: number
  updateTime: string
  createTime: string
}
