
import ClassForm from '@renderer/components/class/ClassForm'
import ClassController from '@renderer/controller/ClassController'
import { useMutation } from '@tanstack/react-query'
import { Button } from 'flowbite-react'
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

  const handleFormSubmit = (data: any): void => {
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
		  <Button>View All Classs</Button>
		</div>
	  </div>
	  <div className="md:p-5">
		<ClassForm
      onSubmit={handleFormSubmit}
      isPending={classMutation.isPending}
      defaultValues={{ name: '', amount: 0 }}
    />
	  </div>
	</div>
  )
}

export default ClassInsert
