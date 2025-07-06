import { addMonths, differenceInMonths, format } from 'date-fns'
import ClassService from '../service/ClassService'
import MonthlyFeeService from '../service/MonthlyFeeService'
import { DB_DATE_FORMAT } from '../utils/constant/date'
import StudentService from '../service/StudentService'
import { apiError, apiSuccess, errorResponse, successResponse } from '../../types/utils/apiReturn'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { Monthly_Fee_Record } from '../../types/interfaces/monthly_fee'
import { IpcMainInvokeEvent } from 'electron'
import PaymentService from '@main/service/PaymentService'
import { Transaction } from '@type/interfaces/db'

type MonthlyFeeAddInput = {
  student_id: number
  class_id: number
  from: string
  to: string
}
type DeleteMonthlyFeeRequest = Omit<MonthlyFeeAddInput, 'class_id'>
class MonthlyFeeController {
  private classService: typeof ClassService

  constructor(classService: typeof ClassService) {
    this.classService = classService
  }

  async create(
    data: MonthlyFeeAddInput,
    amountToPaid: number = -1,
    tx: BetterSQLite3Database<Record<string, never>> | null = null
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const MonthCount = this.countMonth(data.from, data.to)
      const count = MonthCount.count
      const end = MonthCount.end
      if (count < 1) {
        return apiSuccess(true, 'No need ')
      }

      // fetch class details
      const classDetails = this.classService.get(data.class_id)
      if (!classDetails) {
        return apiError('Class Not found')
      }

      const fee = classDetails.amount
      const studentId = data.student_id
      // fetch amount for paid
      let amount = amountToPaid
      if (amount < 0) {
        const paymentRecord = PaymentService.unsed_list(studentId)
        const paidAmount = paymentRecord.reduce((acc, payment) => {
          return acc + (payment.amount - payment.used)
        }, 0)

        amount = paidAmount
      }

      const input = {
        student_id: data.student_id,
        class_id: data.class_id,
        from: data.from,
        count: count,
        fee: fee,
        haveAmount: amount
      }
      const total = fee * count

      if (tx == null) {
        MonthlyFeeService.db.transaction((tx: Transaction) => {
          MonthlyFeeService.createBulkWithPayment(input, tx)
          StudentService.decrementBalance(tx, data.student_id, total)
          // update student last date
          StudentService.last_fee_date_update(data.student_id, end, tx)
        })
      } else {
        MonthlyFeeService.createBulkWithPayment(input, tx)
        StudentService.decrementBalance(tx, data.student_id, total)
        StudentService.last_fee_date_update(data.student_id, end, tx)
      }
      return apiSuccess(true, 'Monthly fees created successfully')
    } catch (error) {
      if (error instanceof Error) {
        return apiError(error.message)
      } else {
        return apiError('An error occurred while creating monthly fees')
      }
    }
  }

  // delete records
  async delete(
    data: DeleteMonthlyFeeRequest,
    tx: BetterSQLite3Database<Record<string, never>> | null = null
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const list = await MonthlyFeeService.listByDateRange(data.student_id, data.from, data.to)
      const ids: number[] = []
      let total = 0
      for (const row of list) {
        total += row.amount || 0
        if (row.id) {
          ids.push(row.id)
        }
      }

      if (tx) {
        // delete the records
        MonthlyFeeService.delete(tx, ids)

        StudentService.incrementBalance(tx, data.student_id, total)
      } else {
        StudentService.db.transaction((tx: BetterSQLite3Database<Record<string, never>>) => {
          MonthlyFeeService.delete(tx, ids)
          StudentService.incrementBalance(tx, data.student_id, total)
        })
      }
      return apiSuccess(true, 'Monthly record delete of given range')
    } catch (error) {
      if (error instanceof Error) {
        return apiError(error.message)
      } else {
        return apiError('An error occurred while deleting monthly fees')
      }
    }
  }

  async list(
    _event: IpcMainInvokeEvent,
    student_id: number
  ): Promise<successResponse<Monthly_Fee_Record[]> | errorResponse> {
    try {
      const result = await MonthlyFeeService.list(student_id)

      return apiSuccess(result, 'Student Monthly Fee list')
    } catch (error) {
      if (error instanceof Error) {
        return apiError(error.message)
      } else {
        return apiError('An error occurred while fetching list monthly fees')
      }
    }
  }

  countMonth(start: string, end: string): { count: number; end: string } {
    const from = new Date(start)
    const to = new Date(end)

    let MonthCount = differenceInMonths(to, from)

    MonthCount = Number(MonthCount)
    if (MonthCount < 0) {
      return {
        count: 0,
        end
      }
    }

    if (MonthCount == 0 && from.getMonth() != to.getMonth()) {
      MonthCount = 1
    }

    // if march then
    if (to.getMonth() == 2) {
      MonthCount += 1
      end = format(addMonths(to, 1), DB_DATE_FORMAT)
    }

    return {
      count: MonthCount,
      end
    }
  }
}

export default new MonthlyFeeController(ClassService)
