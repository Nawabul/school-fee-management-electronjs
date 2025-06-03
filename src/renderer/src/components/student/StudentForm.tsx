import { useForm } from 'react-hook-form'
import { Button } from 'flowbite-react'
import FormSelect from '../form/FormSelect'
import FormInput from '../form/FormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { JSX } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKey } from '@renderer/types/constant/queryKey'
import ClassController from '@renderer/controller/ClassController'
import FormCheckBox from '../form/FromCheckBox'
import { Loader2 } from 'lucide-react'
import { Student_Schema } from '@renderer/types/schema/student'

interface Props {
  onSubmit: (data: any) => void
  defaultValues?: z.infer<typeof Student_Schema> | {}
  isPending?: boolean
}

const StudentForm = ({
  onSubmit,

  defaultValues = {},
  isPending = false
}: Props): JSX.Element => {
  const { control, handleSubmit } = useForm<z.infer<typeof Student_Schema>>({
    resolver: zodResolver(Student_Schema),
    defaultValues
  })

  const { data: classList = [] } = useQuery({
    queryKey: queryKey.class,
    queryFn: ClassController.list
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto p-6 rounded-lg"
    >
      {/* Class */}
      <FormSelect
        name="class_id"
        control={control}
        label="Class"
        options={classList}
        placeholder="Select Class"
      />

      {/* Registration Number */}
      <FormInput
        name="reg_number"
        label="Reg. Number"
        placeholder="Registration Number"
        type="text"
        control={control}
      />
      {/* Student Name */}
      <FormInput
        name="student_name"
        label="Student Name"
        placeholder=""
        type="text"
        control={control}
      />

      {/* father Name */}
      <FormInput
        name="father_name"
        label="Father Name"
        placeholder=""
        type="text"
        control={control}
      />

      {/* mobile  */}
      <FormInput
        name="mobile"
        label="Mobile No."
        placeholder="e.g. 9876543210"
        type="text"
        control={control}
      />

      {/* is whatsapp */}
      <FormCheckBox name="is_whatsapp" label="Have Whatsapp" control={control} />

      {/* Admission Date */}
      <FormInput
        name="admission_date"
        label="Admission Date"
        placeholder="e.g. 01/01/2025"
        type="date"
        control={control}
      />
      {/* Address */}
      <FormInput
        name="address"
        label="Address"
        placeholder="e.g. Near Red For New Dehli India"
        type="text"
        control={control}
      />

      {/* opening balance */}
      <FormInput
        name="initial_balance"
        label="Opening Balance"
        placeholder="e.g. 0 | 200 | -500"
        type="number"
        control={control}
      />

      {/* Submit */}
      <div className="md:col-span-2 mt-auto ml-auto">
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Button type="submit" size="md" className="w-60">
            Submit
          </Button>
        )}
      </div>
    </form>
  )
}

export default StudentForm
