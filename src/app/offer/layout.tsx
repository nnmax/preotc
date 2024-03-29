'use client'
import { useSearchParams } from 'next/navigation'
import OfferLayout from '@/components/OfferLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')

  return (
    <OfferLayout linkTitle={type === 'sell' ? 'Selling' : 'Buying'}>
      {children}
    </OfferLayout>
  )
}
