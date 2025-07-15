// components/FormInput.tsx

import { Label, TextInput } from 'flowbite-react'
import { ComponentProps, JSX } from 'react'
import { useController } from 'react-hook-form'

type TextInputType = ComponentProps<typeof TextInput>['type']

interface Props extends ComponentProps<typeof TextInput> {
  name: string
  label?: string
  placeholder: string
  type?: TextInputType
  control: any
  className?: string
}

const FormInput = ({ type = 'text', label, name, control, ...props }: Props): JSX.Element => {
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
      <TextInput type={type} id={name} {...field} {...props} placeholder={props.placeholder} />
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error?.message}</p>}
    </div>
  )
}

export default FormInput
