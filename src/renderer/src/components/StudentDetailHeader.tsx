import { BookOpen, Hash, Phone, MapPin } from 'lucide-react'
import { JSX } from 'react'
import useStudentDetails from '@renderer/hooks/useStudentDetails'
const StudentDetailHeader = (): JSX.Element => {
  const { studentDetails: studentDetail } = useStudentDetails()

  if (!studentDetail) {
    return <div>Loading student details...</div>
  }
  return (
    <div className="mb-2 rounded-xl bg-gray-800 p-4 text-white shadow-lg">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        {/* Left Side: Student Info */}
        <div className="flex gap-6">
          <div className="">
            <h1 className="text-2xl font-bold text-cyan-400">{studentDetail.student_name}</h1>
            <p className="text-md text-gray-300">s/o {studentDetail.father_name}</p>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <BookOpen size={16} className="text-gray-400" />
              <span>
                Class: <strong>{studentDetail.class_name}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Hash size={16} className="text-gray-400" />
              <span>
                Reg. No: <strong>{studentDetail.reg_number}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone size={16} className="text-gray-400" />
              <span>
                Mobile: <strong>{studentDetail.mobile}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-gray-400" />
              <span>
                Address: <strong>{studentDetail.address}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Actions and Balance */}
      </div>
    </div>
  )
}

export default StudentDetailHeader
