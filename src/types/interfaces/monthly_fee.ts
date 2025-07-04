export interface Monthly_Fee_Write {
  student_id: number
  class_id: number
  date: string // ISO date string
  amount: number
}

export interface Monthly_Fee_Record {
  id: number
  class_name: string
  date: string // ISO date string
  amount: number
}

export interface Monthly_Fee_Read {
  amount: number
  student_id: number
  paid: number
  class_id: number
  date: string
}

export interface Monthly_Fee_Read_Paid_Unpaid {
  id: number
  amount: number
  paid: number
}
