import { NextResponse } from 'next/server'
import type { CommonResponse, SearchMarketOrderResponse } from '@/api'

const body: CommonResponse<SearchMarketOrderResponse[]> = {
  code: 200,
  message: 'Ok',
  prompt: 'success',
  timestamp: Date.now(),
  data: Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    projectId: 1,
    chainOrderId: 1,
    originOrderId: null,
    buyerId: 2,
    sellerId: null,
    type: 1,
    amount: 1000,
    price: 0.1,
    feePercent: 2.5,
    buyerDepositTx:
      '0xd4eb7d393bd0d79dba8d5f372a2fb5bb7c2ffa1ef2a9c0b6deee463d006dc897',
    sellerDepositTx: null,
    sellerDeliverTx: null,
    buyerConfirmTx: null,
    status: 3,
    updateTime: new Date().toISOString(),
    createTime: new Date().toISOString(),
  })),
}

export async function POST() {
  return new Promise<NextResponse<CommonResponse<SearchMarketOrderResponse[]>>>(
    (resolve) => {
      setTimeout(() => {
        resolve(NextResponse.json(body))
      }, 1000)
    },
  )
}
