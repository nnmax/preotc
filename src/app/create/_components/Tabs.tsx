'use client'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { useState } from 'react'
import Panel from './Panel'
import type { FormValues } from '../types'

function tabClasses({ selected }: { selected: boolean }) {
  return clsx(
    'flex flex-1 items-center justify-center',
    selected && 'bg-[#FFC300] text-black',
  )
}

export default function Tabs() {
  const searchParams = useSearchParams()
  const defaultIndex = searchParams.get('tab') === 'selling' ? 1 : 0
  const [buyingStep, setBuyingStep] = useState(1)
  const [sellingStep, setsellingStep] = useState(1)
  const methods = useForm<FormValues>()

  return (
    <FormProvider {...methods}>
      <Tab.Group defaultIndex={defaultIndex}>
        <Tab.List
          className={clsx(
            'flex h-[42px] max-w-[640px] rounded border border-solid border-[#FFC300] text-center text-[18px] text-[#FFC300]',
            (buyingStep === 2 || sellingStep === 2) && 'hidden',
          )}
        >
          <Tab className={tabClasses} as={Link} href={'/create?tab=buying'}>
            {'Buying'}
          </Tab>
          <Tab className={tabClasses} as={Link} href={'/create?tab=selling'}>
            {'Selling'}
          </Tab>
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            <Panel tab={'buying'} step={buyingStep} setStep={setBuyingStep} />
          </Tab.Panel>
          <Tab.Panel>
            <Panel
              tab={'selling'}
              step={sellingStep}
              setStep={setsellingStep}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </FormProvider>
  )
}
