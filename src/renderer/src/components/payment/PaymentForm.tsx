import { useForm } from 'react-hook-form'
import { Button } from 'flowbite-react'
import FormInput from '../form/FormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { JSX } from 'react'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
import { Payment_Schema } from '@renderer/types/schema/payment'
import { todayISODate } from '@renderer/types/constant/date'

interface Props {
  // @ts-ignore schema can ve any thing
  onSubmit: (data: z.infer<typeof Payment_Schema>) => void
  defaultValues?: z.infer<typeof Payment_Schema> | Record<string, string | number | boolean>
  isPending?: boolean
}

const PaymentForm = ({
  onSubmit,

  defaultValues = {},
  isPending = false
}: Props): JSX.Element => {
  const { control, handleSubmit } = useForm<z.infer<typeof Payment_Schema>>({
    //@ts-ignore ites working well
    resolver: zodResolver(Payment_Schema),
    defaultValues: defaultValues || { date: todayISODate }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* payment date */}
          <FormInput
            name="date"
            label="Date"
            placeholder="e.g. 01/01/2025"
            type="date"
            control={control}
          />

          {/* amount */}
          <FormInput
            name="amount"
            label="Amount"
            placeholder="e.g. 900"
            type="number"
            control={control}
          />

          {/* remark */}
          <FormInput
            name="remark"
            label="Remark"
            placeholder="e.g. Monthly Fee January 2025 (optional)"
            type="text"
            control={control}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex pt-4 ml-auto justify-end items-center">
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

export default PaymentForm
