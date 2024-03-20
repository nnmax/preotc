import Image from 'next/image'
import clsx from 'clsx'
import USDTSvg from '@/images/USDT.svg'
import NextSvg from '@/images/next.svg'

const tabPanelContentClasses = 'mt-7 bg-[#162024] rounded-[10px] py-7 px-10'

export default function Panel({ tab }: { tab: 'buying' | 'selling' }) {
  const amountLabelText = tab === 'buying' ? 'Buying' : 'Selling'
  const labelBg = tab === 'buying' ? 'bg-[#FFC300]' : 'bg-[#EB2F96]'
  const btnBg = tab === 'buying' ? 'bg-[#004DFF]' : 'bg-[#8F2760]'
  const btnChildren =
    tab === 'buying' ? (
      <>
        <div
          className={'absolute inset-0 bg-[#1058FF] text-white blur-[15px]'}
        />
        <span className={'absolute z-10 flex items-center'}>
          {'Next'}
          <Image src={NextSvg} alt={'next'} width={'24'} className={'ml-5'} />
        </span>
      </>
    ) : (
      <>
        <span>{'Next'}</span>
        <Image src={NextSvg} alt={'next'} width={'24'} className={'ml-5'} />
      </>
    )

  return (
    <>
      <form className={tabPanelContentClasses}>
        <label className={'flex flex-col gap-y-5'}>
          <span
            className={clsx(
              'flex items-center self-start rounded-[3px] px-[10px] leading-6 text-black',
              labelBg,
            )}
          >
            {amountLabelText}
          </span>
          <input
            type={'text'}
            placeholder={'Enter Amount'}
            className={
              'rounded-[5px] bg-[#2A3037] px-[14px] leading-[44px] text-[#9E9E9E]'
            }
          />
        </label>

        <label className={'mt-8 flex flex-col gap-y-5'}>
          <span
            className={clsx(
              'flex items-center self-start rounded-[3px] px-[10px] leading-6 text-black',
              labelBg,
            )}
          >
            {'1 Token'}
          </span>
          <div
            className={
              'relative flex rounded-[5px] bg-[#2A3037] leading-[44px] text-[#9E9E9E]'
            }
          >
            <input
              type={'text'}
              placeholder={'Enter Unit Price'}
              className={
                'w-full appearance-none bg-transparent pl-[14px] pr-[100px]'
              }
            />
            <div
              className={
                'absolute right-2.5 top-0 flex items-center gap-[10px]'
              }
            >
              <span>{'USDT'}</span>
              <Image src={USDTSvg} alt={'USDT'} width={24} />
            </div>
          </div>
        </label>
        <div className={'mt-5 flex flex-col gap-3 leading-5'}>
          <span className={' text-[#737373]'}>{'For'}</span>
          <span className={'text-[#FFC300]'}>{'$ 0'}</span>
        </div>
      </form>

      <button
        type={'button'}
        className={clsx(
          'relative mt-[52px] flex h-[42px] w-full items-center justify-center rounded',
          btnBg,
        )}
      >
        {btnChildren}
      </button>
    </>
  )
}
