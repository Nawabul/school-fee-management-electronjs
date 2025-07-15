import StudentDetailHeader from '@renderer/components/StudentDetailHeader'
import useStudentDetails from '@renderer/hooks/useStudentDetails'
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

function StudentFinanceLayer(): React.ReactNode {
  const student = useStudentDetails()
  const { studentDetails } = student

  if (studentDetails == null) {
    return <Outlet />
  }
  const { id } = studentDetails
  const nav = [
    {
      title: 'Payment',
      path: `/finance/payment/${id}`
    },
    {
      title: 'Monthly',
      path: `/finance/monthly_fee/${id}`
    },
    {
      title: 'Promot',
      path: `/finance/admission/${id}`
    },
    {
      title: 'Mis. Charge',
      path: `/finance/mis_charge/${id}`
    }
  ]
  return (
    <div className="p-5">
      {/* Student Details Header */}
      <StudentDetailHeader />
      {/* Tabs Navigation */}
      <div className="mb-6">
        <div className="border-b border-slate-700">
          <nav className="-mb-px flex space-x-6">
            {nav.map((item) => (
              <NavLink
                to={item.path}
                key={item.path}
                className={({ isActive }) => `
                  ${
                    isActive
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-white hover:border-slate-500'
                  } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                {item.title}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      <Outlet />
    </div>
  )
}

export default StudentFinanceLayer
