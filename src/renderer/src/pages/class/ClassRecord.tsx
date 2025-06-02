import { classColumns } from '@renderer/components/class/columns'
import { ClassTableComponent } from '@renderer/components/class/ClassTableComponent'
import { JSX } from 'react'
import { Link } from 'react-router-dom'
import { CgUserList } from 'react-icons/cg'
import { useQuery } from '@tanstack/react-query'
import ClassController from '@renderer/controller/ClassController'

const ClassRecord = (): JSX.Element => {
  const { data = [] } = useQuery({
    queryKey: ['class-record'],
    queryFn: ClassController.list,
    refetchOnWindowFocus: true
  })

  return (
    <>
      <div className="flex gap-2 justify-between items-center mb-4 bg-gray-700 rounded-t-xl md:p-5">
        <div className="flex gap-2 items-center">
          <CgUserList size={40} />
          <h1 className="text-2xl font-bold">Class Record</h1>
        </div>
        <div>
          <Link
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            to="/class/insert"
          >
            Add Class
          </Link>
        </div>
      </div>
      <div className="md:p-5 ">
        <ClassTableComponent columns={classColumns} data={data || []} />
      </div>
    </>
  )
}

export default ClassRecord
