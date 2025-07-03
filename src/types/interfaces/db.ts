import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

type Transaction = BetterSQLite3Database<Record<string, never>>

export type { Transaction }
