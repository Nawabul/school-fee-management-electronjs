export interface Student_Write {
  reg_number: string
  student_name: string
  father_name: string
  mobile: string
  is_whatsapp: boolean
  admission_date: string // ISO date string
  address: string
  class_id: number
  monthly: number
}

export interface Student_Insert extends Student_Write {
  current_balance: number
  last_fee_date: string
}
export interface Student_Record {
  id: number
  reg_number: string
  student_name: string
  father_name: string
  mobile: string
  admission_date: string // ISO date string
  transfer_date?: string | null // either an ISO date string or the literal "active"
  address: string
  class_name: string
  current_balance: number
}

export interface Student_Get {
  id: number
  reg_number: string
  student_name: string
  father_name: string
  mobile: string
  is_whatsapp: boolean
  admission_date: string // ISO date string
  transfer_date: string | null // either an ISO date string or the literal "active"
  address: string
  class_id: number
  initial_balance: number
  current_balance: number
  last_fee_date: string // ISO date string
  last_notification_date: string // ISO date string
  monthly: number
}

export interface Student_Details {
   id: number
  reg_number: string
  student_name: string
  father_name: string
  mobile: string
  is_whatsapp: boolean
  admission_date: string // ISO date string
  transfer_date: string | null // either an ISO date string or the literal "active"
  address: string
  class_name: string
  current_balance: number

}
