import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Class } from '../types/interfaces/class'
import { successResponse, errorResponse } from '../types/utils/apiReturn'
import { Student_Get, Student_Record, Student_Write } from '../types/interfaces/student'
import {
  Payment_Read,
  Payment_Record,
  Payment_Type,
  Payment_Write
} from '../types/interfaces/payment'
import { Mis_Item_Read, Mis_Item_Record, Mis_Item_Write } from '../types/interfaces/mis_item'
import {
  Mis_Charge_Read,
  Mis_Charge_Record,
  Mis_Charge_Write
} from '../types/interfaces/mis_charge'
import { Monthly_Fee_Record } from '../types/interfaces/monthly_fee'
import { Admission_Record, Admission_Write } from '@type/interfaces/admission'
import { PaymentChart, statics } from '@type/interfaces/dashboard'
// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('setting', {
      minimize: () => ipcRenderer.invoke('minimize'),
      toggle: () => ipcRenderer.invoke('toggle'),
      close: () => ipcRenderer.invoke('close'),
      eventTrigger: (channel: string, fun: () => void) => {
        return ipcRenderer.on(channel, fun)
      }
    })

    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('class', {
      create: async (data: Omit<Class, 'id'>): Promise<successResponse<number> | errorResponse> =>
        ipcRenderer.invoke('class:create', data),
      update: async (
        id: number,
        data: Omit<Class, 'id'>
      ): Promise<successResponse<boolean> | errorResponse> =>
        ipcRenderer.invoke('class:update', id, data),
      delete: async (id: number | number[]): Promise<successResponse<boolean> | errorResponse> =>
        ipcRenderer.invoke('class:delete', id),
      list: async (): Promise<successResponse<Class[]> | errorResponse> =>
        ipcRenderer.invoke('class:list'),
      fetch: async (id: number): Promise<successResponse<Class> | errorResponse> =>
        ipcRenderer.invoke('class:fetch', id)
    })
    // student
    contextBridge.exposeInMainWorld('student', {
      create: async (data: Student_Write): Promise<successResponse<number> | errorResponse> =>
        ipcRenderer.invoke('student:create', data),
      update: async (
        id: number,
        data: Student_Write
      ): Promise<successResponse<boolean> | errorResponse> =>
        ipcRenderer.invoke('student:update', id, data),
      transfer: async (
        id: number,
        data: { date: string }
      ): Promise<successResponse<boolean> | errorResponse> =>
        ipcRenderer.invoke('student:transfer', id, data),
      delete: async (id: number | number[]): Promise<successResponse<boolean> | errorResponse> =>
        ipcRenderer.invoke('student:delete', id),
      continue: async (id: number | number[]): Promise<successResponse<boolean> | errorResponse> =>
        ipcRenderer.invoke('student:continue', id),
      list: async (): Promise<successResponse<Student_Record[]> | errorResponse> =>
        ipcRenderer.invoke('student:list'),
      fetch: async (id: number): Promise<successResponse<Student_Get> | errorResponse> =>
        ipcRenderer.invoke('student:fetch', id)
    })

    // payment
    contextBridge.exposeInMainWorld('payment', {
      create: async (
        data: Payment_Write,
        type: Payment_Type
      ): Promise<successResponse<number> | errorResponse> =>
        ipcRenderer.invoke('student:payment:create', data, type),
      update: async (
        id: number,
        data: Payment_Write
      ): Promise<successResponse<boolean> | errorResponse> =>
        ipcRenderer.invoke('student:payment:update', id, data),
      delete: async (id: number | number[]): Promise<successResponse<boolean> | errorResponse> =>
        ipcRenderer.invoke('student:payment:delete', id),
      list: async (studentId: number): Promise<successResponse<Payment_Record[]> | errorResponse> =>
        ipcRenderer.invoke('student:payment:list', studentId),
      fetch: async (id: number): Promise<successResponse<Payment_Read> | errorResponse> =>
        ipcRenderer.invoke('student:payment:fetch', id)
    })

    // mis item
    contextBridge.exposeInMainWorld('mis_item', {
      create: async (data: Mis_Item_Write): Promise<successResponse<number> | errorResponse> =>
        ipcRenderer.invoke('mis:item:create', data),
      update: async (
        id: number,
        data: Mis_Item_Write
      ): Promise<successResponse<boolean> | errorResponse> =>
        ipcRenderer.invoke('mis:item:update', id, data),
      delete: async (id: number | number[]): Promise<successResponse<boolean> | errorResponse> =>
        ipcRenderer.invoke('mis:item:delete', id),
      list: async (): Promise<successResponse<Mis_Item_Record[]> | errorResponse> =>
        ipcRenderer.invoke('mis:item:list'),
      fetch: async (id: number): Promise<successResponse<Mis_Item_Read> | errorResponse> =>
        ipcRenderer.invoke('mis:item:fetch', id)
    })

    // mis charge
    contextBridge.exposeInMainWorld('mis_charge', {
      create: async (data: Mis_Charge_Write): Promise<successResponse<number> | errorResponse> =>
        ipcRenderer.invoke('student:mis:charge:create', data),
      update: async (
        id: number,
        data: Mis_Charge_Write
      ): Promise<successResponse<boolean> | errorResponse> =>
        ipcRenderer.invoke('student:mis:charge:update', id, data),
      delete: async (id: number | number[]): Promise<successResponse<boolean> | errorResponse> =>
        ipcRenderer.invoke('student:mis:charge:delete', id),
      list: async (
        studentId: number
      ): Promise<successResponse<Mis_Charge_Record[]> | errorResponse> =>
        ipcRenderer.invoke('student:mis:charge:list', studentId),
      fetch: async (id: number): Promise<successResponse<Mis_Charge_Read> | errorResponse> =>
        ipcRenderer.invoke('student:mis:charge:fetch', id)
    })

    // monthly fee
    contextBridge.exposeInMainWorld('monthly_fee', {
      list: async (
        studentId: number
      ): Promise<successResponse<Monthly_Fee_Record[]> | errorResponse> =>
        ipcRenderer.invoke('student:monthly:fee:list', studentId)
    })
    // admission
    contextBridge.exposeInMainWorld('admission', {
      list: async (
        studentId: number
      ): Promise<successResponse<Admission_Record[]> | errorResponse> =>
        ipcRenderer.invoke('student:admission:list', studentId),
      create: async (data: Admission_Write): Promise<successResponse<number> | errorResponse> =>
        ipcRenderer.invoke('student:admission:create', data)
    })

    // init
    contextBridge.exposeInMainWorld('init', {
      database: async (): Promise<successResponse<boolean> | errorResponse> =>
        ipcRenderer.invoke('init:database'),
      monthly_fee: async (): Promise<successResponse<boolean> | errorResponse> =>
        ipcRenderer.invoke('init:student:monthly:fee'),
      is_dark_mode: async (): Promise<successResponse<boolean> | errorResponse> =>
        ipcRenderer.invoke('init:theme:mode:dark'),
      app_update: async (): Promise<void> => ipcRenderer.invoke('init:app:update')
    })
    // dashboard
    contextBridge.exposeInMainWorld('dashboard', {
      statics: async (): Promise<successResponse<statics> | errorResponse> =>
        ipcRenderer.invoke('dashboard:statics'),
      payment_chart: async (): Promise<successResponse<PaymentChart> | errorResponse> =>
        ipcRenderer.invoke('dashboard:payment:chart')
    })

    // session
    contextBridge.exposeInMainWorld('session', {
      check: async (): Promise<successResponse<boolean> | errorResponse> =>
        ipcRenderer.invoke('session:end:check'),
      getEndMonth: async (): Promise<successResponse<boolean> | errorResponse> =>
        ipcRenderer.invoke('session:end:get'),
      set: async (month: string | number): Promise<successResponse<boolean> | errorResponse> =>
        ipcRenderer.invoke('session:end:set', month)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
