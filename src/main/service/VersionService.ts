import Database from 'better-sqlite3'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import db, { rowDb } from '../db/db'
import { versions } from '../db/schema/version'
import { eq } from 'drizzle-orm'
import { DB_VERSION_NAME } from '../utils/constant/config'
import { currentSchemaStatements } from '../utils/constant/dbSchema'

class VersionService {
  db: BetterSQLite3Database<Record<string, never>> & {
    $client: Database.Database
  }
  constructor() {
    this.db = db
  }

  async lastDBVersion(): Promise<string | null> {
    // is version table exist

    const version = this.db
      .select({ value: versions.value })
      .from(versions)
      .where(eq(versions.name, DB_VERSION_NAME))
      .get()

    if (!version) {
      return null
    }
    return version.value
  }

  async executeSchemasForLatest(): Promise<boolean> {
    const migrate = rowDb.transaction(() => {
      for (const stmt of currentSchemaStatements) {
        rowDb.prepare(stmt).run()
      }
    })

    try {
      migrate() // run the transaction
      return true
    } catch (error) {
      if (error instanceof Error) {
        return false
      }
      return false
    }
  }

  async tableExists(tableName: string): Promise<boolean> {
    const result = await rowDb
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?")
      .get(tableName)
    return !!result
  }
}

export default new VersionService()
