import { and, desc, eq, gt, lt, sql } from 'drizzle-orm'
import BaseRepository from './BaseRepository'
import { mis_charges } from '@main/db/schema/mis_charge'
import { mis_items } from '@main/db/schema/mis_item'
import { Transaction } from '@type/interfaces/db'
import { Mis_Charge_Read_Paid_Unpaid, Mis_Charge_Record } from '@type/interfaces/mis_charge'

class MisChargeRepository extends BaseRepository<typeof mis_charges> {
  protected model = mis_charges

  constructor() {
    super()
  }

  /**
   * Get all miscellaneous charges for a student.
   * @param studentId - ID of the student
   * @returns Array of mis_charge records
   */
  list(studentId: number): Mis_Charge_Record[] {
    return this.listByStudent(studentId)
  }

  /**
   * Get detailed miscellaneous charges for a student, including item name.
   * @param studentId - ID of the student
   * @returns Array of mis_charge records with item details
   */
  listByStudent(studentId: number): Mis_Charge_Record[] {
    return this.db
      .select({
        id: mis_charges.id,
        date: mis_charges.date,
        amount: mis_charges.amount,
        paid: mis_charges.paid,
        remark: mis_charges.remark,
        item_name: mis_items.name
      })
      .from(mis_charges)
      .where(eq(mis_charges.student_id, studentId))
      .innerJoin(mis_items, eq(mis_charges.item_id, mis_items.id))
      .orderBy(desc(mis_charges.date))
      .all()
  }

  /**
   * List all unpaid miscellaneous charges for a student.
   * @param studentId - ID of the student
   * @returns Array of mis_charge records with unpaid amounts
   */
  unpaid_list(studentId: number): Mis_Charge_Read_Paid_Unpaid[] {
    const conditions = [
      eq(mis_charges.student_id, studentId),
      lt(mis_charges.paid, mis_charges.amount)
    ]

    return this.db
      .select({
        id: mis_charges.id,
        amount: mis_charges.amount,
        paid: mis_charges.paid
      })
      .from(mis_charges)
      .where(and(...conditions))
      .orderBy(desc(mis_charges.paid), mis_charges.date)
      .all()
  }

  /**
   * List all paid miscellaneous charges for a student.
   * @param studentId - ID of the student
   * @returns Array of mis_charge records with amounts that have been paid
   */
  paid_list(studentId: number): Mis_Charge_Read_Paid_Unpaid[] {
    const conditions = [eq(mis_charges.student_id, studentId), gt(mis_charges.paid, 0)]

    return this.db
      .select({
        id: mis_charges.id,
        amount: mis_charges.amount,
        paid: mis_charges.paid
      })
      .from(mis_charges)
      .where(and(...conditions))
      .orderBy(mis_charges.paid, desc(mis_charges.date))
      .all()
  }

  /**
   * Add a payment to a specific mis_charge record.
   * @param misChargeId - ID of the mis_charge record
   * @param amount - Amount to add to the paid field
   * @param tx - Optional transaction object
   * @returns True if the update was successful, false otherwise
   */
  paid(misChargeId: number, amount: number, tx: Transaction = this.db): boolean {
    const result = tx
      .update(mis_charges)
      .set({ paid: sql`${mis_charges.paid} + ${amount}` })
      .where(eq(mis_charges.id, misChargeId))
      .run()
    return result.changes > 0
  }

  /**
   * Reverse a payment for a specific mis_charge record.
   * @param misChargeId - ID of the mis_charge record
   * @param amount - Amount to subtract from the paid field
   * @param tx - Optional transaction object
   * @returns True if the update was successful, false otherwise
   */
  unpaid(misChargeId: number, amount: number, tx: Transaction = this.db): boolean {
    const result = tx
      .update(mis_charges)
      .set({ paid: sql`${mis_charges.paid} - ${amount}` })
      .where(eq(mis_charges.id, misChargeId))
      .run()
    return result.changes > 0
  }
}

export default MisChargeRepository
