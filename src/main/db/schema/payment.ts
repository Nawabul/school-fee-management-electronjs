import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { students } from './student'

export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(), // store ISO date string
  amount: integer('amount').notNull().default(0),
  student_id: integer('student_id')
    .notNull()
    .references(() => students.id, { onDelete: 'restrict' }),
  remark: text('remark')
})
