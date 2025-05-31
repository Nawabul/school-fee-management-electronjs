export interface Student {
  id: number
  class: number
  reg_number: string
  student_name: string
  father_name: string
  mobile: string
  admission_date: string
  termission_date: string | null
  initial_amount: number
  current_amount: number
  last_fee_date: string
}

export default Student
