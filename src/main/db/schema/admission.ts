import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { students } from './student'
import { classes } from './class'

export const admission = sqliteTable('admission', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  student_id: integer('student_id')
    .notNull()
    .references(() => students.id, { onDelete: 'restrict' }),
  amount: integer('amount').notNull().default(0),
  paid: integer('paid').notNull().default(0),
  date: text('date').notNull(), // store ISO date string
  class_id: integer('class_id')
    .notNull()
    .references(() => classes.id, { onDelete: 'restrict' }),
  remark: text('remark')
})
