// ✅ CreateMonthlyForm.tsx
import { useForm } from 'react-hook-form'
import { Button, ToggleSwitch } from 'flowbite-react'
import FormInput from '../form/FormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { JSX, useEffect, useState } from 'react'
import { CreateStudentMonthlySchema } from '@renderer/types/schema/monthly'
import useMutationHandler from '@renderer/hooks/useMutationHandler'
import MonthlyFeeController from '@renderer/controller/MonthlyFeeController'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKey } from '@renderer/types/constant/queryKey'
import ClassController from '@renderer/controller/ClassController'
import FormSelect from '../form/FormSelect'
import StudentController from '@renderer/controller/StudentController'
import { todayISODate } from '@type/utils/date'

interface Props {
  studentId: number
  successFun: () => void
}

const CreateMonthlyForm = ({ studentId, successFun }: Props): JSX.Element => {
  const { control, handleSubmit, reset } = useForm<CreateStudentMonthlySchema>({
    resolver: zodResolver(CreateStudentMonthlySchema),
    defaultValues: {
      start: todayISODate,
      end: todayISODate
    }
  })

  const [endIncluded, setEndIncluded] = useState<boolean>(false)

  const { data = [] } = useQuery({
    queryKey: queryKey.class,
    queryFn: () => ClassController.list()
  })

  const { data: student, isSuccess } = useQuery({
    queryKey: ['find', 'student'],
    queryFn: () => StudentController.fetch(studentId)
  })

  useEffect(
    function setDefaultValue() {
      if (isSuccess) {
        reset({
          classId: student.class_id,
          monthly: student.monthly
        })
      }
    },
    [isSuccess]
  )

  const queryClient = useQueryClient()
  const monthlyMutation = useMutationHandler({
    mutationFn: (data: CreateStudentMonthlySchema) => MonthlyFeeController.create(studentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey.student_details
      })

      successFun()
    }
  })

  const onSubmit = (data: CreateStudentMonthlySchema): void => {
    monthlyMutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mx-auto p-6 rounded-lg">
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-6 border-b border-slate-700 pb-4">
          Create Student Monthly
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSelect
            name="classId"
            label="Class"
            control={control}
            options={data}
            placeholder="Select Class "
          />

          <FormInput name="start" label="Start" placeholder=" " type="date" control={control} />
          <FormInput name="end" label="End" placeholder="" type="date" control={control} />

          <ToggleSwitch
            name="endIncluded"
            label="Last Month fee include"
            className="mt-8 pl-5"
            checked={endIncluded}
            onChange={(checked) => setEndIncluded(checked)}
            color="green"
            sizing="md"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="md" className="w-60" disabled={monthlyMutation.isPending}>
          {monthlyMutation.isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  )
}

export default CreateMonthlyForm
