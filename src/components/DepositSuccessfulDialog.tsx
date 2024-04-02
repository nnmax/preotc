import Image from 'next/image'
import Dialog from '@/components/Dialog'
import CheckGreenSvg from '@/images/check-green.svg'

interface DepositSuccessfulDialogProps {
  open: boolean
  onClose: () => void
  text: string
}

export default function DepositSuccessfulDialog({
  open,
  onClose,
  text,
}: DepositSuccessfulDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      panelClassName={'max-w-[412px] flex flex-col items-center'}
    >
      <Image src={CheckGreenSvg} width={'24'} height={'24'} alt={'check'} />
      <p className={'mt-4 text-xs leading-6'}>{text}</p>
    </Dialog>
  )
}
