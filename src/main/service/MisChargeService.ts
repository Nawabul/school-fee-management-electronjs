import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import db from '../db/db'
import Database from 'better-sqlite3'
import { and, desc, eq, gt, lt, sql } from 'drizzle-orm'
import { mis_charges } from '../db/schema/mis_charge'
import {
  Mis_Charge_Write,
  Mis_Charge_Record,
  Mis_Charge_Read,
  Mis_Charge_Read_Paid_Unpaid,
  Mis_Charege_Insert_Update
} from '../../types/interfaces/mis_charge'
import { mis_items } from '../db/schema/mis_item'
type Transaction = BetterSQLite3Database<Record<string, never>>
class MisChargeService {
  db: BetterSQLite3Database<Record<string, never>> & {
    $client: Database.Database
  }

  constructor() {
    this.db = db
  }

  /**
   * Create a new MIS charge and update student balance (transactional).
   */
  create(data: Mis_Charege_Insert_Update, tx: Transaction = this.db): number {
    const result = tx.insert(mis_charges).values(data).returning({ id: mis_charges.id }).get()

    return result.id
  }

  /**
   * Update a MIS charge and adjust the student balance accordingly (transactional).
   */
  update(id: number, data: Mis_Charge_Write, tx: Transaction = this.db): boolean {
    const result = tx.update(mis_charges).set(data).where(eq(mis_charges.id, id)).run()

    return result.changes > 0
  }

  /**
   * Delete a MIS charge and revert the student balance (transactional).
   */
  delete(id: number, tx: Transaction = this.db): boolean {
    const result = tx.delete(mis_charges).where(eq(mis_charges.id, id)).run()
    return result.changes > 0
  }

  /**
   * Get all MIS charges.
   */
  async list(studentId: number): Promise<Mis_Charge_Record[]> {
    try {
      return (
        this.db
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
          .all() || []
      )
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error
          ? 'Error while fetching MIS charges: ' + error.message
          : 'Unknown error while fetching MIS charges'
      )
    }
  }

  /**
   * Get a single MIS charge by ID.
   */
  get(id: number): Mis_Charge_Read | null {
    const charge = this.db
      .select({
        item_id: mis_charges.item_id,
        student_id: mis_charges.student_id,
        date: mis_charges.date,
        amount: mis_charges.amount,
        paid: mis_charges.paid,
        remark: mis_charges.remark
      })
      .from(mis_charges)
      .where(eq(mis_charges.id, id))
      .get()

    return charge || null
  }

  unpaid_list(studentId: number): Mis_Charge_Read_Paid_Unpaid[] {
    const condition = [
      eq(mis_charges.student_id, studentId),
      lt(mis_charges.paid, mis_charges.amount)
    ]
    const list = this.db
      .select({
        id: mis_charges.id,
        amount: mis_charges.amount,
        paid: mis_charges.paid
      })
      .from(mis_charges)
      .where(and(...condition))
      .orderBy(desc(mis_charges.paid), desc(mis_charges.date))
      .all()
    return list
  }

  //paid list
  paid_list(studentId: number): Mis_Charge_Read_Paid_Unpaid[] {
    const condition = [eq(mis_charges.student_id, studentId), gt(mis_charges.paid, 0)]
    const list = this.db
      .select({
        id: mis_charges.id,
        amount: mis_charges.amount,
        paid: mis_charges.paid
      })
      .from(mis_charges)
      .where(and(...condition))
      .orderBy(mis_charges.paid, desc(mis_charges.date))
      .all()
    return list
  }
  paid(
    id: number,
    amount: number,
    tx: BetterSQLite3Database<Record<string, never>> = this.db
  ): boolean {
    const pay = tx
      .update(mis_charges)
      .set({ paid: sql`${mis_charges.paid} + ${amount}` })
      .where(eq(mis_charges.id, id))
      .run()
    return pay.changes > 0
  }

  // unpaid reverse the paid amount

  unpaid(
    id: number,
    amount: number,
    tx: BetterSQLite3Database<Record<string, never>> = this.db
  ): boolean {
    const pay = tx
      .update(mis_charges)
      .set({ paid: sql`${mis_charges.paid} - ${amount}` })
      .where(eq(mis_charges.id, id))
      .run()
    return pay.changes > 0
  }

  handlePaidUp(studentId: number, amount: number, tx: Transaction): number {
    const list = this.unpaid_list(studentId)
    let used = 0
    let remain = amount

    for (let i = 0; i < list.length && remain > 0; i++) {
      const charge = list[i]
      const toPay = charge.amount - charge.paid
      if (toPay > remain) {
        this.paid(charge.id, remain, tx)
        used += remain
        remain = 0
      } else {
        this.paid(charge.id, toPay, tx)
        used += toPay
        remain -= toPay
      }
    }

    return used
  }

  // handle paid down

  handlePaidDown(studentId: number, amount: number, tx: Transaction): number {
    const list = this.paid_list(studentId)

    let collect = 0
    let remain = Math.abs(amount) // will be negative

    for (let i = 0; i < list.length && remain > 0; i++) {
      const charge = list[i]
      const toCollect = charge.paid

      if (toCollect > remain) {
        this.unpaid(charge.id, remain, tx)
        collect += remain
        remain = 0
      } else {
        this.unpaid(charge.id, toCollect, tx)
        collect += toCollect
        remain -= toCollect
      }
    }

    return collect
  }
  // adjust the paid amount

  adjustPaid(studentId: number, amount: number, tx: Transaction | null): number {
    let used = 0
    if (amount == 0) {
      return 0
    }
    if (tx == null) {
      const paid = this.db.transaction((tx: Transaction) => {
        if (amount < 0) {
          // reverse the paid amount
          const havePaid = this.handlePaidDown(studentId, amount, tx)
          return -havePaid
        } else {
          // add the paid amount
          const havePaid = this.handlePaidUp(studentId, amount, tx)
          return havePaid
        }
      })

      used = paid
      return used
    }

    if (amount < 0) {
      // reverse the paid amount
      const havePaid = this.handlePaidDown(studentId, amount, tx)

      used = -havePaid
    } else {
      // add the paid amount
      const havePaid = this.handlePaidUp(studentId, amount, tx)
      used = havePaid
    }

    return used
  }
}

export default new MisChargeService()
