import { useForm } from 'react-hook-form'
import { Button } from 'flowbite-react'
import FormSelect from '../form/FormSelect'
import FormInput from '../form/FormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { JSX, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKey } from '@renderer/types/constant/queryKey'
import ClassController from '@renderer/controller/ClassController'
import FormCheckBox from '../form/FromCheckBox'
import { Loader2 } from 'lucide-react'
import { StudentCreateSchema, StudentUpdateSchema } from '@renderer/types/schema/student'
import { z } from 'zod'

interface Props {
  // @ts-ignore schema can ve any thing
  onSubmit: (data: any) => void
  defaultValues?:
    | z.infer<typeof StudentCreateSchema | typeof StudentUpdateSchema>
    | Record<string, string | number | boolean>
  isPending?: boolean
  isUpdate?: boolean
}

const StudentForm = ({
  onSubmit,
  isUpdate = false,

  defaultValues = {},
  isPending = false
}: Props): JSX.Element => {
  const { control, handleSubmit, watch, setValue } = useForm<
    z.infer<typeof StudentCreateSchema | typeof StudentUpdateSchema>
  >({
    //@ts-ignore ites working well
    resolver: zodResolver(isUpdate ? StudentUpdateSchema : StudentCreateSchema),
    defaultValues
  })

  const { data: classList = [] } = useQuery({
    queryKey: queryKey.class,
    queryFn: ClassController.list
  })

  useEffect(() => {
    if (isUpdate) return

    const subscribe = watch((value, { name }) => {
      if (name == 'class_id' && 'class_id' in value && value.class_id) {
        const item = classList.find((item) => item.id == value.class_id)
        if (item) {
          setValue('admission_charge', item.admission_charge)
        }
      }
    })

    return () => {
      subscribe.unsubscribe()
    }
  }, [watch, classList, setValue, isUpdate])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto p-6 rounded-lg"
    >
      {/* Class */}
      {!isUpdate && (
        <FormSelect
          name="class_id"
          control={control}
          label="Class"
          options={classList}
          placeholder="Select Class"
        />
      )}

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

      {/* admission charge */}
      {!isUpdate && (
        <FormInput
          name="admission_charge"
          label="Admission Charge"
          placeholder="e.g. 0 | 200 | -500"
          type="number"
          control={control}
        />
      )}

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
