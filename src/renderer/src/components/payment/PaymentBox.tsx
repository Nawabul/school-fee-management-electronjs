import { zodResolver } from '@hookform/resolvers/zod'
import PaymentController from '@renderer/controller/PaymentController'
import { DB_DATE_FORMAT } from '@renderer/types/constant/date'
import { useMutation } from '@tanstack/react-query'
import { Payment_Type } from '@type/interfaces/payment'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import z from 'zod'
import FormInput from '../form/FormInput'
import { useEffect } from 'react'
import { Button } from 'flowbite-react'

type props = {
  type: Payment_Type
  amount: number
  remark: string
  studentId: number
  date?: string | null
  successFn?: () => void
}
const schema = z.object({
  amount: z.coerce.number().min(1)
})
function PaymentBox({
  type,
  amount,
  remark,
  studentId,
  date = null,
  successFn = () => {}
}: props): React.ReactNode {
  if (date == null) {
    date = format(new Date(), DB_DATE_FORMAT)
  }
  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(schema)
  })

  const mutation = useMutation({
    mutationKey: ['payment'],
    mutationFn: (data) => PaymentController.create(studentId, data, type),
    onSuccess: () => {
      successFn()
    }
  })
  useEffect(() => {
    setValue('amount', amount)
  }, [amount, setValue])

  const onSubmit = (data: z.infer<typeof schema>): void => {
    const input = {
      date,
      remark,
      amount: data.amount
    }

    //@ts-ignore data structure is ok
    mutation.mutate(input)
  }
  return (
    <form className="flex gap-2 w-full justify-end items-end" onSubmit={handleSubmit(onSubmit)}>
      <Button
        className="bg-blue-800 text-white text-xl rounded-xl px-2 py-0 h-10"
        type={mutation.isPending ? 'button' : 'submit'}

      >
        {mutation.isPending ? 'Paying...' : 'Pay'}
      </Button>
      <FormInput
        control={control}
        label="Amount"
        name="amount"
        type="number"
        placeholder="e.g. 1000"
      />
    </form>
  )
}

export default PaymentBox
