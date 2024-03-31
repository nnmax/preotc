import React from 'react'

export default function NavTabs(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <div role={'navigation'} className={'relative'}>
      <div
        role={'tablist'}
        className={'flex h-8 flex-row gap-x-14 text-sm text-white'}
      >
        {children}
      </div>
    </div>
  )
}
