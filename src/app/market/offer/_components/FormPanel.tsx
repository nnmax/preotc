import Image from 'next/image'
import clsx from 'clsx'
import XSvg from '@/images/x.svg'
import WalletSvg from '@/images/wallet.svg'

export default function FormPanel({ type }: { type: 'buy' | 'sell' }) {
  const labelText = type === 'buy' ? 'Buying' : 'Selling'
  const labelBg = type === 'buy' ? 'bg-[#FFC300]' : 'bg-[#EB2F96]'
  const rangeShdw = type === 'buy' ? '#FFC300' : '#EB2F96'

  return (
    <div className={'flex flex-col'}>
      <div className={'flex gap-5'}>
        <div className={'h-[60px] w-[60px] rounded-full bg-slate-100'} />
        <div className={'flex flex-col gap-3'}>
          <span>{'KKKK #354'}</span>
          <div
            className={
              'w-5 rounded-[3px] border border-solid border-[#737373] p-[2px]'
            }
          >
            <Image src={XSvg} alt={'x'} width={'16'} />
          </div>
        </div>
      </div>

      <div
        className={'mb-14 mt-10 rounded-[10px] bg-[#162024] px-10 py-[26px]'}
      >
        <div className={'flex items-center justify-between'}>
          <span
            className={clsx(
              'rounded-[3px] px-2.5 leading-6 text-black',
              labelBg,
            )}
          >
            {labelText}
          </span>
          <span className={'text-xs text-[#9B9B9B]'}>{'$ 0.1516 / Token'}</span>
        </div>
        <div className={'my-5'}>
          <span className={''}>{'89893'}</span>
        </div>
        <div className={'flex items-center justify-between gap-[52px]'}>
          <input
            type={'range'}
            className={'range'}
            style={{
              '--range-shdw': rangeShdw,
            }}
          />
          <span
            className={clsx(
              'rounded-[3px] px-2.5 leading-6 text-black',
              labelBg,
            )}
          >
            {'100%'}
          </span>
        </div>
        <div className={'mt-[60px] flex flex-col gap-3'}>
          <span className={'text-[#737373]'}>{'For'}</span>
          <span className={'text-[#FFC300]'}>{'0.45454'}</span>
        </div>
      </div>

      <button
        type={'button'}
        className={clsx(
          'relative mt-[52px] flex h-[42px] w-full items-center justify-center rounded bg-[#FA5151]',
        )}
      >
        <div
          className={'absolute inset-0 bg-[#FA5151] text-white blur-[15px]'}
        />
        <span className={'absolute z-10 flex items-center'}>
          <Image src={WalletSvg} alt={'next'} width={'32'} className={'mr-5'} />
          {'Connect Wallet'}
        </span>
      </button>
    </div>
  )
}
