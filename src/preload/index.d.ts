import { ElectronAPI } from '@electron-toolkit/preload'
import { Class } from '@types/interfaces/class'
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
      delete: (id: number) => Promise<successResponse<boolean> | errorResponse>
      list: () => Promise<successResponse<Student_Record[]> | errorResponse>
      fetch: (id: number) => Promise<successResponse<Student_Get> | errorResponse>
    }
  }
}
