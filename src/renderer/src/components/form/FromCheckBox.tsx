// components/FormInput.tsx

import { Label, TextInput } from 'flowbite-react'
import { JSX } from 'react'
import { useController } from 'react-hook-form'

interface Props {
  name: string
  label: string
  control: any
}

const FormCheckBox = ({ label, name, control, ...props }: Props): JSX.Element => {
  const {
    field,
    fieldState: { error }
  } = useController({
    name,
    control
  })
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <TextInput type={'checkbox'} id={name} {...field} {...props} checked={field.value} />
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error?.message}</p>}
    </div>
  )
}

export default FormCheckBox
