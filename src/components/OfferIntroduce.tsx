import clsx from 'clsx'
import TelegramAlertButton from '@/components/TelegramAlertButton'

export default function OfferIntroduce({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        className,
        'flex flex-col gap-5 text-xs leading-[30px] text-white [&>p>span]:text-[#FFC300]',
      )}
    >
      <p>
        {
          '1. In order to ensure that the seller will complete the delivery of the tokens in time, the seller needs to deposit '
        }
        <span>{'2x'}</span> {'the deal amount of USDT.'}
      </p>
      <p>
        {
          '2. Please pay close attention to the delivery time of the tokens after the deal is completed, once the token delivery process is opened, the seller will have '
        }
        <span>{'72 hours'}</span>
        {
          " to deliver the token, if it is not completed before the deadline, it will be regarded as a breach of contract, and the seller's "
        }
        <span>{'2x'}</span>
        {
          ' deposit will be regarded as the compensation for the buyer! If the seller completes the delivery, the buyer will have '
        }
        <span>{'7 days'}</span>{' '}
        {
          'to confirm the deal, and if the buyer does not complete the confirmation within 7 days,  the buyer will be penalized with half of the tokens!'
        }
      </p>
      <p>
        {
          '3. Please connect your telegram to ensure that you can receive timely alerts such as delivery notifications, confirmation notifications and deals completion!'
        }
      </p>
      <TelegramAlertButton type={2} />
    </div>
  )
}
