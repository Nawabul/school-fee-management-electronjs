import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import db from '../db/db'
import {
  Payment_Read,
  Payment_Record,
  Payment_Type,
  Payment_Write
} from '../../types/interfaces/payment'
import PaymentRepository from '@main/repository/PaymentRepository'
import { BaseService } from './BaseService'
import AdjustmentRepository from '@main/repository/AdjustmentRepository'
import StudentRepository from '@main/repository/StudentRepository'
import PaymentNotFoundException from '@main/exception.ts/PaymentNotFoundException'
type Transaction = BetterSQLite3Database<Record<string, never>>
class PaymentService extends BaseService {
  private repo: PaymentRepository
  private adjustRepo: AdjustmentRepository
  private studentRepo: StudentRepository
  constructor() {
    super()
    this.repo = new PaymentRepository()
    this.adjustRepo = new AdjustmentRepository()

    this.studentRepo = new StudentRepository()
  }

  // PaymentService.ts
  create(data: Payment_Write, type: Payment_Type): number {
    let remain = data.amount
    const studentId = data.student_id
    const result = db.transaction((tx: Transaction) => {
      let admission = 0
      let misCharge = 0
      let monthly = 0
      // adjust admission
      const services = {
        admission: () => {
          admission = this.adjustRepo.adjustAdmission(studentId, remain, tx)
          remain -= admission
        },
        mis_charge: () => {
          misCharge = this.adjustRepo.adjustMisCharge(studentId, remain, tx)
          remain -= misCharge
        },
        monthly: () => {
          monthly = this.adjustRepo.adjustMonthly(studentId, remain, tx)
          remain -= monthly
        }
      }

      const serviceName: Payment_Type[] = ['admission', 'monthly', 'mis_charge']

      const index = serviceName.indexOf(type)
      if (index == -1) {
        type = 'admission'
      }

      for (const service of serviceName) {
        services[service]()
      }

      const used = {
        admission: admission,
        monthly: monthly,
        mis_charge: misCharge
      }
      const input = {
        ...data,
        ...used,
        used: data.amount - remain
      }

      const result = this.repo.create(input, tx)

      this.studentRepo.incrementBalance(studentId, data.amount, tx)
      return result
    })

    return result.id
  }

  update(id: number, data: Payment_Write): boolean {
    // fetch payment record
    const paymentRecord = this.repo.findById(id)
    if (!paymentRecord) {
      throw new PaymentNotFoundException()
    }
    const result = db.transaction((tx: Transaction) => {
      const balanceDiff = data.amount - paymentRecord.amount
      let newAdmission = paymentRecord.admission
      let newMonthly = paymentRecord.monthly
      let newMisCharge = paymentRecord.mis_charge
      const studentId = paymentRecord.student_id
      let remain = data.amount - paymentRecord.used

      if (remain < 0) {
        const misPaid = this.adjustRepo.adjustMisCharge(studentId, remain, tx)
        newMisCharge += misPaid
        remain -= misPaid

        const monthlyPaid = this.adjustRepo.adjustMonthly(studentId, remain, tx)
        newMonthly += monthlyPaid
        remain -= monthlyPaid

        const admissionPaid = this.adjustRepo.adjustAdmission(studentId, remain, tx)
        newAdmission += admissionPaid
        remain -= admissionPaid
      }
      if (remain > 0) {
        const admissionPaid = this.adjustRepo.adjustAdmission(studentId, remain, tx)
        newAdmission += admissionPaid
        remain -= admissionPaid

        const monthlyPaid = this.adjustRepo.adjustMonthly(studentId, remain, tx)
        newMonthly += monthlyPaid
        remain -= monthlyPaid

        const misPaid = this.adjustRepo.adjustMisCharge(studentId, remain, tx)
        newMisCharge += misPaid
        remain -= misPaid
      }

      const updatedData = {
        ...data,
        mis_charge: newMisCharge,
        monthly: newMonthly,
        admission: newAdmission,
        used: data.amount - remain
      }

      // update payment
      const paymentUpdate = this.repo.update(id, updatedData)
      // update student balance
      this.studentRepo.incrementBalance(studentId, balanceDiff, tx)

      return paymentUpdate
    })

    return result.changes > 0
  }

  delete(id: number): boolean {
    const oldPayment = this.repo.findById(id)

    if (!oldPayment) {
      throw new PaymentNotFoundException()
    }

    const result = db.transaction((tx: Transaction) => {
      const admission = oldPayment.admission
      const monthly = oldPayment.monthly
      const misCharge = oldPayment.mis_charge
      const studentId = oldPayment.student_id
      const amount = oldPayment.amount
      this.adjustRepo.adjustAdmission(studentId, admission, tx)
      this.adjustRepo.adjustMonthly(studentId, monthly, tx)
      this.adjustRepo.adjustMisCharge(studentId, misCharge, tx)

      this.studentRepo.decrementBalance(studentId, amount, tx)
      return this.repo.delete(id, tx)
    })

    return result.changes > 0
  }

  /**
   * Deletes all records related to a given student.
   *
   * This is a service-level wrapper around the repository method.
   * It should be used inside a transaction when removing a student,
   * so that all dependent records (payments)
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
  ): ReturnType<PaymentRepository['deleteAllOfStudent']> {
    return this.repo.deleteAllOfStudent(studentId, tx)
  }

  /**
   * Get all payment records.
   */
  async list(studentId: number): Promise<Payment_Record[]> {
    const results = this.repo.listByStudent(studentId)

    return results || []
  }
  async listByRange(from: string, to: string, studentId: number = 0): Promise<Payment_Record[]> {
    try {
      const results = this.repo.listByRange(studentId, from, to)

      return results || []
    } catch (error: unknown) {
      throw super.processError(error)
    }
  }

  /**
   * Get a single payment record by ID.
   */
  get(id: number): Payment_Read | null {
    const payment = this.repo.findById(id)

    return payment || null
  }

  getUsedTotal(studentId: number): number {
    return this.repo.getUsedTotal(studentId)
  }
  getUnusedTotal(studentId: number): number {
    return this.repo.getUnusedTotal(studentId)
  }
}

export default new PaymentService()
