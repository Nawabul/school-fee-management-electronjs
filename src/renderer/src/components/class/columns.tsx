import { ColumnDef } from '@tanstack/react-table'
import { Class_Record } from '@renderer/types/ts/class'
import { Pen, Trash2 } from 'lucide-react'

export const classColumns = (
  item: Record<string, (id: number) => void>
): ColumnDef<Class_Record>[] => [
  {
    accessorKey: 'id',
    header: 'S.NO.',
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
    header: 'Tution Fee Monthly',
    enableHiding: false
  },
  {
    accessorKey: 'admission_charge',
    header: 'Enrollment Charge',
    enableHiding: false
  },
  {
    accessorKey: 'Action',
    header: 'Action',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex gap-2 ">
        <Pen fill="blue" onClick={(): void => item.update(row.original.id)} />
        <Trash2 fill="red" onClick={(): void => item.delete(row.original.id)} />
      </div>
    )
  }
]
