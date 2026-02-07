import { ColumnDef } from '@tanstack/react-table'
import AmountFilter from '../table/AmountFilter'
import FilterClass from '../table/FilterClass'
import { Student_Record } from '@renderer/types/ts/student'
import { format } from 'date-fns'
import { date_format } from '@renderer/types/constant/date'
import { CircleDot, CircleSlash, ClipboardList, Pen, Trash2, User, User2 } from 'lucide-react'
import { GenderEnum } from '@renderer/types/constant/gender'

export const studentColumns = (
  item: Record<string, (id: number, data: Student_Record) => void>
): ColumnDef<Student_Record>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    enableHiding: false,
    cell: ({ row }) => Number(row.id) + 1
  },
  {
    accessorKey: 'reg_number',
    header: 'Reg. Number',
    enableHiding: false
  },
  {
    accessorKey: 'student_name',
    header: 'Name',
    enableHiding: false
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => {
      const genderValue = GenderEnum[row.original.gender] ?? 'Not Mentioned'
      const isMale = genderValue === 'Male'
      const isFemale = genderValue === 'Female'

      const IconComponent = isMale ? User : isFemale ? User2 : CircleSlash

      const iconColor = isMale ? 'text-blue-500' : isFemale ? 'text-pink-500' : 'text-gray-500'

      const tagClass = isMale
        ? 'bg-blue-500/20 text-blue-700'
        : isFemale
          ? 'bg-pink-500/20 text-pink-700'
          : 'bg-gray-500/20 text-gray-700'

      return (
        <div className="flex items-center gap-2">
          <IconComponent className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tagClass}`}>
            {genderValue}
          </span>
        </div>
      )
    }
  },
  // ... (rest of your columns are unchanged)
  {
    accessorKey: 'father_name',
    header: 'Father Name',
    enableHiding: true
  },
  {
    accessorKey: 'mobile',
    header: 'Mobile',
    enableHiding: true
  },
  {
    accessorKey: 'class_name',
    header: 'Class',
    enableHiding: false,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true
      return filterValue.includes(row.getValue(columnId))
    },
    meta: {
      filterComponent: FilterClass
    }
  },
  {
    accessorKey: 'admission_date',
    header: 'Admission Date',
    enableHiding: true,
    cell: ({ row }) => format(new Date(row.original.admission_date), date_format)
  },
  {
    accessorKey: 'transfer_date',
    header: 'Transfered',
    filterFn: (row, columnId, filterValue) => {
      const date = row.getValue(columnId)
      if (filterValue === 'active') return !date
      if (filterValue === 'inactive') return !!date
      return true
    },
    cell: ({ row }) =>
      row.original.transfer_date != null
        ? format(new Date(row.original.transfer_date), date_format)
        : 'Active',
    enableHiding: true
  },
  {
    accessorKey: 'current_balance',
    header: 'Current Balance',
    filterFn: (row, columnId, filterValue) => {
      const rowValue = Number(row.getValue(columnId))
      const { condition, value } = filterValue ?? {}

      if (value === undefined || isNaN(value)) return true

      switch (condition) {
        case 'gt':
          return rowValue >= Math.abs(value)
        case 'lt':
          return rowValue <= -Math.abs(value)
        case 'eq':
          return rowValue === value
        default:
          return true
      }
    },
    cell: ({ row }) => (
      <span className={`${row.original.current_balance < 0 ? 'text-red-700' : 'text-green-700'}`}>
        {row.original.current_balance}
      </span>
    ),
    enableHiding: false,
    meta: {
      filterComponent: AmountFilter
    }
  },
  {
    header: 'Actions',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex gap-2">
        {/* Use class for styling and add hover state */}
        <Pen
          className="text-blue-500 hover:text-blue-700"
          onClick={(): void => item.update(row.original.id, row.original)}
        />
        <ClipboardList
          className="text-gray-500 hover:text-gray-700"
          onClick={(): void => item.payment(row.original.id, row.original)}
        />
        <Trash2
          className="text-red-500 hover:text-red-700"
          onClick={(): void => item.delete(row.original.id, row.original)}
        />
        {row.original.transfer_date != null && (
          <CircleDot
            className="text-red-500 hover:text-red-700"
            onClick={() => item.continue(row.original.id, row.original)}
          />
        )}
        {row.original.transfer_date == null && (
          <CircleDot
            className="text-green-500 hover:text-green-700"
            onClick={() => item.transfer(row.original.id, row.original)}
          />
        )}
      </div>
    )
  }
]
