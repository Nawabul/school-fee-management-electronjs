import { Select, TextInput } from 'flowbite-react'
import { useState, useEffect, JSX } from 'react'

export default function AmountFilter({ column }: { column: any }): JSX.Element {
  const [condition, setCondition] = useState<'gt' | 'lt' | 'eq'>('gt')
  const [value, setValue] = useState('')

  useEffect(() => {
    if (value === '') {
      column.setFilterValue(null)
    } else {
      column.setFilterValue({ condition, value: Number(value) })
    }
  }, [condition, value, column])

  return (
    <div className="flex gap-0 bg-gray-700 rounded-xl">
      <Select
        value={condition}
        className="rounded-r-none"
        onChange={(e) => setCondition(e.target.value as 'gt' | 'lt' | 'eq')}
      >
        <option value="gt">Greater Than</option>
        <option value="lt">Less Than</option>
        <option value="eq">Equal To</option>
      </Select>
      <TextInput
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter amount"
      />
    </div>
  )
}
