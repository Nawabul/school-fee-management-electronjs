import { z } from 'zod'

export const Payment_Schema = z.object({
  date: z
    .string({
      required_error: 'Payment date is required'
    })
    .min(1, 'Payment date cannot be empty'),
  remark: z
    .string({
      required_error: 'Payment remark for this payment'
    })
    .optional()
    .nullable(),
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a valid number'
    })
    .min(0, 'Amount must be a positive number')
})
