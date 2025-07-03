import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import db from '../db/db'
import Database from 'better-sqlite3'
import { desc, eq, gt, lt, sql } from 'drizzle-orm'
import { mis_charges } from '../db/schema/mis_charge'
import {
  Mis_Charge_Write,
  Mis_Charge_Record,
  Mis_Charge_Read,
  Mis_Charge_Read_Paid_Unpaid
} from '../../types/interfaces/mis_charge'
import StudentService from './StudentService'
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
  async create(data: Mis_Charge_Write): Promise<number> {
    try {
      const insertedId = this.db.transaction((tx) => {
        const result = tx.insert(mis_charges).values(data).returning({ id: mis_charges.id }).get()

        if (!result?.id) throw new Error('Failed to create MIS charge.')

        StudentService.decrementBalance(tx, data.student_id, data.amount)

        return result.id
      })

      return insertedId
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error
          ? 'Error while creating MIS charge: ' + error.message
          : 'Unknown error while creating MIS charge'
      )
    }
  }

  /**
   * Update a MIS charge and adjust the student balance accordingly (transactional).
   */
  async update(id: number, newData: Mis_Charge_Write): Promise<boolean> {
    try {
      const success = this.db.transaction((tx) => {
        const old = tx
          .select({ amount: mis_charges.amount, student_id: mis_charges.student_id })
          .from(mis_charges)
          .where(eq(mis_charges.id, id))
          .get()

        if (!old) throw new Error('MIS charge not found.')

        const result = tx.update(mis_charges).set(newData).where(eq(mis_charges.id, id)).run()
        const amountDiff = newData.amount - old.amount

        if (amountDiff !== 0) {
          StudentService.decrementBalance(tx, old.student_id, amountDiff)
        }

        return result.changes > 0
      })

      return success
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error
          ? 'Error while updating MIS charge: ' + error.message
          : 'Unknown error while updating MIS charge'
      )
    }
  }

  /**
   * Delete a MIS charge and revert the student balance (transactional).
   */
  async delete(id: number): Promise<boolean> {
    try {
      const deleted = this.db.transaction((tx) => {
        const old = tx
          .select({ amount: mis_charges.amount, student_id: mis_charges.student_id })
          .from(mis_charges)
          .where(eq(mis_charges.id, id))
          .get()

        if (!old) throw new Error('MIS charge not found.')

        const result = tx.delete(mis_charges).where(eq(mis_charges.id, id)).run()

        StudentService.incrementBalance(tx, old.student_id, old.amount)

        return result.changes > 0
      })

      return deleted
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error
          ? 'Error while deleting MIS charge: ' + error.message
          : 'Unknown error while deleting MIS charge'
      )
    }
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
  async get(id: number): Promise<Mis_Charge_Read | null> {
    try {
      const charge = this.db
        .select({
          item_id: mis_charges.item_id,
          date: mis_charges.date,
          amount: mis_charges.amount,
          remark: mis_charges.remark
        })
        .from(mis_charges)
        .where(eq(mis_charges.id, id))
        .get()

      return charge || null
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error
          ? 'Error while fetching MIS charge: ' + error.message
          : 'Unknown error while fetching MIS charge'
      )
    }
  }

  unpaid_list(): Mis_Charge_Read_Paid_Unpaid[] {
    const list = this.db
      .select({
        id: mis_charges.id,
        amount: mis_charges.amount,
        paid: mis_charges.paid
      })
      .from(mis_charges)
      .where(lt(mis_charges.paid, mis_charges.amount))
      .orderBy(desc(mis_charges.paid), desc(mis_charges.date))
      .all()
    return list
  }

  //paid list
  paid_list(): Mis_Charge_Read_Paid_Unpaid[] {
    const list = this.db
      .select({
        id: mis_charges.id,
        amount: mis_charges.amount,
        paid: mis_charges.paid
      })
      .from(mis_charges)
      .where(gt(mis_charges.paid, 0))
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

  handlePaidUp(amount: number, tx: Transaction): number {
    const list = this.unpaid_list()
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

  handlePaidDown(amount: number, tx: Transaction): number {
    const list = this.paid_list()

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

  adjustPaid(amount: number, tx: Transaction | null): number {
    let used = 0
    if (amount == 0) {
      return 0
    }
    if (tx == null) {
      const paid = this.db.transaction((tx: Transaction) => {
        if (amount < 0) {
          // reverse the paid amount
          const havePaid = this.handlePaidDown(amount, tx)
          return -havePaid
        } else {
          // add the paid amount
          const havePaid = this.handlePaidUp(amount, tx)
          return havePaid
        }
      })

      used = paid
      return used
    }

    if (amount < 0) {
      // reverse the paid amount
      const havePaid = this.handlePaidDown(amount, tx)

      used = -havePaid
      console.log('Ajdust paid used ', used)
    } else {
      // add the paid amount
      const havePaid = this.handlePaidUp(amount, tx)
      used = havePaid
    }

    return used
  }
  // adjust the unpaid amount
}

export default new MisChargeService()
