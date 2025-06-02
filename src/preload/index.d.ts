import { ElectronAPI } from '@electron-toolkit/preload'
import { Class } from '@types/interfaces/class'
import { errorResponse, successResponse } from '@types/utils/apiReturn'
declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    class: {
      create: (data: Class) => Promise<successResponse<number> | errorResponse>
      list: () => Promise<successResponse<Class[]> | errorResponse>
      fetch: (id: number) => Promise<successResponse<Class> | errorResponse>
    }
  }
}
