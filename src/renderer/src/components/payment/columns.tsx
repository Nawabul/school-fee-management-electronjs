import { ColumnDef } from '@tanstack/react-table'
import { Payment_Record } from '@renderer/types/ts/payments'
import { Pen, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { date_format } from '@renderer/types/constant/date'

export const paymentColumns = (
  item: Record<string, (id: number) => void>
): ColumnDef<Payment_Record>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    enableHiding: false,
    cell: ({ row }) => Number(row.id) + 1
  },
  {
    accessorKey: 'date',
    header: 'Name',
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
  },
  {
    accessorKey: 'Action',
    header: 'Action',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex gap-2 ">
        <Pen onClick={(): void => item.update(row.original.id)} />
        <Trash2 onClick={(): void => item.delete(row.original.id)} />
      </div>
    )
  }
]
