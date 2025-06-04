import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const mis_items = sqliteTable('mis_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(), // store ISO date string
  amount: integer('amount').notNull().default(0)
})
