import db from '@main/db/db'
import {
  Admission_Insert_Update,
  Admission_Read,
  Admission_Read_Paid_Unpaid,
  Admission_Record,
  Admission_Write
} from '@type/interfaces/admission'
import { Transaction } from '@type/interfaces/db'
import AdmissionRepository from '@main/repository/AdmissionRepository'
import { BaseService } from './BaseService'
import AdjustmentRepository from '@main/repository/AdjustmentRepository'
import AdmissionNotFoundException from '@main/exception.ts/AdmissionNotFoundException'
import StudentRepository from '@main/repository/StudentRepository'
import { DB_DATE_FORMAT } from '@main/utils/constant/date'
import { format } from 'date-fns'
import StudnetNotFoundException from '@main/exception.ts/StudentNotFoundException'
import MonthlyFeeService from '@main/service/MonthlyFeeService'
import SessionService from './SessionService'
class AdmissionService extends BaseService {
  private repo: AdmissionRepository
  private studentRepo: StudentRepository
  private adjustRepo: AdjustmentRepository
  private monthlyService: typeof MonthlyFeeService

  private sessionService: typeof SessionService
  constructor() {
    super()
    this.repo = new AdmissionRepository()
    this.adjustRepo = new AdjustmentRepository()
    this.studentRepo = new StudentRepository()
    this.monthlyService = MonthlyFeeService

    this.sessionService = SessionService
  }
  create(data: Admission_Insert_Update, tx: Transaction = db): number {
    // create admission
    const result = this.repo.create(data, tx)
    return result.id
  }

  promote(data: Admission_Write): number {
    const studentId = data.student_id
    const student = this.studentRepo.findById(studentId)
    if (!student) {
      throw new StudnetNotFoundException()
    }
    const result = db.transaction((tx: Transaction) => {
      let haveAmount = this.adjustRepo.haveAmount(studentId)
      const amount = data.amount
      const paid = Math.min(haveAmount, amount)
      haveAmount -= paid
      const today = format(new Date(), DB_DATE_FORMAT)
      const last_fee = student.last_fee_date
      const fromDate = data.date
      const startDate = fromDate < last_fee ? last_fee : fromDate
      const result = this.repo.create(
        {
          ...data,
          paid
        },
        tx
      )

      this.monthlyService.processCreate(
        {
          studentId,
          classId: data.class_id,
          monthly: data.monthly,
          start: startDate,
          end: today
        },
        tx
      )
      const activeUntil = this.sessionService.endDate()
      this.studentRepo.decrementBalance(studentId, amount, tx)
      this.studentRepo.classUpdate(studentId, data.class_id, data.monthly, activeUntil, tx)

      return result
    })

    return result.id
  }

  update(id: number, data: Admission_Insert_Update): boolean {
    const oldData = this.repo.findById(id)
    if (!oldData) {
      throw new AdmissionNotFoundException()
    }
    const result = db.transaction((tx: Transaction) => {
      const need = data.amount - oldData.paid
      const studentId = oldData.student_id
      const haveAmount = this.adjustRepo.haveAmount(studentId)
      const adjust = Math.min(haveAmount, need)
      const input = {
        ...data,
        paid: oldData.paid + adjust
      }
      const update = this.repo.update(id, input, tx)
      if (need < 0) {
        this.adjustRepo.processExpenseDown(studentId, need, 'admission', tx)
      }
      this.adjustRepo.processExpenseDown(studentId, need, 'admission', tx)
      return update
    })

    // .run() returns info about rows affected, not the updated row itself
    return result.changes > 0
  }
  delete(id: number): boolean {
    const result = db.transaction((tx: Transaction) => {
      const oldData = this.repo.findById(id)
      if (!oldData) {
        throw new AdmissionNotFoundException()
      }
      const result = this.repo.delete(id)
      const paid = oldData.paid

      this.adjustRepo.processExpenseDown(oldData.student_id, -paid, 'admission', tx)

      return result
    })

    // .run() returns info about rows affected, not the updated row itself
    return result.changes > 0
  }

  /**
   * Deletes all records related to a given student.
   *
   * This is a service-level wrapper around the repository method.
   * It should be used inside a transaction when removing a student,
   * so that all dependent records (admission)
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
  ): ReturnType<AdmissionRepository['deleteAllOfStudent']> {
    return this.repo.deleteAllOfStudent(studentId, tx)
  }

  async list(studentId: number): Promise<Admission_Record[]> {
    try {
      return this.repo.listByStudent(studentId)
    } catch (error: unknown) {
      throw super.processError(error)
    }
  }
  get(id: number): Admission_Read {
    try {
      const result = this.repo.findById(id)
      if (!result) {
        throw new AdmissionNotFoundException()
      }
      return result
    } catch (error) {
      throw super.processError(error)
    }
  }

  unpaid_list(studentId: number): Admission_Read_Paid_Unpaid[] {
    return this.repo.unpaid_list(studentId)
  }

  //paid list
  paid_list(studentId: number): Admission_Read_Paid_Unpaid[] {
    return this.repo.paid_list(studentId)
  }
  paid(id: number, amount: number, tx: Transaction = db): boolean {
    const pay = this.repo.paid(id, amount, tx)
    return pay
  }

  // unpaid reverse the paid amount

  unpaid(id: number, amount: number, tx: Transaction = db): boolean {
    return this.repo.unpaid(id, amount, tx)
  }
}

export default new AdmissionService()
