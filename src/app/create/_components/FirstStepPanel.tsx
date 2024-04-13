import clsx from 'clsx'
import { Controller } from 'react-hook-form'
import Image from 'next/image'
import Select from '@/components/Select'
import USDBSvg from '@/images/USDB.svg'
import type { ProjectsData } from '@/api/query'
import type { PanelProps } from '@/app/create/_components/Panel'
import type { FormValues } from '@/app/create/types'
import type { SelectOption } from '@/components/Select'
import type { UseFormRegister } from 'react-hook-form'

interface FirstStepPanelProps extends Pick<PanelProps, 'tab'> {
  formId: string
  onSubmit: React.FormEventHandler<HTMLFormElement>
  register: UseFormRegister<FormValues>
  selectOptions: SelectOption<number>[]
  selectedProject?: ProjectsData
  price: number
}

export function FirstStepPanel(props: FirstStepPanelProps) {
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
      <div className={'flex justify-between gap-4'}>
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

        {
          <Controller<FormValues>
            name={'projectId'}
            render={({ field }) => (
              <Select<number>
                className={'ml-auto w-fit min-w-[180px] self-end'}
                options={selectOptions}
                value={field.value}
                name={field.name}
                onChange={field.onChange}
                displayValue={
                  <>
                    {selectedProject && (
                      <Image
                        src={selectedProject.avatarUrl}
                        alt={''}
                        width={'24'}
                        height={'24'}
                        className={'mr-4 h-6 w-6 rounded-full'}
                      />
                    )}
                    <span>{selectedProject?.name}</span>
                  </>
                }
              />
            )}
          />
        }
      </div>
      <label className={'mt-6 flex flex-col gap-y-2'}>
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
