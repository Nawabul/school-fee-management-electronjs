import db from '@main/db/db'
import ForeignKeyException from '@main/exception.ts/ForeignKeyException'
import InsertException from '@main/exception.ts/InsertException'
import { Transaction } from '@type/interfaces/db'
import { RunResult } from 'better-sqlite3'
import { eq, Table } from 'drizzle-orm'

type UpdateRow = RunResult

abstract class BaseRepository<TTable extends Table, TEntity = TTable['_']['inferSelect']> {
  protected db: Transaction
  protected abstract model: TTable

  protected primaryKey: keyof TEntity = 'id' as keyof TEntity

  constructor(dbInstance?: Transaction) {
    this.db = dbInstance ?? db
  }
  // ✅ Create
  create(data: TTable['_']['inferInsert'], tx: Transaction = this.db): TEntity {
    const result = tx.insert(this.model).values(data).returning().get() as TEntity

    if (!result) {
      throw new InsertException()
    }

    return result
  }

  // ✅ Find by ID (assumes primary key column is `id`)
  findById(id: number, tx: Transaction = this.db): TEntity | undefined {
    return tx
      .select()
      .from(this.model)
      .where(eq(this.model[this.primaryKey as number | string], id))
      .get() as TEntity | undefined
  }

  // ✅ Get all
  findAll(tx: Transaction = this.db): TEntity[] {
    return tx.select().from(this.model).all() as TEntity[]
  }

  // ✅ Update by ID
  update(
    id: number,
    data: Partial<TTable['_']['inferInsert']>,
    tx: Transaction = this.db
  ): UpdateRow {
    return tx
      .update(this.model)
      .set(data)
      .where(eq(this.model[this.primaryKey as number | string], id))
      .run()
  }

  // ✅ Delete by ID
  delete(id: number, tx: Transaction = this.db): UpdateRow {
    try {
      return tx
        .delete(this.model)
        .where(eq(this.model[this.primaryKey as number | string], id))
        .run()
    } catch (error: unknown) {
      // Check for foreign key constraint error
      if (error instanceof Error && error.message.includes('FOREIGN KEY')) {
        throw new ForeignKeyException()
      }

      // Re-throw other errors
      throw error
    }
  }
}

export default BaseRepository
