import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { students } from './student'

export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(), // store ISO date string
  amount: integer('amount').notNull().default(0),
  used: integer('used').notNull().default(0),
  admission: integer('admission').notNull().default(0),
  monthly: integer('monthly').notNull().default(0),
  mis_charge: integer('mis_charge').notNull().default(0),
  student_id: integer('student_id')
    .notNull()
    .references(() => students.id, { onDelete: 'restrict' }),
  remark: text('remark')
})
