import { addMonths, differenceInMonths, format } from 'date-fns'
import ClassService from '../service/ClassService'
import MonthlyFeeService from '../service/MonthlyFeeService'
import { DB_DATE_FORMAT } from '../utils/constant/date'
import StudentService from '../service/StudentService'
import db from '../db/db'
import { apiError, apiSuccess, errorResponse, successResponse } from '../../types/utils/apiReturn'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { Monthly_Fee_Record } from '../../types/interfaces/monthly_fee'
import { IpcMainInvokeEvent } from 'electron'

type MonthlyFeeAddInput = {
  student_id: number
  class_id: number
  from: string
  to: string
}
class MonthlyFeeController {
  private classService: typeof ClassService
  private studentService: typeof StudentService

  constructor(classService: typeof ClassService, studentService: typeof StudentService) {
    this.classService = classService
    this.studentService = studentService
  }

  async create(
    data: MonthlyFeeAddInput,
    tx: BetterSQLite3Database<Record<string, never>> | null = null
  ): Promise<successResponse<boolean> | errorResponse> {
    try {
      const MonthCount = this.countMonth(data.from, data.to)
      if (MonthCount < 1) {
        return apiSuccess(true, 'No need ')
      }
      // fetch class details
      const classDetails = await this.classService.list(data.class_id)
      if (!classDetails || classDetails.length === 0) {
        return apiError('Class Not found')
      }
      const fee = classDetails[0].amount
      type row = {
        student_id: number
        class_id: number
        amount: number
        date: string
      }
      const row: row[] = []

      for (let i = 0; i < MonthCount; i++) {
        row[i] = {
          student_id: data.student_id,
          class_id: data.class_id,
          amount: fee,
          date: format(addMonths(data.from, i), DB_DATE_FORMAT)
        }
      }

      const total = fee * MonthCount
      if (row.length < 1) {
        return apiSuccess(false, 'No Need to add')
      }
      let done = false
      if (tx) {
        // insert monthly fees
        // @ts-ignore client is missing but passing tx refrenece
        const feeResponse = MonthlyFeeService.create(tx, row)
        if (!feeResponse) {
          throw new Error('Failed to create monthly fee')
        }

        console.log('month tx done')
        console.log('month tx done')
        // decrement student balance
        this.studentService.decrementBalance(tx, data.student_id, total)

        done = true
      } else {
        db.transaction((tx: BetterSQLite3Database<Record<string, never>>) => {
          // insert monthly fees
          // @ts-ignore pasing db ref
          const feeResponse = MonthlyFeeService.create(tx, row)
          if (!feeResponse) {
            throw new Error('Failed to create monthly fee')
          }
          console.log('month tx done')
          // decrement student balance
          this.studentService.decrementBalance(tx, data.student_id, total)

          const lastFee = this.studentService.last_fee_date_update(data.student_id, data.to)
          if (!lastFee) {
            throw new Error('Last fee update error in monthly fee handler')
          }

          done = true
        })
      }

      return apiSuccess(done, 'Monthly fees created successfully')
    } catch (error) {
      if (error instanceof Error) {
        return apiError(error.message)
      } else {
        return apiError('An error occurred while creating monthly fees')
      }
    }
  }

  async list(
    _event: IpcMainInvokeEvent,
    student_id: number
  ): Promise<successResponse<Monthly_Fee_Record[]> | errorResponse> {
    try {
      console.log('check 1')
      const result = await MonthlyFeeService.list(student_id)
      console.log('check 2')

      return apiSuccess(result, 'Student Monthly Fee list')
    } catch (error) {
      if (error instanceof Error) {
        return apiError(error.message)
      } else {
        return apiError('An error occurred while fetching list monthly fees')
      }
    }
  }

  countMonth(start: string, end: string): number {
    const from = new Date(start)
    const to = new Date(end)

    let MonthCount = differenceInMonths(to, from)
    console.log(MonthCount)
    MonthCount = Number(MonthCount)
    if (MonthCount < 0) {
      return 0
    }

    if (MonthCount == 0) {
      const fromMonth = new Date(from)
      const toMonth = new Date(to)
      if (fromMonth.getMonth() < toMonth.getMonth()) {
        return 1
      }
    }

    return MonthCount
  }
}

export default new MonthlyFeeController(ClassService, StudentService)
