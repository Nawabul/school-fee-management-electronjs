import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { students } from './student'
import { classes } from './class'

export const monthly_fee = sqliteTable('monthly_fee', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(), // store ISO date string
  amount: integer('amount').notNull().default(0),
  paid: integer('paid').notNull().default(0),
  student_id: integer('student_id')
    .notNull()
    .references(() => students.id, { onDelete: 'restrict' }),
  class_id: integer('class_id')
    .notNull()
    .references(() => classes.id, { onDelete: 'restrict' })
})
