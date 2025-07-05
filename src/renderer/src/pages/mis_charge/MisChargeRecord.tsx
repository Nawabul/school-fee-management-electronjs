// Imports...
import { JSX, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { SimpleTableComponent } from '@renderer/components/table/SimpleTableComponent'
import { misChargeColumns } from '@renderer/components/mis_charge/columns'
import MisChargeController from '@renderer/controller/MisChargeController'
import { queryKey } from '@renderer/types/constant/queryKey'
import { Mis_Charge_Record } from '@renderer/types/ts/mis_charge'
import { CgUserList } from 'react-icons/cg'
import StudentDetailHeader from '@renderer/components/StudentDetailHeader'
import PaymentBox from '@renderer/components/payment/PaymentBox'

const MisChargeRecord = (): JSX.Element => {
  const studentId = useParams().id
  const navigate = useNavigate()

  const {
    data = [],
    refetch,
    isSuccess
  } = useQuery({
    queryKey: [queryKey.mis_charge, studentId],
    queryFn: () => MisChargeController.list(Number(studentId)),
    refetchOnWindowFocus: true
  })

  const [id, setId] = useState<number>(0)

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

  const total = useMemo(() => {
    return data.reduce((acc, item) => acc + (item.amount - item.paid), 0) || 0
  }, [data])

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
      {/* START STUDENT DETAIL HEADER CARD */}
      <StudentDetailHeader />
      {/* END HEADER CARD */}

      <div className="rounded-xl bg-gray-800 p-1 md:p-5">
        <SimpleTableComponent<Mis_Charge_Record>
          columns={misChargeColumns(item)}
          data={data || []}
          isLoading={misChargeMutation.isPending}
          id={id}
        />
        <br />
        {studentId && isSuccess && (
          <PaymentBox
            amount={total}
            remark="Miscellaneous Charge"
            studentId={Number(studentId)}
            type="mis_charge"
            successFn={refetch}
          />
        )}
      </div>
    </>
  )
}

export default MisChargeRecord
