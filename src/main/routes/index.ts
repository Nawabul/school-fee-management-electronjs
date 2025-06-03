import { BrowserWindow, ipcMain } from 'electron'
import ClassController from '../controller/ClassController'

export default async function routes(mainWindow: BrowserWindow): Promise<void> {
  // class
  ipcMain.handle('class:create', ClassController.create)
  ipcMain.handle('class:list', ClassController.list)
  ipcMain.handle('class:fetch', ClassController.fetch)
  ipcMain.handle('class:update', ClassController.update)
  ipcMain.handle('class:delete', ClassController.delete)
}
