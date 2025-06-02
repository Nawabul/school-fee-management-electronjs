import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { Class } from '../../types/interfaces/class'
import db from '../db/db'
import Database from 'better-sqlite3'
import { classes } from '../db/schema/class'
import { eq, inArray } from 'drizzle-orm'

class ClassService {
  db: BetterSQLite3Database<Record<string, never>> & {
    $client: Database.Database
  }
  constructor() {
    this.db = db
  }
  async create(data: Omit<Class, 'id'>): Promise<number> {
    try {
      const result = this.db.insert(classes).values(data).returning({ id: classes.id }).get()
      if (!result || !result.id) {
        throw new Error('Failed to create class, no ID returned')
      }
      return result.id
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while creating class: ' + error.message)
      } else {
        console.error('Unknown error while creating class:', error)
        throw new Error('Unknown error while creating class')
      }
    }
  }
  async update(id: number, data: Omit<Class, 'id'>): Promise<boolean> {
    try {
      const result = this.db.update(classes).set(data).where(eq(classes.id, id)).run()

      // .run() returns info about rows affected, not the updated row itself
      return result.changes > 0
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while updating class: ' + error.message)
      } else {
        console.error('Unknown error while updating class:', error)
        throw new Error('Unknown error while updating class')
      }
    }
  }
  async list(id: number | number[] | null = null): Promise<Class[]> {
    try {
      const result = this.db
        .select({
          id: classes.id,
          name: classes.name,
          amount: classes.amount
        })
        .from(classes)
      if (id) {
        console.log('Fetching classes with IDs:', id)
        return result.where(inArray(classes.id, Array.isArray(id) ? id : [id])) || []
      }
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

export default new ClassService()
