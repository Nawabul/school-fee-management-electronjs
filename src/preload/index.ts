import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Class } from '../types/interfaces/class'
import { successResponse, errorResponse } from '../types/utils/apiReturn'
import { Student_Get, Student_Record, Student_Write } from '../types/interfaces/student'
// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
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
      delete: async (id: number | number[]): Promise<successResponse<boolean> | errorResponse> =>
        ipcRenderer.invoke('student:delete', id),
      list: async (): Promise<successResponse<Student_Record[]> | errorResponse> =>
        ipcRenderer.invoke('student:list'),
      fetch: async (id: number): Promise<successResponse<Student_Get> | errorResponse> =>
        ipcRenderer.invoke('student:fetch', id)
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
