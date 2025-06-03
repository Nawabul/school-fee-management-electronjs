import StudentForm from '@renderer/components/student/StudentForm'
import { useMutation } from '@tanstack/react-query'
import { Button } from 'flowbite-react'
import { HiAcademicCap } from 'react-icons/hi'
import StudentController from '@renderer/controller/StudentController'
import { Link, useNavigate } from 'react-router-dom'

const StudentInsert = (): React.JSX.Element => {
  const navigate = useNavigate()
  const studentMutation = useMutation({
    mutationKey: ['student', 'insert'],
    mutationFn: StudentController.create,
    onSuccess: () => {
      navigate('/student')
      // Optionally reset form or show success message
    },
    onError: (error) => {
      console.error('Error creating class:', error)
      // Optionally show error message
    }
  })

  const handleFormSubmit = (data: any): void => {
    studentMutation.mutate(data)
  }

  return (
    <div>
      <div className="flex gap-2 justify-between items-center mb-4 bg-gray-700 rounded-t-xl md:p-5">
        <div className="flex gap-2 items-center">
          <HiAcademicCap size={40} />
          <h1 className="text-2xl font-bold">Student Insert</h1>
        </div>
        <div>
          <Link to={'/student'}>
          <Button>View All Student</Button>
          </Link>
        </div>
      </div>
      <div className="md:p-5">
        <StudentForm onSubmit={handleFormSubmit} isPending={studentMutation.isPending}/>
      </div>
    </div>
  )
}

export default StudentInsert
