import { ipcMain } from 'electron'
import ClassController from '../controller/ClassController'
import StudentController from '../controller/StudentController'
import PaymentController from '../controller/PaymentController'
import MIsItemController from '../controller/MIsItemController'
import MisChargeController from '../controller/MisChargeController'
import MonthlyFeeController from '../controller/MonthlyFeeController'
import VersionController from '../controller/VersionController'
import InitController from '../controller/InitController'

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

  // paymets
  ipcMain.handle('student:payment:create', PaymentController.create)
  ipcMain.handle('student:payment:list', PaymentController.list)
  ipcMain.handle('student:payment:fetch', PaymentController.fetch)
  ipcMain.handle('student:payment:update', PaymentController.update)
  ipcMain.handle('student:payment:delete', PaymentController.delete)

  // mis items

  ipcMain.handle('mis:item:create', MIsItemController.create)
  ipcMain.handle('mis:item:list', MIsItemController.list)
  ipcMain.handle('mis:item:fetch', MIsItemController.fetch)
  ipcMain.handle('mis:item:update', MIsItemController.update)
  ipcMain.handle('mis:item:delete', MIsItemController.delete)

  // mis charges
  ipcMain.handle('student:mis:charge:create', MisChargeController.create)
  ipcMain.handle('student:mis:charge:list', MisChargeController.list)
  ipcMain.handle('student:mis:charge:fetch', MisChargeController.fetch)
  ipcMain.handle('student:mis:charge:update', MisChargeController.update)
  ipcMain.handle('student:mis:charge:delete', MisChargeController.delete)

  // monthly fee
  ipcMain.handle('student:monthly:fee:list', MonthlyFeeController.list)

  // init sertup
  // database
  ipcMain.handle('init:database', VersionController.dbHandler)
  // monthly fee
  ipcMain.handle('init:student:monthly:fee', InitController.generate)
}
