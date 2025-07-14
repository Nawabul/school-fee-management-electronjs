import { useMutation } from '@tanstack/react-query'
import { Button } from 'flowbite-react'
import { HiAcademicCap } from 'react-icons/hi'
import { Link, useNavigate, useParams } from 'react-router-dom'
import MisChargeController from '@renderer/controller/MisChargeController'
import MisChargeForm from '@renderer/components/mis_charge/MisChargeForm'
import { todayISODate } from '@renderer/types/constant/date'

const MisChargeInsert = (): React.JSX.Element => {
  const navigate = useNavigate()

  const studentId = useParams<{ id: string }>().id

  const misChargeMutation = useMutation({
    mutationKey: ['charge', 'insert'],
    mutationFn: (data) => MisChargeController.create(Number(studentId), data),
    onSuccess: () => {
      navigate(-1)
      // Optionally reset form or show success message
    },
    onError: (error) => {
      console.error('Error creating class:', error)
      // Optionally show error message
    }
  })

  const handleFormSubmit = (data): void => {
    misChargeMutation.mutate(data)
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
      <div className="flex gap-2 justify-between items-center">
        <div className="flex gap-2 items-center">
          <HiAcademicCap size={40} />
          <h1 className="text-2xl font-bold">Mis. Charge Insert</h1>
        </div>
        <div>
          <Link to={`/finance/mis_charge/${studentId}`}>
            <Button>View All Mis. Charge</Button>
          </Link>
        </div>
      </div>
      <br />
      <hr className="text-gray-600" />
      <br />
      <MisChargeForm
        onSubmit={handleFormSubmit}
        isPending={misChargeMutation.isPending}
        defaultValues={{
          date: todayISODate
        }}
      />
    </div>
  )
}

export default MisChargeInsert
