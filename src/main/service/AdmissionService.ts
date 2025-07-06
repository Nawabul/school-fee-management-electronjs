import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import db from '@main/db/db'
import Database from 'better-sqlite3'
import { admission } from '@main/db/schema/admission'
import { and, desc, eq, gt, inArray, lt, sql } from 'drizzle-orm'
import {
  Admission_Insert_Update,
  Admission_Read,
  Admission_Read_Paid_Unpaid,
  Admission_Record
} from '@type/interfaces/admission'
import { classes } from '@main/db/schema/class'
import { Transaction } from '@type/interfaces/db'

class AdmissionService {
  db: BetterSQLite3Database<Record<string, never>> & {
    $client: Database.Database
  }
  constructor() {
    this.db = db
  }
  create(
    data: Admission_Insert_Update,
    tx: BetterSQLite3Database<Record<string, never>> = this.db
  ): number {
    const result = tx.insert(admission).values(data).returning({ id: admission.id }).get()
    if (!result || !result.id) {
      throw new Error('Failed to create admission, no ID returned')
    }
    return result.id
  }
  update(id: number, data: Admission_Insert_Update): boolean {
    const result = this.db.update(admission).set(data).where(eq(admission.id, id)).run()

    // .run() returns info about rows affected, not the updated row itself
    return result.changes > 0
  }
  delete(id: number | number[]): boolean {
    const result = this.db
      .delete(admission)
      .where(inArray(admission.id, Array.isArray(id) ? id : [id]))
      .run()

    // .run() returns info about rows affected, not the updated row itself
    return result.changes > 0
  }
  async list(studentId: number): Promise<Admission_Record[]> {
    try {
      const result = this.db
        .select({
          id: admission.id,
          date: admission.date,
          amount: admission.amount,
          paid: admission.paid,
          remark: admission.remark,
          class: classes.name
        })
        .from(admission)
        .where(eq(admission.student_id, studentId))
        .orderBy(desc(admission.id))
        .innerJoin(classes, eq(admission.class_id, classes.id))
      return result.all() || []
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while fetching class: ' + error.message)
      } else {
        throw new Error('Error  while fetching class')
      }
    }
  }
  get(id: number): Admission_Read | null {
    const charge = this.db
      .select({
        class_id: admission.class_id,
        student_id: admission.student_id,
        date: admission.date,
        amount: admission.amount,
        paid: admission.paid,
        remark: admission.remark
      })
      .from(admission)
      .where(eq(admission.id, id))
      .get()

    return charge || null
  }

  unpaid_list(studentId: number): Admission_Read_Paid_Unpaid[] {
    const condition = [eq(admission.student_id, studentId), lt(admission.paid, admission.amount)]
    const list = this.db
      .select({
        id: admission.id,
        amount: admission.amount,
        paid: admission.paid
      })
      .from(admission)
      .where(and(...condition))
      .orderBy(desc(admission.paid), admission.date)
      .all()
    return list
  }

  //paid list
  paid_list(studentId: number): Admission_Read_Paid_Unpaid[] {
    const condition = [eq(admission.student_id, studentId), gt(admission.paid, 0)]
    const list = this.db
      .select({
        id: admission.id,
        amount: admission.amount,
        paid: admission.paid
      })
      .from(admission)
      .where(and(...condition))
      .orderBy(admission.paid, desc(admission.date))
      .all()
    return list
  }
  paid(
    id: number,
    amount: number,
    tx: BetterSQLite3Database<Record<string, never>> = this.db
  ): boolean {
    const pay = tx
      .update(admission)
      .set({ paid: sql`${admission.paid} + ${amount}` })
      .where(eq(admission.id, id))
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
      .update(admission)
      .set({ paid: sql`${admission.paid} - ${amount}` })
      .where(eq(admission.id, id))
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

export default new AdmissionService()
