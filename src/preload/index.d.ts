import { ElectronAPI } from '@electron-toolkit/preload'
import { Class } from '@types/interfaces/class'
declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    class:{
      create: (data: Class) => Promise<void>
    }
  }
}
