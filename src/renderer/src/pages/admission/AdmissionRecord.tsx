// Imports...
import { JSX, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { SimpleTableComponent } from '@renderer/components/table/SimpleTableComponent'
import { queryKey } from '@renderer/types/constant/queryKey'
import { CgUserList } from 'react-icons/cg'
import StudentDetailHeader from '@renderer/components/StudentDetailHeader'
import AdmissionController from '@renderer/controller/AdmissionController'
import { Admission_Record } from '@type/interfaces/admission'
import { admissionColumns } from '@renderer/components/admission/columns'
import PaymentBox from '@renderer/components/payment/PaymentBox'

const AdmissionRecord = (): JSX.Element => {
  const studentId = useParams().id

  const {
    data = [],
    refetch,
    isSuccess
  } = useQuery({
    queryKey: [queryKey.admission, studentId],
    queryFn: () => AdmissionController.list(Number(studentId)),
    refetchOnWindowFocus: true
  })

  const [id, setId] = useState<number>(0)

  const admissionMutation = useMutation({
    mutationFn: AdmissionController.delete,
    onSuccess: () => {
      refetch()
      setId(0)
    },
    onError: () => {
      setId(0)
    }
  })
  const total = useMemo(() => {
    return data.reduce((acc, item) => acc + (item.amount - item.paid), 0) || 0
  }, [data])

  return (
    <>
      <div className="flex gap-2 justify-between items-center mb-4 bg-gray-700 rounded-t-xl md:p-5">
        <div className="flex gap-2 items-center">
          <CgUserList size={40} />
          <h1 className="text-2xl font-bold">Promote Class Record</h1>
        </div>
        <div>
          <Link
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            to={`/finance/admission/insert/${studentId}`}
          >
            Promote Class
          </Link>
        </div>
      </div>


      <div className="rounded-xl bg-gray-800 p-1 md:p-5">
        <SimpleTableComponent<Admission_Record>
          columns={admissionColumns()}
          data={data || []}
          isLoading={admissionMutation.isPending}
          id={id}
        />

        <br />
        {studentId && isSuccess && (
          <PaymentBox
            amount={total}
            remark="Admission"
            studentId={Number(studentId)}
            type="admission"
            successFn={refetch}
          />
        )}
      </div>
    </>
  )
}

export default AdmissionRecord
