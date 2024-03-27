'use client'
import Image from 'next/image'
import clsx from 'clsx'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useRouter, useSearchParams } from 'next/navigation'
import { capitalize } from 'lodash-es'
import USDBSvg from '@/images/USDB.svg'
import NextSvg from '@/images/next.svg'
import DownSvg from '@/images/down.svg'
import DangerSvg from '@/images/danger.svg'
import { createOrder, createOrderUrl, listProject, listProjectUrl } from '@/api'
import type {
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'
import type { CreateOrderParams, ListProjectResponse } from '@/api'

const tabPanelContentClasses = 'mt-7 bg-[#162024] rounded-[10px] py-7 px-10'

export interface PanelProps {
  tab: 'buying' | 'selling'
}

export interface FormValues {
  amount: number
  price: number
  projectId: number
}

export default function Panel({ tab }: PanelProps) {
  const amountLabelText = tab === 'buying' ? 'Buying' : 'Selling'
  const labelBg = tab === 'buying' ? 'bg-[#FFC300]' : 'bg-[#EB2F96]'

  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.has('next')
  const { register, setValue, watch, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      amount: searchParams.has('amount')
        ? Number(searchParams.get('amount'))
        : ('' as unknown as number),
      price: searchParams.has('price')
        ? Number(searchParams.get('price'))
        : ('' as unknown as number),
      projectId: searchParams.has('selectedProject')
        ? (
            JSON.parse(
              searchParams.get('selectedProject')!,
            ) as ListProjectResponse
          ).id
        : ('' as unknown as number),
    },
  })
  const { selectOptions, selectedProject } = useSelectProps({
    setValue,
    watch,
  })
  const formId = useId()
  const [amount, price] = watch(['amount', 'price'])
  const usdb = amount * price || 0
  const invalid = usdb <= 100

  const btnBg = next
    ? 'bg-[#FBFC02]'
    : tab === 'buying'
      ? invalid
        ? 'bg-[#1B3F93]'
        : 'bg-[#004DFF]'
      : 'bg-[#8F2760]'

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
      price: values.price,
      projectId: values.projectId,
      type: capitalize(tab) as CreateOrderParams['type'],
    })
    router.push(
      `/market/offer?${searchParams.toString()}&${new URLSearchParams({
        next: '1',
        amount: values.amount.toString(),
        price: values.price.toString(),
        selectedProject: JSON.stringify(selectedProject),
      }).toString()}`,
    )
  }

  const handleInvalid = (errors: FieldErrors<FormValues>) => {
    Object.values(errors).forEach((value) => {
      toast.error(value.message)
    })
  }

  return (
    <div>
      <form
        className={tabPanelContentClasses}
        id={formId}
        onSubmit={handleSubmit(handleValid, handleInvalid)}
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
              readOnly={next}
              required
              step={'any'}
              autoComplete={'off'}
              type={'number'}
              placeholder={'Enter Amount'}
              className={clsx(
                'reset-input-number w-full rounded-[5px] bg-[#2A3037] px-[14px] leading-[44px] text-[#9E9E9E]',
                {
                  'border-none bg-transparent text-white focus:outline-none':
                    next,
                },
              )}
            />
          </label>

          {!next && (
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
          )}
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
              {
                'bg-transparent text-white': next,
              },
            )}
          >
            <input
              {...register('price', {
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
              readOnly={next}
              placeholder={'Enter Unit Price'}
              className={clsx(
                'reset-input-number w-full appearance-none bg-transparent pl-[14px] pr-[100px]',
                {
                  'focus:outline-none': next,
                },
              )}
            />
            <div
              className={
                'absolute right-2.5 top-0 flex items-center gap-[10px]'
              }
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
            {usdb.toLocaleString()}
          </span>
        </div>
        {next && (
          <div className={'mt-8 flex justify-between leading-5'}>
            <span className={' text-[#737373]'}>{'PreOTC fee'}</span>
            <span className={'text-white'}>{'2.5%'}</span>
          </div>
        )}
      </form>

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

      <button
        form={formId}
        type={'submit'}
        disabled={invalid || creatingOrder}
        className={clsx(
          'relative mt-[52px] flex h-[42px] w-full items-center justify-center rounded',
          btnBg,
          invalid && 'cursor-not-allowed',
          creatingOrder && 'cursor-wait',
        )}
      >
        {creatingOrder ? (
          <span className={'loading loading-dots mr-2'} />
        ) : (
          getBtnChildren(tab, invalid, next, usdb)
        )}
      </button>
    </div>
  )
}

function getBtnChildren(
  tab: PanelProps['tab'],
  invalid: boolean,
  next: boolean,
  usdb: number,
) {
  if (next) {
    return (
      <>
        <div className={'absolute inset-0 bg-[#FBFC02] blur-[15px]'} />
        <span
          className={'absolute z-10 flex items-center text-black'}
        >{`Deposit ${usdb.toLocaleString()} USDB`}</span>
      </>
    )
  }

  if (tab === 'buying') {
    return (
      <>
        {!invalid && (
          <div className={'absolute inset-0 bg-[#1058FF] blur-[15px]'} />
        )}
        <span className={'absolute z-10 flex items-center'}>
          {'Next'}
          <Image src={NextSvg} alt={'next'} width={'24'} className={'ml-5'} />
        </span>
      </>
    )
  }

  return (
    <>
      <span>{'Next'}</span>
      <Image src={NextSvg} alt={'next'} width={'24'} className={'ml-5'} />
    </>
  )
}

function useSelectProps(options: {
  setValue: UseFormSetValue<FormValues>
  watch: UseFormWatch<FormValues>
}) {
  const { setValue, watch } = options

  const [selectedProject, setSelectedProject] = useState<ListProjectResponse>()
  const { data: projects } = useSuspenseQuery({
    queryKey: [listProjectUrl],
    queryFn: listProject,
  })

  const selectOptions = projects.map((project) => (
    <option key={project.id} value={project.id}>
      {project.name}
    </option>
  ))

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      if (value.projectId) {
        const project = projects.find(
          (project) => project.id === value.projectId,
        )
        setSelectedProject(project)
      }
    })
    return () => unsubscribe()
  }, [projects, watch])

  useEffect(() => {
    if (projects.length) {
      setSelectedProject(projects[0])
      setValue('projectId', projects[0].id)
    }
  }, [projects, setValue])

  return { selectedProject, selectOptions }
}
