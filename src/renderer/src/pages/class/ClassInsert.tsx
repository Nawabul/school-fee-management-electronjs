import ClassForm from '@renderer/components/class/ClassForm'
import Header from '@renderer/components/Header'
import ClassController from '@renderer/controller/ClassController'
import { useMutation } from '@tanstack/react-query'
import { HiAcademicCap } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

const ClassInsert = (): React.JSX.Element => {
  const navigate = useNavigate()
  const classMutation = useMutation({
    mutationFn: ClassController.create,
    onSuccess: () => {
      navigate('/class')
      // Optionally reset form or show success message
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

  return (
    <div className="p-5">
      <Header
        buttonLink="/class"
        buttonText="View All Classes"
        title="Add Class"
        subtitle="Classes / Add Class"
        icon={<HiAcademicCap size={45} />}
      />
      <hr className="text-gray-600" />
      <br />
      <ClassForm
        onSubmit={handleFormSubmit}
        isPending={classMutation.isPending}
        defaultValues={{ name: '', amount: 0, admission_charge: 0 }}
      />
    </div>
  )
}

export default ClassInsert
