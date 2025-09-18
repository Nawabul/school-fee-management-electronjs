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
    const remain = data.amount
    const studentId = data.student_id

    const result = db.transaction((tx: Transaction) => {
      this.adjustRepo.processAdjustment(studentId, remain, type, tx)

      const input = {
        ...data
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
      const studentId = paymentRecord.student_id

      this.adjustRepo.processAdjustment(studentId, balanceDiff, null, tx)

      const updatedData = {
        ...data
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
      const studentId = oldPayment.student_id
      const amount = oldPayment.amount

      this.adjustRepo.processAdjustment(studentId, -amount, null, tx)

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
