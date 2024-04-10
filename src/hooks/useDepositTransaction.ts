'use client'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { parseEther } from 'viem/utils'
import { useAccount, useSendTransaction } from 'wagmi'
import { estimateGas } from 'wagmi/actions'
import handleWeb3Error from '@/utils/handleWeb3Error'
import { config } from '@/components/providers'
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
        const gas = await estimateGas(config, {
          to: orderResponse.approveCallData.destination,
          data: orderResponse.approveCallData.callData,
          value: parseEther(orderResponse.approveCallData.value.toString()),
        })

        console.log('approve estimateGas', gas)

        const approved = await sendTransactionAsync({
          to: orderResponse.approveCallData.destination,
          value: parseEther(orderResponse.approveCallData.value.toString()),
          data: orderResponse.approveCallData.callData,
          gas,
        }).catch(handleWeb3Error)

        if (!approved) return null
      }

      const gas = await estimateGas(config, {
        to: orderResponse.depositCallData.destination,
        data: orderResponse.depositCallData.callData,
        value: parseEther(orderResponse.depositCallData.value.toString()),
      })

      console.log('deposit estimateGas', gas)

      const txHash = await sendTransactionAsync({
        to: orderResponse.depositCallData.destination,
        value: parseEther(orderResponse.depositCallData.value.toString()),
        data: orderResponse.depositCallData.callData,
        gas,
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
