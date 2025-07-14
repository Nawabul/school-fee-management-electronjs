// Imports...
import { JSX, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { SimpleTableComponent } from '@renderer/components/table/SimpleTableComponent'
import { queryKey } from '@renderer/types/constant/queryKey'
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

      <div className="rounded-xl p-1 md:p-5">
        <SimpleTableComponent<Admission_Record>
          columns={admissionColumns()}
          data={data || []}
          isLoading={admissionMutation.isPending}
          id={id}
          btn
          btnLink={`/finance/admission/insert/${studentId}`}
          btnTitle="Promote Class"
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
