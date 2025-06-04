import { useForm } from 'react-hook-form'
import { Button } from 'flowbite-react'
import FormInput from '../form/FormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { JSX } from 'react'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
import { Payment_Schema } from '@renderer/types/schema/payment'

interface Props {
  // @ts-ignore schema can ve any thing
  onSubmit: (data: z.infer<typeof Payment_Schema>) => void
  defaultValues?: z.infer<typeof Payment_Schema> | Record<string, never>
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
    defaultValues
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto p-6 rounded-lg"
    >
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

export default PaymentForm
