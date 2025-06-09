import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'

const sqlite = new Database(process.env.DB_FILE_NAME || 'school.db')
const db = drizzle({ client: sqlite })

// @ts-ignore row db exported
const rowDb = sqlite
export default db

export { rowDb }
