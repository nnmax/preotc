import Image from 'next/image'
import Dialog from '@/components/Dialog'
import CheckGreenSvg from '@/images/check-green.svg'

interface DepositSuccessfulModalProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function DepositSuccessfulModal({
  open,
  setOpen,
}: DepositSuccessfulModalProps) {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      panelClassName={'!max-w-[490px]'}
    >
      <div className={'flex flex-col items-center'}>
        <Image src={CheckGreenSvg} width={'24'} height={'24'} alt={''} />
        <p className={'mb-10 mt-4 text-xs leading-6'}>
          {
            'Congratulations on completing the settlement, please be patient and '
          }
          {'wait for the confirmation.'}
        </p>
        <button
          type={'button'}
          onClick={() => setOpen(false)}
          className={
            'flex h-9 w-[140px] items-center justify-center rounded-[5px] bg-[#EB2F96]'
          }
        >
          {'Confirm'}
        </button>
      </div>
    </Dialog>
  )
}
