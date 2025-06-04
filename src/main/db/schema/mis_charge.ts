import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { students } from './student'
import { mis_items } from './mis_item'

export const mis_charges = sqliteTable('mis_charges', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  student_id: integer('student_id')
    .notNull()
    .references(() => students.id, { onDelete: 'restrict' }),
  amount: integer('amount').notNull().default(0),
  date: text('date').notNull(), // store ISO date string
  item_id: integer('item_id')
    .notNull()
    .references(() => mis_items.id, { onDelete: 'restrict' }),
  remark: text('remark')
})
