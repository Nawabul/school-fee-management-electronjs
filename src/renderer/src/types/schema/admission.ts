import { z } from 'zod'

export const Admission_Schema = z.object({
  date: z
    .string({
      required_error: 'Admission date is required'
    })
    .min(1, 'Admission date cannot be empty'),
  remark: z
    .string({
      required_error: 'Remark for this record'
    })
    .optional()
    .nullable(),
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a valid number'
    })
    .min(0, 'Amount must be a positive number'),
  monthly: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a valid number'
    })
    .min(0, 'Amount must be a positive number'),
  class_id: z.coerce
    .number({
      required_error: 'Class is required',
      invalid_type_error: 'Class must be a valid'
    })
    .min(1, 'Class must be selected')
})
