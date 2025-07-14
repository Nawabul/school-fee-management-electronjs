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
          setValue('amount', item.admission_charge)
          setValue('monthly', item.amount)
        }
      }
    })

    return () => {
      subscribe.unsubscribe()
    }
  }, [watch, classList, setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Class */}
          <FormSelect
            name="class_id"
            control={control}
            label="Class"
            options={classList}
            placeholder="Select Class"
          />
          {/* Admission Charge */}
          <FormInput
            name="amount"
            label="Admission Charge"
            placeholder="1300"
            type="number"
            control={control}
          />
          {/* Monthly  Charge */}
          <FormInput
            name="monthly"
            label="Monthly Fee"
            placeholder="700"
            type="number"
            control={control}
          />

          {/* Date */}
          <FormInput
            name="date"
            label="Date"
            placeholder="e.g. 300"
            type="date"
            control={control}
          />

          {/* Remark*/}
          <FormInput
            name="remark"
            label="Remark"
            placeholder="Renew 2025 admission"
            type="text"
            control={control}
          />
        </div>
      </div>
      {/* Submit */}
      <div className="flex pt-4 ml-auto justify-end items-center">
        <Button type="submit" size="md" className="w-60">
          {isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  )
}

export default AdmissionForm
