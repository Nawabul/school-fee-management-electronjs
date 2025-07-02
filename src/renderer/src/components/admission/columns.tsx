import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { date_format } from '@renderer/types/constant/date'
import { Admission_Record } from '@type/interfaces/admission'

export const admissionColumns = (): ColumnDef<Admission_Record>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    enableHiding: false,
    cell: ({ row }) => Number(row.id) + 1
  },
  {
    accessorKey: 'class',
    header: 'Class',
    enableHiding: false
  },
  {
    accessorKey: 'date',
    header: 'Date',
    enableHiding: false,
    cell: ({ row }) => format(new Date(row.original.date), date_format)
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    enableHiding: false
  },
  {
    accessorKey: 'remark',
    header: 'Remark',
    enableHiding: false
  }
]
