import { z } from 'zod'

export const StudentSchema = {
  reg_number: z
    .string({
      required_error: 'Registration number is required'
    })
    .min(1, 'Registration number cannot be empty')
    .regex(/^[a-zA-Z0-9/]+$/, {
      message: 'Only alphabets, numbers, and slashes are allowed'
    }),

  student_name: z
    .string({
      required_error: 'Student name is required'
    })
    .min(1, 'Student name cannot be empty')
    .regex(/^[a-zA-Z]+$/, {
      message: 'Only alphabets are allowed'
    }),

  father_name: z
    .string({
      required_error: 'Father’s name is required'
    })
    .min(1, 'Father’s name cannot be empty'),

  mobile: z
    .string({
      required_error: 'Mobile number is required'
    })
    .min(1, 'Mobile number cannot be empty')
    .regex(/^\d{10}$/, {
      message: 'Must be exactly 10 digits'
    }),

  is_whatsapp: z
    .preprocess(
      (val) => !!val,
      z.boolean({
        required_error: 'Please specify if this number is on WhatsApp'
      })
    )
    .default(false),

  address: z
    .string({
      required_error: 'Address is required'
    })
    .min(1, 'Address cannot be empty'),

  admission_date: z
    .string({
      required_error: 'Admission date is required'
    })
    .min(1, 'Admission date cannot be empty')
}

export const StudentCreateSchema = z.object({
  ...StudentSchema,
  class_id: z.coerce
    .number({
      required_error: 'Class is required',
      invalid_type_error: 'Class  must be a Selected'
    })
    .min(1, 'Class must be at Selected'),

  admission_charge: z.coerce
    .number({
      required_error: 'Admission Charge is required',
      invalid_type_error: 'Admission Charge must be a number'
    })
    .optional()
    .default(0)
})

export const StudentUpdateSchema = z.object(StudentSchema)
