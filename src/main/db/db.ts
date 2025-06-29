import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { join } from 'path'
import { app } from 'electron'

const db_name = process.env.DB_FILE_NAME || 'school.db'
const user_path = app.getPath('userData')
const path = join(user_path, db_name)// path to the database file
console.log(`Database path: ${path}`)
const sqlite = new Database(path)
const db = drizzle({ client: sqlite })

// @ts-ignore row db exported
const rowDb = sqlite
export default db

export { rowDb }
