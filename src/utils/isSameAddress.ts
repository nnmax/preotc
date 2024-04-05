import type { Hex } from 'viem'
import type { SearchMarketOrderResponse } from '@/api'

export default function isSameAddress(
  data: SearchMarketOrderResponse | undefined,
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
