import Image from 'next/image'
import clsx from 'clsx'
import Dialog from '@/components/Dialog'
import CheckGreenSvg from '@/images/check-green.svg'

interface DepositSuccessfulDialogProps {
  open: boolean
  onClose: () => void
  text: React.ReactNode
  textClasses?: string
}

export default function DepositSuccessfulDialog({
  open,
  onClose,
  text,
  textClasses,
}: DepositSuccessfulDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      panelClassName={'!max-w-[412px] flex flex-col items-center'}
    >
      <Image src={CheckGreenSvg} width={'24'} height={'24'} alt={'check'} />
      <p className={clsx('mt-4 text-xs leading-6', textClasses)}>{text}</p>
    </Dialog>
  )
}
