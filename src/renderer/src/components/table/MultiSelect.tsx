import { JSX, useState, useRef, useMemo, useEffect, RefObject } from 'react'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { TextInput } from 'flowbite-react'

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent): void => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

// 2. Aapka main component
export default function MultiSelectDropdown({
  options,
  label = 'Select Options'
}: {
  options: any[]
  label?: string
}): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  //@ts-ignore
  useOnClickOutside(dropdownRef, () => setIsOpen(false))

  const filteredOptions = useMemo(
    () =>
      options.filter((col) =>
        col.columnDef.header.toString().toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [options, searchTerm]
  )

  const areAllSelected = useMemo(() => options.every((col) => col.getIsVisible()), [options])
  const toggleAll = (): void => {
    options.forEach((col) => col.toggleVisibility(!areAllSelected))
  }

  const getSelectedLabel = (): string => {
    const selectedCount = options.filter((col) => col.getIsVisible()).length
    if (selectedCount === 0) return label
    if (selectedCount === options.length) return 'All Selected'
    return `${selectedCount} selected`
  }

  return (
    <div className="relative w-40" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex w-full cursor-pointer items-center justify-between rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white"
      >
        <span>{getSelectedLabel()}</span>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-md border border-gray-600 bg-gray-800 shadow-lg">
          <div className="sticky top-0 border-b border-gray-700 bg-gray-800 p-1">
            <div className="relative">
              <TextInput
                type="text"
                icon={Search}
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ul>
            <li className="border-b border-gray-700">
              <label className="flex cursor-pointer items-center px-3 py-2 text-sm transition-colors hover:bg-blue-600">
                <input
                  type="checkbox"
                  checked={areAllSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 cursor-pointer rounded bg-gray-600 text-blue-500"
                />
                <span className="ml-2 select-none">Select All</span>
              </label>
            </li>

            {filteredOptions.map((column) => (
              <li key={column.id}>
                <label className="flex cursor-pointer items-center px-3 py-2 text-sm transition-colors hover:bg-blue-600">
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={() => column.toggleVisibility(!column.getIsVisible())}
                    className="h-4 w-4 cursor-pointer rounded bg-gray-600 text-blue-500"
                  />
                  <span className="ml-2 select-none">{column.columnDef.header}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
