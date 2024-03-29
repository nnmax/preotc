import Image from 'next/image'
import clsx from 'clsx'
import { useMutation } from '@tanstack/react-query'
import { useId } from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'
import { capitalize } from 'lodash-es'
import USDBSvg from '@/images/USDB.svg'
import DownSvg from '@/images/down.svg'
import DangerSvg from '@/images/danger.svg'
import { createOrder, createOrderUrl } from '@/api'
import BlurButton from '@/components/BlurButton'
import SecondStepPanel from '@/app/offer/_components/SecondStepPanel'
import TokenHeader from '@/components/TokenHeader'
import { useSelectProps } from '@/app/create/hooks'
import type { Dispatch, SetStateAction } from 'react'
import type { FormValues } from '@/app/create/types'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { CreateOrderParams, ListProjectResponse } from '@/api'

export interface PanelProps {
  tab: 'buying' | 'selling'
  step: number
  setStep: Dispatch<SetStateAction<number>>
}

export default function Panel({ tab, step, setStep }: PanelProps) {
  const { selectOptions, selectedProject } = useSelectProps()
  const { watch, handleSubmit, register } = useFormContext<FormValues>()
  const formId = useId()
  const [amount, pricePerToken] = watch(['amount', 'pricePerToken'])
  const price = amount * pricePerToken || 0
  const invalid = price <= 100

  const { mutateAsync: createOrderAsync, isPending: creatingOrder } =
    useMutation({
      mutationKey: [createOrderUrl],
      mutationFn: (variables: CreateOrderParams) => {
        return createOrder(variables)
      },
    })

  const handleValid = async (values: FormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const res = await createOrderAsync({
      amount: values.amount,
      price: values.pricePerToken,
      projectId: values.projectId,
      type: capitalize(tab) as CreateOrderParams['type'],
    }).catch(() => {})
    setStep(2)
  }

  const handleInvalid = (errors: FieldErrors<FormValues>) => {
    Object.values(errors).forEach((value) => {
      toast.error(value.message)
    })
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
      <BlurButton
        form={formId}
        type={'submit'}
        disabled={invalid || creatingOrder}
        loading={creatingOrder}
        bgColorClass={
          tab === 'buying'
            ? invalid
              ? 'bg-[#1B3F93]'
              : 'bg-[#004DFF]'
            : 'bg-[#8F2760]'
        }
        className={clsx('mt-[52px]')}
        disabledBlur={invalid}
      >
        {'Next'}
      </BlurButton>
    )
  }
  if (step === 2) {
    stepPanel = (
      <SecondStepPanel
        amount={amount}
        pricePerToken={pricePerToken}
        price={price}
        type={tab === 'buying' ? 'buy' : 'sell'}
      />
    )
    stepButton = (
      <BlurButton
        type={'button'}
        bgColorClass={'bg-[#FBFC02]'}
        className={'mt-[52px] text-black'}
      >
        {`Deposit ${price.toLocaleString()} USDB`}
      </BlurButton>
    )
  }

  return (
    <div>
      {step === 2 && !!selectedProject && (
        <TokenHeader
          id={selectedProject.id}
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
  const labelBg = tab === 'buying' ? 'bg-[#FFC300]' : 'bg-[#EB2F96]'

  return (
    <form
      className={clsx('mt-7 rounded-[10px] bg-[#162024] px-10 py-7')}
      id={formId}
      onSubmit={onSubmit}
    >
      <div className={'flex gap-5'}>
        <label className={'flex flex-1 flex-col items-center gap-y-5'}>
          <span
            className={clsx(
              'flex items-center self-start rounded-[3px] px-[10px] leading-6 text-black',
              labelBg,
            )}
          >
            {amountLabelText}
          </span>
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
              'reset-input-number w-full rounded-[5px] bg-[#2A3037] px-[14px] leading-[44px] text-[#9E9E9E]',
            )}
          />
        </label>

        <div
          className={
            'relative flex h-[44px] w-[180px] items-center gap-2.5 self-end rounded-[5px] bg-[#2A3037] p-2.5'
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
          <span className={'flex-1'}>{selectedProject?.name}</span>
          <Image src={DownSvg} alt={'down'} width={'24'} />
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

      <label className={'mt-8 flex flex-col gap-y-5'}>
        <span
          className={clsx(
            'flex items-center self-start rounded-[3px] px-[10px] leading-6 text-black',
            labelBg,
          )}
        >
          {'Price Per Token'}
        </span>
        <div
          className={clsx(
            'relative flex rounded-[5px] bg-[#2A3037] leading-[44px] text-[#9E9E9E]',
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
              'reset-input-number w-full appearance-none bg-transparent pl-[14px] pr-[100px]',
            )}
          />
          <div
            className={'absolute right-2.5 top-0 flex items-center gap-[10px]'}
          >
            <span>{'USDB'}</span>
            <Image src={USDBSvg} alt={'USDB'} width={24} />
          </div>
        </div>
      </label>
      <div className={'mt-5 flex flex-col gap-3 leading-5'}>
        <span className={' text-[#737373]'}>{'For'}</span>
        <span className={'text-[#FFC300]'}>
          {'$ '}
          {price.toLocaleString()}
        </span>
      </div>
    </form>
  )
}
