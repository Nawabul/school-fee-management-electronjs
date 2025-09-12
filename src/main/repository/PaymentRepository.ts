// src/repositories/MonthlyRepository.ts
import { and, desc, eq, gt, gte, lt, lte, sql } from 'drizzle-orm'
import BaseRepository from './BaseRepository'
import { payments } from '@main/db/schema/payment'
import { Transaction } from '@type/interfaces/db'
import { Payment_Record, Payment_Type, Payment_Used_Unused } from '@type/interfaces/payment'
import { RunResult } from 'better-sqlite3'

/**
 * PaymentRepository
 *
 * Repository class to handle CRUD operations and queries related to payments.
 * Inherits from BaseRepository to get access to common database methods.
 */
class PaymentRepository extends BaseRepository<typeof payments> {
  protected model = payments

  constructor() {
    super()
  }



  /**
   * Delete all records belonging to a specific student in this table.
   *
   * Intended to be used when cascading deletes are needed (e.g.
   * removing all payments for a student).
   *
   * @param studentId - The ID of the student whose records will be deleted
   * @param tx - The active transaction context
   * @returns RunResult - The result of the delete operation
   */
  public deleteAllOfStudent(studentId: number, tx: Transaction): RunResult {
    return tx.delete(this.model).where(eq(this.model.student_id, studentId)).run()
  }

  /**
   * List all payments for a specific student.
   * @param studentId - ID of the student
   * @returns Array of Payment_Record
   */
  list(studentId: number): Payment_Record[] {
    return this.listByStudent(studentId)
  }

  /**
   * List payments by student
   * @param studentId - ID of the student
   * @returns Array of Payment_Record
   */
  listByStudent(studentId: number): Payment_Record[] {
    return this.db
      .select({
        id: payments.id,
        date: payments.date,
        amount: payments.amount,
        used: payments.used,
        remark: payments.remark
      })
      .from(payments)
      .where(eq(payments.student_id, studentId))
      .orderBy(desc(payments.date))
      .all()
  }

  /**
   * List payments within a specific date range.
   * Optionally filter by student ID.
   * @param studentId - ID of the student (optional)
   * @param start - Start date (YYYY-MM-DD)
   * @param end - End date (YYYY-MM-DD)
   * @returns Array of Payment_Record
   */
  listByRange(studentId: number = 0, start: string, end: string): Payment_Record[] {
    const condition = [gte(payments.date, start), lte(payments.date, end)]
    if (studentId) {
      condition.push(eq(payments.student_id, studentId))
    }
    return this.db
      .select({
        id: payments.id,
        date: payments.date,
        amount: payments.amount,
        used: payments.used,
        remark: payments.remark
      })
      .from(payments)
      .where(and(...condition))
      .orderBy(desc(payments.date))
      .all()
  }

  /**
   * List only unused payments for a student.
   * Unused payments are those where `used < amount`.
   * @param studentId - ID of the student
   * @returns Array of Payment_Used_Unused
   */
  unsed_list(studentId: number): Payment_Used_Unused[] {
    const condition = [eq(payments.student_id, studentId), lt(payments.used, payments.amount)]

    return this.db
      .select({
        id: payments.id,
        amount: payments.amount,
        used: payments.used,
        admission: payments.admission,
        monthly: payments.monthly,
        mis_charge: payments.mis_charge
      })
      .from(payments)
      .where(and(...condition))
      .orderBy(desc(payments.used), desc(payments.date))
      .all()
  }

  /**
   * List only used payments for a student.
   * Used payments are those where `used > 0`.
   * @param studentId - ID of the student
   * @returns Array of Payment_Used_Unused
   */
  used_list(studentId: number): Payment_Used_Unused[] {
    const condition = [eq(payments.student_id, studentId), gt(payments.used, 0)]

    return this.db
      .select({
        id: payments.id,
        amount: payments.amount,
        used: payments.used,
        admission: payments.admission,
        monthly: payments.monthly,
        mis_charge: payments.mis_charge
      })
      .from(payments)
      .where(and(...condition))
      .orderBy(payments.used, desc(payments.date))
      .all()
  }

  /**
   * Mark a payment as used by adding an amount to the `used` field
   * and to a specific payment type (admission, monthly, or mis_charge).
   *
   * @param paymentId - ID of the payment to update
   * @param amount - Amount to mark as used
   * @param type - Type of payment to apply the used amount to ('admission', 'monthly', 'mis_charge'). Default is 'admission'.
   * @param tx - Optional transaction object. Defaults to the repository's database instance.
   * @returns true if the update was successful, false otherwise
   */
  used(
    paymentId: number,
    amount: number,
    type: Payment_Type = 'admission',
    tx: Transaction = this.db
  ): boolean {
    const result = tx
      .update(payments)
      .set({ used: sql`${payments.used} + ${amount}`, [type]: sql`${payments[type]} + ${amount}` })
      .where(eq(payments.id, paymentId))
      .run()
    return result.changes > 0
  }

  /**
   * Reverse used amount of a payment (reduce `used` field)
   * @param paymentId - ID of the payment
   * @param amount - Amount to reverse
   * @param type - Type of payment to apply the used amount to ('admission', 'monthly', 'mis_charge'). Default is 'mis_charge'.
   * @param tx - Optional transaction object
   * @returns true if update was successful, false otherwise
   */
  unused(
    paymentId: number,
    amount: number,
    type: Payment_Type = 'mis_charge',
    tx: Transaction = this.db
  ): boolean {
    const result = tx
      .update(payments)
      .set({ used: sql`${payments.used} - ${amount}`, [type]: sql`${payments[type]} - ${amount}` })
      .where(eq(payments.id, paymentId))
      .run()
    return result.changes > 0
  }

  getUsedTotal(studentId: number): number {
    const list = this.used_list(studentId)
    const total = list.reduce((acc, next) => acc + next.used, 0)
    return total
  }
  getUnusedTotal(studentId: number): number {
    const list = this.used_list(studentId)
    const total = list.reduce((acc, next) => acc + (next.amount - next.used), 0)
    return total
  }
}

export default PaymentRepository
