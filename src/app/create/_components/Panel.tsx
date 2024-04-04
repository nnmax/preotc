import Image from 'next/image'
import clsx from 'clsx'
import { useMutation } from '@tanstack/react-query'
import { useId, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'
import { capitalize } from 'lodash-es'
import { useRouter } from 'next/navigation'
import USDBSvg from '@/images/USDB.svg'
import DownSvg from '@/images/down.svg'
import DangerSvg from '@/images/danger.svg'
import {
  depositMakeOrder,
  depositMakeOrderUrl,
  makeOrder,
  makeOrderUrl,
} from '@/api'
import Button from '@/components/Button'
import SecondStepPanel from '@/app/offer/_components/SecondStepPanel'
import TokenHeader from '@/components/TokenHeader'
import { useSelectProps } from '@/app/create/hooks'
import useDepositTransaction from '@/hooks/useDepositTransaction'
import DepositSuccessfulDialog from '@/components/DepositSuccessfulDialog'
import type { Dispatch, SetStateAction } from 'react'
import type { FormValues } from '@/app/create/types'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { MakeOrderParams, ListProjectResponse } from '@/api'

export interface PanelProps {
  tab: 'buying' | 'selling'
  step: number
  setStep: Dispatch<SetStateAction<number>>
}

const USDB_LIMIT = 100

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
  const price = amount * pricePerToken || 0
  const invalid = price < USDB_LIMIT
  const [successfulDialogOpen, setSuccessfulDialogOpen] = useState(false)
  const { depositTransaction, sendingTransaction } = useDepositTransaction()

  const {
    mutateAsync: makeOrderAsync,
    isPending: makingOrder,
    data: makeOrderResponse,
  } = useMutation({
    mutationKey: [makeOrderUrl],
    mutationFn: makeOrder,
  })

  const { mutateAsync: depositMakeOrderAsync, isPending: depositMakingOrder } =
    useMutation({
      mutationKey: [depositMakeOrderUrl],
      mutationFn: depositMakeOrder,
    })

  const handleValid = async (values: FormValues) => {
    await makeOrderAsync({
      amount: values.amount,
      price: values.pricePerToken,
      projectId: values.projectId,
      type: capitalize(tab) as MakeOrderParams['type'],
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
            : 'bg-[#8F2760]'
        }
        className={clsx('mt-12')}
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
        className={'mt-12 text-black'}
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
        <p
          className={
            'absolute flex items-center pl-10 text-xs leading-[30px] text-white'
          }
        >
          <Image src={DangerSvg} alt={'danger'} className={'mr-[10px]'} />
          {'The value of each order must be greater than $100.'}
        </p>
      )}
      {stepButton}
      <DepositSuccessfulDialog
        open={successfulDialogOpen}
        text={'Congratulations, you have successfully created an order!'}
        onClose={() => {
          setSuccessfulDialogOpen(false)
          router.push('/market')
        }}
      />
    </div>
  )
}

interface FirstStepPanelProps extends Pick<PanelProps, 'tab'> {
  formId: string
  onSubmit: React.FormEventHandler<HTMLFormElement>
  register: UseFormRegister<FormValues>
  selectOptions: JSX.Element[]
  selectedProject: ListProjectResponse | undefined
  price: number
}

function FirstStepPanel(props: FirstStepPanelProps) {
  const {
    formId,
    onSubmit,
    tab,
    register,
    selectOptions,
    selectedProject,
    price,
  } = props

  const amountLabelText = tab === 'buying' ? 'Buying' : 'Selling'
  const labelClasses = clsx(
    'flex items-center self-start rounded-[3px] px-2 text-sm leading-6',
    {
      'bg-[#FFC300] text-black': tab === 'buying',
      'bg-[#EB2F96] text-white': tab === 'selling',
    },
  )

  return (
    <form
      className={clsx('mt-8 rounded-[10px] bg-[#162024] p-6')}
      id={formId}
      onSubmit={onSubmit}
    >
      <div className={'flex gap-4'}>
        <label className={'flex flex-1 flex-col items-center gap-y-2'}>
          <span className={labelClasses}>{amountLabelText}</span>
          <input
            {...register('amount', {
              valueAsNumber: true,
              required: 'The amount is required',
              min: {
                value: 0,
                message: 'The amount must be greater than 0',
              },
            })}
            min={0}
            required
            step={'any'}
            autoComplete={'off'}
            type={'number'}
            placeholder={'Enter Amount'}
            className={clsx(
              'reset-input-number w-full rounded-[5px] bg-[#2A3037] px-[14px] text-sm leading-9 text-white',
            )}
          />
        </label>

        <div
          className={
            'relative flex h-9 w-fit items-center gap-2.5 self-end rounded-[5px] bg-[#2A3037] p-2.5'
          }
        >
          {selectedProject && (
            <Image
              src={selectedProject?.avatarUrl}
              alt={''}
              width={'24'}
              height={'24'}
              className={'h-full w-6 rounded-full'}
            />
          )}
          <span className={'flex-1 text-sm'}>{selectedProject?.name}</span>
          <Image src={DownSvg} alt={'down'} width={'16'} />
          <select
            {...register('projectId', {
              valueAsNumber: true,
              required: 'The project is required',
            })}
            required
            className={
              'absolute inset-0 h-full w-full cursor-pointer opacity-0'
            }
          >
            {selectOptions}
          </select>
        </div>
      </div>

      <label className={'mt-[18px] flex flex-col gap-y-2'}>
        <span className={labelClasses}>{'Price Per Token'}</span>
        <div
          className={clsx(
            'relative flex rounded-[5px] bg-[#2A3037] leading-9 text-[#9E9E9E]',
          )}
        >
          <input
            {...register('pricePerToken', {
              valueAsNumber: true,
              required: 'The unit price is required',
              min: {
                value: 0,
                message: 'The unit price must be greater than 0',
              },
            })}
            min={0}
            required
            autoComplete={'off'}
            type={'number'}
            step={'any'}
            placeholder={'Enter Unit Price'}
            className={clsx(
              'reset-input-number w-full appearance-none bg-transparent pl-[14px] pr-[96] text-sm leading-9 text-white',
            )}
          />
          <div
            className={
              'absolute right-2 top-0 flex h-full items-center gap-2 text-sm'
            }
          >
            <span>{'USDB'}</span>
            <Image src={USDBSvg} alt={'USDB'} width={24} />
          </div>
        </div>
      </label>
      <div className={'mt-8 flex flex-col gap-4 leading-5'}>
        <span className={' text-[#737373]'}>{'For'}</span>
        <span className={'text-[#FFC300]'}>
          {'$ '}
          {price.toLocaleString()}
        </span>
      </div>
    </form>
  )
}
