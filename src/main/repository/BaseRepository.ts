import db from '@main/db/db'
import ForeignKeyException from '@main/exception.ts/ForeignKeyException'
import InsertException from '@main/exception.ts/InsertException'
import { Transaction } from '@type/interfaces/db'
import { eq, Table } from 'drizzle-orm'

abstract class BaseRepository<TTable extends Table, TEntity = TTable['_']['inferSelect']> {
  protected db: Transaction = db
  protected abstract model: TTable

  protected primaryKey: keyof TEntity = 'id' as keyof TEntity
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
  ): TEntity | undefined {
    return tx
      .update(this.model)
      .set(data)
      .where(eq(this.model[this.primaryKey as number | string], id))
      .returning()
      .get() as TEntity | undefined
  }

  // ✅ Delete by ID
  delete(id: number, tx: Transaction = this.db): TEntity | undefined {
    try {
      return tx
        .delete(this.model)
        .where(eq(this.model[this.primaryKey as number | string], id))
        .returning()
        .get() as TEntity | undefined
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
