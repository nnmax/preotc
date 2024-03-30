'use client'
import { useSearchParams } from 'next/navigation'
import FormPanel from '../_components/FormPanel'

export default function Offer() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  return <FormPanel type={type as 'buy' | 'sell'} />
}
