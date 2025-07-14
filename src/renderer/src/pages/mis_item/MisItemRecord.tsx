import { misItemColumns } from '@renderer/components/mis_item/columns'
import { SimpleTableComponent } from '@renderer/components/table/SimpleTableComponent'
import { JSX, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CgUserList } from 'react-icons/cg'
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryKey } from '@renderer/types/constant/queryKey'
import MisItemController from '@renderer/controller/MisItemController'
import { Mis_Item_Record } from '@renderer/types/ts/mis_item'
import useModel from '@renderer/hooks/useModel'
import Header from '@renderer/components/Header'
const MisItemRecord = (): JSX.Element => {
  const { data = [], refetch } = useQuery({
    queryKey: queryKey.mis_item,
    queryFn: MisItemController.list,
    refetchOnWindowFocus: true
  })
  const { openModel } = useModel()
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
    delete: (id: number) => {
      openModel({
        submitFun: () => handleDelete(id)
      })
    }
  }

  return (
    <div className="p-5">
      <Header
        title="Mis. Item Record"
        subtitle="Mis. Item / Mis. Item Record"
        buttonLink="/mis_item/insert"
        buttonText="Add Mis. Item"
        icon={<CgUserList size={45} />}
      />
      <hr className="text-gray-600" />
      <br />
      <SimpleTableComponent<Mis_Item_Record>
        columns={misItemColumns(item)}
        data={data || []}
        isLoading={misItemDelete.isPending}
        id={id}
      />
    </div>
  )
}

export default MisItemRecord
