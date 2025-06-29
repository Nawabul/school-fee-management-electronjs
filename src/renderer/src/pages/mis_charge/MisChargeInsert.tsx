import { useMutation } from '@tanstack/react-query'
import { Button } from 'flowbite-react'
import { HiAcademicCap } from 'react-icons/hi'
import { Link, useNavigate, useParams } from 'react-router-dom'
import MisChargeController from '@renderer/controller/MisChargeController'
import MisChargeForm from '@renderer/components/mis_charge/MisChargeForm'
import StudentDetailHeader from '@renderer/components/StudentDetailHeader'
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
    <div>
      <div className="flex gap-2 justify-between items-center mb-4 bg-gray-700 rounded-t-xl md:p-5">
        <div className="flex gap-2 items-center">
          <HiAcademicCap size={40} />
          <h1 className="text-2xl font-bold">Mis. Charge Insert</h1>
        </div>
        <div>
          <Link to={`/mis_charge/${studentId}`}>
            <Button>View All Mis. Charge</Button>
          </Link>
        </div>
      </div>
      {/* START STUDENT DETAIL HEADER CARD */}
      <StudentDetailHeader />
      {/* END HEADER CARD */}
      <div className="md:p-5">
        <MisChargeForm onSubmit={handleFormSubmit} isPending={misChargeMutation.isPending}
          defaultValues={{
            date: todayISODate
          }}
        />
      </div>
    </div>
  )
}

export default MisChargeInsert
