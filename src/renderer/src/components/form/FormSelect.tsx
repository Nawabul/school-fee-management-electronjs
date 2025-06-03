// components/FormInput.tsx

import { Label, Select } from 'flowbite-react'
import { JSX } from 'react'
import { useController } from 'react-hook-form'

type Option = {
  id: number
  name: string
}

interface Props {
  name: string
  label: string
  placeholder: string
  control: any
  options: Option[]
}

const FormSelect = ({ name, label, placeholder, control, options = [] }: Props): JSX.Element => {
  const {
    field,
    fieldState: { error }
  } = useController({
    name,
    control
  })

  return (
    <div className="space-y-2">
      <Label htmlFor="class">{label}</Label>
      <Select id={name} {...field}>
        <option value="">{placeholder}</option>
        {options.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.name}
          </option>
        ))}
      </Select>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error?.message}</p>}
    </div>
  )
}

export default FormSelect
