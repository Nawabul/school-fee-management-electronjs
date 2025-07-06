import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { Student_Get, Student_Record, Student_Write } from '../../types/interfaces/student'
import db from '../db/db'
import Database from 'better-sqlite3'
import { addYears, format, set, subYears } from 'date-fns'
import { eq, sql } from 'drizzle-orm'
import { students } from '../db/schema/student'
import { InferInsertModel } from 'drizzle-orm'
import { classes } from '../db/schema/class'
import { payments } from '../db/schema/payment'
import { mis_charges } from '../db/schema/mis_charge'
import { monthly_fee } from '../db/schema/monthly_fee'
import { DB_DATE_FORMAT } from '../utils/constant/date'
import { admission } from '@main/db/schema/admission'

type StudentUpdateInput = Partial<Student_Write> & {
  current_balance?: number
}

type ListLastFeeMonthAgo = {
  student_id: number
  last_fee_date: string
  class_id: number
  active_until: string | null
}

class StudentService {
  db: BetterSQLite3Database<Record<string, never>> & {
    $client: Database.Database
  }

  constructor() {
    this.db = db
  }
  create(
    data: Student_Write,
    tx: BetterSQLite3Database<Record<string, never>> = this.db
  ): { id: number; last_date: string; active_until: string | null } {
    const today = new Date()
    const month = today.getMonth() + 1 // getMonth() returns 0-11, so we add 1
    let sub = 0
    if (month < 4) {
      sub = 1
    }
    const apr1 = set(new Date(), { month: 3, date: 1 })
    const lastDate = subYears(new Date(apr1), sub)
    const fee_date = format(new Date(lastDate), DB_DATE_FORMAT)
    const march30 = set(new Date(), { month: 2, date: 30 })
    const nextYear = addYears(march30, 1)
    const active_until = format(new Date(nextYear), DB_DATE_FORMAT)
    const now = new Date().toISOString()
    type InsertRow = InferInsertModel<typeof students>
    const row: InsertRow = {
      reg_number: data.reg_number,
      student_name: data.student_name,
      father_name: data.father_name,
      mobile: data.mobile,
      is_whatsapp: data.is_whatsapp ? 1 : 0,
      admission_date: format(new Date(data.admission_date), DB_DATE_FORMAT),
      address: data.address,
      class_id: data.class_id,
      initial_balance: 0,
      current_balance: 0,
      last_fee_date: fee_date,
      last_notification_date: now,
      active_until
    }

    const result = tx
      .insert(students)
      .values(row)
      .returning({
        id: students.id,
        last_date: students.last_fee_date,
        active_until: students.active_until
      })
      .get()

    if (!result?.id) {
      throw new Error('Failed to create student, no ID returned')
    }

    return result
  }
  async update(
    tx: BetterSQLite3Database<Record<string, never>> | null = null,
    id: number,
    data: StudentUpdateInput
  ): Promise<boolean> {
    try {
      const existing = await this.get(id)

      if (!existing) {
        throw new Error('Student not found')
      }

      // if (data.initial_balance !== undefined) {
      //   const diff = data.initial_balance - existing.initial_balance
      //   data.current_balance = existing.current_balance + diff
      // }

      // Prepare the object to update in DB, converting boolean to 1/0
      const dbData = {
        ...data,
        is_whatsapp: data.is_whatsapp !== undefined ? (data.is_whatsapp ? 1 : 0) : undefined
      }

      // Remove undefined properties from dbData (optional but cleaner)
      Object.keys(dbData).forEach((key) => dbData[key] === undefined && delete dbData[key])
      const dbInstance = tx || this.db
      const result = dbInstance.update(students).set(dbData).where(eq(students.id, id)).run()

      return result.changes > 0
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while updating student: ' + error.message)
      } else {
        throw new Error('Unknown error while updating student')
      }
    }
  }

  // transfer
  async transfer(
    studentId: number,
    date: string,
    tx: BetterSQLite3Database<Record<string, never>> | null = null
  ): Promise<boolean> {
    try {
      const dbInstance = tx || this.db
      const result = await dbInstance
        .update(students)
        .set({ transfer_date: date })
        .where(eq(students.id, studentId))
        .run()
      return result.changes > 0
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error while updating transfer: ' + error.message)
      }
      throw new Error('Error while updating transfer: ')
    }
  }
  // continue study
  async continueStudy(
    studentId: number,
    tx: BetterSQLite3Database<Record<string, never>> | null = null
  ): Promise<boolean> {
    try {
      const dbInstance = tx || this.db
      const result = await dbInstance
        .update(students)
        .set({ transfer_date: null })
        .where(eq(students.id, studentId))
        .run()
      return result.changes > 0
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error while updating transfer: ' + error.message)
      }
      throw new Error('Error while updating transfer: ')
    }
  }
  // not transfer
  async not_transfer(
    studentId: number,
    tx: BetterSQLite3Database<Record<string, never>> | null = null
  ): Promise<boolean> {
    try {
      const dbInstance = tx || this.db
      const result = await dbInstance
        .update(students)
        .set({ transfer_date: null })
        .where(eq(students.id, studentId))
        .run()
      return result.changes > 0
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error while updating transfer: ' + error.message)
      }
      throw new Error('Error while updating transfer: ')
    }
  }

  async last_fee_date_update(
    studentId: number,
    date: string,
    tx: BetterSQLite3Database<Record<string, never>> | null = null
  ): Promise<boolean> {
    try {
      const dbInstance = tx || this.db
      const result = await dbInstance
        .update(students)
        .set({ last_fee_date: date })
        .where(eq(students.id, studentId))
        .run()
      return result.changes > 0
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error while updating last fee date: ' + error.message)
      }
      throw new Error('Error while updating last fee date: ')
    }
  }
  class_update(
    studentId: number,
    classId: number,
    tx: BetterSQLite3Database<Record<string, never>> | null = null
  ): boolean {
    const dbInstance = tx || this.db
    const march31 = set(new Date(), { month: 2, date: 31 })
    const nextDate = addYears(new Date(march31), 1)
    const active = format(new Date(nextDate), DB_DATE_FORMAT)
    const result = dbInstance
      .update(students)
      .set({ class_id: classId, active_until: active })
      .where(eq(students.id, studentId))
      .run()
    return result.changes > 0
  }

  async delete(studentId: number): Promise<boolean> {
    try {
      // check if student exists
      const existing = await this.get(studentId)
      if (!existing) {
        throw new Error('Student not found')
      }
      let deleted = false
      this.db.transaction((tx) => {
        ;(async () => {
          // delete all payment for this student
          tx.delete(payments).where(eq(payments.student_id, studentId)).run()

          // all mis. charges for this student
          tx.delete(mis_charges).where(eq(mis_charges.student_id, studentId)).run()

          // delete all months for this student
          tx.delete(monthly_fee).where(eq(monthly_fee.student_id, studentId)).run()
          // delete all admission for this student
          tx.delete(admission).where(eq(admission.student_id, studentId)).run()
          // delete student
          tx.delete(students).where(eq(students.id, studentId)).run()
          deleted = true
        })()
      })

      return deleted
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while deleting student(s): ' + error.message)
      } else {
        console.error('Unknown error while deleting student(s):', error)
        throw new Error('Unknown error while deleting student(s)')
      }
    }
  }

  async list(): Promise<Student_Record[]> {
    try {
      const query = this.db
        .select({
          id: students.id,
          reg_number: students.reg_number,
          student_name: students.student_name,
          father_name: students.father_name,
          mobile: students.mobile,
          address: students.address,
          admission_date: students.admission_date,
          // CASE WHEN transfer_date IS NULL THEN 'active' ELSE transfer_date END
          transfer_date: students.transfer_date,
          class_name: classes.name,
          current_balance: students.current_balance
        })
        .from(students)
        .innerJoin(classes, eq(students.class_id, classes.id))
        .orderBy(classes.name, students.student_name, students.father_name)

      return query.all() || []
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while fetching students: ' + error.message)
      } else {
        throw new Error('Error while fetching students')
      }
    }
  }

  // student list those monthly fee calculated more than 28 days
  async list_last_fee_month_ago(): Promise<ListLastFeeMonthAgo[]> {
    try {
      const compareDate = format(new Date(), DB_DATE_FORMAT) // e.g., '2025-06-05'

      const list = await this.db
        .select({
          student_id: students.id,
          class_id: students.class_id,
          last_fee_date: students.last_fee_date,
          active_until: students.active_until
        })
        .from(students)
        .where(
          sql`
      ${students.transfer_date} IS NULL AND
      strftime('%Y-%m', ${students.last_fee_date}) < strftime('%Y-%m', ${compareDate})
    `
        )

      return list || []
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error while fetching student last fee month ago: ' + error.message)
      }
      throw new Error('Error while fetching student last fee month ago: ')
    }
  }
  get(id: number): Student_Get | null {
    const query = this.db
      .select({
        id: students.id,
        reg_number: students.reg_number,
        student_name: students.student_name,
        father_name: students.father_name,
        mobile: students.mobile,
        address: students.address,
        admission_date: students.admission_date,
        transfer_date: students.transfer_date,
        is_whatsapp: students.is_whatsapp,
        class_id: students.class_id,
        initial_balance: students.initial_balance,
        current_balance: students.current_balance,
        last_fee_date: students.last_fee_date,
        last_notification_date: students.last_notification_date
      })
      .from(students)
      .where(eq(students.id, id))
    const result = query.get()
    if (!result) {
      return null
    }
    return {
      ...result,
      is_whatsapp: result.is_whatsapp === 1, // Convert 1/0 to boolean
      transfer_date: result.transfer_date || null // Ensure transfer_date is null if not set
    }
  }
  //@ts-ignore there will be any table with this name
  incrementBalance(
    tx: BetterSQLite3Database<Record<string, never>>,
    studentId: number,
    amount: number
  ): void {
    tx.update(students)
      .set({ current_balance: sql`${students.current_balance} + ${amount}` })
      .where(eq(students.id, studentId))
      .run()
  }

  //@ts-ignore there will be any table with this name
  decrementBalance(
    tx: BetterSQLite3Database<Record<string, never>>,
    studentId: number,
    amount: number
  ): void {
    tx.update(students)
      .set({ current_balance: sql`${students.current_balance} - ${amount}` })
      .where(eq(students.id, studentId))
      .run()
  }
}

export default new StudentService()
