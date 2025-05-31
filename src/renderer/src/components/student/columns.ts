import { ColumnDef } from '@tanstack/react-table'

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
    enableHiding: true
  },
  {
    accessorKey: 'admission_date',
    header: 'Admission Date',
    enableHiding: true
  },
  {
    accessorKey: 'termission_date',
    header: 'Termission Date',
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
    enableHiding: true
  }
]
