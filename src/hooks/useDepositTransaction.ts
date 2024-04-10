'use client'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { parseEther } from 'viem/utils'
import { useAccount, useSendTransaction } from 'wagmi'
import handleWeb3Error from '@/utils/handleWeb3Error'
import { GAS_LIMIT } from '@/constant'
import type { MakeOrderData, TakeOrderData } from '@/api/mutation'

export default function useDepositTransaction() {
  const { address } = useAccount()
  const { sendTransactionAsync, isPending: sendingTransaction } =
    useSendTransaction()

  const depositTransaction = useCallback(
    async ({
      orderResponse,
    }: {
      // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-duplicate-type-constituents
      orderResponse: MakeOrderData | TakeOrderData | undefined
    }) => {
      if (!orderResponse || !address) {
        toast.error('Failed to make order')
        return null
      }

      if (orderResponse.approveCallData) {
        const approved = await sendTransactionAsync({
          to: orderResponse.approveCallData.destination,
          value: parseEther(orderResponse.approveCallData.value.toString()),
          data: orderResponse.approveCallData.callData,
          gas: GAS_LIMIT,
        }).catch(handleWeb3Error)

        if (!approved) return null
      }

      const txHash = await sendTransactionAsync({
        to: orderResponse.depositCallData.destination,
        value: parseEther(orderResponse.depositCallData.value.toString()),
        data: orderResponse.depositCallData.callData,
        gas: GAS_LIMIT,
      }).catch(handleWeb3Error)

      return txHash
    },
    [address, sendTransactionAsync],
  )

  return {
    depositTransaction,
    sendingTransaction,
  }
}
