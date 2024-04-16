import clsx from 'clsx'
import { Controller, useFormContext } from 'react-hook-form'
import Image from 'next/image'
import Select from '@/components/Select'
import USDBSvg from '@/images/USDB.svg'
import ETHSvg from '@/images/eth-yellow.png'
import setMinNumber from '@/utils/setInputMinNumber'
import type { ProjectsData } from '@/api/query'
import type { PanelProps } from '@/app/create/_components/Panel'
import type { FormValues } from '@/app/create/types'
import type { SelectOption } from '@/components/Select'

interface FirstStepPanelProps extends Pick<PanelProps, 'tab'> {
  formId: string
  onSubmit: React.FormEventHandler<HTMLFormElement>
  projectSelectOptions: SelectOption<number>[]
  selectedProject?: ProjectsData
  price: number
}

const inputClasses =
  'reset-input-number w-full rounded bg-[#2A3037] px-[14px] text-sm leading-9 text-white'

const selectClasses = 'ml-auto w-fit min-w-[180px] self-end'

export function FirstStepPanel(props: FirstStepPanelProps) {
  const {
    formId,
    onSubmit,
    tab,
    projectSelectOptions,
    selectedProject,
    price,
  } = props

  const { register, setValue } = useFormContext<FormValues>()
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
      <div className={'flex justify-between gap-4'}>
        <label className={'flex flex-1 flex-col items-center gap-y-2'}>
          <span className={labelClasses}>{amountLabelText}</span>
          <input
            {...register('amount', {
              valueAsNumber: true,
              required: 'The amount is required',
              onBlur(event) {
                if (selectedProject && selectedProject.decimals !== 0) return
                setMinNumber({
                  setValue,
                  field: 'amount',
                  value: event.target.value,
                  min: 1,
                })
              },
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
            className={inputClasses}
          />
        </label>

        {
          <Controller<FormValues>
            name={'projectId'}
            render={({ field }) => {
              return (
                <Select<number>
                  className={selectClasses}
                  options={projectSelectOptions}
                  value={field.value}
                  name={field.name}
                  onChange={field.onChange}
                  displayValue={(_, option) => option?.name}
                />
              )
            }}
          />
        }
      </div>

      <div className={'mt-6 flex justify-between gap-4'}>
        <label className={'flex flex-1 flex-col items-center gap-y-2'}>
          <span className={labelClasses}>{'Price Per Token'}</span>
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
            className={inputClasses}
          />
        </label>

        {
          <Controller<FormValues>
            name={'tokenId'}
            render={({ field }) => (
              <Select<number>
                className={selectClasses}
                defaultValue={1}
                options={[
                  {
                    value: 1,
                    name: (
                      <>
                        <Image
                          src={USDBSvg}
                          alt={'USDB'}
                          width={'20'}
                          height={'20'}
                          className={'mr-4 rounded-full'}
                        />
                        <span>{'USDB'}</span>
                      </>
                    ),
                  },
                  {
                    value: 2,
                    name: (
                      <>
                        <Image
                          src={ETHSvg}
                          alt={'ETH'}
                          width={'20'}
                          height={'20'}
                          className={'mr-4 rounded-full'}
                        />
                        <span>{'ETH'}</span>
                      </>
                    ),
                  },
                ]}
                value={field.value}
                name={field.name}
                onChange={field.onChange}
                displayValue={(_, option) => option?.name}
              />
            )}
          />
        }
      </div>
      <div className={'mt-6 flex flex-col gap-4 leading-5'}>
        <span className={' text-[#737373]'}>{'For'}</span>
        <span className={'text-[#FFC300]'}>
          {'$ '}
          {price.toLocaleString()}
        </span>
      </div>
    </form>
  )
}
