import { ColumnDef } from '@tanstack/react-table'
import { Mis_Item_Record } from '@renderer/types/ts/mis_item'
import { Pen, Trash2 } from 'lucide-react'

export const misItemColumns = (
  item: Record<string, (id: number) => void>
): ColumnDef<Mis_Item_Record>[] => [
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
