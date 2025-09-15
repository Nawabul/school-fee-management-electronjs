import SessionService from '@main/service/SessionService'
import StudentService from '@main/service/StudentService'
import { Transaction } from '@type/interfaces/db'
import { errorResponse, successResponse } from '@type/utils/apiReturn'
import { IpcMainInvokeEvent } from 'electron'
import { BaseController } from './BaseController'

class SessionController extends BaseController {
  private studentService: typeof StudentService

  constructor() {
    super()
    this.studentService = StudentService
  }

  async isEndSet(): Promise<successResponse<boolean> | errorResponse> {
    try {
      const response = SessionService.isEndMonthHave()
      return super.processSuccess(response, 'Session is set status fetched')
    } catch (error) {
      return super.processError(error)
    }
  }

  // get session
  async getEndSet(): Promise<successResponse<number> | errorResponse> {
    try {
      const response = SessionService.getEndMonth()
      return super.processSuccess(response, ' Session End month')
    } catch (error) {
      return super.processError(error)
    }
  }

  // create end month
  async setEndMonth(
    _event: IpcMainInvokeEvent,
    month: string | number
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const result = SessionService.db.transaction((tx: Transaction) => {
        const isSet = SessionService.isEndMonthHave()
        // already have then update other wise create
        if (isSet) {
          SessionService.updateEndMonth(month, tx)
        } else {
          SessionService.createEndMonth(month, tx)
        }
        // create end month
        const endDate = SessionService.formatEndDate(Number(month))
        // update student active date

        this.studentService.active_student_active_until_update(endDate, tx)

        return true
      })
      return super.processSuccess(result, ' Session End month created')
    } catch (error) {
      return super.processError(error)
    }
  }
}

export default new SessionController()
