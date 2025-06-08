import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import db from '../db/db'
import Database from 'better-sqlite3'
import { desc, eq } from 'drizzle-orm'
import { mis_charges } from '../db/schema/mis_charge'
import {
  Mis_Charge_Write,
  Mis_Charge_Record,
  Mis_Charge_Read
} from '../../types/interfaces/mis_charge'
import StudentService from './StudentService'
import { mis_items } from '../db/schema/mis_item'

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
}

export default new MisChargeService()
