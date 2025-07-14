import Header from '@renderer/components/Header'
import StudentForm from '@renderer/components/student/StudentForm'
import StudentController from '@renderer/controller/StudentController'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const StudentUpdate = (): React.JSX.Element => {
  const id = useParams().id
  const navigate = useNavigate()
  const studentMutation = useMutation({
    mutationFn: (data) => StudentController.update(Number(id), data),
    onSuccess: () => {
      // Optionally reset form or show success message
      navigate('/student')
    },
    onError: (error) => {
      console.error('Error creating class:', error)
      // Optionally show error message
    }
  })

  const handleFormSubmit = (data): void => {
    // Post to backend or handle in state
    studentMutation.mutate(data)
  }
  const key = ['student-single', id]
  const { data, isLoading, isSuccess, isError, error } = useQuery({
    queryKey: key,
    queryFn: () => StudentController.fetch(Number(id)),
    enabled: !!id, // Only run this query if id is available

    refetchOnWindowFocus: 'always'
  })
  const queryClient = useQueryClient()
  useEffect(() => {
    return () => {
      queryClient.removeQueries({
        queryKey: key,
        exact: true
      })
    }
  }, [])

  return (
    <div className="p-5">
      <Header
        buttonLink="/student"
        buttonText="View All Students"
        title="Update Student"
        subtitle="Students / Update Student"
      />
      <hr className="text-gray-600" />
      <br />
      {isLoading && <Loader2 className="animate-spin h-5 w-5 text-gray-500" />}
      {isError && <p className="text-red-500">Error: {error.message}</p>}
      {isSuccess && (
        <StudentForm
          onSubmit={handleFormSubmit}
          isPending={studentMutation.isPending}
          defaultValues={data}
          isUpdate={true}
        />
      )}
    </div>
  )
}

export default StudentUpdate
