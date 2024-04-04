import Image from 'next/image'
import XSvg from '@/images/x.svg'

interface TokenHeaderProps {
  avatarUrl: string | undefined
  name: string | undefined
  twitterUrl: string | undefined
  id: number | undefined
}

export default function TokenHeader(props: TokenHeaderProps) {
  const { avatarUrl, name, twitterUrl, id } = props
  return (
    <div className={'flex items-center'}>
      {avatarUrl && (
        <Image
          src={avatarUrl}
          alt={''}
          width={'56'}
          height={'56'}
          className={'mr-2 rounded-full'}
        />
      )}
      <div className={'flex flex-col'}>
        <p className={'mb-3 flex'}>
          {name}
          {id && (
            <span
              className={'ml-2.5 text-sm leading-4 text-[#737373]'}
            >{`#${id}`}</span>
          )}
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
