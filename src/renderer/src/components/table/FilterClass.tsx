import { JSX, useState } from 'react'

export default function FilterClass({
  column,
  options
}: {
  column: any
  options?: any
}): JSX.Element {
  const label = 'Class'
  const selectedValues = column.getFilterValue() ?? []

  const [open, setOpen] = useState(false)

  const handleSelect = (value: string): void => {
    let newSelected
    if (selectedValues.includes(value)) {
      newSelected = selectedValues.filter((v) => v !== value)
    } else {
      newSelected = [...selectedValues, value]
    }
    column.setFilterValue(newSelected.length > 0 ? newSelected : undefined)
  }

  return (
    <label className="relative z-10">
      <input type="checkbox" className="hidden peer" onChange={() => setOpen(!open)} />
      <div className="cursor-pointer bg-gray-700 inline-flex items-center justify-between border border-gray-600 rounded-md px-2 py-2 w-full">
        <span>{label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 ml-2 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div className="absolute dark:bg-gray-800 border rounded-sm border-gray-600 transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto w-full max-h-60 overflow-y-auto mt-[0.5px]">
        <ul>
          {options?.map((value) => (
            <li key={value}>
              <label className="flex whitespace-nowrap cursor-pointer px-2 py-1 transition-colors hover:bg-blue-600 [&:has(input:checked)]:bg-gray-600">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(value)}
                  className="cursor-pointer"
                  onChange={() => handleSelect(value)}
                />
                <span className="ml-1 cursor-pointer select-none">{value}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </label>
  )
}
