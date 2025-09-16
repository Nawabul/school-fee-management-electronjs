// ✅ CreateMonthlyForm.tsx
import { useForm } from 'react-hook-form'
import { Button } from 'flowbite-react'
import FormInput from '../form/FormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { JSX, useEffect } from 'react'
import { UpdateStudentMonthlySchema } from '@renderer/types/schema/monthly'
import useMutationHandler from '@renderer/hooks/useMutationHandler'
import MonthlyFeeController from '@renderer/controller/MonthlyFeeController'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKey } from '@renderer/types/constant/queryKey'

interface Props {
  monthlyId: number
  successFun: () => void
}

const UpdateMonthlyForm = ({ monthlyId, successFun }: Props): JSX.Element => {
  const { control, handleSubmit, reset } = useForm<UpdateStudentMonthlySchema>({
    resolver: zodResolver(UpdateStudentMonthlySchema)
  })

  const { data, isSuccess } = useQuery({
    queryKey: ['find', 'monthly'],
    queryFn: () => MonthlyFeeController.fetch(monthlyId),
    refetchOnMount: 'always'
  })

  useEffect(
    function setDefaultValue() {
      if (isSuccess) {
        reset({
          amount: data.amount
        })
      }
    },
    [isSuccess, data, reset]
  )

  const queryClient = useQueryClient()
  const monthlyMutation = useMutationHandler({
    mutationFn: (data: { amount: number }) => MonthlyFeeController.update(monthlyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey.student_details
      })
      queryClient.invalidateQueries({
        queryKey: queryKey.monthly_fee
      })

      successFun()
    }
  })

  const onSubmit = (data: UpdateStudentMonthlySchema): void => {
    monthlyMutation.mutate({ ...data })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mx-auto p-6 rounded-lg">
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-6 border-b border-slate-700 pb-4">
          Update Student Monthly
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput name="amount" label="Amount" placeholder=" " type="number" control={control} />
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

export default UpdateMonthlyForm
