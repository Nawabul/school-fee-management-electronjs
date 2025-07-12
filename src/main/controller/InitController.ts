import { format } from 'date-fns'
import { apiError, apiSuccess, errorResponse, successResponse } from '../../types/utils/apiReturn'
import MonthlyFeeController from './MonthlyFeeController'
import { DB_DATE_FORMAT } from '../utils/constant/date'
import StudentService from '../service/StudentService'
import { checkAndApplyUpdates } from '@main/utils/handler/autoUpdate'

class InitController {
  // generate student monthly records of students
  async generate(): Promise<successResponse<boolean> | errorResponse> {
    try {
      // fetch list of students
      const students = await StudentService.list_last_fee_month_ago()

      const today = format(new Date(), DB_DATE_FORMAT)
      // loop through students
      for (const student of students) {
        const active_until = student.active_until || today
        // create monthly fee records of each
        const input = {
          student_id: student.student_id,
          class_id: student.class_id,
          from: student.last_fee_date,
          to: today < active_until ? today : active_until,
          monthly: student.monthly
        }

        await MonthlyFeeController.create(input)
      }

      return apiSuccess(true, 'Monthly records generated of all students')
    } catch (error) {
      if (error instanceof Error) {
        return apiError('Unable to generate monthly fee records', error)
      }
      return apiError('Unable to generate monthly fee records')
    }
  }

  async checkForUpdates(): Promise<void> {
    // Check for updates
    checkAndApplyUpdates()
  }
}

export default new InitController()
