import { useForm } from 'react-hook-form'
import { Button } from 'flowbite-react'
import FormSelect from '../form/FormSelect'
import FormInput from '../form/FormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { JSX, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKey } from '@renderer/types/constant/queryKey'
import ClassController from '@renderer/controller/ClassController'
import { ToggleSwitch } from 'flowbite-react'
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
          setValue('monthly', item.amount)
        }
      }
    })

    return () => {
      subscribe.unsubscribe()
    }
  }, [watch, classList, setValue, isUpdate])

  return (
    // The form now wraps the sections
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-8">
        {/* Student Details Section */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-white mb-6 border-b border-slate-700 pb-4">
            Student Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!isUpdate && (
              <FormSelect
                name="class_id"
                label="Class"
                control={control}
                options={classList}
                placeholder="Select Class"
              />
            )}
            <FormInput
              name="reg_number"
              label="Reg. Number"
              placeholder="Registration Number"
              control={control}
            />
            <FormInput
              name="student_name"
              label="Student Name"
              placeholder="e.g. Anjali Verma"
              control={control}
            />
            <FormInput
              name="father_name"
              label="Father Name"
              placeholder="e.g. Rajesh Verma"
              control={control}
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-white mb-6 border-b border-slate-700 pb-4">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              name="mobile"
              label="Mobile No."
              placeholder="e.g. 9876543210"
              control={control}
            />
            <ToggleSwitch
              name="is_whatsapp"
              label="Has WhatsApp"
              className="mt-8 pl-5"
              checked={watch('is_whatsapp')}
              onChange={(checked) => setValue('is_whatsapp', checked)}
              color="green"
              sizing="md"
            />
            <div className="md:col-span-2">
              <FormInput
                name="address"
                label="Address"
                placeholder="e.g. Near Red Fort, New Delhi, India"
                control={control}
              />
            </div>
          </div>
        </div>

        {/* Fee & Admission Details Section */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-white mb-6 border-b border-slate-700 pb-4">
            Fee & Admission Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              placeholder=""
              name="admission_date"
              label="Admission Date"
              type="date"
              control={control}
            />
            {!isUpdate && (
              <FormInput
                placeholder=""
                name="admission_charge"
                label="Admission Charge (₹)"
                type="number"
                control={control}
              />
            )}
            <FormInput
              placeholder=""
              name="monthly"
              label="Monthly Fee (₹)"
              type="number"
              control={control}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="animate-spin h-5 w-5 text-white" />
            ) : isUpdate ? (
              'Update Student'
            ) : (
              'Add Student'
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default StudentForm
