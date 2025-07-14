import {
  BookOpen,
  Hash,
  Phone,
  MapPin,
  UserCircleIcon,
  PhoneIcon,
  LocationEditIcon
} from 'lucide-react'
import { JSX } from 'react'
import useStudentDetails from '@renderer/hooks/useStudentDetails'
const StudentDetailHeader = (): JSX.Element => {
  const { studentDetails: studentDetail } = useStudentDetails()

  if (!studentDetail) {
    return <div>Loading student details...</div>
  }
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg mb-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-5">
          <UserCircleIcon className="w-20 h-20 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">{studentDetail?.student_name}</h1>
            <p className="text-slate-400">s/o {studentDetail?.father_name}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <b>Class:</b> {studentDetail?.class_name}
              </span>
              <span className="flex items-center gap-1.5">
                <b>Reg. No:</b> {studentDetail?.reg_number}
              </span>
              <span className="flex items-center gap-1.5">
                <PhoneIcon className="w-4 h-4" /> {studentDetail?.mobile}
              </span>
              <span className="flex items-center gap-1.5">
                <LocationEditIcon className="w-4 h-4" /> {studentDetail?.address}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400 mb-1">Current Balance</p>
          <p
            className={`text-3xl font-bold ${studentDetail.current_balance < 0 ? 'text-red-500' : 'text-green-500'}`}
          >
            {studentDetail.current_balance}₹
          </p>
        </div>
      </div>
    </div>
  )
}

export default StudentDetailHeader
