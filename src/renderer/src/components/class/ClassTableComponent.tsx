import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput
} from 'flowbite-react'
import React, { JSX, useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table'

import { Class_Record } from '@renderer/types/ts/class'
import { Link } from 'react-router-dom'
import { Pen, Trash2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import ClassController from '@renderer/controller/ClassController'

interface props {
  data: Class_Record[]
  columns: ColumnDef<Class_Record>[]
}

export function ClassTableComponent({ data, columns }: props): JSX.Element {
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

  const [id, setId] = useState<number>(0)

  const classDelete = useMutation({
    mutationFn: (id: number) => ClassController.delete(id),
    onSuccess: () => {
      setId(0)
      // Optionally, you can refetch the class list after deletion
      // queryClient.invalidateQueries(['class-record'])
    },
    onError: () => {
      setId(0)
      // Handle error, e.g., show a notification
    }
  })

  const handleDelete = (id: number): void => {
    setId(id)
    classDelete.mutate(id)
  }

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
                <TableHeadCell>Action</TableHeadCell>
              </TableRow>
            ))}
          </TableHead>
          <TableBody className="divide-y">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    // Render each cell in the row
                    console.log('Cell Data:', cell.getContext().row.original)
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                  <TableCell className="flex gap-2">
                    <Link to={`/class/update/${row.original.id}`}>
                      <Pen />
                    </Link>
                    <Trash2 />
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
