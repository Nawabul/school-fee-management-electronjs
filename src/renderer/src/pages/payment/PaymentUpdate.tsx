import PaymentForm from '@renderer/components/payment/PaymentForm'
import PaymentController from '@renderer/controller/PaymentController'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from 'flowbite-react'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { HiAcademicCap } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom'

const PaymentUpdate = (): React.JSX.Element => {
  const id = useParams().id
  const navigate = useNavigate()
  const studentMutation = useMutation({
    mutationFn: (data) => PaymentController.update(Number(id), data),
    onSuccess: () => {
      // Optionally reset form or show success message
      navigate(-1)
    },
    onError: (error) => {
      console.error('Error creating payment:', error)
      // Optionally show error message
    }
  })

  const handleFormSubmit = (data): void => {
    // Post to backend or handle in state
    studentMutation.mutate(data)
  }
  const key = ['payment-single', id]
  const { data, isLoading, isSuccess, isError, error } = useQuery({
    queryKey: key,
    queryFn: () => PaymentController.fetch(Number(id)),
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
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
      <div className="flex gap-2 justify-between items-center">
        <div className="flex gap-2 items-center">
          <HiAcademicCap size={40} />
          <h1 className="text-2xl font-bold">Update Payment</h1>
        </div>
        <div>
          <Button onClick={() => navigate(-1)}>View All Payment</Button>
        </div>
      </div>
      <br />
      <hr className="text-gray-600" />
      <br />
      {isLoading && <Loader2 className="animate-spin h-5 w-5 text-gray-500" />}
      {isError && <p className="text-red-500">Error: {error.message}</p>}
      {isSuccess && (
        <PaymentForm
          onSubmit={handleFormSubmit}
          isPending={studentMutation.isPending}
          // @ts-ignore working well response type
          defaultValues={data}
        />
      )}
    </div>
  )
}

export default PaymentUpdate
