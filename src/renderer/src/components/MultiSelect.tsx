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

      <div className="cursor-pointer after:content-['▼'] after:text-xs after:ml-1 after:inline-flex after:items-center peer-checked:after:-rotate-180 after:transition-transform inline-flex border border-gray-600 rounded-md px-5 py-2">
        {label}&nbsp;&nbsp;
      </div>

      <div className="absolute dark:bg-gray-800 border rounded-sm border-gray-600 transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto w-full max-h-60 overflow-y-scroll mt-[0.5px]">
        <ul>
          {options?.map((column) => {
            return (
              <li key={column.id}>
                <label
                  className={`flex whitespace-nowrap cursor-pointer px-2 py-1 transition-colors hover:bg-blue-600 [&:has(input:checked)]:bg-gray-600`}
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
