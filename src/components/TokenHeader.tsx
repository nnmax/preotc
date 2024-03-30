import Image from 'next/image'
import XSvg from '@/images/x.svg'

interface TokenHeaderProps {
  avatarUrl: string
  name: string
  twitterUrl: string
  id: number
}

export default function TokenHeader(props: TokenHeaderProps) {
  const { avatarUrl, name, twitterUrl, id } = props
  return (
    <div className={'flex items-center'}>
      <Image
        src={avatarUrl}
        alt={''}
        width={'60'}
        height={'60'}
        className={'mr-5 rounded-full'}
      />
      <div className={'flex flex-col'}>
        <p className={'mb-3 flex text-[18px] leading-5'}>
          {name}
          <span className={'ml-2.5 text-sm leading-4'}>{`# ${id}`}</span>
        </p>
        <a
          href={twitterUrl}
          target={'_blank'}
          rel={'noreferrer'}
          className={
            'flex w-5 items-center rounded-[3px] border border-solid border-[#737373] p-[2px]'
          }
        >
          <Image src={XSvg} alt={'x'} width={'16'} height={'16'} />
        </a>
      </div>
    </div>
  )
}
