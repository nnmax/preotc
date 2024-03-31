import clsx from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  bgColorClass?: string
}

export default function Button(props: ButtonProps) {
  const { disabled, loading, children, className, bgColorClass, ...restProps } =
    props

  return (
    <button
      type={'button'}
      disabled={loading || disabled}
      className={clsx(
        className,
        bgColorClass,
        disabled && 'cursor-not-allowed',
        loading && 'cursor-wait',
        'flex h-[42px] w-full items-center justify-center rounded',
      )}
      {...restProps}
    >
      {loading ? (
        <span className={'loading loading-dots mr-2'} />
      ) : (
        <span className={'flex items-center'}>{children}</span>
      )}
    </button>
  )
}
