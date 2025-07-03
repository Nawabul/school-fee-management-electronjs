export interface Payment_Write {
  student_id: number
  amount: number
  date: string
  remark?: string
}
export interface Payment_Insert extends Payment_Write {
  used: number
  admission: number
  monthly: number
  mis_charge: number
}
export interface Payment_Record {
  id: number
  amount: number
  date: string
  remark?: string | null
}

export interface Payment_Read {
  amount: number
  date: string
  remark?: string | null
}
