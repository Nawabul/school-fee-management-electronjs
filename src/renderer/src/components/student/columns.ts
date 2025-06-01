import { ColumnDef } from '@tanstack/react-table'
import AmountFilter from '../table/AmountFilter'
import FilterClass from '../table/FilterClass'

export const studentColumns: ColumnDef<any>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableHiding: false
  },
  {
    accessorKey: 'reg_number',
    header: 'Reg. Number',
    enableHiding: true
  },
  {
    accessorKey: 'student_name',
    header: 'Student Name',
    enableHiding: true
  },
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
    accessorKey: 'class',
    header: 'Class',
    enableHiding: true,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true // no filter applied
      return filterValue.includes(row.getValue(columnId))
    },
    meta: {
      filterComponent: FilterClass
    }
  },
  {
    accessorKey: 'admission_date',
    header: 'Admission Date',
    enableHiding: true
  },
  {
    accessorKey: 'termission_date',
    header: 'Termission Date',
    filterFn: (row, columnId, filterValue) => {
      const date = row.getValue(columnId)
      if (filterValue === 'active') return !date
      if (filterValue === 'inactive') return !!date
      return true // 'both' or undefined
    },
    cell: ({ getValue }) => getValue<string | null>() || 'Active',
    enableHiding: true
  },
  {
    accessorKey: 'initial_amount',
    header: 'Initial Amount',
    enableHiding: true
  },
  {
    accessorKey: 'current_amount',
    header: 'Current Balance',
    filterFn: (row, columnId, filterValue) => {
      const rowValue = Number(row.getValue(columnId))
      const { condition, value } = filterValue ?? {}

      if (value === undefined || isNaN(value)) return true

      switch (condition) {
        case 'gt':
          return rowValue > value
        case 'lt':
          return rowValue < value
        case 'eq':
          return rowValue === value
        default:
          return true
      }
    },
    enableHiding: true,
    meta: {
      filterComponent: AmountFilter
    }
  }
]
