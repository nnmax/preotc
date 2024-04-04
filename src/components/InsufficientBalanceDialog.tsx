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
      panelClassName={'max-w-[359px] flex items-center'}
    >
      <Image src={ErrorSvg} width={'28'} height={'28'} alt={'check'} />
      <p className={'ml-4 text-xs leading-5'}>{'Insufficient balance!'}</p>
    </Dialog>
  )
}
