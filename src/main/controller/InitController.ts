import { format } from 'date-fns'
import { errorResponse, successResponse } from '../../types/utils/apiReturn'
import { DB_DATE_FORMAT } from '../utils/constant/date'
import StudentService from '../service/StudentService'
import { checkAndApplyUpdates } from '@main/utils/handler/autoUpdate'
import { nativeTheme } from 'electron'
import { BaseController } from './BaseController'
import MonthlyFeeService from '@main/service/MonthlyFeeService'

class InitController extends BaseController {
  private studentService: typeof StudentService

  private monthlyService: typeof MonthlyFeeService

  constructor() {
    super()
    this.studentService = StudentService
    this.monthlyService = MonthlyFeeService
  }

  async generate(): Promise<successResponse<boolean> | errorResponse> {
    try {
      // fetch list of students
      const students = this.studentService.listOfLastFeeMonthAgo()

      const today = format(new Date(), DB_DATE_FORMAT)
      // loop through students
      for (const student of students) {
        const active_until = student.active_until || today

        this.monthlyService.create({
          classId: student.class_id,
          monthly: student.monthly,
          start: student.last_fee_date,
          studentId: student.student_id,
          end: today < active_until ? today : active_until
        })
      }

      return super.processSuccess(true, 'Monthly records generated of all students')
    } catch (error) {
      return super.processError(error)
    }
  }

  async checkForUpdates(): Promise<void> {
    // Check for updates
    checkAndApplyUpdates()
  }

  // is dark mode
  async isDarkMode(): Promise<successResponse<boolean> | errorResponse> {
    try {
      const dark = nativeTheme.shouldUseDarkColors
      return super.processSuccess(dark, 'Dark mode status')
    } catch (error) {
      return super.processError(error)
    }
  }
}

export default new InitController()
