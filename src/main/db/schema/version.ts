import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const versions = sqliteTable('versions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  value: text('value').notNull()
})
