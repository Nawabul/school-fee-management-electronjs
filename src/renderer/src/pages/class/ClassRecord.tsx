import { classColumns } from '@renderer/components/class/columns'
import { SimpleTableComponent } from '@renderer/components/table/SimpleTableComponent'
import { JSX, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CgUserList } from 'react-icons/cg'
import { useMutation, useQuery } from '@tanstack/react-query'
import ClassController from '@renderer/controller/ClassController'
import { queryKey } from '@renderer/types/constant/queryKey'
import { Class_Record } from '@renderer/types/ts/class'
import useModel from '@renderer/hooks/useModel'
import Header from '@renderer/components/Header'
const ClassRecord = (): JSX.Element => {
  const { data = [], refetch } = useQuery({
    queryKey: queryKey.class,
    queryFn: ClassController.list,
    refetchOnWindowFocus: true
  })
  const [id, setId] = useState<number>(0)
  const navigate = useNavigate()
  const { openModel } = useModel()
  const classDelete = useMutation({
    mutationFn: ClassController.delete,
    onSuccess: () => {
      refetch()
      setId(0)
    },
    onError: () => {
      setId(0)
    }
  })

  const handleDelete = (id: number): void => {
    classDelete.mutate(id)
    setId(id)
  }

  const item: Record<string, (id: number) => void> = {
    update: (id: number): void => {
      navigate(`/class/update/${id}`)
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
        buttonLink="/class/insert"
        buttonText="Add New Class"
        title="Class Record"
        subtitle="Classes / Class Record"
        icon={<CgUserList size={45} />}
      />
      <hr className="text-gray-600" />
      <br />
      <SimpleTableComponent<Class_Record>
        columns={classColumns(item)}
        data={data || []}
        isLoading={classDelete.isPending}
        id={id}
      />
    </div>
  )
}

export default ClassRecord
