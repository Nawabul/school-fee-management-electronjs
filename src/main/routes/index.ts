import { ipcMain } from 'electron'
import ClassController from '../controller/ClassController'
import StudentController from '../controller/StudentController'

export default async function routes(): Promise<void> {
  // class
  ipcMain.handle('class:create', ClassController.create)
  ipcMain.handle('class:list', ClassController.list)
  ipcMain.handle('class:fetch', ClassController.fetch)
  ipcMain.handle('class:update', ClassController.update)
  ipcMain.handle('class:delete', ClassController.delete)

  // student
  ipcMain.handle('student:create', StudentController.create)
  ipcMain.handle('student:list', StudentController.list)
  ipcMain.handle('student:fetch', StudentController.fetch)
  ipcMain.handle('student:update', StudentController.update)
  ipcMain.handle('student:delete', StudentController.delete)
}
