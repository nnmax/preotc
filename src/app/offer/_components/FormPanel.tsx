'use client'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { toNumber } from 'lodash-es'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
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
import InsufficientBalanceDialog from '@/components/InsufficientBalanceDialog'
import isSameAddress from '@/utils/isSameAddress'
import { PERCENTAGE_LIMIT, USDB_LIMIT } from '@/constant'
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
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false)
  const same = isSameAddress(data, address)
  const min = Math.min(data ? data.amount * PERCENTAGE_LIMIT : 0, USDB_LIMIT)
  const invalid = rangeValue < min

  useEffect(() => {
    if (data?.amount) {
      setRangeValue(data.amount)
    }
  }, [data?.amount])

  useEffect(() => {
    if (same) router.replace('/market')
  }, [router, same])

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
    }).catch((error) => {
      if (error?.code === 668800011) {
        setBalanceDialogOpen(true)
      } else {
        toast.error(error?.prompt)
      }
      throw error
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

  if (isPending || same) {
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
        min={min}
        pricePerToken={data?.price}
        unit={data?.singularUnit}
      />
    )
    stepButton = (
      <Button
        bgColorClass={
          type === 'buy'
            ? invalid
              ? 'bg-[#1B3F93]'
              : 'bg-[#004DFF]'
            : invalid
              ? 'bg-[#8F2760]'
              : 'bg-[#EB2F96]'
        }
        disabled={invalid}
        onClick={handleValid}
        loading={takingOrder}
        className={'mt-8'}
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
        className={'mt-8 text-black'}
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
          className={'mt-8'}
          onClick={openConnectModal}
        >
          <Image src={WalletSvg} alt={'next'} width={'24'} className={'mr-5'} />
          {'Connect Wallet'}
        </Button>
      )}

      <DepositSuccessfulDialog
        open={successfulDialogOpen}
        text={
          'Congratulations on completing the deal, please pay close attention to the settlement time!'
        }
        onClose={() => {
          setSuccessfulDialogOpen(false)
          router.push('/market')
        }}
      />

      <InsufficientBalanceDialog
        open={balanceDialogOpen}
        onClose={() => setBalanceDialogOpen(false)}
      />
    </div>
  )
}
