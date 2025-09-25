import { JSX, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export default function FilterClass({
  column,
  options
}: {
  column: any
  options?: any
}): JSX.Element {
  const [open, setOpen] = useState(false)
  const selectedValues = column.getFilterValue() ?? []

  const handleSelect = (value: string): void => {
    let newSelected
    if (selectedValues.includes(value)) {
      newSelected = selectedValues.filter((v) => v !== value)
    } else {
      newSelected = [...selectedValues, value]
    }
    column.setFilterValue(newSelected.length > 0 ? newSelected : undefined)
  }

  const getButtonLabel = () => {
    if (selectedValues.length === 1) {
      return selectedValues[0]
    } else if (selectedValues.length > 1) {
      return `${selectedValues.length} Classes`
    }
    return 'Filter by Class'
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-600 hover:bg-gray-700"
        onClick={() => setOpen(!open)}
      >
        {getButtonLabel()}
        <ChevronDown
          className={`-mr-1 h-5 w-5 text-gray-400 transform transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <div
              className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                column.setFilterValue(undefined)
                setOpen(false)
              }}
            >
              All Classes Is here
            </div>
            {options?.map((value: string) => (
              <div
                key={value}
                className="flex items-center justify-between px-4 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSelect(value)}
              >
                <span> {value}</span>
                {selectedValues.includes(value) && <Check size={16} className="text-blue-400" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
