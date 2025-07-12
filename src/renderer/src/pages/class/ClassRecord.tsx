import { classColumns } from '@renderer/components/class/columns'
import { SimpleTableComponent } from '@renderer/components/table/SimpleTableComponent'
import { JSX, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CgUserList } from 'react-icons/cg'
import { useMutation, useQuery } from '@tanstack/react-query'
import ClassController from '@renderer/controller/ClassController'
import { queryKey } from '@renderer/types/constant/queryKey'
import { Class_Record } from '@renderer/types/ts/class'
import useModel from '@renderer/hooks/useModel'
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
    <>
      <div className="flex gap-2 justify-between items-center mb-4 bg-gray-700 rounded-t-xl md:p-5">
        <div className="flex gap-2 items-center">
          <CgUserList size={40} />
          <h1 className="text-2xl font-bold">Class Record</h1>
        </div>
        <div>
          <Link
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            to="/class/insert"
          >
            Add Class
          </Link>
        </div>
      </div>
      <div className="md:p-5 ">
        <SimpleTableComponent<Class_Record>
          columns={classColumns(item)}
          data={data || []}
          isLoading={classDelete.isPending}
          id={id}
        />
      </div>
    </>
  )
}

export default ClassRecord
