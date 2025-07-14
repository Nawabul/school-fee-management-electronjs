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
import PaymentBox from '@renderer/components/payment/PaymentBox'
import useModel from '@renderer/hooks/useModel'

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
  const { openModel } = useModel()

  const handleDelete = (id: number): void => {
    misChargeMutation.mutate(id)
    setId(id)
  }

  const item: Record<string, (id: number) => void> = {
    update: (id: number): void => {
      navigate(`/finance/mis_charge/update/${id}`)
    },
    delete: (id: number) => {
      openModel({
        submitFun: () => handleDelete(id)
      })
    }
  }

  const total = useMemo(() => {
    return data.reduce((acc, item) => acc + (item.amount - item.paid), 0) || 0
  }, [data])

  return (
    <>

      <div className="rounded-xl p-1 md:p-5">
        <SimpleTableComponent<Mis_Charge_Record>
          columns={misChargeColumns(item)}
          data={data || []}
          isLoading={misChargeMutation.isPending}
          id={id}
          btn
          btnLink={`/finance/mis_charge/insert/${studentId}`}
          btnTitle="Add Mis. Charge"
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
