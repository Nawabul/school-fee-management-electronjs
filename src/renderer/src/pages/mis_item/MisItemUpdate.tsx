import MisItemForm from '@renderer/components/mis_item/MisItemFrom'
import MisItemController from '@renderer/controller/MisItemController'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from 'flowbite-react'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { HiAcademicCap } from 'react-icons/hi'
import { Link, useNavigate, useParams } from 'react-router-dom'

const MisItemUpdate = (): React.JSX.Element => {
  const id = useParams().id
  const navigate = useNavigate()
  const classMutation = useMutation({
    mutationFn: (data) => MisItemController.update(Number(id), data),
    onSuccess: (data) => {
      console.log('Class created successfully:', data)
      // Optionally reset form or show success message
      navigate('/mis_item')
    },
    onError: (error) => {
      console.error('Error creating class:', error)
      // Optionally show error message
    }
  })
  console.log('Class ID:', id)
  const handleFormSubmit = (data): void => {
    console.log('Form Data Submitted:', data)
    // Post to backend or handle in state
    classMutation.mutate(data)
  }
  const key = ['mis-item-single', id]
  const { data, isLoading, isSuccess, isError, error } = useQuery({
    queryKey: key,
    queryFn: () => MisItemController.fetch(Number(id)),
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
          <h1 className="text-2xl font-bold">Update Mis. Item</h1>
        </div>
        <div>
          <Link to={'/mis_item'}>
            <Button>View All Mis. Item</Button>
          </Link>
        </div>
      </div>
      <div className="md:p-5">
        {isLoading && <Loader2 className="animate-spin h-5 w-5 text-gray-500" />}
        {isError && <p className="text-red-500">Error: {error.message}</p>}
        {isSuccess && (
          <MisItemForm
            onSubmit={handleFormSubmit}
            isPending={classMutation.isPending}
            defaultValues={data}
          />
        )}
      </div>
    </div>
  )
}

export default MisItemUpdate
