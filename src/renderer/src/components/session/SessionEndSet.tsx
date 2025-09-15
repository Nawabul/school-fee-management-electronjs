import SessionController from '@renderer/controller/SessionController'
import useModel from '@renderer/hooks/useModel'
import useMutationHandler from '@renderer/hooks/useMutationHandler'
import { queryKey } from '@renderer/types/constant/queryKey'
import { useQuery } from '@tanstack/react-query'
import { Button } from 'flowbite-react'
import React, { useEffect, useState } from 'react'

type props = {
  sumbitFun: () => void
  value?: string | number
  isUpdate?: boolean
  btnStyle?: React.CSSProperties
}
function SessionEndSet({ sumbitFun, btnStyle, isUpdate = false }: props): React.ReactNode {
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
  const { data = 3, isSuccess } = useQuery({
    queryKey: queryKey.session_end_month,
    queryFn: SessionController.getEndMonth
  })
  const [selectedMonth, setSelectedMonth] = useState<number>(Number(data))
  useEffect(() => {
    if (isSuccess) {
      setSelectedMonth(Number(data))
    }
  }, [isSuccess, data])
  const { openModel } = useModel()
  const mutation = useMutationHandler({
    mutationFn: (month: number) => SessionController.set(month),
    onSuccess: () => {
      sumbitFun()
    }
  })

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    if (isUpdate) {
      openModel({
        title: 'Confirm Session End Change',
        component: (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>You are about to change the session end month.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Extend session:</strong>
                For example, <code>6/2025 → 7/2025</code> → all students’ session end date will
                update to <code>7/2025</code>.
              </li>
              <li>
                <strong>Shorten session:</strong>
                For example, <code>6/2025 → 3/2025</code> → all students’ session end date will move
                to <code>3/2026</code>.
              </li>
            </ul>
            <p>Do you want to apply this change?</p>
          </div>
        ),
        submitTitle: 'Confirm Change',
        closeTitle: 'Cancel',
        submitFun: () => mutation.mutate(selectedMonth)
      })
    } else {
      mutation.mutate(selectedMonth)
    }
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
