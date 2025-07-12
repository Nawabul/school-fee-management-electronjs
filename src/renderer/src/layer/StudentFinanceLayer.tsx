import StudentDetailHeader from '@renderer/components/StudentDetailHeader'
import useStudentDetails from '@renderer/hooks/useStudentDetails'
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

function StudentFinanceLayer(): React.ReactNode {
  const student = useStudentDetails()
  const { studentDetails } = student
  console.log(studentDetails)
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
    <div className="flex flex-col gap-4">
      {/* START STUDENT DETAIL HEADER CARD */}
      <StudentDetailHeader />
      {/* END HEADER CARD */}
      <ul className="flex w-1/3 ">
        {nav.map((item) => (
          <li key={item.path} className="flex items-center h-12 border-2 border-gray-500">
            <NavLink
              to={item.path}
              className={({ isActive }) => (`px-4 py-2 ${isActive ? 'bg-blue-700 text-white': ''}`)}
            >
              {item.title}
            </NavLink>
          </li>
        ))}
      </ul>
      <Outlet />
    </div>
  )
}

export default StudentFinanceLayer
