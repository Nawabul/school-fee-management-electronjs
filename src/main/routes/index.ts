import { ipcMain } from 'electron'
import ClassController from '../controller/ClassController'
import StudentController from '../controller/StudentController'
import PaymentController from '../controller/PaymentController'
import MIsItemController from '../controller/MIsItemController'
import MisChargeController from '../controller/MisChargeController'
import MonthlyFeeController from '../controller/MonthlyFeeController'
import VersionController from '../controller/VersionController'
import InitController from '../controller/InitController'
import AddmissionController from '@main/controller/AddmissionController'
import SessionController from '@main/controller/SessionController'
import DashboradController from '@main/controller/DashboradController'

export default async function routes(): Promise<void> {
  // class
  ipcMain.handle('class:create', (event, data) => ClassController.create(event, data))
  ipcMain.handle('class:list', () => ClassController.list())
  ipcMain.handle('class:fetch', (event, id) => ClassController.fetch(event, id))
  ipcMain.handle('class:update', (event, id, data) => ClassController.update(event, id, data))
  ipcMain.handle('class:delete', (event, id) => ClassController.delete(event, id))

  // student
  // student
  ipcMain.handle('student:create', (event, data) => StudentController.create(event, data))
  ipcMain.handle('student:list', () => StudentController.list())
  ipcMain.handle('student:fetch', (event, id) => StudentController.fetch(event, id))
  ipcMain.handle('student:details', (event, id) => StudentController.details(event, id))
  ipcMain.handle('student:update', (event, id, data) => StudentController.update(event, id, data))
  ipcMain.handle('student:delete', (event, id) => StudentController.delete(event, id))
  ipcMain.handle('student:transfer', (event, id, data) =>
    StudentController.transfer(event, id, data)
  )
  ipcMain.handle('student:continue', (event, id) => StudentController.continueStudy(event, id))

  // paymets
  ipcMain.handle('student:payment:create', (event, data) => PaymentController.create(event, data))

  ipcMain.handle('student:payment:list', (event, studentId) =>
    PaymentController.list(event, studentId)
  )

  ipcMain.handle('student:payment:fetch', (event, id) => PaymentController.fetch(event, id))

  ipcMain.handle('student:payment:update', (event, id, data) =>
    PaymentController.update(event, id, data)
  )

  ipcMain.handle('student:payment:delete', (event, id) => PaymentController.delete(event, id))

  // mis items

  ipcMain.handle('mis:item:create', (event, data) => MIsItemController.create(event, data))

  ipcMain.handle('mis:item:list', () => MIsItemController.list())

  ipcMain.handle('mis:item:fetch', (event, id) => MIsItemController.fetch(event, id))

  ipcMain.handle('mis:item:update', (event, id, data) => MIsItemController.update(event, id, data))

  ipcMain.handle('mis:item:delete', (event, id) => MIsItemController.delete(event, id))

  // mis charges

  ipcMain.handle('student:mis:charge:create', (event, data) =>
    MisChargeController.create(event, data)
  )

  ipcMain.handle('student:mis:charge:list', (event, id) => MisChargeController.list(event, id))

  ipcMain.handle('student:mis:charge:fetch', (event, id) => MisChargeController.fetch(event, id))

  ipcMain.handle('student:mis:charge:update', (event, id, data) =>
    MisChargeController.update(event, id, data)
  )

  ipcMain.handle('student:mis:charge:delete', (event, id) => MisChargeController.delete(event, id))

  // student:monthly:fee
  ipcMain.handle('student:monthly:fee:list', (event, studentId) =>
    MonthlyFeeController.list(event, studentId)
  )

  // admission
  ipcMain.handle('student:admission:create', (event, data) =>
    AddmissionController.create(event, data)
  )

  ipcMain.handle('student:admission:list', (event, studentId) =>
    AddmissionController.list(event, studentId)
  )

  // init setup
  // database
  ipcMain.handle('init:database', () => VersionController.dbHandler())

  // monthly fee
  ipcMain.handle('init:student:monthly:fee', () => InitController.generate())

  // app update
  ipcMain.handle('init:app:update', () => InitController.checkForUpdates())

  // system dark mode
  ipcMain.handle('init:theme:mode:dark', () => InitController.isDarkMode())

  // dashboard
  ipcMain.handle('dashboard:statics', () => DashboradController.statics())

  ipcMain.handle('dashboard:payment:chart', () => DashboradController.paymentChart())

  // session
  ipcMain.handle('session:end:check', () => SessionController.isEndSet())

  ipcMain.handle('session:end:get', () => SessionController.getEndSet())
  ipcMain.handle('session:end:set', (event, month) => SessionController.setEndMonth(event, month))
}
