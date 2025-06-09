import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { eq, inArray } from 'drizzle-orm'
import db from '../db/db'
import { mis_items } from '../db/schema/mis_item'
import { Mis_Item_Write, Mis_Item_Read, Mis_Item_Record } from '../../types/interfaces/mis_item'

class MisItemService {
  db: BetterSQLite3Database<Record<string, never>> & {
    $client: Database.Database
  }

  constructor() {
    this.db = db
  }

  // Create new MIS Item
  async create(data: Mis_Item_Write): Promise<number> {
    try {
      const result = this.db.insert(mis_items).values(data).returning({ id: mis_items.id }).get()
      if (!result?.id) throw new Error('Failed to create MIS item, no ID returned')
      return result.id
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while creating MIS item: ' + error.message)
      }
      throw new Error('Unknown error while creating MIS item')
    }
  }

  // Update MIS item
  async update(id: number, data: Omit<Mis_Item_Write, 'id'>): Promise<boolean> {
    try {
      const result = this.db.update(mis_items).set(data).where(eq(mis_items.id, id)).run()
      return result.changes > 0
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while updating MIS item: ' + error.message)
      }
      throw new Error('Unknown error while updating MIS item')
    }
  }

  // Delete MIS item(s)
  async delete(id: number | number[]): Promise<boolean> {
    try {
      const result = this.db
        .delete(mis_items)
        .where(inArray(mis_items.id, Array.isArray(id) ? id : [id]))
        .run()
      return result.changes > 0
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while deleting MIS item: ' + error.message)
      }
      throw new Error('Unknown error while deleting MIS item')
    }
  }

  // List MIS item(s)
  async list(): Promise<Mis_Item_Record[]> {
    try {
      const query = this.db
        .select({
          id: mis_items.id,
          name: mis_items.name,
          amount: mis_items.amount
        })
        .from(mis_items)

      return query.all() || []
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while fetching MIS items: ' + error.message)
      }
      throw new Error('Unknown error while fetching MIS items')
    }
  }

  // List MIS item(s)
  async get(id: number): Promise<Mis_Item_Read | null> {
    try {
      const query = this.db
        .select({
          id: mis_items.id,
          name: mis_items.name,
          amount: mis_items.amount
        })
        .from(mis_items)
        .where(eq(mis_items.id, id))
        .get()

      return query || null
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error while fetching MIS items: ' + error.message)
      }
      throw new Error('Unknown error while fetching MIS items')
    }
  }
}

export default new MisItemService()
