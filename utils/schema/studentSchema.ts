import { z } from 'zod'

export const studentFormSchema = z.object({
  class: z.number({ required_error: 'Class is required' }),

  reg_number: z.string().min(1, 'Registration number is required'),

  student_name: z.string().min(1, 'Student name is required'),

  father_name: z.string().min(1, 'Father name is required'),

  mobile: z.string().regex(/^[0-9]{10}$/, 'Mobile must be a 10-digit number'),

  admission_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid admission date'
  }),

  termission_date: z
    .string()
    .nullable()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid termission date'
    }),

  initial_amount: z.number({ required_error: 'Initial amount is required' }),

  current_amount: z.number({ required_error: 'Current amount is required' }),

  last_fee_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid last fee date'
  })
})

export type StudentFormData = z.infer<typeof studentFormSchema>
