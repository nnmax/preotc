import Dialog from '@/components/Dialog'
import { SteeldConfirmLocalStorageKey } from '@/constant'

interface SettleConfirmDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function SettleConfirmDialog(props: SettleConfirmDialogProps) {
  const { open, setOpen } = props

  const handleClose = () => {
    setOpen(false)
    window.localStorage.setItem(SteeldConfirmLocalStorageKey, 'true')
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      panelClassName={'flex flex-col items-center min-w-[580px] py-10 px-16'}
      showCloseButton={false}
    >
      <p className={'text-xs leading-6 [&>span]:text-[#FFC300]'}>
        {
          'You have a deal to be settled, please complete it in the dashboard as soon as possible. If the settlement is not completed within '
        }
        <span>{'72 hours'}</span>
        {', you will lose all the '}
        <span>{'USDB'}</span> {'your have deposited!'}
      </p>
      <button
        type={'button'}
        className={'mt-10 h-9 w-[140px] rounded-[5px] bg-[#EB2F96]'}
        onClick={handleClose}
      >
        {'Confirm'}
      </button>
    </Dialog>
  )
}
