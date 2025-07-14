import Header from '@renderer/components/Header'
import MisItemForm from '@renderer/components/mis_item/MisItemFrom'
import MisItemController from '@renderer/controller/MisItemController'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { HiAcademicCap } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom'

const MisItemUpdate = (): React.JSX.Element => {
  const id = useParams().id
  const navigate = useNavigate()
  const classMutation = useMutation({
    mutationFn: (data) => MisItemController.update(Number(id), data),
    onSuccess: () => {
      // Optionally reset form or show success message
      navigate('/mis_item')
    },
    onError: (error) => {
      console.error('Error creating class:', error)
      // Optionally show error message
    }
  })

  const handleFormSubmit = (data): void => {
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
    <div className="p-5">
      <Header
        title="Update Mis. Item"
        subtitle="mis_item / update"
        buttonText="View All Mis. Item"
        buttonLink="/mis_item"
        icon={<HiAcademicCap size={45} />}
      />
      <hr className="text-gray-600" />
      <br />
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
  )
}

export default MisItemUpdate
