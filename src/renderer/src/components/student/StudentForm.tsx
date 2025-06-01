import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from 'flowbite-react'
import FormSelect from '../form/FormSelect'
import FormInput from '../form/FormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { StudentFormData, studentFormSchema } from '@utils/schema/studentSchema'

interface ClassOption {
  id: number
  name: string
}

interface StudentFormProps {
  classOptions: ClassOption[]
  onSubmit: SubmitHandler<StudentFormData>
}

const StudentForm: React.FC<StudentFormProps> = ({ classOptions, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema)
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto p-6 rounded-lg"
    >
      {/* Class */}
      <FormSelect
        classOptions={classOptions}
        errors={errors}
        {...register('class', { required: true })}
      />

      {/* Registration Number */}
      <FormInput
        errors={errors}
        label="Registration Number"
        placeholder="e.g. REG1001"
        {...register('reg_number', { required: true })}
      />

      {/* Student Name */}
      <FormInput
        errors={errors}
        label="Student Name"
        placeholder="e.g. Nawab"
        {...register('student_name', { required: true })}
      />

      {/* Father Name */}
      <FormInput
        errors={errors}
        label="Father Name"
        placeholder="e.g. Abc"
        {...register('father_name', { required: true })}
      />

      {/* Mobile */}
      <FormInput
        errors={errors}
        label="Mobile Number"
        placeholder="e.g. 9876543210"
        {...register('mobile', { required: true })}
      />

      {/* Admission Date */}
      <FormInput
        errors={errors}
        label="Admission Date"
        placeholder="e.g. 03/01/2023"
        type="date"
        {...register('admission_date', { required: true })}
      />

      {/* Initial Amount */}
      <FormInput
        errors={errors}
        label="Initial Amount"
        type="number"
        placeholder="0"
        {...register('initial_amount', { required: true })}
      />

      {/* Submit */}
      <div className="md:col-span-2 mt-auto ml-auto">
        <Button type="submit" size="md" className="w-60">
          Submit
        </Button>
      </div>
    </form>
  )
}

export default StudentForm
