'use client'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { toNumber } from 'lodash-es'
import { useMutation, useQuery } from '@tanstack/react-query'
import WalletSvg from '@/images/wallet.svg'
import Button from '@/components/Button'
import TokenHeader from '@/components/TokenHeader'
import {
  depositTakeOrder,
  depositTakeOrderUrl,
  getMarketOrderById,
  getMarketOrderByIdUrl,
  takeOrder,
  takeOrderUrl,
} from '@/api'
import useDepositTransaction from '@/hooks/useDepositTransaction'
import DepositSuccessfulDialog from '@/components/DepositSuccessfulDialog'
import FirstStepPanel from './FirstStepPanel'
import SecondStepPanel from './SecondStepPanel'

export default function FormPanel() {
  const searchParams = useSearchParams()
  const { id } = useParams()
  const type = searchParams.get('type') as 'buy' | 'sell'
  const { data, isPending } = useQuery({
    queryKey: [getMarketOrderByIdUrl, id],
    queryFn: () => {
      return getMarketOrderById({ id: toNumber(id) })
    },
  })

  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [rangeValue, setRangeValue] = useState(0)
  const [step, setStep] = useState(1)
  const router = useRouter()
  const { depositTransaction, sendingTransaction } = useDepositTransaction()
  const [successfulDialogOpen, setSuccessfulDialogOpen] = useState(false)

  useEffect(() => {
    if (data?.amount) {
      setRangeValue(data.amount)
    }
  }, [data?.amount])

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
      orderId: data!.id,
      type: type === 'buy' ? 'Buying' : 'Selling',
    })
    setStep(2)
  }

  const handleDeposit = async () => {
    const txHash = await depositTransaction({
      orderResponse: takeOrderResponse,
    })

    if (!txHash) return

    await depositTakeOrderAsync({
      amount: rangeValue,
      orderId: data!.id,
      type: type === 'buy' ? 'Buying' : 'Selling',
      price: data!.price,
      txHash,
    })
    setSuccessfulDialogOpen(true)
  }

  if (isPending) {
    return <span className={'loading loading-dots'} />
  }

  let stepPanel = null
  let stepButton = null
  if (step === 1) {
    stepPanel = (
      <FirstStepPanel
        type={type}
        rangeValue={rangeValue}
        setRangeValue={setRangeValue}
        max={data?.amount ?? 0}
        pricePerToken={data?.price}
        unit={data?.projectSingularUnit}
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
        amount={takeOrderResponse?.orderConfirmData.amount ?? rangeValue}
        pricePerToken={data!.price}
        type={type}
        price={
          takeOrderResponse?.orderConfirmData.totalPrice ??
          rangeValue * data!.price
        }
        fee={data!.feePercent}
      />
    )
    stepButton = (
      <Button
        bgColorClass={'bg-[#FBFC02]'}
        className={'text-black'}
        onClick={handleDeposit}
        loading={sendingTransaction || depositTakingOrder}
      >
        {`Deposit ${takeOrderResponse?.orderConfirmData.depositUsdbAmount} USDB`}
      </Button>
    )
  }

  return (
    <div className={'flex flex-col'}>
      <TokenHeader
        id={data?.id}
        name={data?.projectName}
        twitterUrl={data?.projectTwitterUrl}
        avatarUrl={data?.projectAvatarUrl}
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

      <DepositSuccessfulDialog
        open={successfulDialogOpen}
        onClose={() => {
          setSuccessfulDialogOpen(false)
          router.push('/market')
        }}
      />
    </div>
  )
}
