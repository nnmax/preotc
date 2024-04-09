import { blast } from 'wagmi/chains'
import { BLAST_TESTNET_CHAIN_ID } from '@/constant'

export default function isBlastChain(chainId: number | undefined) {
  if (process.env.NEXT_PUBLIC_IS_DEV === 'true') {
    return chainId === BLAST_TESTNET_CHAIN_ID
  }
  return chainId === blast.id
}
