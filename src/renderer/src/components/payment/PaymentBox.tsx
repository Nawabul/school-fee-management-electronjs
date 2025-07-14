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
  amount: z.coerce.number().min(1, 'Amount must be greater than 0')
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
    <form
      className="space-y-2 justify-end items-end flex flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormInput
        control={control}
        label="Amount"
        name="amount"
        type="number"
        placeholder="e.g. 1000"
      />
      <Button
        className="bg-blue-800 text-white px-2 max-w-md"
        type={mutation.isPending ? 'button' : 'submit'}
      >
        {mutation.isPending ? 'Paying...' : 'Pay Now'}
      </Button>
    </form>
  )
}

export default PaymentBox
