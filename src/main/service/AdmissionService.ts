import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import db from '@main/db/db'
import Database from 'better-sqlite3'
import { admission } from '@main/db/schema/admission'
import { desc, eq, inArray } from 'drizzle-orm'
import { Admission_Record, Admission_Write } from '@type/interfaces/admission'
import { classes } from '@main/db/schema/class'

class AdmissionService {
  db: BetterSQLite3Database<Record<string, never>> & {
    $client: Database.Database
  }
  constructor() {
    this.db = db
  }
  async create(
    data: Admission_Write,
    tx: BetterSQLite3Database<Record<string, never>> = this.db
  ): Promise<number> {
    try {
      const result = tx.insert(admission).values(data).returning({ id: admission.id }).get()
      if (!result || !result.id) {
        throw new Error('Failed to create admission, no ID returned')
      }
      return result.id
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while creating admission: ' + error.message)
      } else {
        console.error('Unknown error while creating adminssion:', error)
        throw new Error('Unknown error while creating adminssion')
      }
    }
  }
  async update(id: number, data: Admission_Write): Promise<boolean> {
    try {
      const result = this.db.update(admission).set(data).where(eq(admission.id, id)).run()

      // .run() returns info about rows affected, not the updated row itself
      return result.changes > 0
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while updating admission: ' + error.message)
      } else {
        console.error('Unknown error while updating admission:', error)
        throw new Error('Unknown error while updating admission')
      }
    }
  }
  async delete(id: number | number[]): Promise<boolean> {
    try {
      const result = this.db
        .delete(admission)
        .where(inArray(admission.id, Array.isArray(id) ? id : [id]))
        .run()

      // .run() returns info about rows affected, not the updated row itself
      return result.changes > 0
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while deleting admission: ' + error.message)
      } else {
        console.error('Unknown error while deleting admission:', error)
        throw new Error('Unknown error while deleting admission')
      }
    }
  }
  async list(studentId: number): Promise<Admission_Record[]> {
    try {
      const result = this.db
        .select({
          id: admission.id,
          date: admission.date,
          amount: admission.amount,
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
}

export default new AdmissionService()
