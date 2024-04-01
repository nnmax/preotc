import { blast } from 'wagmi/chains'
import { BLAST_TESTNET_CHAIN_ID } from '@/constant'

export default function isBlastChain(chainId: number) {
  return (
    chainId === blast.id ||
    (process.env.NEXT_PUBLIC_IS_DEV === 'true'
      ? chainId === BLAST_TESTNET_CHAIN_ID
      : false)
  )
}
