import { misItemColumns } from '@renderer/components/mis_item/columns'
import { SimpleTableComponent } from '@renderer/components/table/SimpleTableComponent'
import { JSX, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CgUserList } from 'react-icons/cg'
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryKey } from '@renderer/types/constant/queryKey'
import MisItemController from '@renderer/controller/MisItemController'
import { Mis_Item_Record } from '@renderer/types/ts/mis_item'
const MisItemRecord = (): JSX.Element => {
  const { data = [], refetch } = useQuery({
    queryKey: queryKey.mis_item,
    queryFn: MisItemController.list,
    refetchOnWindowFocus: true
  })
  const [id, setId] = useState<number>(0)
  const navigate = useNavigate()

  const misItemDelete = useMutation({
    mutationFn: MisItemController.delete,
    onSuccess: () => {
      refetch()
      setId(0)
    },
    onError: () => {
      setId(0)
    }
  })

  const handleDelete = (id: number): void => {
    misItemDelete.mutate(id)
    setId(id)
  }

  const item: Record<string, (id: number) => void> = {
    update: (id: number): void => {
      navigate(`/mis_item/update/${id}`)
    },
    delete: handleDelete
  }

  return (
    <>
      <div className="flex gap-2 justify-between items-center mb-4 bg-gray-700 rounded-t-xl md:p-5">
        <div className="flex gap-2 items-center">
          <CgUserList size={40} />
          <h1 className="text-2xl font-bold">Mis. Item Record</h1>
        </div>
        <div>
          <Link
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            to="/mis_item/insert"
          >
            Add Mis. Item
          </Link>
        </div>
      </div>
      <div className="md:p-5 ">
        <SimpleTableComponent<Mis_Item_Record>
          columns={misItemColumns(item)}
          data={data || []}
          isLoading={misItemDelete.isPending}
          id={id}
        />
      </div>
    </>
  )
}

export default MisItemRecord
