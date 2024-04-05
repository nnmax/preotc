import Image from 'next/image'
import clsx from 'clsx'
import InfoBlackSvg from '@/images/info-black.svg'
import Tooltip from '@/components/Tooltip'

const data = [
  {
    name: 'LISTING',
    description: (
      <>
        {
          'You will earn more points by creating a selling offer which is closer to the highest buying offer or a buying offer which is closer to the lowest selling offer. The number of points increased every '
        }
        <span>{'24 hours'}</span>
        {
          ' is equal to your “closer coefficient” multiplied by your order amount, with a maximum coefficient of '
        }
        <span>{'2'}</span>
        {'.'}
      </>
    ),
  },
  {
    name: 'TRADING',
    description: (
      <>
        {
          'You will earn points as you make any deal. The points will continue to increase until the deal is completed. The number of points increased every '
        }
        <span>{'24 hours'}</span>
        {' is equal to your deal amount.'}
      </>
    ),
  },
  {
    name: 'CREDIT',
    description: (
      <>
        {
          'If you are a seller, you will earn points for each successful settlement; if you are a buyer, you will earn points as compensation for each time the seller fails to settle the tokens to you within the deadline. The number of points you earn each time is equal to '
        }
        <span>{'100'}</span>
        {' multiplied by the deal amount.'}
      </>
    ),
  },
  {
    name: 'REFERRAL',
    description: (
      <>
        {'You will earn '}
        <span>{'+20%'}</span>
        {
          ' on top of any points your referrals earn. The more they earn, the more you earn!'
        }
      </>
    ),
  },
]

export default function Points() {
  return (
    <div className={'flex flex-col px-[34px] pt-6 min-[1920px]:px-[209px]'}>
      <div className={'flex gap-2 rounded-md border-4 border-[#FFC300]'}>
        {data.map((item, index, arr) => (
          <div key={item.name} className={'flex flex-1 flex-col'}>
            <div
              className={
                'flex h-14 items-center justify-center rounded-b-md bg-[#FFC300] first:rounded-bl-none last:rounded-br-none'
              }
            >
              <h2
                className={
                  'flex items-center justify-center gap-6 text-sm text-black'
                }
              >
                <span>
                  {item.name}
                  {' PTS'}
                </span>
                <Tooltip
                  title={item.description}
                  placement={'bottom'}
                  className={'[&>span]:text-[#FFC300]'}
                >
                  <Image
                    src={InfoBlackSvg}
                    alt={'info'}
                    width={'20'}
                    height={'20'}
                    tabIndex={0}
                  />
                </Tooltip>
              </h2>
            </div>
            <div
              className={clsx(
                index !== arr.length - 1 && 'border-r-4 border-[#FFC300]',
                'mb-1 mt-[22px] flex h-[86px] items-center justify-center',
              )}
            >
              <p>{'????'}</p>
            </div>
          </div>
        ))}
      </div>

      <p className={'mt-[88px] text-center text-[18px] text-[#FFC300]'}>
        {'Coming Soon...'}
      </p>
    </div>
  )
}
