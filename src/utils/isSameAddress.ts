import type { Hex } from 'viem'
import type { MarketOrderData } from '@/api/query'

export default function isSameAddress(
  data: MarketOrderData | undefined,
  address: Hex | undefined,
) {
  if (!data) return false
  if (data.type === 1) {
    return data.buyerEthAddress?.toLowerCase() === address?.toLowerCase()
  }
  if (data.type === 2) {
    return data.sellerEthAddress?.toLowerCase() === address?.toLowerCase()
  }
  return false
}
