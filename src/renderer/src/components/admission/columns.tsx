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
  }
]
