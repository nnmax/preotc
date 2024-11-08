'use client'
import { useState } from 'react'
import React from 'react'
import clsx from 'clsx'
import {
  FloatingPortal,
  offset,
  safePolygon,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
  shift,
} from '@floating-ui/react'
import { isObject } from 'lodash-es'
import useForkRef from '@/hooks/useForkRef'
import type { Placement } from '@floating-ui/react'

interface TooltipProps {
  title: React.ReactNode
  children: React.ReactElement
  floatingClassName?: string
  placement?: Placement
  defaultOpen?: boolean
  strategy?: 'fixed' | 'absolute'
  className?: string
  delay?:
    | number
    | Partial<{
        open: number
        close: number
      }>
}

export default function Tooltip(props: TooltipProps) {
  const {
    children: childrenProp,
    title,
    delay = 150,
    placement = 'top',
    floatingClassName,
    defaultOpen = false,
    strategy,
    className,
  } = props

  const children = React.isValidElement(childrenProp) ? (
    childrenProp
  ) : (
    <span>{childrenProp}</span>
  )

  const [isOpen, setIsOpen] = useState(defaultOpen)

  const { refs, floatingStyles, context } = useFloating({
    placement,
    middleware: [
      offset(8),
      shift({
        padding: 16,
      }),
    ],
    open: isOpen,
    onOpenChange: setIsOpen,
    strategy,
  })
  const hover = useHover(context, {
    delay,
    handleClose: safePolygon({
      blockPointerEvents: true,
    }),
  })
  const focus = useFocus(context)
  const role = useRole(context)
  const dismiss = useDismiss(context)
  const { isMounted, styles } = useTransitionStyles(context, {
    initial: {
      transform: `scale(0.75, ${0.75 ** 2})`,
      opacity: 0,
    },
    common: ({ placement: _placement }) => ({
      transformOrigin: {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left',
        'top-start': 'bottom left',
        'top-end': 'bottom right',
        'bottom-start': 'top left',
        'bottom-end': 'top right',
        'left-start': 'top right',
        'left-end': 'bottom right',
        'right-start': 'top left',
        'right-end': 'bottom left',
      }[_placement],
    }),
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    role,
    dismiss,
  ])

  const handleRefs = useForkRef((children as any).ref, refs.setReference)

  const floatingProps = getFloatingProps()

  return (
    <>
      {React.cloneElement(
        children,
        getReferenceProps({
          ...children.props,
          ref: handleRefs,
        }),
      )}
      {isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            {...floatingProps}
            style={{
              ...floatingStyles,
              ...(isObject(floatingProps.style) ? floatingStyles : {}),
            }}
            className={clsx(
              floatingClassName,
              getFloatingProps().className as string,
            )}
          >
            <div
              style={styles}
              className={clsx(
                className,
                'w-full max-w-[460px] rounded-md border border-aaa/50 bg-[#1e1e1e] p-4 text-xs leading-6',
              )}
            >
              {title}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  )
}
