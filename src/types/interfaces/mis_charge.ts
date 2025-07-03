export interface Mis_Charge_Write {
  student_id: number
  item_id: number
  amount: number
  date: string
  remark?: string
}

export interface Mis_Charege_Insert_Update extends Mis_Charge_Write {
  paid: number
}

export interface Mis_Charge_Record {
  id: number
  item_name: string
  amount: number
  date: string
  remark?: string | null
}

export interface Mis_Charge_Read {
  amount: number
  student_id: number
  paid: number
  item_id: number
  date: string
  remark?: string | null
}

export interface Mis_Charge_Read_Paid_Unpaid {
  id: number
  amount: number
  paid: number
}
