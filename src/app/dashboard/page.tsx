import { Suspense } from 'react'
import Tabs from './_components/Tabs'

export default function Dashboard() {
  return (
    <Suspense fallback={<span className={'loading loading-dots'} />}>
      <Tabs />
    </Suspense>
  )
}
