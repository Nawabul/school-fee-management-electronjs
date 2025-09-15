import { Transaction } from '@type/interfaces/db'
import { DB_DATE_FORMAT } from '@main/utils/constant/date'
import { addMonths, differenceInMonths, set } from 'date-fns'
import { format } from 'date-fns'

import MonthlyRepository from '@main/repository/MonthlyRepository'
import AdjustmentRepository from '@main/repository/AdjustmentRepository'
import { BaseService } from './BaseService'
import {
  CreateMonthly,
  Monthly_Fee_Insert_Update,
  Monthly_Fee_Write
} from '@type/interfaces/monthly_fee'
import SessionService from './SessionService'
import db from '@main/db/db'
import StudentRepository from '@main/repository/StudentRepository'
import StudnetNotFoundException from '@main/exception.ts/StudentNotFoundException'
import MonthlyNotFoundException from '@main/exception.ts/MonthlyNotFoundException'
type CreateByRange = {
  studentId: number
  classId: number
  from: string
  count: number
  fee: number
  haveAmount: number
}

class MonthlyFeeService extends BaseService {
  private repo: MonthlyRepository
  private studentRepo: StudentRepository
  private adjustRepo: AdjustmentRepository
  constructor() {
    super()
    this.repo = new MonthlyRepository()
    this.adjustRepo = new AdjustmentRepository()
    this.studentRepo = new StudentRepository()
  }

  public create(data: CreateMonthly, tx: Transaction | null = null): boolean {
    if (tx == null) {
      return db.transaction((tx: Transaction) => {
        return this.processCreate(data, tx)
      })
    }

    return this.processCreate(data, tx)
  }

  public processCreate(
    { studentId, classId, start, end, endIncluded, monthly }: CreateMonthly,
    tx: Transaction
  ): boolean {
    if (end == null) {
      end = format(new Date(), DB_DATE_FORMAT)
    }
    const student = this.studentRepo.findById(studentId)
    if (!student) {
      throw new StudnetNotFoundException()
    }
    const lastDate = student.last_fee_date
    const month = this.countMonth(start, end)
    let count = month.count
    let endFeeDate = month.end
    if (endIncluded) {
      const from = new Date(start)
      const last = new Date(end)

      if (last.getMonth() >= from.getMonth()) {
        count++
        endFeeDate = format(addMonths(new Date(endFeeDate), 1), DB_DATE_FORMAT)
      }
    }
    if (count < 1) {
      return true
    }
    const haveAmount = this.adjustRepo.getTotalUnused(studentId)
    const used = this.createByRange(
      {
        studentId,
        classId,
        fee: monthly,
        count,
        from: start,
        haveAmount
      },
      tx
    )

    // adjust payment used
    this.adjustRepo.adjustPayment(studentId, used, 'monthly', tx)

    // decrease amount
    const total = monthly * count
    this.studentRepo.decrementBalance(studentId, total, tx)

    // update last fee date
    const lastFeeDate = lastDate > endFeeDate ? lastDate : endFeeDate
    this.studentRepo.lastFeeUpdate(studentId, lastFeeDate, tx)

    return true
  }

  update(id: number, data: Partial<Monthly_Fee_Write>): boolean {
    const old = this.repo.findById(id)
    if (!old) {
      throw new MonthlyNotFoundException()
    }
    const result = db.transaction((tx: Transaction) => {
      const amount = data.amount ?? old.amount
      const diff = amount - old.amount
      const need = amount - old.paid
      const studentId = old.student_id
      const adjust = this.adjustRepo.adjustPayment(studentId, need, 'monthly', tx)
      const input = {
        amount: amount,
        paid: old.paid + adjust
      }
      const update = this.repo.update(id, input, tx)

      this.studentRepo.decrementBalance(studentId, diff, tx)

      return update
    })

    return result.changes > 0
  }

  // list of monthly records of specific student

  public listOfStudent(studentId: number): ReturnType<MonthlyRepository['listByStudent']> {
    const list = this.repo.listByStudent(studentId)

    return list
  }

  /**
   * Deletes all records related to a given student.
   *
   * This is a service-level wrapper around the repository method.
   * It should be used inside a transaction when removing a student,
   * so that all dependent records (fees)
   * are cleared consistently.
   *
   * ⚠️ Use with caution — this action is irreversible.
   *
   * @param studentId - The ID of the student whose records should be deleted
   * @param tx - Optional transaction context (defaults to main db connection)
   * @returns The result of the repository delete operation
   */
  public deleteAllOfStudent(
    studentId: number,
    tx: Transaction = db
  ): ReturnType<MonthlyRepository['deleteAllOfStudent']> {
    return this.repo.deleteAllOfStudent(studentId, tx)
  }

  // create in range

  public createByRange(
    { studentId, classId, from, count, fee, haveAmount }: CreateByRange,
    tx: Transaction
  ): number {
    if (count <= 0) {
      return 0
    }
    let used = 0
    let remain = haveAmount
    const start = set(from, { date: 1 })
    for (let i = 0; i < count; i++) {
      const amount = fee
      const paid = Math.min(amount, remain)
      remain -= paid
      used += paid
      const input: Monthly_Fee_Insert_Update = {
        student_id: studentId,
        class_id: classId,
        amount,
        paid: paid,
        date: format(addMonths(start, i), DB_DATE_FORMAT)
      }
      this.createMonthly(input, tx)
    }

    return used
  }

  // count month
  public countMonth(start: string, end: string): { count: number; end: string } {
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
    const endMonth = SessionService.getEndMonth() - 1
    // if march then
    if (to.getMonth() == endMonth) {
      MonthCount += 1
      end = format(addMonths(to, 1), DB_DATE_FORMAT)
    }

    return {
      count: MonthCount,
      end
    }
  }

  // private methods

  // create single record
  private createMonthly(data: Monthly_Fee_Insert_Update, tx: Transaction): number {
    try {
      const result = this.repo.create(data, tx)

      return result.id
    } catch (error) {
      throw super.processError(error)
    }
  }
}

export default new MonthlyFeeService()
