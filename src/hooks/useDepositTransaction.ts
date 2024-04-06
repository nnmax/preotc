'use client'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { parseEther } from 'viem/utils'
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi'
import { blast } from 'wagmi/chains'
import isBlastChain from '@/utils/isBlastChain'
import { BLAST_TESTNET_CHAIN_ID } from '@/constant'
import type { MakeOrderResponse, TakeOrderResponse } from '@/api'

export default function useDepositTransaction() {
  const { address, chainId } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const { sendTransactionAsync, isPending: sendingTransaction } =
    useSendTransaction()

  const handleWeb3Error = useCallback((error: any) => {
    console.log(error)
    toast.error(error?.shortMessage ?? error?.message ?? 'SwitchChainError')
    return null
  }, [])

  const depositTransaction = useCallback(
    async ({
      orderResponse,
    }: {
      orderResponse: MakeOrderResponse | TakeOrderResponse | undefined
    }) => {
      if (!orderResponse || !address) {
        toast.error('Failed to make order')
        return null
      }

      if (!isBlastChain(chainId)) {
        const switched = await switchChainAsync({
          chainId:
            process.env.NEXT_PUBLIC_IS_DEV === 'true'
              ? BLAST_TESTNET_CHAIN_ID
              : blast.id,
        }).catch(handleWeb3Error)

        if (!switched) return null
      }

      const approved = await sendTransactionAsync({
        to: orderResponse.approveCallData.destination,
        value: parseEther(orderResponse.approveCallData.value.toString()),
        data: orderResponse.approveCallData.callData,
        gas: process.env.NEXT_PUBLIC_IS_DEV === 'true' ? null : undefined,
      }).catch(handleWeb3Error)

      if (!approved) return null

      const txHash = await sendTransactionAsync({
        to: orderResponse.depositCallData.destination,
        value: parseEther(orderResponse.depositCallData.value.toString()),
        data: orderResponse.depositCallData.callData,
        gas: process.env.NEXT_PUBLIC_IS_DEV === 'true' ? null : undefined,
      }).catch(handleWeb3Error)

      return txHash
    },
    [address, chainId, sendTransactionAsync, switchChainAsync, handleWeb3Error],
  )

  return {
    depositTransaction,
    sendingTransaction,
  }
}
