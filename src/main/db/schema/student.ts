import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { classes } from './class'
import { sql } from 'drizzle-orm'

export const students = sqliteTable('students', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  reg_number: text('reg_number').notNull().unique(),
  student_name: text('student_name').notNull(),
  father_name: text('father_name').notNull(),
  mobile: text('mobile').notNull(),
  is_whatsapp: integer('is_whatsapp').notNull().default(0),
  admission_date: text('admission_date').notNull(), // store ISO date string
  transfer_date: text('transfer_date'),
  address: text('address').notNull(),
  initial_balance: integer('initial_balance').notNull().default(0),
  current_balance: integer('current_balance').notNull().default(0),
  monthly: integer('monthly').notNull().default(0),
  class_id: integer('class_id')
    .notNull()
    .references(() => classes.id, { onDelete: 'restrict' }),
  last_fee_date: text('last_fee_date').notNull(),
  active_until: text('active_until'),
  last_notification_date: text('last_notification_date')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
})
