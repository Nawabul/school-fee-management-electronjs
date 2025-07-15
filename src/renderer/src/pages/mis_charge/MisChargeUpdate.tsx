import MisChargeForm from '@renderer/components/mis_charge/MisChargeForm'
import MisChargeController from '@renderer/controller/MisChargeController'
import { queryKey } from '@renderer/types/constant/queryKey'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from 'flowbite-react'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { HiAcademicCap } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom'

const MisChargeUpdate = (): React.JSX.Element => {
  const id = useParams().id
  const navigate = useNavigate()

  const misChargeMutation = useMutation({
    mutationFn: (data) => MisChargeController.update(Number(id), data),
    onSuccess: () => {
      // Optionally reset form or show success message
      navigate(-1)
      queryClient.invalidateQueries({
        queryKey: queryKey.student_details
      })
    },
    onError: (error) => {
      console.error('Error creating payment:', error)
      // Optionally show error message
    }
  })

  const handleFormSubmit = (data): void => {
    // Post to backend or handle in state
    misChargeMutation.mutate(data)
  }
  const key = ['mis-charge-single', id]
  const { data, isLoading, isSuccess, isError, error } = useQuery({
    queryKey: key,
    queryFn: () => MisChargeController.fetch(Number(id)),
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
          <h1 className="text-2xl font-bold">Update Mis. Charge</h1>
        </div>
        <div>
          <Button onClick={() => navigate(-1)}>View All Mis. Charge</Button>
        </div>
      </div>

      <div className="md:p-5">
        {isLoading && <Loader2 className="animate-spin h-5 w-5 text-gray-500" />}
        {isError && <p className="text-red-500">Error: {error.message}</p>}
        {isSuccess && (
          <MisChargeForm
            onSubmit={handleFormSubmit}
            isPending={misChargeMutation.isPending}
            // @ts-ignore working well response type
            defaultValues={data}
          />
        )}
      </div>
    </div>
  )
}

export default MisChargeUpdate
