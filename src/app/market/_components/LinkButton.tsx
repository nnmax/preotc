'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { useMemo } from 'react'
import type { Hex } from 'viem'
import type { SearchMarketOrderResponse } from '@/api'

function isSameAddress(
  data: SearchMarketOrderResponse,
  address: Hex | undefined,
) {
  if (data.type === 1) {
    return data.buyerEthAddress?.toLowerCase() === address?.toLowerCase()
  }
  if (data.type === 2) {
    return data.sellerEthAddress?.toLowerCase() === address?.toLowerCase()
  }
  return false
}

export default function LinkButton(props: { data: SearchMarketOrderResponse }) {
  const { data } = props
  const { address } = useAccount()

  const Component = useMemo(() => {
    if (isSameAddress(data, address)) {
      return 'span'
    }
    return Link
  }, [address, data])

  const componentProps = useMemo(() => {
    const commonProps = {
      className: clsx(
        'flex h-6 w-16 items-center justify-center rounded text-sm',
        data.type === 2 ? 'bg-[#004DFF]' : 'bg-[#EB2F96]',
      ),
      children: data.type === 2 ? 'BUY' : 'SELL',
    }

    if (!isSameAddress(data, address)) {
      Object.assign(commonProps, {
        href:
          data.type === 2
            ? `/offer/${data.id}?type=buy`
            : `/offer/${data.id}?type=sell`,
      })
    }

    return commonProps as any
  }, [address, data])

  return <Component {...componentProps} />
}
