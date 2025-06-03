import ClassForm from '@renderer/components/class/ClassForm'
import StudentForm from '@renderer/components/student/StudentForm'
import ClassController from '@renderer/controller/ClassController'
import StudentController from '@renderer/controller/StudentController'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from 'flowbite-react'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { HiAcademicCap } from 'react-icons/hi'
import { Link, useNavigate, useParams } from 'react-router-dom'

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

  const handleFormSubmit = (data: any): void => {
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
    <div>
      <div className="flex gap-2 justify-between items-center mb-4 bg-gray-700 rounded-t-xl md:p-5">
        <div className="flex gap-2 items-center">
          <HiAcademicCap size={40} />
          <h1 className="text-2xl font-bold">Update Student</h1>
        </div>
        <div>
          <Link to={'/student'}>
            <Button>View All Student</Button>
          </Link>
        </div>
      </div>
      <div className="md:p-5">
        {isLoading && <Loader2 className="animate-spin h-5 w-5 text-gray-500" />}
        {isError && <p className="text-red-500">Error: {error.message}</p>}
        {isSuccess && (
          <StudentForm
            onSubmit={handleFormSubmit}
            isPending={studentMutation.isPending}
            defaultValues={data}
          />
        )}
      </div>
    </div>
  )
}

export default StudentUpdate
