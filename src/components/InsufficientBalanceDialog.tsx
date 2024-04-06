import Image from 'next/image'
import Dialog from '@/components/Dialog'
import ErrorSvg from '@/images/error.png'

interface InsufficientBalanceDialogProps {
  open: boolean
  onClose: () => void
}

export default function InsufficientBalanceDialog({
  open,
  onClose,
}: InsufficientBalanceDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      panelClassName={
        '!max-w-[412px] flex flex-col items-center text-xs leading-6'
      }
    >
      <div className={'mb-4 flex items-center'}>
        <Image src={ErrorSvg} width={'28'} height={'28'} alt={'check'} />
        <p className={'ml-4'}>{'Insufficient balance!'}</p>
      </div>
      <p>
        <span className={'text-[#FFC300]'}>{'How to get USDB?'}</span>{' '}
        {'Bridge USDT/ USDC/ DAI to the Blast Network'}
        {'on '}
        <a
          href={'https://blast.io'}
          target={'_blank'}
          rel={'noreferrer'}
          className={'text-[#FFC300] underline'}
        >
          {'blast.io'}
        </a>
        {'.'}
      </p>
    </Dialog>
  )
}
