import { ColumnDef } from '@tanstack/react-table'
import { Class_Record } from '@renderer/types/ts/class'
export const classColumns: ColumnDef<Class_Record>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableHiding: false,
    cell: ({ row }) => Number(row.id) + 1
  },
  {
    accessorKey: 'name',
    header: 'Name',
    enableHiding: false
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    enableHiding: false
  }
]
