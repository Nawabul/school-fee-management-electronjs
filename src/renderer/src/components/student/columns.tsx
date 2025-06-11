import { ColumnDef } from '@tanstack/react-table'
import AmountFilter from '../table/AmountFilter'
import FilterClass from '../table/FilterClass'
import { Student_Record } from '@renderer/types/ts/student'
import { format } from 'date-fns'
import { date_format } from '@renderer/types/constant/date'
import { Dropdown, DropdownItem } from 'flowbite-react'

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
      return true // 'both' or undefined
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
          return rowValue > value
        case 'lt':
          return rowValue < value
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
      <Dropdown label="Edit" arrowIcon={false} placement="bottom">
        <DropdownItem onClick={() => item.update(row.original.id, row.original)}>Edit</DropdownItem>
        {row.original.transfer_date == null ? (
          <DropdownItem onClick={() => item.transfer(row.original.id, row.original)}>
            Transfer
          </DropdownItem>
        ) : (
          <DropdownItem onClick={() => item.continue(row.original.id, row.original)}>
            Continue
          </DropdownItem>
        )}

        <DropdownItem onClick={() => item.delete(row.original.id, row.original)}>
          Delete
        </DropdownItem>
        <DropdownItem onClick={() => item.payment(row.original.id, row.original)}>
          Payment
        </DropdownItem>
        <DropdownItem onClick={() => item.mis_charge(row.original.id, row.original)}>
          Mis. Charges
        </DropdownItem>
        <DropdownItem onClick={() => item.monthly_fee(row.original.id, row.original)}>
          Monthly Fee
        </DropdownItem>
      </Dropdown>
    )
  }
]
