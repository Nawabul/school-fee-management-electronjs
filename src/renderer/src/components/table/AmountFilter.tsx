import { Column, Table } from '@tanstack/react-table'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@renderer/hooks/useDebounce'

interface AmountFilterProps {
  column: Column<any, any>
  table: Table<any>
}

type Condition = 'gt' | 'lt' | 'eq'

const AmountFilter: React.FC<AmountFilterProps> = ({ column }) => {
  const columnFilterValue = column.getFilterValue() as {
    condition: Condition
    value: number
  }

  const [condition, setCondition] = useState<Condition>(columnFilterValue?.condition || 'lt')
  const [value, setValue] = useState<string>(columnFilterValue?.value.toString() || '')

  const debouncedValue = useDebounce(value, 500)

  useEffect(() => {
    if (debouncedValue === '') {
      column.setFilterValue(undefined)
    } else {
      column.setFilterValue({ condition, value: Number(debouncedValue) })
    }
  }, [condition, debouncedValue, column])

  return (
    <div className="flex items-center space-x-2 w-72">
      <div className="flex w-full items-center rounded-md border border-gray-600 bg-gray-700 focus-within:ring-2 focus-within:ring-blue-500">
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value as Condition)}
          className="rounded-l-md border-none bg-gray-800 py-1 text-white text-sm focus:outline-none focus:ring-0"
        >
          <option value="lt">Due than</option>
          <option value="gt">Advance than</option>
          <option value="eq">Equal to</option>
        </select>
        <input
          min={0}
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="₹ 0.00"
          className="w-full rounded-r-md border-none bg-gray-700 py-1 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  )
}

export default AmountFilter
