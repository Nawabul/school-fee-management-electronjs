export interface Admission_Write {
  student_id: number
  class_id: number
  amount: number
  date: string
  remark?: string
}

export interface Admission_Record {
  id: number
  class: string
  amount: number
  date: string
  remark?: string | null
}

export interface Admission_Read {
  amount: number
  item_id: number
  date: string
  remark?: string | null
}
