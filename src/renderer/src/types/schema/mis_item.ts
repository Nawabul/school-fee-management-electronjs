import { z } from 'zod'

export const Mis_Item_Schema = z.object({
  name: z
    .string({
      required_error: 'Mis. Item name is required'
    })
    .min(1, 'Mis. Item must be at least 1 character long'),
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a valid number'
    })
    .min(0, 'Amount must be a positive number')
})
