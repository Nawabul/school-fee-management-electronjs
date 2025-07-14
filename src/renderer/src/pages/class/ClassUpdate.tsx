import ClassForm from '@renderer/components/class/ClassForm'
import Header from '@renderer/components/Header'
import ClassController from '@renderer/controller/ClassController'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { HiAcademicCap } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom'

const ClassUpdate = (): React.JSX.Element => {
  const id = useParams().id
  const navigate = useNavigate()
  const classMutation = useMutation({
    mutationFn: (data) => ClassController.update(Number(id), data),
    onSuccess: () => {
      // Optionally reset form or show success message
      navigate('/class')
    },
    onError: (error) => {
      console.error('Error creating class:', error)
      // Optionally show error message
    }
  })

  const handleFormSubmit = (data: any): void => {
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
    <div className="p-5">
      <Header
        buttonLink="/class"
        buttonText="View All Classes"
        title="Update Class"
        subtitle="Classes / Update Class"
        icon={<HiAcademicCap size={45} />}
      />
      <hr className="text-gray-600" />
      <br />
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
