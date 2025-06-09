import { BookOpen, Hash, Phone, MapPin, IndianRupee } from 'lucide-react'
import { JSX } from 'react'

const StudentDetailHeader = ({ studentDetail }: any): JSX.Element => {
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
        <div className="flex w-full flex-row-reverse items-center justify-between sm:w-auto sm:flex-col sm:items-end sm:justify-start">
          <div className="mt-2 text-right">
            <span className="text-sm text-gray-400">Current Balance</span>
            <p
              className={`flex items-center justify-end text-2xl font-bold ${studentDetail.current_balance < 0 ? 'text-red-400' : 'text-green-400'}`}
            >
              <IndianRupee size={20} />
              {studentDetail.current_balance?.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDetailHeader
