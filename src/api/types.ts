import type { Hex } from 'viem'

export interface CommonResponse<Data = unknown> {
  code: number
  message: string
  prompt: string
  timestamp: number
  data: Data
}

export interface CallData {
  chainId: number
  destination: Hex
  value: number
  callData: Hex
}
