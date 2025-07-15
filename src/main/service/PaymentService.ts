import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import db from '../db/db'
import Database from 'better-sqlite3'
import { and, desc, eq, gt, gte, lt, lte, sql } from 'drizzle-orm'
import {
  Payment_Insert,
  Payment_Read,
  Payment_Record,
  Payment_Type,
  Payment_Used_Unused,
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
          used: payments.used,
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
  async listByRange(from: string, to: string, student: number = 0): Promise<Payment_Record[]> {
    try {
      const condition = [gte(payments.date,from), lte(payments.date, to)]
      if (student != 0) {
        condition.push(eq(payments.student_id, student))
      }
      const results = this.db
        .select({
          id: payments.id,
          date: payments.date,
          amount: payments.amount,
          used: payments.used,
          remark: payments.remark
        })
        .from(payments)
        .where(and(...condition))
        .orderBy(payments.date)
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

  unsed_list(studentId: number): Payment_Used_Unused[] {
    const condition = [eq(payments.student_id, studentId), lt(payments.used, payments.amount)]
    const list = this.db
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
    return list
  }

  //used list
  used_list(studentId: number): Payment_Used_Unused[] {
    const condition = [eq(payments.student_id, studentId), gt(payments.used, 0)]
    const list = this.db
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
    return list
  }
  used(
    id: number,
    amount: number,
    type: Payment_Type,
    tx: BetterSQLite3Database<Record<string, never>> = this.db
  ): boolean {
    const data = { used: sql`${payments.used} + ${amount}` }
    data[type] = sql`${payments[type]} + ${amount}`
    const used = tx.update(payments).set(data).where(eq(payments.id, id)).run()
    return used.changes > 0
  }

  // unsed reverse the paid amount

  unsed(
    id: number,
    amount: number,
    type: Payment_Type,
    tx: BetterSQLite3Database<Record<string, never>> = this.db
  ): boolean {
    const data = { used: sql`${payments.used} - ${amount}` }
    data[type] = sql`${payments[type]} - ${amount}`
    const used = tx.update(payments).set(data).where(eq(payments.id, id)).run()
    return used.changes > 0
  }

  handleUsedUp(studentId: number, amount: number, type: Payment_Type, tx: Transaction): number {
    const list = this.unsed_list(studentId)

    let used = 0
    let remain = amount

    for (let i = 0; i < list.length && remain > 0; i++) {
      const charge = list[i]
      const toUsed = charge.amount - charge.used
      if (toUsed > remain) {
        this.used(charge.id, remain, type, tx)
        used += remain
        remain = 0
      } else {
        this.used(charge.id, toUsed, type, tx)
        used += toUsed
        remain -= toUsed
      }
    }

    return used
  }

  // handle used down

  handleUsedDown(studentId: number, amount: number, type: Payment_Type, tx: Transaction): number {
    const list = this.used_list(studentId)

    let collect = 0
    let remain = Math.abs(amount) // will be negative

    for (let i = 0; i < list.length && remain > 0; i++) {
      const charge = list[i]
      const toCollect = charge.used

      if (toCollect > remain) {
        this.unsed(charge.id, remain, type, tx)
        collect += remain
        remain = 0
      } else {
        this.unsed(charge.id, toCollect, type, tx)
        collect += toCollect
        remain -= toCollect
      }
    }

    return collect
  }
  // adjust the paid amount

  adjustUsed(
    studentId: number,
    amount: number,
    type: Payment_Type,
    tx: Transaction | null
  ): number {
    let used = 0
    if (amount == 0) {
      return 0
    }
    if (tx == null) {
      const used = this.db.transaction((tx: Transaction) => {
        if (amount < 0) {
          // reverse the used amount
          const haveUsed = this.handleUsedDown(studentId, amount, type, tx)
          return -haveUsed
        } else {
          // add the used amount
          const haveUsed = this.handleUsedUp(studentId, amount, type, tx)
          return haveUsed
        }
      })

      return used
    }

    if (amount < 0) {
      // reverse the paid amount
      const haveUsed = this.handleUsedDown(studentId, amount, type, tx)

      used = -haveUsed
    } else {
      // add the paid amount
      const haveUsed = this.handleUsedUp(studentId, amount, type, tx)
      used = haveUsed
    }

    return used
  }
}

export default new PaymentService()
