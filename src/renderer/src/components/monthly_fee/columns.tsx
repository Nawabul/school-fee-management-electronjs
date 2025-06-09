import { ColumnDef } from '@tanstack/react-table'
import { Monthly_Fee_Record } from '@renderer/types/ts/monthly_fee'
import { format } from 'date-fns'
import { date_format } from '@renderer/types/constant/date'

//@ts-ignore no need of methods
export const monthly_fee_columns = () // item: Record<string, (id: number) => void>
: ColumnDef<Monthly_Fee_Record>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    enableHiding: false,
    cell: ({ row }) => Number(row.id) + 1
  },
  {
    accessorKey: 'date',
    header: 'date',
    enableHiding: false,
    cell: ({ row }) => format(new Date(row.original.date), date_format)
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    enableHiding: false
  },
  {
    accessorKey: 'class_name',
    header: 'Class',
    enableHiding: false
  }
]
