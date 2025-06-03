import {
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
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table'

import { Class_Record } from '@renderer/types/ts/class'

interface props {
  data: Class_Record[]
  columns: ColumnDef<Class_Record>[]
  isLoading?: boolean
  id?: number
}

export function SimpleTableComponent({
  data,
  columns,
  isLoading = false,
  id = 0
}: props): JSX.Element {
  const [globleFilter, setGlobleFilter] = React.useState('')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    state: {
      globalFilter: globleFilter
    },
    onGlobalFilterChange: setGlobleFilter
  })

  return (
    <>
      <div className="flex ml-auto gap-3 pb-2 justify-between">
        <div className="flex gap-3">
          <TextInput
            placeholder="Filter here..."
            value={globleFilter ?? ''}
            onChange={(e) => setGlobleFilter(e.target.value)}
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
              </TableRow>
            ))}
          </TableHead>
          <TableBody className="divide-y">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {isLoading && id != 0 ? (
                    <span>Loading</span>
                  ) : (
                    row.getVisibleCells().map((cell) => {
                      // Render each cell in the row
                      console.log('Cell Data:', cell.getContext().row.original)
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })
                  )}
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
