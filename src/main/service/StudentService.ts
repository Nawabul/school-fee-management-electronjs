import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { Student_Get, Student_Record, Student_Write } from '../../types/interfaces/student'
import db from '../db/db'
import Database from 'better-sqlite3'

import { eq, inArray, sql } from 'drizzle-orm'
import { students } from '../db/schema/student'
import { InferInsertModel } from 'drizzle-orm'
import { classes } from '../db/schema/class'

type StudentUpdateInput = Partial<Student_Write> & {
  current_balance?: number
}

class StudentService {
  db: BetterSQLite3Database<Record<string, never>> & {
    $client: Database.Database
  }

  constructor() {
    this.db = db
  }
  async create(data: Student_Write): Promise<number> {
    try {
      const now = new Date().toISOString()
      type InsertRow = InferInsertModel<typeof students>
      const row: InsertRow = {
        reg_number: data.reg_number,
        student_name: data.student_name,
        father_name: data.father_name,
        mobile: data.mobile,
        is_whatsapp: data.is_whatsapp ? 1 : 0,
        admission_date: data.admission_date,
        address: data.address,
        class_id: data.class_id,
        initial_balance: data.initial_balance ?? 0,
        current_balance: data.initial_balance ?? 0,
        last_fee_date: new Date(data.admission_date).toISOString(),
        last_notification_date: now
      }

      const result = this.db.insert(students).values(row).returning({ id: students.id }).get()

      if (!result?.id) {
        throw new Error('Failed to create student, no ID returned')
      }

      return result.id
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while creating student: ' + error.message)
      } else {
        throw new Error('Unknown error while creating student')
      }
    }
  }
  async update(id: number, data: StudentUpdateInput): Promise<boolean> {
    try {
      const existing = await this.get(id)

      if (!existing) {
        throw new Error('Student not found')
      }

      if (data.initial_balance !== undefined) {
        const diff = data.initial_balance - existing.initial_balance
        data.current_balance = existing.current_balance + diff
      }

      // Prepare the object to update in DB, converting boolean to 1/0
      const dbData = {
        ...data,
        is_whatsapp: data.is_whatsapp !== undefined ? (data.is_whatsapp ? 1 : 0) : undefined
      }

      // Remove undefined properties from dbData (optional but cleaner)
      Object.keys(dbData).forEach((key) => dbData[key] === undefined && delete dbData[key])

      const result = this.db.update(students).set(dbData).where(eq(students.id, id)).run()

      return result.changes > 0
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while updating student: ' + error.message)
      } else {
        throw new Error('Unknown error while updating student')
      }
    }
  }

  async delete(id: number | number[]): Promise<boolean> {
    try {
      const ids = Array.isArray(id) ? id : [id]

      const result = this.db.delete(students).where(inArray(students.id, ids)).run()

      return result.changes > 0
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

      return query.all() || []
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while fetching students: ' + error.message)
      } else {
        throw new Error('Error while fetching students')
      }
    }
  }

  async get(id: number): Promise<Student_Get | null> {
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
      const result = await query.get()
      if (!result) {
        return null
      }
      return {
        ...result,
        is_whatsapp: result.is_whatsapp === 1, // Convert 1/0 to boolean
        transfer_date: result.transfer_date || null // Ensure transfer_date is null if not set
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while fetching students: ' + error.message)
      } else {
        throw new Error('Error while fetching students')
      }
    }
  }
}

export default new StudentService()
