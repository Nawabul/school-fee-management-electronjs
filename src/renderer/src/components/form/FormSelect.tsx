// components/FormInput.tsx

import { ErrorMessage } from '@hookform/error-message'
import { Label, Select } from 'flowbite-react'
import { JSX } from 'react'
import { FieldErrors } from 'react-hook-form'

interface ClassOption {
  id: number
  name: string
}

interface Props {
  name: string
  errors: FieldErrors
  classOptions: ClassOption[]
}

const FormSelect = ({ name, errors, classOptions, ...props }: Props): JSX.Element => {
  return (
    <div className="space-y-2">
      <Label htmlFor="class">Class</Label>
      <Select id="class" {...props}>
        <option value="">Select Class</option>
        {classOptions.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.name}
          </option>
        ))}
      </Select>
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

export default FormSelect
