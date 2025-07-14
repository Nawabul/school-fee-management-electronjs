import { useForm } from 'react-hook-form'
import { Button } from 'flowbite-react'
import FormInput from '../form/FormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { JSX } from 'react'
import { Mis_Item_Schema } from '@renderer/types/schema/mis_item'
interface Props {
  onSubmit: (data) => void
  defaultValues?: z.infer<typeof Mis_Item_Schema> | Record<string, never>
  isPending?: boolean
}

const MisItemForm = ({
  onSubmit,

  defaultValues = {},
  isPending = false
}: Props): JSX.Element => {
  const { control, handleSubmit } = useForm<z.infer<typeof Mis_Item_Schema>>({
    resolver: zodResolver(Mis_Item_Schema),
    defaultValues
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mx-auto p-6 rounded-lg">
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-6 border-b border-slate-700 pb-4">
          Mis. Item Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Class Name */}
          <FormInput
            name="name"
            label="Name"
            placeholder="e.g. Addmission Charge Class I 2025"
            type="text"
            control={control}
          />

          {/* Class Fee */}
          <FormInput
            name="amount"
            label="Fee"
            placeholder="e.g. 300"
            type="number"
            control={control}
          />
        </div>
      </div>
      {/* Submit */}
      <div className="flex justify-end pt-4">
        <Button type="submit" size="md" className="w-60">
          {isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  )
}

export default MisItemForm
