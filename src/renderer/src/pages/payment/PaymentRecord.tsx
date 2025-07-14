import { paymentColumns } from '@renderer/components/payment/columns'
import { SimpleTableComponent } from '@renderer/components/table/SimpleTableComponent'
import { JSX, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryKey } from '@renderer/types/constant/queryKey'
import PaymentController from '@renderer/controller/PaymentController'
import { Payment_Record } from '@renderer/types/ts/payments'
import useModel from '@renderer/hooks/useModel'

const PaymentRecord = (): JSX.Element => {
  const studentId = useParams().id

  const { data = [], refetch } = useQuery({
    queryKey: queryKey.payment,
    queryFn: () => PaymentController.list(Number(studentId)),
    refetchOnWindowFocus: true
  })
  const [id, setId] = useState<number>(0)
  const navigate = useNavigate()
  const { openModel } = useModel()
  const paymentDelete = useMutation({
    mutationFn: PaymentController.delete,
    onSuccess: () => {
      refetch()
      setId(0)
    },
    onError: () => {
      setId(0)
    }
  })

  const handleDelete = (id: number): void => {
    paymentDelete.mutate(id)
    setId(id)
  }

  const item: Record<string, (id: number) => void> = {
    update: (id: number): void => {
      navigate(`/finance/payment/update/${id}`)
    },
    delete: (id: number) => {
      openModel({
        submitFun: () => handleDelete(id)
      })
    }
  }

  return (
    <>
      {/* END HEADER CARD */}
      <div className="md:p-5 ">
        <SimpleTableComponent<Payment_Record>
          columns={paymentColumns(item)}
          data={data || []}
          isLoading={paymentDelete.isPending}
          id={id}
          btn
          btnLink={`/finance/payment/insert/${studentId}`}
          btnTitle="Collect Payment"
        />
      </div>
    </>
  )
}

export default PaymentRecord
