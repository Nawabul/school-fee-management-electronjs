import MisItemForm from '@renderer/components/mis_item/MisItemFrom'
import MisItemController from '@renderer/controller/MisItemController'
import { useMutation } from '@tanstack/react-query'
import { Button } from 'flowbite-react'
import { HiAcademicCap } from 'react-icons/hi'
import { Link, useNavigate } from 'react-router-dom'

const MisItemInsert = (): React.JSX.Element => {
  const navigate = useNavigate()
  const classMutation = useMutation({
    mutationFn: MisItemController.create,
    onSuccess: (data) => {

      navigate('/mis_item')
      // Optionally reset form or show success message
    },
    onError: (error) => {
      console.error('Error creating class:', error)
      // Optionally show error message
    }
  })

  const handleFormSubmit = (data): void => {
    console.log('Form Data Submitted:', data)
    // Post to backend or handle in state
    classMutation.mutate(data)
  }

  return (
    <div>
      <div className="flex gap-2 justify-between items-center mb-4 bg-gray-700 rounded-t-xl md:p-5">
        <div className="flex gap-2 items-center">
          <HiAcademicCap size={40} />
          <h1 className="text-2xl font-bold">Add Class</h1>
        </div>
        <div>
          <Link to={'/mis_item'}>
            <Button>View All Mis. Item</Button>
          </Link>
        </div>
      </div>
      <div className="md:p-5">
        <MisItemForm
          onSubmit={handleFormSubmit}
          isPending={classMutation.isPending}
          defaultValues={{ name: '', amount: 0 }}
        />
      </div>
    </div>
  )
}

export default MisItemInsert
