import { JSX } from 'react'

export default function MultiSelectDropdown({
  options,
  label = 'Select Options'
}: {
  options: any
  label?: string
}): JSX.Element {
  return (
    <label className="relative z-10">
      <input type="checkbox" className="hidden peer" />

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

      <div className="absolute dark:bg-gray-800 border rounded-sm border-gray-600 transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto w-full max-h-60 overflow-y-auto overflow-x-hidden mt-[0.5px]">
        <ul>
          {options?.map((column) => {
            return (
              <li key={column.id}>
                <label
                  className={`flex whitespace-nowrap text-sm cursor-pointer px-2 py-1 transition-colors hover:bg-blue-600 [&:has(input:checked)]:bg-gray-600`}
                >
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    className="cursor-pointer"
                    onChange={(value) => column.toggleVisibility(value.target.checked)}
                  />
                  <span className="ml-1 cursor-pointer select-none">{column?.columnDef.header}</span>
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    </label>
  )
}
