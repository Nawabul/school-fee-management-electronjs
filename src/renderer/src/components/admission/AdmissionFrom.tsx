import { useForm } from 'react-hook-form'
import { Button } from 'flowbite-react'
import FormInput from '../form/FormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { JSX, useEffect } from 'react'
import { Admission_Schema } from '@renderer/types/schema/admission'
import FormSelect from '../form/FormSelect'
import { useQuery } from '@tanstack/react-query'
import { queryKey } from '@renderer/types/constant/queryKey'
import ClassController from '@renderer/controller/ClassController'
interface Props {
  onSubmit: (data) => void

  defaultValues?: z.infer<typeof Admission_Schema> | Record<string, string | number | boolean>
  isPending?: boolean
}

const AdmissionForm = ({
  onSubmit,

  defaultValues = {},
  isPending = false
}: Props): JSX.Element => {
  const { control, handleSubmit, watch, setValue } = useForm<z.infer<typeof Admission_Schema>>({
    resolver: zodResolver(Admission_Schema),
    defaultValues
  })

  const { data: classList = [] } = useQuery({
    queryKey: queryKey.class,
    queryFn: ClassController.list
  })

  useEffect(() => {
    const subscribe = watch((value, { name }) => {
      if (name == 'class_id' && value.class_id) {
        const item = classList.find((item) => item.id == value.class_id)
        if (item) {
          setValue('amount', item.amount)
        }
      }
    })

    return () => {
      subscribe.unsubscribe()
    }
  }, [watch, classList, setValue])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto p-6 rounded-lg"
    >
      {/* Class */}
      <FormSelect
        name="class_id"
        control={control}
        label="Class"
        options={classList}
        placeholder="Select Class"
      />
      {/* Admission Charge */}
      <FormInput name="amount" label="Amount" placeholder="1300" type="number" control={control} />

      {/* Date */}
      <FormInput name="date" label="Date" placeholder="e.g. 300" type="date" control={control} />

      {/* Remark*/}
      <FormInput
        name="remark"
        label="Remark"
        placeholder="Renew 2025 admission"
        type="text"
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

export default AdmissionForm
