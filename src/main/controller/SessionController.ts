import SessionService from '@main/service/SessionService'
import StudentService from '@main/service/StudentService'
import { Transaction } from '@type/interfaces/db'
import { apiError, apiSuccess, errorResponse, successResponse } from '@type/utils/apiReturn'
import { IpcMainInvokeEvent } from 'electron'

class SessionController {
  async isEndSet(): Promise<successResponse<boolean> | errorResponse> {
    try {
      const response = SessionService.isEndMonthHave()
      return apiSuccess(response, ' Session End month')
    } catch (error) {
      if (error instanceof Error) {
        return apiError('Error while fetching Session End: ' + error.message)
      }
      return apiError('Error while fetching Session End')
    }
  }

  // get session
  async getEndSet(): Promise<successResponse<number> | errorResponse> {
    try {
      const response = SessionService.getEndMonth()
      return apiSuccess(response, ' Session End month')
    } catch (error) {
      if (error instanceof Error) {
        return apiError('Error while fetching Session End: ' + error.message)
      }
      return apiError('Error while fetching Session End')
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
        console.log(endDate)
        StudentService.active_student_active_until_update(endDate, tx)

        return true
      })
      return apiSuccess(result, ' Session End month created')
    } catch (error) {
      if (error instanceof Error) {
        return apiError('Error while creating Session End: ' + error.message)
      }
      return apiError('Error while creating Session End')
    }
  }


}

export default new SessionController()
