'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import isSameAddress from '@/utils/isSameAddress'
import type { MarketOrderData } from '@/api/query'

export default function LinkButton(props: { data: MarketOrderData }) {
  const { data } = props
  const { address } = useAccount()
  const same = isSameAddress(data, address)
  const isBuy = data.type === 2
  const [Component, setComponent] = useState<'span' | typeof Link>('span')
  const [componentProps, setComponentProps] = useState<any>({})

  useEffect(() => {
    if (same) {
      setComponent('span')
    } else {
      setComponent(Link)
    }
  }, [same])

  useEffect(() => {
    const commonProps: any = {
      children: isBuy ? 'BUY' : 'SELL',
      href: isBuy
        ? `/offer/${data.id}?type=buy`
        : `/offer/${data.id}?type=sell`,
    }
    let className = 'flex h-6 w-16 items-center justify-center rounded text-sm'
    if (same) {
      className = clsx(
        'cursor-not-allowed select-none bg-[#555555] text-aaa',
        className,
      )
      delete commonProps.href
    } else {
      className = clsx(isBuy ? 'bg-[#004DFF]' : 'bg-[#EB2F96]', className)
    }

    commonProps.className = className

    setComponentProps(commonProps)
  }, [data.id, isBuy, same])

  return <Component {...componentProps} />
}
