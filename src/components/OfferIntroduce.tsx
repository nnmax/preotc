import clsx from 'clsx'
import TelegramAlertButton from '@/components/TelegramAlertButton'

export default function OfferIntroduce({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        className,
        'flex flex-col gap-5 text-xs leading-[30px] text-white [&>p>a]:text-[#FFC300] [&>p>a]:underline [&>p>span]:text-[#FFC300]',
      )}
    >
      <p>
        {
          '1. In order to ensure that the seller will complete the settlement of the tokens in time, the seller needs to deposit '
        }
        <span>{'2x'}</span> {'the deal amount of USDB.'}
      </p>
      <p>
        {
          '2. Please pay close attention to the settlement time of the tokens after the deal is completed, once the settlement process is opened, the seller will have '
        }
        <span>{'72 hours'}</span>{' '}
        {
          "to settle the token, if it is not completed before the deadline, it will be regarded as a breach of contract, and the seller's deposit will be regarded as the compensation for the buyer!"
        }
      </p>
      <p>
        {'3. '}
        <span>{'How to get USDB?'}</span>
        {' Bridge USDT/ USDC/ DAI to the Blast Network on '}
        <a href={'https://blast.io'} target={'_blank'} rel={'noreferrer'}>
          {'blast.io'}
        </a>
        {'.'}
      </p>
      <p>
        {
          '4. Please connect your telegram to ensure that you can receive timely alerts such as settlement notifications, confirmation notifications and deals completion!'
        }
      </p>
      <TelegramAlertButton type={2} />
    </div>
  )
}
