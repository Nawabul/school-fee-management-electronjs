import {
  Button,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput
} from 'flowbite-react'
import React, { JSX } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table'
import EditButton from './EditButton'
import MultiSelectDropdown from './MultiSelect'
import { Student_Record } from '@renderer/types/ts/student'
interface props {
  data: Student_Record[]
  columns: ColumnDef<Student_Record>[]
  id: number
  isLoading?: boolean
}

export function TableComponent({ data, columns, id, isLoading = false }: props): JSX.Element {
  const [globleFilter, setGlobleFilter] = React.useState('')
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      globalFilter: globleFilter,
      columnFilters: columnFilters
    },
    onGlobalFilterChange: setGlobleFilter
  })

  const statusColumn = table.getColumn('transfer_date')

  const classOptions = Array.from(new Set(data.map((row) => row.class_name)))

  return (
    <>
      <div className="flex ml-auto gap-3 pb-2 justify-between">
        <div className="flex gap-3">
          <TextInput
            placeholder="Filter here..."
            value={globleFilter ?? ''}
            onChange={(e) => setGlobleFilter(e.target.value)}
          />
          <Select
            onChange={(e) => {
              const value = e.target.value
              statusColumn?.setFilterValue(value === 'both' ? undefined : value)
            }}
            //@ts-ignore its working well
            value={statusColumn?.getFilterValue() ?? 'both'}
          >
            <option value="both">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers.map((header) => {
              //@ts-ignore we are using meta to pass filter component
              const filterComponent = header.column.columnDef.meta?.filterComponent
              return (
                <React.Fragment key={header.id}>
                  {filterComponent &&
                    filterComponent({ column: header.column, options: classOptions })}
                </React.Fragment>
              )
            })
          )}
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              table.resetColumnFilters()
              table.resetGlobalFilter()
            }}
            className="bg-gray-700"
            color={'alternative'}
          >
            Clear
          </Button>
          <MultiSelectDropdown
            options={table.getAllColumns().filter((column) => column.getCanHide())}
            label="Hide Columns"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            {table?.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHeadCell key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHeadCell>
                ))}
                <TableHeadCell></TableHeadCell>
              </TableRow>
            ))}
          </TableHead>
          <TableBody className="divide-y">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {isLoading && id > 0 ? (
                    <span>Loading</span>
                  ) : (
                    row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })
                  )}

                  <TableCell>
                    <EditButton />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
