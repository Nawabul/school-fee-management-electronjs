import { monthly_fee_columns } from '@renderer/components/monthly_fee/columns'
import { SimpleTableComponent } from '@renderer/components/table/SimpleTableComponent'
import { JSX } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { CgUserList } from 'react-icons/cg'
import { useQuery } from '@tanstack/react-query'
import { queryKey } from '@renderer/types/constant/queryKey'
import { Monthly_Fee_Record } from '@renderer/types/ts/monthly_fee'
import MonthlyFeeController from '@renderer/controller/MonthlyFeeController'
import StudentDetailHeader from '@renderer/components/StudentDetailHeader'
const MonthlyFeeRecord = (): JSX.Element => {
  const studentId = useParams().id
  const { data = [] } = useQuery({
    queryKey: queryKey.monthly_fee,
    queryFn: () => MonthlyFeeController.list(Number(studentId)),
    refetchOnWindowFocus: true
  })

  const studentDetail = useLocation().state

  return (
    <>
      <div className="flex gap-2 justify-between items-center mb-4 bg-gray-700 rounded-t-xl md:p-5">
        <div className="flex gap-2 items-center">
          <CgUserList size={40} />
          <h1 className="text-2xl font-bold">Monthly Fee Record</h1>
        </div>
        <div></div>
      </div>
      {/* START STUDENT DETAIL HEADER CARD */}
      <StudentDetailHeader studentDetail={studentDetail} />
      {/* END HEADER CARD */}
      <div className="md:p-5 ">
        <SimpleTableComponent<Monthly_Fee_Record>
          columns={monthly_fee_columns()}
          data={data || []}
          isLoading={false}
          id={0}
        />
      </div>
    </>
  )
}

export default MonthlyFeeRecord
