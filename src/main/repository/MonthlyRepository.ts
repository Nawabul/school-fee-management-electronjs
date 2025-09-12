// src/repositories/MonthlyRepository.ts
import { and, desc, eq, gt, lt, sql } from 'drizzle-orm'
import BaseRepository from './BaseRepository'
import { monthly_fee } from '@main/db/schema/monthly_fee'
import { Monthly_Fee_Read_Paid_Unpaid, Monthly_Fee_Record } from '@type/interfaces/monthly_fee'
import { classes } from '@main/db/schema/class'
import { students } from '@main/db/schema/student'
import { Transaction } from '@type/interfaces/db'
import { RunResult } from 'better-sqlite3'

class MonthlyRepository extends BaseRepository<typeof monthly_fee> {
  protected model = monthly_fee

  constructor() {
    super()
  }

  /**
   * Delete all records belonging to a specific student in this table.
   *
   * Intended to be used when cascading deletes are needed (e.g.
   * removing all monthly for a student).
   *
   * @param studentId - The ID of the student whose records will be deleted
   * @param tx - The active transaction context
   * @returns RunResult - The result of the delete operation
   */
  public deleteAllOfStudent(studentId: number, tx: Transaction): RunResult {
    return tx.delete(this.model).where(eq(this.model.student_id, studentId)).run()
  }

  list(studnentId: number): Monthly_Fee_Record[] {
    return this.listByStudent(studnentId)
  }

  listByStudent(studentId: number): Monthly_Fee_Record[] {
    return this.db
      .select({
        id: monthly_fee.id,
        student_id: monthly_fee.student_id,
        class_id: monthly_fee.class_id,
        date: monthly_fee.date,
        amount: monthly_fee.amount,
        paid: monthly_fee.paid,
        class_name: classes.name, // join column
        student_name: students.student_name // join column
      })
      .from(monthly_fee)
      .innerJoin(classes, eq(monthly_fee.class_id, classes.id))
      .innerJoin(students, eq(monthly_fee.student_id, students.id))
      .where(eq(monthly_fee.student_id, studentId))
      .orderBy(monthly_fee.date)
      .all() as Monthly_Fee_Record[]
  }

  // List only unpaid monthly fees for a student
  unpaid_list(studentId: number): Monthly_Fee_Read_Paid_Unpaid[] {
    const condition = [
      eq(monthly_fee.student_id, studentId),
      lt(monthly_fee.paid, monthly_fee.amount)
    ]

    return this.db
      .select({
        id: monthly_fee.id,
        amount: monthly_fee.amount,
        paid: monthly_fee.paid
      })
      .from(monthly_fee)
      .where(and(...condition))
      .orderBy(desc(monthly_fee.paid), monthly_fee.date)
      .all() as Monthly_Fee_Read_Paid_Unpaid[]
  }

  // List only paid monthly fees for a student
  paid_list(studentId: number): Monthly_Fee_Read_Paid_Unpaid[] {
    const condition = [
      eq(monthly_fee.student_id, studentId),
      gt(monthly_fee.paid, 0) // paid > 0
    ]

    return this.db
      .select({
        id: monthly_fee.id,
        amount: monthly_fee.amount,
        paid: monthly_fee.paid
      })
      .from(monthly_fee)
      .where(and(...condition))
      .orderBy(monthly_fee.paid, desc(monthly_fee.date))
      .all() as Monthly_Fee_Read_Paid_Unpaid[]
  }

  /**
   * Add paid amount to a monthly fee
   */
  paid(feeId: number, amount: number, tx: Transaction = this.db): boolean {
    const result = tx
      .update(monthly_fee)
      .set({ paid: sql`${monthly_fee.paid} + ${amount}` })
      .where(eq(monthly_fee.id, feeId))
      .run()
    return result.changes > 0
  }

  /**
   * Reverse paid amount (reduce)
   */
  unpaid(feeId: number, amount: number, tx: Transaction = this.db): boolean {
    const result = tx
      .update(monthly_fee)
      .set({ paid: sql`${monthly_fee.paid} - ${amount}` })
      .where(eq(monthly_fee.id, feeId))
      .run()
    return result.changes > 0
  }
}

export default MonthlyRepository
