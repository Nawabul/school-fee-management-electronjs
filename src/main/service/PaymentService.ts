import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import db from '../db/db'
import Database from 'better-sqlite3'
import { desc, eq } from 'drizzle-orm'
import {
  Payment_Insert,
  Payment_Read,
  Payment_Record,
  Payment_Write
} from '../../types/interfaces/payment'
import { payments } from '../db/schema/payment'
type Transaction = BetterSQLite3Database<Record<string, never>>
class PaymentService {
  db: BetterSQLite3Database<Record<string, never>> & {
    $client: Database.Database
  }

  constructor() {
    this.db = db
  }

  // PaymentService.ts
  create(data: Payment_Insert, tx: Transaction = this.db): number {
    // used payment amount
    const result = tx.insert(payments).values(data).returning({ id: payments.id }).get()

    return result.id
  }

  update(id: number, newData: Payment_Write, tx: Transaction = this.db): boolean {
    const changes = tx.update(payments).set(newData).where(eq(payments.id, id)).run()

    return changes.changes > 0
  }

  delete(id: number, tx: Transaction = this.db): boolean {
    const deleted = tx.delete(payments).where(eq(payments.id, id)).run()

    return deleted.changes > 0
  }

  /**
   * Get all payment records.
   */
  async list(studentId: number): Promise<Payment_Record[]> {
    try {
      const results = this.db
        .select({
          id: payments.id,
          date: payments.date,
          amount: payments.amount,
          remark: payments.remark
        })
        .from(payments)
        .where(eq(payments.student_id, studentId))
        .orderBy(desc(payments.date))
        .all()

      return results || []
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while fetching payments: ' + error.message)
      } else {
        throw new Error('Unknown error while fetching payments')
      }
    }
  }

  /**
   * Get a single payment record by ID.
   */
  get(id: number): Payment_Read | null {
    const payment = this.db
      .select({
        id: payments.id,
        student_id: payments.student_id,
        date: payments.date,
        amount: payments.amount,
        used: payments.used,
        admission: payments.admission,
        monthly: payments.monthly,
        mis_charge: payments.mis_charge,
        remark: payments.remark
      })
      .from(payments)
      .where(eq(payments.id, id))
      .get()

    return payment || null
  }
}

export default new PaymentService()
