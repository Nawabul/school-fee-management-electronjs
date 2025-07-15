import { ElectronAPI } from '@electron-toolkit/preload'
import { Admission_Record, Admission_Write } from '@type/interfaces/admission'
import { Payment_Type } from '@type/interfaces/payment'
import { Class } from '@types/interfaces/class'
import { Mis_Charge_Read, Mis_Charge_Record, Mis_Charge_Write } from '@types/interfaces/mis_charge'
import { Mis_Item_Read, Mis_Item_Record, Mis_Item_Write } from '@types/interfaces/mis_item'
import { Monthly_Fee_Record } from '@types/interfaces/monthly_fee'
import { Payment_Read, Payment_Record, Payment_Write } from '@types/interfaces/payment'
import { Student_Get, Student_Record, Student_Write } from '@types/interfaces/student'

import { errorResponse, successResponse } from '@types/utils/apiReturn'
declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    class: {
      create: (data: Class) => Promise<successResponse<number> | errorResponse>
      update: (id: number, data: Class) => Promise<successResponse<boolean> | errorResponse>
      delete: (id: number | number[]) => Promise<successResponse<boolean> | errorResponse>
      list: () => Promise<successResponse<Class[]> | errorResponse>
      fetch: (id: number) => Promise<successResponse<Class> | errorResponse>
    }
    // student
    student: {
      create: (data: Student_Write) => Promise<successResponse<number> | errorResponse>
      update: (id: number, data: Student_Write) => Promise<successResponse<boolean> | errorResponse>
      transfer: (
        id: number,
        data: { date: string }
      ) => Promise<successResponse<boolean> | errorResponse>
      delete: (id: number) => Promise<successResponse<boolean> | errorResponse>
      continue: (id: number) => Promise<successResponse<boolean> | errorResponse>
      list: () => Promise<successResponse<Student_Record[]> | errorResponse>
      fetch: (id: number) => Promise<successResponse<Student_Get> | errorResponse>
    }
    // payment
    payment: {
      create: (
        data: Payment_Write,
        type?: Payment_Type
      ) => Promise<successResponse<number> | errorResponse>
      update: (id: number, data: Payment_Write) => Promise<successResponse<boolean> | errorResponse>
      delete: (id: number) => Promise<successResponse<boolean> | errorResponse>
      list: (studentId: number) => Promise<successResponse<Payment_Record[]> | errorResponse>
      fetch: (id: number) => Promise<successResponse<Payment_Read> | errorResponse>
    }

    // mis item
    mis_item: {
      create: (data: Mis_Item_Write) => Promise<successResponse<number> | errorResponse>
      update: (
        id: number,
        data: Mis_Item_Write
      ) => Promise<successResponse<boolean> | errorResponse>
      delete: (id: number) => Promise<successResponse<boolean> | errorResponse>
      list: () => Promise<successResponse<Mis_Item_Record[]> | errorResponse>
      fetch: (id: number) => Promise<successResponse<Mis_Item_Read> | errorResponse>
    }

    // mis charge
    mis_charge: {
      create: (data: Mis_Charge_Write) => Promise<successResponse<number> | errorResponse>
      update: (
        id: number,
        data: Mis_Charge_Write
      ) => Promise<successResponse<boolean> | errorResponse>
      delete: (id: number) => Promise<successResponse<boolean> | errorResponse>
      list: (studentId: number) => Promise<successResponse<Mis_Charge_Record[]> | errorResponse>
      fetch: (id: number) => Promise<successResponse<Mis_Charge_Read> | errorResponse>
    }

    // monthly fee
    monthly_fee: {
      list: (studentId: number) => Promise<successResponse<Monthly_Fee_Record[]> | errorResponse>
    }

    // admission
    admission: {
      create: (data: Admission_Write) => Promise<successResponse<number> | errorResponse>
      list: (studentId: number) => Promise<successResponse<Admission_Record[]> | errorResponse>
      delete: (studentId: number) => Promise<successResponse<boolean> | errorResponse>
    }
    init: {
      database: () => Promise<successResponse<boolean> | errorResponse>
      monthly_fee: () => Promise<successResponse<boolean> | errorResponse>
      app_update: () => Promise<void>
      is_dark_mode: () => Promise<successResponse<boolean> | errorResponse>
    }

    // session
    session: {
      check: () => Promise<successResponse<boolean> | errorResponse>
      getEndMonth: () => Promise<successResponse<number> | errorResponse>
      set: (month: string | number) => Promise<successResponse<boolean> | errorResponse>
    }
  }
}
