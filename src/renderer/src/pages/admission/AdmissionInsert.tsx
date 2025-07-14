import { useMutation } from '@tanstack/react-query'
import { Button } from 'flowbite-react'
import { HiAcademicCap } from 'react-icons/hi'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdmissionForm from '@renderer/components/admission/AdmissionFrom'
import AdmissionController from '@renderer/controller/AdmissionController'
import { Admission_Write } from '@type/interfaces/admission'
import { todayISODate } from '@renderer/types/constant/date'

const AdmissionInsert = (): React.JSX.Element => {
  const navigate = useNavigate()

  const studentId = useParams<{ id: string }>().id

  const admissionMutation = useMutation({
    mutationKey: ['admission', 'insert'],
    mutationFn: (data: Admission_Write) => AdmissionController.create(Number(studentId), data),
    onSuccess: () => {
      navigate(-1)
      // Optionally reset form or show success message
    },
    onError: (error) => {
      console.error('Error creating admission:', error)
      // Optionally show error message
    }
  })

  const handleFormSubmit = (data): void => {
    admissionMutation.mutate(data)
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
      <div className="flex gap-2 justify-between items-center">
        <div className="flex gap-2 items-center">
          <HiAcademicCap size={40} />
          <h1 className="text-2xl font-bold">Promote Class</h1>
        </div>
        <div>
          <Link to={`/finance/admission/${studentId}`}>
            <Button>View All Promote Class</Button>
          </Link>
        </div>
      </div>
      <br />
      <hr className="text-gray-600" />
      <br />
      <AdmissionForm
        onSubmit={handleFormSubmit}
        isPending={admissionMutation.isPending}
        defaultValues={{
          date: todayISODate
        }}
      />
    </div>
  )
}

export default AdmissionInsert
