import ClassService from '@main/service/ClassService'
import MisItemService from '@main/service/MisItemService'
import PaymentService from '@main/service/PaymentService'
import SessionService from '@main/service/SessionService'
import StudentService from '@main/service/StudentService'

import { PaymentChart, statics } from '@type/interfaces/dashboard'
import { errorResponse, successResponse } from '@type/utils/apiReturn'
import { endOfMonth, format, parseISO, set } from 'date-fns'
import { BaseController } from './BaseController'

class DashboardController extends BaseController {
  private studentService: typeof StudentService
  private classService: typeof ClassService
  private misItemService: typeof MisItemService
  private paymentService: typeof PaymentService

  constructor() {
    super()
    this.classService = ClassService
    this.studentService = StudentService
    this.misItemService = MisItemService

    this.paymentService = PaymentService
  }

  async statics(): Promise<successResponse<statics> | errorResponse> {
    const defaultValues: statics = {
      total_advance: 0,
      active_advance: 0,
      active_due: 0,
      total_due: 0,
      total_class: 0,
      total_student: 0,
      active_student: 0,
      total_item: 0
    }

    try {
      const [students, classes, items] = await Promise.all([
        this.studentService.list(),
        this.classService.list(),
        this.misItemService.list()
      ])

      if (students) {
        for (const student of students) {
          const amount = student.current_balance
          defaultValues.total_student++

          const isActive = student.transfer_date == null
          const isDue = amount < 0

          if (isActive) {
            defaultValues.active_student++
            if (isDue) {
              defaultValues.active_due += amount
              defaultValues.total_due += amount
            } else {
              defaultValues.active_advance += amount
              defaultValues.total_advance += amount
            }
          } else {
            if (isDue) {
              defaultValues.total_due += amount
            } else {
              defaultValues.total_advance += amount
            }
          }
        }
      }

      if (classes) {
        defaultValues.total_class = classes.length
      }

      if (items) {
        defaultValues.total_item = items.length
      }

      return super.processSuccess(defaultValues)
    } catch (error) {
      return super.processError(error)
    }
  }
  async paymentChart(): Promise<successResponse<PaymentChart[]> | errorResponse> {
    try {
      const sessionEndMonth = SessionService.getEndMonth() // 1-based (e.g. 3 = March)
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const sessionStartYear =
        currentDate.getMonth() + 1 < sessionEndMonth ? currentYear - 1 : currentYear

      const sessionStartMonth = (sessionEndMonth % 12) + 1 // if 12 => 1
      const sessionEndYear = sessionStartMonth === 1 ? currentYear : sessionStartYear + 1

      const chartData: { name: string; value: number }[] = []
      const monthKeys: string[] = []

      for (let i = 0; i < 12; i++) {
        const monthNum = ((sessionStartMonth - 1 + i) % 12) + 1 // 1-based month
        const yearOffset = sessionStartMonth + i > 12 ? 1 : 0
        const year = sessionStartYear + yearOffset

        // Build date from year and monthNum (JS Date expects 0-based month)
        const date = set(new Date(year, monthNum - 1, 1), {})
        const label = format(date, 'MMM')
        const name = label === 'Jan' ? `${label} ${year}` : label

        chartData.push({ name, value: 0 })
        monthKeys.push(format(date, 'yyyy-MM'))
      }

      const from = `${sessionStartYear}-${String(sessionStartMonth).padStart(2, '0')}-01`
      const toDate = endOfMonth(new Date(sessionEndYear, sessionEndMonth - 1))
      const to = format(toDate, 'yyyy-MM-dd')

      const payments = await this.paymentService.listByRange(from, to) // expects [{ amount, date }]
      for (const payment of payments) {
        const date = parseISO(payment.date)
        const key = format(date, 'yyyy-MM')
        const idx = monthKeys.indexOf(key)
        if (idx !== -1) {
          chartData[idx].value += payment.amount
        }
      }

      return super.processSuccess(chartData)
    } catch (error) {
      return super.processError(error)
    }
  }
}

export default new DashboardController()
