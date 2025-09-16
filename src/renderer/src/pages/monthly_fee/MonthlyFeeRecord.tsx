import { monthly_fee_columns } from '@renderer/components/monthly_fee/columns'
import { SimpleTableComponent } from '@renderer/components/table/SimpleTableComponent'
import { JSX, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { queryKey } from '@renderer/types/constant/queryKey'
import { Monthly_Fee_Record } from '@renderer/types/ts/monthly_fee'
import MonthlyFeeController from '@renderer/controller/MonthlyFeeController'
import PaymentBox from '@renderer/components/payment/PaymentBox'
import useModel from '@renderer/hooks/useModel'
import { Button } from 'flowbite-react'
import CreateMonthlyForm from '@renderer/components/monthly_fee/CreateMonthlyForm'
import UpdateMonthlyForm from '@renderer/components/monthly_fee/UpdateMonthlyForm'
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
  const { openModel, closeModel } = useModel()

  const close = (): void => {
    closeModel()
  }

  const create = (): void => {
    openModel({
      component: <CreateMonthlyForm studentId={Number(studentId)} successFun={close} />,
      componentOnly: true
    })
  }
  const onUpdate = (id: number): void => {
    openModel({
      component: <UpdateMonthlyForm monthlyId={Number(id)} successFun={close} />,
      componentOnly: true
    })
  }

  const action = {
    update: onUpdate
  }

  const total = useMemo(() => {
    return data.reduce((acc, item) => acc + (item.amount - item.paid), 0) || 0
  }, [data])
  return (
    <>
      <div className="flex justify-end mr-10">
        <Button onClick={create}>Create</Button>
      </div>
      <div className="md:p-5">
        <SimpleTableComponent<Monthly_Fee_Record>
          columns={monthly_fee_columns(action)}
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
