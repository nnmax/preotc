import { useId } from 'react'
import clsx from 'clsx'
import TablePaginationActions from './TablePaginationActions'

interface LabelDisplayedRowsArgs {
  from: number
  to: number
  count: number
}

function defaultLabelDisplayedRows({
  from,
  to,
  count,
}: LabelDisplayedRowsArgs) {
  return (
    <>
      {from}
      {'–'}
      {to} <span className={'text-[#9B9B9B]'}>{'of'}</span> {count}
    </>
  )
}

interface TablePaginationProps {
  colSpan?: number
  count: number
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => void
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
  page: number
  rowsPerPage: number
  rowsPerPageOptions?: readonly number[]
  toolbarClassName?: string
}

export default function TablePagination(props: TablePaginationProps) {
  const {
    colSpan,
    count,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    rowsPerPageOptions = [10, 25, 50, 100],
    toolbarClassName,
  } = props

  const selectId = useId()
  const labelId = useId()

  return (
    <td colSpan={colSpan}>
      <div
        className={clsx(
          'flex h-12 w-[396px] items-center text-xs font-normal',
          toolbarClassName,
        )}
      >
        {rowsPerPageOptions.length > 1 && (
          <p id={labelId} className={'mr-2 text-[#9B9B9B]'}>
            {'Rows per page: '}
          </p>
        )}

        {rowsPerPageOptions.length > 1 && (
          <select
            className={
              'cursor-pointer rounded px-3 py-2 text-white transition-colors hover:bg-slate-700'
            }
            value={rowsPerPage}
            id={selectId}
            onChange={onRowsPerPageChange}
            aria-label={rowsPerPage.toString()}
            aria-labelledby={
              [labelId, selectId].filter(Boolean).join(' ') || undefined
            }
          >
            {rowsPerPageOptions.map((rowsPerPageOption: number) => (
              <option key={rowsPerPageOption} value={rowsPerPageOption}>
                {rowsPerPageOption}
              </option>
            ))}
          </select>
        )}

        <p className={'ml-auto text-white'}>
          {defaultLabelDisplayedRows({
            from: count === 0 ? 0 : page * rowsPerPage + 1,
            to: Math.min(count, (page + 1) * rowsPerPage),
            count: count === -1 ? -1 : count,
          })}
        </p>
        <TablePaginationActions
          page={page}
          rowsPerPage={rowsPerPage}
          count={count}
          onPageChange={onPageChange}
        />
      </div>
    </td>
  )
}
