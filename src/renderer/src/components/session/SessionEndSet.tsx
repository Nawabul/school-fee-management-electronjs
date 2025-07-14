import SessionController from '@renderer/controller/SessionController'
import { useMutation } from '@tanstack/react-query'
import { Button } from 'flowbite-react'
import React, { useEffect, useState } from 'react'

type props = {
  sumbitFun: () => void
  value?: string | number
  btnStyle?: React.CSSProperties
}
function SessionEndSet({ sumbitFun, value = 3, btnStyle }: props): React.ReactNode {
  const [selectedMonth, setSelectedMonth] = useState<number>(Number(value))
  const months = [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'December' }
  ]

  useEffect(() => {
    if (selectedMonth != value) {
      setSelectedMonth(Number(value))
    }
  }, [value])

  const mutation = useMutation({
    mutationFn: SessionController.set,
    onSuccess: () => {
      sumbitFun()
    }
  })

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    mutation.mutate(selectedMonth)
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-4">
      <div>
        <label
          htmlFor="session_end_month"
          className="block mb-1 text-start font-medium text-gray-900 dark:text-white"
        >
          Select an option
        </label>
        <select
          id="session_end_month"
          className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none text-white focus:outline-none"
          onChange={(e) => {
            const value = e.target.value
            console.log(value)
            setSelectedMonth(Number(value))
          }}
        >
          {months.map((month) => (
            <option value={month.id} key={month.id} selected={month.id == selectedMonth}>
              {month.name}
            </option>
          ))}
        </select>
      </div>
      <Button
        type="submit"
        style={btnStyle}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg"
      >
        Submit
      </Button>
    </form>
  )
}

export default SessionEndSet
