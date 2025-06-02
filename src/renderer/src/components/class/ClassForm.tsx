import { useForm } from 'react-hook-form'
import { Button } from 'flowbite-react'
import FormInput from '../form/FormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Class_Schema } from '@renderer/types/schema/class'

interface Props{
  onSubmit:(data:any)=>void
  defaultValues?: z.infer<typeof Class_Schema> | {},
  isPending?: boolean

}



const ClassForm =({
	onSubmit,

	defaultValues = {},
  isPending = false
 }:Props) => {
  const {
    control,
	handleSubmit,
	formState: { errors }
  } = useForm<z.infer<typeof Class_Schema>>({
      resolver: zodResolver(Class_Schema),
	  defaultValues
  })
  console.log(errors)

  return (
	<form
	  onSubmit={handleSubmit(onSubmit)}
	  className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto p-6 rounded-lg"
	>

	  {/* Class Name */}
	  <FormInput
    name='name'
		label="Name"
		placeholder="Class I"
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





	  {/* Submit */}
	  <div className="md:col-span-2 mt-auto ml-auto">
		<Button type="submit" size="md" className="w-60">
		  {isPending ? 'Submitting...' : 'Submit'}
		</Button>
	  </div>
	</form>
  )
}

export default ClassForm
