import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from 'flowbite-react'
import { HiAcademicCap } from 'react-icons/hi'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PaymentController from '@renderer/controller/PaymentController'
import PaymentForm from '@renderer/components/payment/PaymentForm'
import { todayISODate } from '@renderer/types/constant/date'
import { queryKey } from '@renderer/types/constant/queryKey'

const PaymentInsert = (): React.JSX.Element => {
  const navigate = useNavigate()

  const studentId = useParams<{ id: string }>().id
  const queryClient = useQueryClient()
  const paymentMutation = useMutation({
    mutationKey: ['payment', 'insert'],
    mutationFn: (data) => PaymentController.create(Number(studentId), data),
    onSuccess: () => {
      navigate(-1)
      // Optionally reset form or show success message
      queryClient.invalidateQueries({
              queryKey: queryKey.student_details
            })
    },
    onError: (error) => {
      console.error('Error creating class:', error)
      // Optionally show error message
    }
  })

  const handleFormSubmit = (data): void => {
    paymentMutation.mutate(data)
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
      <div className="flex gap-2 justify-between items-center">
        <div className="flex gap-2 items-center">
          <HiAcademicCap size={40} />
          <h1 className="text-2xl font-bold">Collect Payment</h1>
        </div>
        <div>
          <Link to={`/finance/payment/${studentId}`}>
            <Button>View All Payment</Button>
          </Link>
        </div>
      </div>
      <br />
      <hr className="text-gray-600" />
      <br />
      <PaymentForm
        onSubmit={handleFormSubmit}
        isPending={paymentMutation.isPending}
        defaultValues={{
          date: todayISODate
        }}
      />
    </div>
  )
}

export default PaymentInsert
