function ChevronLeftFilledSvg() {
  return (
    <svg
      xmlns={'http://www.w3.org/2000/svg'}
      fill={'none'}
      version={'1.1'}
      width={'24'}
      height={'24'}
      viewBox={'0 0 24 24'}
    >
      <defs>
        <clipPath id={'master_svg0_72_13995/1_472'}>
          <rect x={'0'} y={'0'} width={'24'} height={'24'} rx={'0'} />
        </clipPath>
      </defs>
      <g clipPath={'url(#master_svg0_72_13995/1_472)'}>
        <g>
          <path
            d={
              'M15.705000076293945,7.41C15.705000076293945,7.41,14.295000076293945,6,14.295000076293945,6C14.295000076293945,6,8.295000076293945,12,8.295000076293945,12C8.295000076293945,12,14.295000076293945,18,14.295000076293945,18C14.295000076293945,18,15.705000076293945,16.59,15.705000076293945,16.59C15.705000076293945,16.59,11.125000076293945,12,11.125000076293945,12C11.125000076293945,12,15.705000076293945,7.41,15.705000076293945,7.41C15.705000076293945,7.41,15.705000076293945,7.41,15.705000076293945,7.41Z'
            }
            fill={'currentColor'}
            fillOpacity={'1'}
          />
        </g>
      </g>
    </svg>
  )
}

function ChevronRightFilledSvg() {
  return (
    <svg
      xmlns={'http://www.w3.org/2000/svg'}
      fill={'none'}
      version={'1.1'}
      width={'24'}
      height={'24'}
      viewBox={'0 0 24 24'}
    >
      <defs>
        <clipPath id={'master_svg0_72_13996/1_472'}>
          <rect x={'0'} y={'0'} width={'24'} height={'24'} rx={'0'} />
        </clipPath>
      </defs>
      <g clipPath={'url(#master_svg0_72_13996/1_472)'}>
        <g>
          <path
            d={
              'M9.705000076293945,6C9.705000076293945,6,8.295000076293945,7.41,8.295000076293945,7.41C8.295000076293945,7.41,12.875000076293945,12,12.875000076293945,12C12.875000076293945,12,8.295000076293945,16.59,8.295000076293945,16.59C8.295000076293945,16.59,9.705000076293945,18,9.705000076293945,18C9.705000076293945,18,15.705000076293945,12,15.705000076293945,12C15.705000076293945,12,9.705000076293945,6,9.705000076293945,6C9.705000076293945,6,9.705000076293945,6,9.705000076293945,6Z'
            }
            fill={'currentColor'}
            fillOpacity={'1'}
          />
        </g>
      </g>
    </svg>
  )
}

const actionButtonClasses =
  'button-base h-12 w-12 rounded-full text-white transition-colors hover:bg-slate-700 disabled:text-[#9B9B9B]'

export interface TablePaginationActionsProps {
  count: number
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => void
  page: number
  rowsPerPage: number
}

export default function TablePaginationActions(
  props: TablePaginationActionsProps,
) {
  const { count, onPageChange, page, rowsPerPage } = props

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page + 1)
  }

  return (
    <div className={'flex items-center'}>
      <button
        type={'button'}
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label={'Go to previous page'}
        title={'Go to previous page'}
        className={actionButtonClasses}
      >
        <ChevronLeftFilledSvg />
      </button>
      <button
        type={'button'}
        onClick={handleNextButtonClick}
        disabled={
          count === -1 ? false : page >= Math.ceil(count / rowsPerPage) - 1
        }
        aria-label={'Go to next page'}
        title={'Go to next page'}
        className={actionButtonClasses}
      >
        <ChevronRightFilledSvg />
      </button>
    </div>
  )
}
