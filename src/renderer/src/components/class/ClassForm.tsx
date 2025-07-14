import { useForm } from 'react-hook-form'
import { Button } from 'flowbite-react'
import FormInput from '../form/FormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Class_Schema } from '@renderer/types/schema/class'
import { JSX } from 'react'
import { Loader2 } from 'lucide-react'
interface Props {
  onSubmit: (data: any) => void
  defaultValues?: z.infer<typeof Class_Schema> | Record<string, never>
  isPending?: boolean
}

const ClassForm = ({
  onSubmit,

  defaultValues = {},
  isPending = false
}: Props): JSX.Element => {
  const { control, handleSubmit } = useForm<z.infer<typeof Class_Schema>>({
    resolver: zodResolver(Class_Schema),
    defaultValues
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-6 border-b border-slate-700 pb-4">
          Class Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput name="name" label="Name" placeholder="Class I" type="text" control={control} />
          <FormInput
            name="amount"
            label="Fee"
            placeholder="e.g. 300"
            type="number"
            control={control}
          />
          <div className="md:col-span-2">
            <FormInput
              name="admission_charge"
              label="Admission Charge"
              placeholder="e.g. 1250"
              type="number"
              control={control}
            />
          </div>
        </div>
      </div>
      <br />
      {/* Submit Button */}
      <div className="md:col-span-2 mt-auto flex justify-end">
        <Button type="submit" size="md" className="w-50">
          {isPending ? <Loader2 className="animate-spin" /> : 'Submit'}
        </Button>
      </div>
    </form>
  )
}

export default ClassForm
