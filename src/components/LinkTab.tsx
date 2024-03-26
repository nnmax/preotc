'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export default function LinkTab(props: React.ComponentProps<typeof Link>) {
  const { className, children, href, ...restProps } = props
  const pathname = usePathname()
  const isSelected =
    typeof href === 'string'
      ? pathname.startsWith(href)
      : pathname.startsWith(href.pathname!)

  return (
    <Link
      role={'tab'}
      href={href}
      aria-selected={isSelected}
      aria-current={isSelected ? 'page' : undefined}
      className={clsx('relative', {
        'before:absolute before:left-1/2 before:top-full before:h-1.5 before:w-9 before:-translate-x-1/2 before:translate-y-[2px] before:rounded-md before:bg-[#ffc300] before:content-[""]':
          isSelected,
      })}
      {...restProps}
    >
      {children}
    </Link>
  )
}
