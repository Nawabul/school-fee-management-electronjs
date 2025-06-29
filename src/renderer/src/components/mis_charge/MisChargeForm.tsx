import { useForm } from 'react-hook-form'
import { Button } from 'flowbite-react'
import FormInput from '../form/FormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { JSX, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
import FormSelect from '../form/FormSelect'
import { useQuery } from '@tanstack/react-query'
import { queryKey } from '@renderer/types/constant/queryKey'
import MisItemController from '@renderer/controller/MisItemController'
import { Mis_Charge_Schema } from '@renderer/types/schema/mis_charge'

interface Props {
  // @ts-ignore schema can ve any thing
  onSubmit: (data: z.infer<typeof Mis_Charge_Schema>) => void
  defaultValues?: z.infer<typeof Mis_Charge_Schema> | Record<string, string | number | boolean>
  isPending?: boolean
}

const MisChargeForm = ({
  onSubmit,

  defaultValues = {},
  isPending = false
}: Props): JSX.Element => {
  const { control, handleSubmit, watch, setValue } = useForm<z.infer<typeof Mis_Charge_Schema>>({
    //@ts-ignore ites working well
    resolver: zodResolver(Mis_Charge_Schema),
    defaultValues
  })

  const { data: itemsList = [] } = useQuery({
    queryKey: queryKey.mis_item,
    queryFn: MisItemController.list
  })

  useEffect(() => {
    const subscribe = watch((value, { name }) => {
      if (name == 'item_id' && value.item_id) {
        const item = itemsList.find((item) => item.id == value.item_id)
        if (item) {
          setValue('amount', item.amount)
        }
      }
    })

    return () => {
      subscribe.unsubscribe()
    }
  }, [watch, itemsList, setValue])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto p-6 rounded-lg"
    >
      {/* mis. items */}
      <FormSelect
        name="item_id"
        control={control}
        label="Item"
        options={itemsList}
        placeholder="Select Item"
      />
      {/* expense date */}
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
        placeholder="e.g. Admission Charge 2025 (optional)"
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

export default MisChargeForm
