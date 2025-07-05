import { format } from 'date-fns'

const date_format = 'dd/MM/yyyy'
const DB_DATE_FORMAT = 'yyyy-MM-dd'
const todayISODate = format(new Date(), DB_DATE_FORMAT)

export { date_format, todayISODate, DB_DATE_FORMAT }
