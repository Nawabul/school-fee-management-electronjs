// components/FormInput.tsx

import { ErrorMessage } from '@hookform/error-message'
import { Label, TextInput } from 'flowbite-react'
import { JSX } from 'react'
import { FieldErrors } from 'react-hook-form'

interface Props {
  name: string
  label: string
  placeholder: string
  errors: FieldErrors
  type?: string
}

const FormInput = ({ type = 'text', label, name, errors, ...props }: Props): JSX.Element => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <TextInput type={type} id={name} {...props} placeholder={props.placeholder} />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">{message}</p>
        )}
      />
    </div>
  )
}

export default FormInput
