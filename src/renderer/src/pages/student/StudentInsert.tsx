import StudentForm, { StudentFormData } from '@renderer/components/student/StudentForm'
import { Button } from 'flowbite-react'
import { HiAcademicCap } from 'react-icons/hi'

const classOptions = [
  { id: 1, name: 'Class 1' },
  { id: 2, name: 'Class 2' },
  { id: 3, name: 'Class 3' }
]

const StudentInsert = (): React.JSX.Element => {
  const handleFormSubmit = (data: StudentFormData): void => {
    console.log('Form Data Submitted:', data)
    // Post to backend or handle in state
  }

  return (
    <div>
      <div className="flex gap-2 justify-between items-center mb-4 bg-gray-700 rounded-t-xl md:p-5">
        <div className="flex gap-2 items-center">
          <HiAcademicCap size={40} />
          <h1 className="text-2xl font-bold">Student Insert</h1>
        </div>
        <div>
          <Button>View All Student</Button>
        </div>
      </div>
      <div className="md:p-5">
        <StudentForm classOptions={classOptions} onSubmit={handleFormSubmit} />
      </div>
    </div>
  )
}

export default StudentInsert
