import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const classes = sqliteTable('classes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  amount: integer('amount').notNull().default(0),
  admission_charge: integer('admission_charge').notNull().default(0)
})
