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
  used: number
  date: string
  remark?: string | null
}

export interface Payment_Read {
  student_id: number
  amount: number
  used: number
  admission: number
  monthly: number
  mis_charge: number
  date: string
  remark?: string | null
}

export interface Payment_Used_Unused {
  id: number
  amount: number
  used: number
  admission: number
  monthly: number
  mis_charge: number
}

export type Payment_Type = 'admission' | 'monthly' | 'mis_charge'
