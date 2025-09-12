import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import db from '../db/db'
import {
  Payment_Insert,
  Payment_Read,
  Payment_Record,
  Payment_Write
} from '../../types/interfaces/payment'
import PaymentRepository from '@main/repository/PaymentRepository'
import { BaseService } from './BaseService'
type Transaction = BetterSQLite3Database<Record<string, never>>
class PaymentService extends BaseService {
  private repo: PaymentRepository

  constructor() {
    super()
    this.repo = new PaymentRepository()
  }

  // PaymentService.ts
  create(data: Payment_Insert, tx: Transaction = db): number {
    // used payment amount
    const result = this.repo.create(data, tx)

    return result.id
  }

  update(id: number, newData: Payment_Write, tx: Transaction = db): boolean {
    const changes = this.repo.update(id, newData, tx)

    return changes.changes > 0
  }

  delete(id: number, tx: Transaction = db): boolean {
    const deleted = this.repo.delete(id, tx)

    return deleted.changes > 0
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
