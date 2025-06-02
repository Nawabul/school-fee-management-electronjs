import ClassForm from '@renderer/components/class/ClassForm'
import ClassController from '@renderer/controller/ClassController'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from 'flowbite-react'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { HiAcademicCap } from 'react-icons/hi'
import { Link, useNavigate, useParams } from 'react-router-dom'

const ClassUpdate = (): React.JSX.Element => {
  const id = useParams().id
  const navigate = useNavigate()
  const classMutation = useMutation({
    mutationFn: (data) => ClassController.update(Number(id), data),
    onSuccess: (data) => {
      console.log('Class created successfully:', data)
      // Optionally reset form or show success message
      navigate('/class')
    },
    onError: (error) => {
      console.error('Error creating class:', error)
      // Optionally show error message
    }
  })
  console.log('Class ID:', id)
  const handleFormSubmit = (data: any): void => {
    console.log('Form Data Submitted:', data)
    // Post to backend or handle in state
    classMutation.mutate(data)
  }
  const key = ['class-single', id]
  const { data, isLoading, isSuccess, isError, error } = useQuery({
    queryKey: key,
    queryFn: () => ClassController.fetch(Number(id)),
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
          <h1 className="text-2xl font-bold">Update Class</h1>
        </div>
        <div>
          <Link to={'/class'}>
            <Button>View All Classs</Button>
          </Link>
        </div>
      </div>
      <div className="md:p-5">
        {isLoading && <Loader2 className="animate-spin h-5 w-5 text-gray-500" />}
        {isError && <p className="text-red-500">Error: {error.message}</p>}
        {isSuccess && (
          <ClassForm
            onSubmit={handleFormSubmit}
            isPending={classMutation.isPending}
            defaultValues={data}
          />
        )}
      </div>
    </div>
  )
}

export default ClassUpdate
