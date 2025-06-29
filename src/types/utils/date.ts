import { DB_DATE_FORMAT } from '../../main/utils/constant/date.js'
import { format } from 'date-fns'

export const todayISODate = format(new Date(), DB_DATE_FORMAT)
