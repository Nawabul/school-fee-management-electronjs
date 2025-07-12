import db from '@main/db/db'
import { versions } from '@main/db/schema/version'
import { DB_DATE_FORMAT } from '@main/utils/constant/date'
import { Transaction } from '@type/interfaces/db'
import { format } from 'date-fns'
import { eq } from 'drizzle-orm'

class SessionService {
  db: Transaction
  constructor() {
    this.db = db
  }

  session_end_key: string = 'session_end_month'

  // get session end month
  endMonth(): number | null {
    const have = this.db
      .select({ month: versions.value })
      .from(versions)
      .where(eq(versions.name, this.session_end_key))
      .get()
    return have ? Number(have.month) : null
  }

  isEndMonthHave(): boolean {
    const have = this.endMonth()
    return have !== null
  }

  getEndMonth(): number {
    const endMonth = this.endMonth() || 3

    return endMonth
  }

  createEndMonth(month: string | number, tx: Transaction = this.db): number {
    const result = tx
      .insert(versions)
      .values({
        name: this.session_end_key,
        value: `${month}`
      })
      .returning({ id: versions.id })
      .get()

    return result.id
  }

  updateEndMonth(month: string | number, tx: Transaction = this.db): boolean {
    const result = tx
      .update(versions)
      .set({
        value: `${month}`
      })
      .where(eq(versions.name, this.session_end_key))
      .run()

    return result.changes > 0
  }

  endDate(): string {
    const month = this.getEndMonth()
    const format = this.formatEndDate(month)

    return format
  }

  formatEndDate(month: number): string {
    const currentDate = new Date()
    let currentYear = currentDate.getFullYear()
    const currentMonth = Number(currentDate.getMonth() + 1)

    if (currentMonth > month) {
      currentYear += 1
    }

    const date = format(new Date(currentYear, month, 0), DB_DATE_FORMAT)
    return date
  }
}

export default new SessionService()
