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
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table'
import EditButton from './EditButton'
import { Class_Record } from '@renderer/types/ts/class'
import { Link } from 'react-router-dom'

interface props {
  data: Class_Record[]
  columns: ColumnDef<Class_Record>[]
}

export function SimpleTableComponent({ data, columns }: props): JSX.Element {
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
                <TableHeadCell>Id</TableHeadCell>
                {headerGroup.headers.map((header) => (
                  <TableHeadCell key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHeadCell>
                ))}
                <TableHeadCell>Action</TableHeadCell>
              </TableRow>
            ))}
          </TableHead>
          <TableBody className="divide-y">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow key={row.id}>
                  <TableCell>{i + 1}</TableCell>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                  <TableCell>
                    <Link to={`class/update/${row.id}`}>
                      <EditButton />
                    </Link>
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
