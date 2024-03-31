'use client'
import Image from 'next/image'
import { useAccount, useSendTransaction } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toNumber } from 'lodash-es'
import { useMutation } from '@tanstack/react-query'
import { parseEther } from 'viem'
import { toast } from 'react-toastify'
import WalletSvg from '@/images/wallet.svg'
import Button from '@/components/Button'
import TokenHeader from '@/components/TokenHeader'
import {
  depositTakeOrder,
  depositTakeOrderUrl,
  takeOrder,
  takeOrderUrl,
} from '@/api'
import FirstStepPanel from './FirstStepPanel'
import SecondStepPanel from './SecondStepPanel'

export default function FormPanel() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') as 'buy' | 'sell'

  const data = {
    id: toNumber(searchParams.get('id')),
    projectName: searchParams.get('projectName')!,
    projectAvatarUrl: searchParams.get('projectAvatarUrl')!,
    projectTwitterUrl: searchParams.get('projectTwitterUrl')!,
    amount: toNumber(searchParams.get('amount')),
    price: toNumber(searchParams.get('price')),
    feePercent: toNumber(searchParams.get('feePercent')),
  }

  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [rangeValue, setRangeValue] = useState(data.amount)
  const [step, setStep] = useState(1)
  const router = useRouter()
  const { sendTransactionAsync, isPending: sendingTransaction } =
    useSendTransaction()

  const {
    mutateAsync: takeOrderAsync,
    isPending: takingOrder,
    data: takeOrderResponse,
  } = useMutation({
    mutationKey: [takeOrderUrl],
    mutationFn: takeOrder,
  })

  const { mutateAsync: depositTakeOrderAsync, isPending: depositTakingOrder } =
    useMutation({
      mutationKey: [depositTakeOrderUrl],
      mutationFn: depositTakeOrder,
    })

  const handleValid = async () => {
    await takeOrderAsync({
      amount: rangeValue,
      orderId: data.id,
      type: type === 'buy' ? 'Buying' : 'Selling',
    })
    setStep(2)
  }

  const handleDeposit = async () => {
    if (!takeOrderResponse || !address) {
      toast.error('Failed to take order')
      return
    }

    await sendTransactionAsync({
      to: takeOrderResponse.approveCallData.destination,
      value: parseEther(takeOrderResponse.approveCallData.value.toString()),
      data: takeOrderResponse.approveCallData.callData,
    }).catch((error) => {
      console.log(error)
      toast.error(
        error?.shortMessage ?? error?.message ?? 'TransactionExecutionError',
      )
      return null
    })

    const txHash = await sendTransactionAsync({
      to: takeOrderResponse.depositCallData.destination,
      value: parseEther(takeOrderResponse.depositCallData.value.toString()),
      data: takeOrderResponse.depositCallData.callData,
    }).catch((error) => {
      console.log(error)
      toast.error(
        error?.shortMessage ?? error?.message ?? 'TransactionExecutionError',
      )
      return null
    })

    if (!txHash) return

    await depositTakeOrderAsync({
      amount: rangeValue,
      orderId: data.id,
      type: type === 'buy' ? 'Buying' : 'Selling',
      price: data.price,
      txHash,
    })
    toast.success(
      'Congratulations on completing the deal, please pay close attention to the token settlement time!',
    )
    router.push('/market')
  }

  let stepPanel = null
  let stepButton = null
  if (step === 1) {
    stepPanel = (
      <FirstStepPanel
        type={type}
        rangeValue={rangeValue}
        setRangeValue={setRangeValue}
        max={data.amount}
        pricePerToken={data.price}
      />
    )
    stepButton = (
      <Button
        bgColorClass={
          type === 'buy'
            ? rangeValue <= 0
              ? 'bg-[#1B3F93]'
              : 'bg-[#1058FF]'
            : rangeValue <= 0
              ? 'bg-[#8F2760]'
              : 'bg-[#EB2F96]'
        }
        disabled={rangeValue <= 0}
        onClick={handleValid}
        loading={takingOrder}
      >
        {'Next'}
      </Button>
    )
  }
  if (step === 2) {
    stepPanel = (
      <SecondStepPanel
        amount={rangeValue}
        pricePerToken={data.price}
        type={type}
        price={rangeValue * data.price}
        fee={data.feePercent}
      />
    )
    stepButton = (
      <Button
        bgColorClass={'bg-[#FBFC02]'}
        className={'text-black'}
        onClick={handleDeposit}
        loading={sendingTransaction || depositTakingOrder}
      >
        {`Deposit ${rangeValue * data.price * (type === 'buy' ? 1 : 2)} USDB`}
      </Button>
    )
  }

  return (
    <div className={'flex flex-col'}>
      <TokenHeader
        id={data.id}
        name={data.projectName}
        twitterUrl={data.projectTwitterUrl}
        avatarUrl={data.projectAvatarUrl}
      />
      {stepPanel}
      {address ? (
        stepButton
      ) : (
        <Button
          bgColorClass={'bg-[#FA5151]'}
          onClick={() => {
            openConnectModal!()
          }}
        >
          <Image src={WalletSvg} alt={'next'} width={'32'} className={'mr-5'} />
          {'Connect Wallet'}
        </Button>
      )}
    </div>
  )
}
