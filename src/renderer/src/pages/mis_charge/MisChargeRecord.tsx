import { misChargeColumns } from '@renderer/components/mis_charge/columns'
import { SimpleTableComponent } from '@renderer/components/table/SimpleTableComponent'
import { JSX, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CgUserList } from 'react-icons/cg'
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryKey } from '@renderer/types/constant/queryKey'
import { Mis_Charge_Record } from '@renderer/types/ts/mis_charge'
import MisChargeController from '@renderer/controller/MisChargeController'

const MisChargeRecord = (): JSX.Element => {
  const studentId = useParams().id

  const { data = [], refetch } = useQuery({
    queryKey: queryKey.mis_charge,
    queryFn: () => MisChargeController.list(Number(studentId)),
    refetchOnWindowFocus: true
  })
  const [id, setId] = useState<number>(0)
  const navigate = useNavigate()

  const misChargeMutation = useMutation({
    mutationFn: MisChargeController.delete,
    onSuccess: () => {
      refetch()
      setId(0)
    },
    onError: () => {
      setId(0)
    }
  })

  const handleDelete = (id: number): void => {
    misChargeMutation.mutate(id)
    setId(id)
  }

  const item: Record<string, (id: number) => void> = {
    update: (id: number): void => {
      navigate(`/mis_charge/update/${id}`)
    },
    delete: handleDelete
  }

  return (
    <>
      <div className="flex gap-2 justify-between items-center mb-4 bg-gray-700 rounded-t-xl md:p-5">
        <div className="flex gap-2 items-center">
          <CgUserList size={40} />
          <h1 className="text-2xl font-bold">Mis. Charge Record</h1>
        </div>
        <div>
          <Link
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            to={`/mis_charge/insert/${studentId}`}
          >
            Add Mis. Charge
          </Link>
        </div>
      </div>
      <div className="md:p-5 ">
        <SimpleTableComponent<Mis_Charge_Record>
          columns={misChargeColumns(item)}
          data={data || []}
          isLoading={misChargeMutation.isPending}
          id={id}
        />
      </div>
    </>
  )
}

export default MisChargeRecord
