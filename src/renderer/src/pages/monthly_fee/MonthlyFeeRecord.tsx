import { monthly_fee_columns } from '@renderer/components/monthly_fee/columns'
import { SimpleTableComponent } from '@renderer/components/table/SimpleTableComponent'
import { JSX, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { CgUserList } from 'react-icons/cg'
import { useQuery } from '@tanstack/react-query'
import { queryKey } from '@renderer/types/constant/queryKey'
import { Monthly_Fee_Record } from '@renderer/types/ts/monthly_fee'
import MonthlyFeeController from '@renderer/controller/MonthlyFeeController'
import PaymentBox from '@renderer/components/payment/PaymentBox'
const MonthlyFeeRecord = (): JSX.Element => {
  const studentId = useParams().id
  const {
    data = [],
    isSuccess,
    refetch
  } = useQuery({
    queryKey: queryKey.monthly_fee,
    queryFn: () => MonthlyFeeController.list(Number(studentId)),
    refetchOnWindowFocus: true
  })

  const total = useMemo(() => {
    return data.reduce((acc, item) => acc + (item.amount - item.paid), 0) || 0
  }, [data])
  return (
    <>
      <div className="md:p-5 ">
        <SimpleTableComponent<Monthly_Fee_Record>
          columns={monthly_fee_columns()}
          data={data || []}
          isLoading={false}
          id={0}
        />
        <br />
        {studentId && isSuccess && (
          <PaymentBox
            amount={total}
            remark="Monthly Fee"
            studentId={Number(studentId)}
            type="monthly"
            successFn={refetch}
          />
        )}
      </div>
    </>
  )
}

export default MonthlyFeeRecord
