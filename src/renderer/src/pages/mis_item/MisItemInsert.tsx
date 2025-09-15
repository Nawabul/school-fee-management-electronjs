import Header from '@renderer/components/Header'
import MisItemForm from '@renderer/components/mis_item/MisItemFrom'
import MisItemController from '@renderer/controller/MisItemController'
import useMutationHandler from '@renderer/hooks/useMutationHandler'
import { Mis_Item_Write } from '@type/interfaces/mis_item'

import { HiAcademicCap } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

const MisItemInsert = (): React.JSX.Element => {
  const navigate = useNavigate()
  const classMutation = useMutationHandler({
    mutationFn: (data: Mis_Item_Write) => MisItemController.create(data),
    onSuccess: () => {
      navigate('/mis_item')
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
        title="Add Mis. Item"
        subtitle="Mis. Item / Mis. Item Insert"
        buttonLink="/mis_item"
        buttonText="View All Mis. Item"
        icon={<HiAcademicCap size={45} />}
      />
      <hr className="text-gray-600" />
      <br />

      <MisItemForm
        onSubmit={handleFormSubmit}
        isPending={classMutation.isPending}
        defaultValues={{ name: '', amount: 0 }}
      />
    </div>
  )
}

export default MisItemInsert
