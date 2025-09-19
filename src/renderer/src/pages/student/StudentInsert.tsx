import StudentForm from '@renderer/components/student/StudentForm'
import StudentController from '@renderer/controller/StudentController'
import { useNavigate } from 'react-router-dom'
import { todayISODate } from '@renderer/types/constant/date'
import Header from '@renderer/components/Header'
import useMutationHandler from '@renderer/hooks/useMutationHandler'
import { Student_Write } from '@type/interfaces/student'

const StudentInsert = (): React.JSX.Element => {
  const navigate = useNavigate()
  const studentMutation = useMutationHandler({
    mutationKey: ['student', 'insert'],
    mutationFn: (data: Student_Write) => StudentController.create(data),
    onSuccess: () => {
      navigate('/student')
      // Optionally reset form or show success message
    },
    onError: (error) => {
      console.error('Error creating class:', error)
      // Optionally show error message
    }
  })

  const handleFormSubmit = (data): void => {
    studentMutation.mutate(data)
  }

  return (
    <div className="p-5">
      <Header
        buttonLink="/student"
        buttonText="View All Students"
        title="Add New Student"
        subtitle="Students / Add New Student"
      />
      <hr className="text-gray-600" />
      <br />
      <StudentForm
        onSubmit={handleFormSubmit}
        isPending={studentMutation.isPending}
        defaultValues={{
          admission_date: todayISODate,
          dob: todayISODate,
          initial_balance: 0
        }}
      />
    </div>
  )
}

export default StudentInsert
