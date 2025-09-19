import { useForm } from 'react-hook-form'
import { Button } from 'flowbite-react'
import FormSelect from '../form/FormSelect'
import FormInput from '../form/FormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { JSX, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKey } from '@renderer/types/constant/queryKey'
import ClassController from '@renderer/controller/ClassController'
import { ToggleSwitch } from 'flowbite-react'
import { Loader2 } from 'lucide-react'
import { StudentCreateSchema, StudentUpdateSchema } from '@renderer/types/schema/student'
import { z } from 'zod'
import { GenderEnum } from '@renderer/types/constant/gender'

type GenderId = keyof typeof GenderEnum
type GenderOption = {
  id: GenderId
  name: string
}

interface Props {
  // @ts-ignore schema can ve any thing
  onSubmit: (data) => void
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
    defaultValues: {
      ...defaultValues,
      initial_balance: Math.abs(Number(defaultValues?.initial_balance))
    }
  })

  const [isDue, setIsDue] = useState<boolean>(
    !isUpdate ||
      defaultValues?.initial_balance === undefined ||
      Number(defaultValues.initial_balance) < 0
  )

  const { data: classList = [] } = useQuery({
    queryKey: queryKey.class,
    queryFn: ClassController.list
  })

  const beforeSubmit = (data): void => {
    let amount = Math.abs(data.initial_balance)

    if (isDue && amount != 0) {
      amount = -amount
    }
    onSubmit({
      ...data,
      initial_balance: amount
    })
  }
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

  const genderOption: GenderOption[] = [
    {
      id: 1,
      name: 'Male'
    },
    {
      id: 2,
      name: 'Female'
    },
    {
      id: 3,
      name: 'Other'
    }
  ]

  return (
    // The form now wraps the sections
    <form onSubmit={handleSubmit(beforeSubmit)}>
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
            <FormInput
              name="dob"
              label="Date of birth"
              type={'date'}
              placeholder="e.g. 01-Feb-2020"
              control={control}
            />

            <FormSelect
              name="gender"
              label="Gender"
              control={control}
              options={genderOption}
              placeholder="Select Gender"
            />
          </div>
        </div>

        {/* Student addition details */}
        <div className="space-y-8">
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-6 border-b border-slate-700 pb-4">
              Student Additional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                name="category"
                label="Category"
                placeholder="e.g. Gen, OBC, ST, SC"
                control={control}
              />
              <FormInput
                name="cast"
                label="Cast"
                placeholder="e.g. Gupta, Pathan, Singh, Bamonns"
                control={control}
              />
              <FormInput
                name="religion"
                label="Religion"
                placeholder="e.g. Hindu, Muslim , Sikh , Christian"
                control={control}
              />
            </div>
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
            <div className="flex flex-col">
              <p className="text-xs">
                Amount due or advance before the student’s{' '}
                <span className="text-sm font-bold"> first active session.</span> This will be
                carried forward into their account.
              </p>
              <div className="flex">
                <FormInput
                  placeholder="Enter carried forward amount"
                  name="initial_balance"
                  label="Opening Balance"
                  type="number"
                  control={control}
                />
                <ToggleSwitch
                  name="is_due"
                  label="is Due"
                  className="mt-8 pl-5"
                  checked={isDue}
                  onChange={(checked) => setIsDue(checked)}
                  color="green"
                  sizing="md"
                />
              </div>
            </div>
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
