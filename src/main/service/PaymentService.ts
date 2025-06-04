import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import db from '../db/db'
import Database from 'better-sqlite3'
import { eq } from 'drizzle-orm'
import { Payment_Read, Payment_Record, Payment_Write } from '../../types/interfaces/payment'
import { payments } from '../db/schema/payment'
import StudentService from './StudentService'

class PaymentService {
  db: BetterSQLite3Database<Record<string, never>> & {
    $client: Database.Database
  }

  constructor() {
    this.db = db
  }

  // PaymentService.ts
  async create(data: Payment_Write): Promise<number> {
    try {
      let insertedId = 0

      this.db.transaction((tx): void => {
        const result = tx.insert(payments).values(data).returning({ id: payments.id }).get()

        if (!result?.id) throw new Error('Failed to create payment.')

        insertedId = result.id

        // Adjust student balance
        StudentService.incrementBalance(tx, data.student_id, data.amount)
      })

      return insertedId
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while creating payment: ' + error.message)
      }
      throw new Error('Unknown error while creating payment')
    }
  }

  async update(id: number, newData: Payment_Write): Promise<boolean> {
    try {
      let changes = 0
      this.db.transaction((tx) => {
        const oldPayment = this.db
          .select({ amount: payments.amount, student_id: payments.student_id })
          .from(payments)
          .where(eq(payments.id, id))
          .get()

        if (!oldPayment) throw new Error('Payment not found.')

        tx.update(payments).set(newData).where(eq(payments.id, id)).run()

        // Adjust student balance
        const newBalance = newData.amount - oldPayment.amount
        if (newBalance !== 0) {
          StudentService.incrementBalance(tx, oldPayment.student_id, newBalance)
        }
        changes = 1
      })

      return changes > 0
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while updating payment: ' + error.message)
      }
      throw new Error('Unknown error while updating payment')
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      let deleted = false
      this.db.transaction((tx) => {
        const payment = this.db
          .select({ amount: payments.amount, student_id: payments.student_id })
          .from(payments)
          .where(eq(payments.id, id))
          .get()

        if (!payment) throw new Error('Payment not found.')

        tx.delete(payments).where(eq(payments.id, id)).run()
        StudentService.decrementBalance(tx, payment.student_id, payment.amount)

        deleted = true
      })

      return deleted
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while deleting payment: ' + error.message)
      }
      throw new Error('Unknown error while deleting payment')
    }
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
        .all()
        console.log('PaymentService.list', results)
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
  async get(id: number): Promise<Payment_Read | null> {
    try {
      const payment = this.db
        .select({
          id: payments.id,
          date: payments.date,
          amount: payments.amount,
          remark: payments.remark
        })
        .from(payments)
        .where(eq(payments.id, id))
        .get()

      return payment || null
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while fetching payment: ' + error.message)
      } else {
        throw new Error('Unknown error while fetching payment')
      }
    }
  }
}

export default new PaymentService()
