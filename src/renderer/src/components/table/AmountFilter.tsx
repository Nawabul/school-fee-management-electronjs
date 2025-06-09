import { useDebounce } from '@renderer/hooks/useDebounce'
import { Select, TextInput } from 'flowbite-react'
import { ChevronLeft, ChevronRight, Equal } from 'lucide-react'
import { useState, useEffect, JSX } from 'react'
import { HiX } from 'react-icons/hi' // Icon ke liye

export default function AmountFilter({ column }: { column: any }): JSX.Element {
  const [condition, setCondition] = useState<'gt' | 'lt' | 'eq'>('gt')
  const [value, setValue] = useState('')

  const debouncedValue = useDebounce(value, 500)

  useEffect(() => {
    if (debouncedValue === '') {
      column.setFilterValue(null)
    } else {
      column.setFilterValue({ condition, value: Number(debouncedValue) })
    }
  }, [condition, debouncedValue, column])

  const handleClear = ():void => {
    setValue('')
  }

  const renderIcon = (): JSX.Element => {
    if (condition === 'lt') {
      return <ChevronLeft className="h-5 w-5 text-gray-500" />
    }
    if (condition === 'eq') {
      return <Equal className="h-5 w-5 text-gray-500" />
    }
    return <ChevronRight className="h-5 w-5 text-gray-500" />
  }

  return (
    <div className="flex w-52 items-center">
      <div className="relative w-full">
        <TextInput
          type="number"
          icon={renderIcon}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Amount..."
        />
        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-10 flex items-center rounded-full p-1.5 text-gray-400 hover:text-gray-600"
            aria-label="Clear filter"
          >
            <HiX className="h-4 w-4" />
          </button>
        )}
        <div className="absolute inset-y-0 right-0 flex items-center">
          <Select
            value={condition}
            onChange={(e) => setCondition(e.target.value as 'gt' | 'lt' | 'eq')}
            className="border-none bg-transparent shadow-none appearance-none bg-none focus:ring-0"
          >
            <option value="gt">GT</option>
            <option value="lt">LT</option>
            <option value="eq">EQ</option>
          </Select>
        </div>
      </div>
    </div>
  )
}
