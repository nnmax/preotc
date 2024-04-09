import { useCallback } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { blast } from 'wagmi/chains'
import { BLAST_TESTNET_CHAIN_ID } from '@/constant'
import handleWeb3Error from '@/utils/handleWeb3Error'
import isBlastChain from '@/utils/isBlastChain'

export default function useCheckChain() {
  const { chainId } = useAccount()
  const { switchChainAsync } = useSwitchChain()

  const checkChain = useCallback(async () => {
    if (isBlastChain(chainId)) return true

    const switched = await switchChainAsync({
      chainId:
        process.env.NEXT_PUBLIC_IS_DEV === 'true'
          ? BLAST_TESTNET_CHAIN_ID
          : blast.id,
    }).catch(handleWeb3Error)

    return !!switched
  }, [chainId, switchChainAsync])

  return {
    checkChain,
  }
}
