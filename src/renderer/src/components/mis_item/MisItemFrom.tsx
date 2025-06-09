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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto p-6 rounded-lg"
    >
      {/* Class Name */}
      <FormInput
        name="name"
        label="Name"
        placeholder="e.g. Addmission Charge Class I 2025"
        type="text"
        control={control}
      />

      {/* Class Fee */}
      <FormInput name="amount" label="Fee" placeholder="e.g. 300" type="number" control={control} />

      {/* Submit */}
      <div className="md:col-span-2 mt-auto ml-auto">
        <Button type="submit" size="md" className="w-60">
          {isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  )
}

export default MisItemForm
