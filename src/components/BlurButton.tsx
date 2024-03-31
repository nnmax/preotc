import clsx from 'clsx'

interface BlurButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  bgColorClass?: string
  disabledBlur?: boolean
}

export default function BlurButton(props: BlurButtonProps) {
  const {
    disabled,
    loading,
    children,
    className,
    bgColorClass,
    disabledBlur,
    ...restProps
  } = props

  return (
    <button
      type={'button'}
      disabled={loading || disabled}
      className={clsx(
        className,
        bgColorClass,
        disabled && 'cursor-not-allowed',
        loading && 'cursor-wait',
        'relative flex h-[42px] w-full items-center justify-center rounded',
      )}
      {...restProps}
    >
      {loading ? (
        <span className={'loading loading-dots mr-2'} />
      ) : (
        <>
          {!disabledBlur && (
            <div
              className={clsx(bgColorClass, 'absolute inset-0 blur-[15px]')}
            />
          )}
          <span className={'absolute z-10 flex items-center'}>{children}</span>
        </>
      )}
    </button>
  )
}
