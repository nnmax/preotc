import Image from 'next/image'
import Link from 'next/link'
import LeftSvg from '@/images/left.svg'
import OfferIntroduce from '@/components/OfferIntroduce'

export default function Layout({
  children,
  linkTitle,
}: {
  children: React.ReactNode
  linkTitle: React.ReactNode
}) {
  return (
    <div className={'flex flex-col items-center py-5'}>
      <div className={'mr-auto'}>
        <Link href={'/market'} className={'flex items-center'}>
          <Image className={'mr-2'} src={LeftSvg} alt={'left'} width={'32'} />
          {linkTitle}
        </Link>
      </div>
      <div className={'flex justify-center gap-[46px] py-9'}>
        <div
          className={
            'w-[720px] rounded-[10px] bg-[#2A3037] px-10 py-8 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.3)]'
          }
        >
          {children}
        </div>
        <OfferIntroduce className={'w-[503px]'} />
      </div>
    </div>
  )
}
