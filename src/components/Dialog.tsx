'use client'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment } from 'react'
import Image from 'next/image'
import CLoseSvg from '@/images/close.svg'

interface DialogBaseProps {
  open?: boolean
  onClose?: () => void
  panelClassName?: string
  children?: React.ReactNode | undefined
}

export default function Dialog(props: DialogBaseProps) {
  const { panelClassName, children, open, onClose } = props

  const handleClose = () => {
    if (onClose) onClose()
  }

  return (
    <Transition as={Fragment} show={open}>
      <HeadlessDialog className={'relative z-10'} onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter={'ease-out duration-300'}
          enterFrom={'opacity-0'}
          enterTo={'opacity-100'}
          leave={'ease-in duration-200'}
          leaveFrom={'opacity-100'}
          leaveTo={'opacity-0'}
        >
          <div className={'fixed inset-0 bg-black/60'} aria-hidden={'true'} />
        </Transition.Child>

        <div
          className={
            'fixed inset-[192px_0_auto] flex w-screen items-center justify-center p-4'
          }
        >
          <Transition.Child
            as={Fragment}
            enter={'ease-out duration-300'}
            enterFrom={'opacity-0 scale-95'}
            enterTo={'opacity-100 scale-100'}
            leave={'ease-in duration-200'}
            leaveFrom={'opacity-100 scale-100'}
            leaveTo={'opacity-0 scale-95'}
          >
            <HeadlessDialog.Panel
              className={clsx(
                'shadow-[0px_4px_10px_0px_rgba(0,0,0,0.3) relative m-8 max-h-[calc(100%-64px)] w-full max-w-[600px] overflow-y-auto rounded-[10px] bg-[#2A3037] px-10 pb-8 pt-4',
                panelClassName,
              )}
            >
              <button
                type={'button'}
                className={'absolute right-2 top-2 h-5 w-5'}
                onClick={handleClose}
              >
                <Image
                  src={CLoseSvg}
                  width={'20'}
                  height={'20'}
                  alt={'Close'}
                />
              </button>
              {children}
            </HeadlessDialog.Panel>
          </Transition.Child>
        </div>
      </HeadlessDialog>
    </Transition>
  )
}
