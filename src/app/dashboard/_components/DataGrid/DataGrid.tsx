import clsx from 'clsx'
import { useState } from 'react'
import TablePagination from '@/app/dashboard/_components/TablePagination/TablePagination'
import { tdClasses, thClasses, trBorderClasses } from '@/app/dashboard/classes'

export interface Column<
  DateType extends Record<string, any> = Record<string, any>,
> {
  field: string
  headerName?: React.ReactNode
  renderCell?: (params: { row: DateType }) => React.ReactNode
}

export interface DataGridProps<
  DateType extends Record<string, any> = Record<string, any>,
> {
  columns: Column<DateType>[]
  rows?: DateType[]
  loading?: boolean
}

export default function DataGrid<
  DateType extends Record<string, any> = Record<string, any>,
>(props: DataGridProps<DateType>) {
  const { columns, rows, loading } = props
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const pageRows = (rows ?? []).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  )

  return (
    <table className={'table'}>
      <thead>
        <tr className={trBorderClasses}>
          {columns.map((column, index) => (
            <th className={thClasses} key={index}>
              {column.headerName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {pageRows.length > 0 ? (
          pageRows.map((row, index, arr) => {
            return (
              <tr
                key={index}
                className={
                  index === arr.length - 1
                    ? 'hover'
                    : clsx(trBorderClasses, 'hover')
                }
              >
                {columns.map((column, index2) => (
                  <td className={tdClasses} key={index2}>
                    {column.renderCell
                      ? column.renderCell({ row })
                      : row[column.field]}
                  </td>
                ))}
              </tr>
            )
          })
        ) : (
          <tr>
            <td
              colSpan={columns.length}
              className={clsx(tdClasses, '!py-20 !text-center')}
            >
              {loading ? (
                <span className={'loading loading-dots'} />
              ) : (
                'No Data'
              )}
            </td>
          </tr>
        )}
      </tbody>
      {(rows ?? []).length > 0 && (
        <tfoot className={'bg-[var(--body-background-color)]'}>
          <tr>
            <TablePagination
              toolbarClassName={'ml-auto'}
              count={rows?.length ?? 0}
              colSpan={columns.length}
              onPageChange={handleChangePage}
              page={page}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </tr>
        </tfoot>
      )}
    </table>
  )
}
