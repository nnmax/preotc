'use client'
import { Fragment, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import Image from 'next/image'
import clsx from 'clsx'
import CheckIcon from '@/images/check-yellow.svg'
import ArrowDown from '@/components/Icons/ArrowDown'
import useControlled from '@/hooks/useControlled'

export interface SelectOption<ValueType = any> {
  name: React.ReactNode
  value: ValueType
}

interface SelectProps<ValueType = any> {
  defaultValue?: ValueType
  value?: ValueType
  onChange?: (value: ValueType) => void
  displayValue?:
    | React.ReactNode
    | ((
        value: ValueType | undefined,
        option: SelectOption<ValueType> | undefined,
      ) => React.ReactNode)
  buttonClassName?: string
  className?: string
  name?: string
  options?: SelectOption[]
}

export default function Select<ValueType = any>(props: SelectProps<ValueType>) {
  const {
    onChange,
    options = [],
    defaultValue,
    value: valueProp,
    displayValue,
    buttonClassName,
    className,
    name,
  } = props
  const [value, setValue] = useControlled({
    controlled: valueProp,
    defaultValue,
  })

  const handleChange = (_value: ValueType) => {
    setValue(_value)
    if (onChange) onChange(_value)
  }

  const renderDisplayValue = (
    _value: ValueType | undefined,
  ): React.ReactNode => {
    const option: SelectOption<ValueType> | undefined = options.find(
      (o) => o.value === _value,
    )

    if (displayValue) {
      return typeof displayValue === 'function'
        ? displayValue(_value, option)
        : displayValue
    }
    return option?.name
  }

  useEffect(() => {
    if (value === undefined && valueProp !== undefined) {
      setValue(valueProp)
    }
  }, [setValue, valueProp, value])

  return (
    <Listbox
      as={'div'}
      value={value}
      onChange={handleChange}
      className={clsx(className, 'relative')}
      name={name}
    >
      <Listbox.Button
        className={clsx(
          buttonClassName,
          'relative flex h-9 w-full items-center justify-between gap-2.5 rounded bg-[#2A3037] px-2',
        )}
      >
        <span className={'flex items-center truncate text-xs'}>
          {renderDisplayValue(value)}
        </span>
        <ArrowDown className={'text-[#FFC300]'} />
      </Listbox.Button>
      <Transition
        as={Fragment}
        leave={'transition ease-in duration-100'}
        leaveFrom={'opacity-100'}
        leaveTo={'opacity-0'}
      >
        <Listbox.Options
          className={
            'absolute z-10 w-full translate-y-2 overflow-auto rounded border border-aaa/50 bg-[#2A3037] px-2 py-4'
          }
        >
          {options.map((option, index) => (
            <Listbox.Option
              key={index}
              value={option.value}
              className={
                'relative flex h-9 cursor-pointer select-none items-center justify-between text-xs'
              }
            >
              {(state) => (
                <>
                  <span className={'flex items-center truncate'}>
                    {option.name}
                  </span>
                  {state.selected && (
                    <Image
                      alt={''}
                      src={CheckIcon}
                      width={'20'}
                      height={'20'}
                    />
                  )}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  )
}
