import Image from 'next/image'
import Link from 'next/link'
import WhiteLogo from '@/images/white-logo.svg'
import XFilled from '@/images/x-filled.svg'

export default function Footer() {
  return (
    <footer className={'flex h-16 w-full items-center bg-black px-14'}>
      <Link
        href={'https://twitter.com/preotc_xyz'}
        className={'flex items-center gap-2'}
      >
        <Image src={WhiteLogo} alt={''} />
        <div
          className={
            'flex h-6 w-6 items-center justify-center rounded border border-white/50'
          }
        >
          <Image src={XFilled} alt={''} />
        </div>
      </Link>
    </footer>
  )
}
