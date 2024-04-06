import { Suspense } from 'react'
import Tabs from './_components/Tabs'

export default function MarketLayout() {
  return (
    <Suspense fallback={<span className={'loading loading-dots'} />}>
      <Tabs />
    </Suspense>
  )
}
