import { paymentColumns } from '@renderer/components/payment/columns'
import { SimpleTableComponent } from '@renderer/components/table/SimpleTableComponent'
import { JSX, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CgUserList } from 'react-icons/cg'
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryKey } from '@renderer/types/constant/queryKey'
import PaymentController from '@renderer/controller/PaymentController'
import { Payment_Record } from '@renderer/types/ts/payments'
import StudentDetailHeader from '@renderer/components/StudentDetailHeader'
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
      navigate(`/payment/update/${id}`)
    },
    delete: (id: number) => {
      openModel({
        fun: () => handleDelete(id)
      })
    }
  }

  return (
    <>
      <div className="flex gap-2 justify-between items-center mb-4 bg-gray-700 rounded-t-xl md:p-5">
        <div className="flex gap-2 items-center">
          <CgUserList size={40} />
          <h1 className="text-2xl font-bold">Payment Record</h1>
        </div>
        <div>
          <Link
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            to={`/payment/insert/${studentId}`}
          >
            Collect Payment
          </Link>
        </div>
      </div>
      {/* START STUDENT DETAIL HEADER CARD */}
      <StudentDetailHeader />
      {/* END HEADER CARD */}
      <div className="md:p-5 ">
        <SimpleTableComponent<Payment_Record>
          columns={paymentColumns(item)}
          data={data || []}
          isLoading={paymentDelete.isPending}
          id={id}
        />
      </div>
    </>
  )
}

export default PaymentRecord
