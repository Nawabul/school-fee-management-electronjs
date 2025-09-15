import { z } from 'zod'

export const CreateStudentMonthlySchema = z.object({
  classId: z.coerce.number({
    required_error: 'Select Class'
  }),
  start: z.string({
    required_error: 'Starting date',
    invalid_type_error: 'Invalid date'
  }),
  end: z.string({
    required_error: 'End date',
    invalid_type_error: 'Invalid date'
  }),
  monthly: z.coerce.number().gte(0)
})

export type CreateStudentMonthlySchema = z.infer<typeof CreateStudentMonthlySchema>

export const UpdateStudentMonthlySchema = z.object({
  amount: z.coerce
    .number({
      required_error: 'Amount is required'
    })
    .gte(0)
})

export type UpdateStudentMonthlySchema = z.infer<typeof UpdateStudentMonthlySchema>
