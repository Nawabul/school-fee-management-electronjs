import { ColumnDef } from '@tanstack/react-table'
import { Mis_Charge_Record } from '@renderer/types/ts/mis_charge'
import { Pen, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { date_format } from '@renderer/types/constant/date'

export const misChargeColumns = (
  item: Record<string, (id: number) => void>
): ColumnDef<Mis_Charge_Record>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    enableHiding: false,
    cell: ({ row }) => Number(row.id) + 1
  },
  {
    accessorKey: 'item_name',
    header: 'Item Name',
    enableHiding: false
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
    accessorKey: 'status',
    header: 'Status',
    enableHiding: false,
    cell: ({ row }) => {
      const amount = row.original.amount
      const paid = row.original.paid
      if (amount == paid) {
        return <span className="text-green-700">Paid</span>
      } else if (paid > 0) {
        return (
         <div className="flex flex-col">
            <span className="text-yellow-400"> Partial</span>
            <span className="text-xs">{paid}</span>
          </div>
        )
      } else {
        return <span className="text-red-700">Unpaid</span>
      }
    }
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
