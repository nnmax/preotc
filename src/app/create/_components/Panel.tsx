import Image from 'next/image'
import { useId, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'
import { capitalize } from 'lodash-es'
import { useRouter } from 'next/navigation'
import Decimal from 'decimal.js'
import DangerSvg from '@/images/danger.svg'
import Button from '@/components/Button'
import SecondStepPanel from '@/app/offer/_components/SecondStepPanel'
import TokenHeader from '@/components/TokenHeader'
import { useSelectProps } from '@/app/create/hooks'
import useDepositTransaction from '@/hooks/useDepositTransaction'
import DepositSuccessfulDialog from '@/components/DepositSuccessfulDialog'
import InsufficientBalanceDialog from '@/components/InsufficientBalanceDialog'
import { FirstStepPanel } from '@/app/create/_components/FirstStepPanel'
import { USDB_LIMIT } from '@/constant'
import { useDepositMakeOrder, useMakeOrder } from '@/api/mutation'
import useCheckChain from '@/hooks/useCheckChain'
import type { Dispatch, SetStateAction } from 'react'
import type { FormValues } from '@/app/create/types'
import type { FieldErrors } from 'react-hook-form'
import type { MakeOrderParams } from '@/api/mutation'

export interface PanelProps {
  tab: 'buying' | 'selling'
  step: number
  setStep: Dispatch<SetStateAction<number>>
}

export default function Panel({ tab, step, setStep }: PanelProps) {
  const { selectOptions, selectedProject } = useSelectProps()
  const { watch, handleSubmit, register } = useFormContext<FormValues>()
  const formId = useId()
  const router = useRouter()
  const [amount, pricePerToken, projectId] = watch([
    'amount',
    'pricePerToken',
    'projectId',
  ])
  const price = new Decimal(amount ?? 0).mul(pricePerToken ?? 0).toNumber()
  const invalid = price < USDB_LIMIT
  const [successfulDialogOpen, setSuccessfulDialogOpen] = useState(false)
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false)
  const { depositTransaction, sendingTransaction } = useDepositTransaction()
  const { checkChain } = useCheckChain()

  const {
    makeOrderAsync,
    isPending: makingOrder,
    data: makeOrderResponse,
  } = useMakeOrder()

  const { depositMakeOrderAsync, isPending: depositMakingOrder } =
    useDepositMakeOrder()

  const handleValid = async (values: FormValues) => {
    if (!(await checkChain())) return

    await makeOrderAsync({
      amount: values.amount,
      price: values.pricePerToken,
      projectId: values.projectId,
      type: capitalize(tab) as MakeOrderParams['type'],
    }).catch((error) => {
      // USDB 余额不足
      if (error?.code === 668800011) {
        setBalanceDialogOpen(true)
      } else if (error?.code === 668800006) {
        toast.error('The value of each order must be greater than $100.')
      } else {
        toast.error(error?.prompt)
      }
      throw error
    })
    setStep(2)
  }

  const handleInvalid = (errors: FieldErrors<FormValues>) => {
    Object.values(errors).forEach((value) => {
      toast.error(value.message)
    })
  }

  const handleDeposit = async () => {
    const txHash = await depositTransaction({
      orderResponse: makeOrderResponse,
    })

    if (!txHash) return

    await depositMakeOrderAsync({
      amount,
      price: pricePerToken,
      projectId,
      type: capitalize(tab) as MakeOrderParams['type'],
      txHash,
    })

    setSuccessfulDialogOpen(true)
  }

  let stepPanel = null
  let stepButton = null
  if (step === 1) {
    stepPanel = (
      <FirstStepPanel
        formId={formId}
        onSubmit={handleSubmit(handleValid, handleInvalid)}
        tab={tab}
        register={register}
        selectOptions={selectOptions}
        selectedProject={selectedProject}
        price={price}
      />
    )
    stepButton = (
      <Button
        form={formId}
        type={'submit'}
        disabled={invalid}
        loading={makingOrder}
        bgColorClass={
          tab === 'buying'
            ? invalid
              ? 'bg-[#1B3F93]'
              : 'bg-[#004DFF]'
            : invalid
              ? 'bg-[#8F2760]'
              : 'bg-[#EB2F96]'
        }
        className={'mt-8'}
      >
        {'Next'}
      </Button>
    )
  }
  if (step === 2) {
    stepPanel = (
      <SecondStepPanel
        amount={amount}
        pricePerToken={pricePerToken}
        price={price}
        type={tab === 'buying' ? 'buy' : 'sell'}
        fee={makeOrderResponse?.orderConfirmData.feePercent ?? 0}
      />
    )
    stepButton = (
      <Button
        type={'button'}
        bgColorClass={'bg-[#FBFC02]'}
        className={'mt-8 text-black'}
        onClick={handleDeposit}
        loading={sendingTransaction || depositMakingOrder}
      >
        {`Deposit ${(price * (tab === 'selling' ? 2 : 1)).toLocaleString()} USDB`}
      </Button>
    )
  }

  return (
    <div>
      {step === 2 && !!selectedProject && (
        <TokenHeader
          id={undefined}
          name={selectedProject.name}
          avatarUrl={selectedProject.avatarUrl}
          twitterUrl={selectedProject.twitterUrl}
        />
      )}
      {stepPanel}
      {invalid && (
        <div className={'relative'}>
          <p
            className={
              'absolute flex items-center pl-10 text-xs leading-[30px] text-white'
            }
          >
            <Image src={DangerSvg} alt={'danger'} className={'mr-[10px]'} />
            {'The value of each order must be greater than $100.'}
          </p>
        </div>
      )}
      {stepButton}
      <DepositSuccessfulDialog
        open={successfulDialogOpen}
        textClasses={'text-center'}
        text={
          <>
            {'Congratulations! '}
            <br />
            {'You have successfully created an order!'}
          </>
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
